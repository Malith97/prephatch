import { resolveDevBypassState } from "./dev-bypass";

const USER_HEADER = "x-prephatch-user-id";
const USER_COOKIE = "ph_user_id";
const DEV_BYPASS_USER_ID = "dev-bypass-user";

function parseCookieValue(
  cookieHeader: string | null,
  key: string,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.split("=");
    const name = rawName.trim();

    if (name !== key) {
      continue;
    }

    const rawValue = rawValueParts.join("=").trim();
    if (!rawValue) {
      return null;
    }

    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }

  return null;
}

export function resolveRequestUserId(request: Request): string | null {
  const headerUserId = request.headers.get(USER_HEADER)?.trim();
  if (headerUserId) {
    return headerUserId;
  }

  const cookieUserId = parseCookieValue(request.headers.get("cookie"), USER_COOKIE);
  if (cookieUserId) {
    return cookieUserId;
  }

  const devBypassState = resolveDevBypassState();
  if (devBypassState.enabled) {
    return DEV_BYPASS_USER_ID;
  }

  return null;
}
