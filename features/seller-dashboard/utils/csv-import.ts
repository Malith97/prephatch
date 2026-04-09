import type {
  QuestionDifficulty,
  QuestionOption,
  QuestionType,
  SellerCourse,
  SellerQuestion,
} from "../types";

export const QUESTION_CSV_TEMPLATE = `course_slug,title,question_text,prompt,context,category,keywords,question_type,difficulty,marks,options,correct_answers,explanation
aws-saa-c03-intensive,VPC ingress design,A workload in private subnets needs public HTTPS access. What is best?,Select one,Focus on least privilege,Networking,"vpc|alb|security",single_choice,medium,2,"Expose instances directly|Use ALB to private targets|Use NAT as ingress|Use private API endpoint",2,ALB in public subnets with private targets preserves boundaries.
aws-saa-c03-intensive,Durability controls,Choose TWO controls that improve data durability,Select two,Durability first,Storage,"s3|backup|resilience",multiple_choice,medium,3,"Enable S3 versioning|Disable backups|Cross-region replication|Use ephemeral-only storage","1|3",Versioning and cross-region replication improve durability.`;

type CsvParseResult = {
  rows: string[][];
};

function parseCsv(input: string): CsvParseResult {
  const rows: string[][] = [];
  let currentField = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentField += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }

      if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
      }

      currentField = "";
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return { rows };
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function buildOptions(rawOptions: string): QuestionOption[] {
  return rawOptions
    .split("|")
    .map((option) => option.trim())
    .filter(Boolean)
    .map((option, index) => ({
      id: String.fromCharCode(97 + index),
      label: String.fromCharCode(65 + index),
      text: option,
    }));
}

function parseCorrectAnswers(raw: string, options: QuestionOption[]): string[] {
  const tokens = raw
    .split("|")
    .map((value) => value.trim())
    .filter(Boolean);

  const optionById = new Map(options.map((option) => [option.id, option.id]));
  const optionByLabel = new Map(options.map((option) => [option.label, option.id]));

  const resolved: string[] = [];
  tokens.forEach((token) => {
    const numeric = Number(token);

    if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= options.length) {
      resolved.push(options[numeric - 1].id);
      return;
    }

    const normalized = token.toUpperCase();
    if (optionByLabel.has(normalized)) {
      resolved.push(optionByLabel.get(normalized) ?? "");
      return;
    }

    const lower = token.toLowerCase();
    if (optionById.has(lower)) {
      resolved.push(optionById.get(lower) ?? "");
      return;
    }

    const matchedByText = options.find(
      (option) => option.text.trim().toLowerCase() === lower,
    );

    if (matchedByText) {
      resolved.push(matchedByText.id);
    }
  });

  return [...new Set(resolved.filter(Boolean))];
}

function parseDifficulty(raw: string): QuestionDifficulty {
  const normalized = raw.trim().toLowerCase();

  if (normalized === "easy" || normalized === "hard") {
    return normalized;
  }

  return "medium";
}

function parseType(raw: string): QuestionType {
  const normalized = raw.trim().toLowerCase();

  if (
    normalized === "multiple" ||
    normalized === "multi" ||
    normalized === "multiple_choice"
  ) {
    return "multiple_choice";
  }

  return "single_choice";
}

function splitKeywords(raw: string): string[] {
  return raw
    .split(/[|,]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function parseQuestionCsvImport(
  csvText: string,
  courses: SellerCourse[],
  createId: (prefix: string) => string,
): {
  questions: SellerQuestion[];
  errors: string[];
} {
  const parsed = parseCsv(csvText);
  const [headerRow, ...contentRows] = parsed.rows;

  if (!headerRow || headerRow.length === 0) {
    return {
      questions: [],
      errors: ["CSV appears empty. Add a header row and at least one question row."],
    };
  }

  const headerMap = new Map<string, number>();
  headerRow.forEach((header, index) => {
    headerMap.set(normalizeHeader(header), index);
  });

  const requiredHeaders = [
    "course_slug",
    "title",
    "question_text",
    "question_type",
    "options",
    "correct_answers",
  ];

  const missingHeaders = requiredHeaders.filter((header) => !headerMap.has(header));
  if (missingHeaders.length > 0) {
    return {
      questions: [],
      errors: [
        `Missing required CSV columns: ${missingHeaders.join(", ")}. Download the template and use the same headers.`,
      ],
    };
  }

  const coursesBySlug = new Map(courses.map((course) => [course.slug, course]));
  const now = new Date().toISOString();

  const questions: SellerQuestion[] = [];
  const errors: string[] = [];

  contentRows.forEach((row, rowIndex) => {
    const safeRead = (header: string): string => {
      const index = headerMap.get(header);
      if (index === undefined) {
        return "";
      }
      return (row[index] ?? "").trim();
    };

    const courseSlug = safeRead("course_slug");
    const title = safeRead("title");
    const questionText = safeRead("question_text");
    const questionTypeRaw = safeRead("question_type");
    const rawOptions = safeRead("options");
    const rawCorrectAnswers = safeRead("correct_answers");

    const lineLabel = `Row ${rowIndex + 2}`;

    const course = coursesBySlug.get(courseSlug);
    if (!course) {
      errors.push(`${lineLabel}: Unknown course_slug '${courseSlug}'.`);
      return;
    }

    if (!title || !questionText || !questionTypeRaw || !rawOptions || !rawCorrectAnswers) {
      errors.push(
        `${lineLabel}: Missing required values. Ensure title, question_text, question_type, options and correct_answers are filled.`,
      );
      return;
    }

    const type = parseType(questionTypeRaw);
    const options = buildOptions(rawOptions);

    if (options.length < 2) {
      errors.push(`${lineLabel}: options must include at least two pipe-separated values.`);
      return;
    }

    const correctOptionIds = parseCorrectAnswers(rawCorrectAnswers, options);
    if (correctOptionIds.length === 0) {
      errors.push(
        `${lineLabel}: Could not resolve correct_answers. Use option numbers (1|2), labels (A|B), ids (a|b), or exact option text.`,
      );
      return;
    }

    if (type === "single_choice" && correctOptionIds.length !== 1) {
      errors.push(
        `${lineLabel}: single_choice requires exactly one correct answer, found ${correctOptionIds.length}.`,
      );
      return;
    }

    if (type === "multiple_choice" && correctOptionIds.length < 2) {
      errors.push(
        `${lineLabel}: multiple_choice requires at least two correct answers.`,
      );
      return;
    }

    const marksRaw = safeRead("marks");
    const marks = Number(marksRaw);

    questions.push({
      id: createId("q"),
      courseId: course.id,
      status: "draft",
      type,
      title,
      questionText,
      prompt: safeRead("prompt") || "Choose the best answer.",
      context: safeRead("context"),
      category: safeRead("category") || "General",
      keywords: splitKeywords(safeRead("keywords")),
      difficulty: parseDifficulty(safeRead("difficulty")),
      marks: Number.isNaN(marks) || marks <= 0 ? 1 : marks,
      options,
      correctOptionIds,
      explanation: safeRead("explanation") || "",
      createdAt: now,
      updatedAt: now,
      source: "csv",
    });
  });

  return {
    questions,
    errors,
  };
}
