#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const USER_ID = "11111111-1111-4111-8111-111111111111";
const ORG_ID = "22222222-2222-4222-8222-222222222222";
const EXAM_SLUG = "free-mock-aptitude-gk-logic";
const EXAM_VERSION_ID = "55666666-6666-4666-8666-666666666501";
const DEFAULT_PORT = 3020;

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return null;
  const index = trimmed.indexOf("=");
  const key = trimmed.slice(0, index).trim();
  let value = trimmed.slice(index + 1).trim();
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return key ? [key, value] : null;
}

function loadLocalEnv(cwd = process.cwd()) {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(cwd, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;
      const [key, value] = parsed;
      process.env[key] ||= value;
    }
  }
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function buildSupabaseClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: WebSocket },
    },
  );
}

async function sleep(ms) {
  await new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function waitForServer(baseUrl, logs) {
  const deadline = Date.now() + 60_000;
  let lastError = "server did not respond";

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/packages`, {
        headers: { Accept: "application/json" },
      });
      if (response.status < 500) return;
      lastError = `${response.status} ${await response.text()}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await sleep(1_000);
  }

  throw new Error(`Next dev server was not ready: ${lastError}\n${logs.slice(-40).join("\n")}`);
}

function startNextServer(port) {
  const logs = [];
  const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "-p", String(port)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ALLOW_DEV_BYPASS: "true",
        DEV_BYPASS_USER_ID: USER_ID,
        DEV_BYPASS_ORGANIZATION_ID: ORG_ID,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  child.stdout.on("data", (chunk) => logs.push(chunk.toString().trimEnd()));
  child.stderr.on("data", (chunk) => logs.push(chunk.toString().trimEnd()));

  return { child, logs };
}

async function routeJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-prephatch-user-id": USER_ID,
      "x-prephatch-organization-id": ORG_ID,
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} failed with ${response.status}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function fetchFirstSnapshotAnswer(supabase, attemptId) {
  const { data, error } = await supabase
    .from("exam_attempts")
    .select("metadata")
    .eq("id", attemptId)
    .single();
  if (error) throw new Error(`fetch attempt snapshot: ${error.message}`);

  const firstQuestion = data?.metadata?.questionSnapshot?.[0];
  const firstOptionId = firstQuestion?.options?.[0]?.id;
  if (!firstQuestion?.id || !firstOptionId) {
    throw new Error(`Attempt ${attemptId} does not have a usable metadata.questionSnapshot[0].`);
  }

  return { questionId: firstQuestion.id, optionId: firstOptionId };
}

export async function runRouteSmoke() {
  loadLocalEnv();
  process.env.ALLOW_DEV_BYPASS ||= "true";
  process.env.DEV_BYPASS_USER_ID ||= USER_ID;
  process.env.DEV_BYPASS_ORGANIZATION_ID ||= ORG_ID;

  const port = Number(process.env.SMOKE_PORT ?? DEFAULT_PORT);
  const baseUrl = process.env.SMOKE_BASE_URL ?? `http://127.0.0.1:${port}`;
  const shouldStartServer = process.env.SMOKE_START_SERVER !== "false";
  const server = shouldStartServer ? startNextServer(port) : null;

  try {
    if (server) {
      await waitForServer(baseUrl, server.logs);
    }

    const supabase = buildSupabaseClient();
    const catalog = await routeJson(baseUrl, "/api/packages");
    const catalogCount = Array.isArray(catalog.data) ? catalog.data.length : 0;
    if (!catalog.data?.some((item) => item.slug === EXAM_SLUG)) {
      throw new Error(`Catalog did not include ${EXAM_SLUG}. count=${catalogCount}`);
    }

    const create = await routeJson(baseUrl, "/api/attempts", {
      method: "POST",
      body: JSON.stringify({
        examSlug: EXAM_SLUG,
        mockId: EXAM_VERSION_ID,
        idempotencyKey: `route-smoke:${Date.now()}`,
      }),
    });
    const attemptId = create.attempt?.attemptId;
    if (!attemptId) throw new Error(`Start attempt returned no attemptId: ${JSON.stringify(create)}`);

    await routeJson(baseUrl, `/api/attempts/${attemptId}?examSlug=${EXAM_SLUG}`);

    const answer = await fetchFirstSnapshotAnswer(supabase, attemptId);
    await routeJson(baseUrl, `/api/attempts/${attemptId}/answers`, {
      method: "PATCH",
      body: JSON.stringify({
        answers: { [answer.questionId]: answer.optionId },
        currentQuestionIndex: 0,
        flaggedQuestionIds: [],
      }),
    });

    const submit = await routeJson(baseUrl, `/api/attempts/${attemptId}/submit`, {
      method: "POST",
      body: JSON.stringify({ idempotencyKey: `submit:${attemptId}` }),
    });
    const submitAgain = await routeJson(baseUrl, `/api/attempts/${attemptId}/submit`, {
      method: "POST",
      body: JSON.stringify({ idempotencyKey: `submit:${attemptId}` }),
    });
    const result = await routeJson(baseUrl, `/api/attempts/${attemptId}?examSlug=${EXAM_SLUG}`);

    return {
      attempt_id: attemptId,
      status: result.attempt?.status,
      submitted_already_on_retry: submitAgain.submittedAlready,
      score: submit.attempt?.score?.percentageScore ?? result.attempt?.score?.percentageScore,
      correct_answers: result.attempt?.score?.correctCount,
      total_questions: result.attempt?.score?.questionResults?.length,
      catalog_count: catalogCount,
      resumed: create.resumed,
    };
  } finally {
    if (server) {
      server.child.kill("SIGTERM");
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runRouteSmoke()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
