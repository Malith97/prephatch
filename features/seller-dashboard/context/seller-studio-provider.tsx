"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import type {
  CourseStatus,
  MockExamConfig,
  SellerCourse,
  SellerQuestion,
  SellerStudioSnapshot,
} from "../types";

const STORAGE_KEY = "prephatch:seller-studio:v1";

type SellerStudioContextValue = SellerStudioSnapshot & {
  saveCourse: (course: SellerCourse) => void;
  setCourseStatus: (courseId: string, status: CourseStatus) => void;
  saveQuestion: (question: SellerQuestion) => void;
  importQuestions: (questions: SellerQuestion[]) => void;
  saveMockExamConfig: (config: MockExamConfig) => void;
  createId: (prefix: string) => string;
};

const SellerStudioContext = createContext<SellerStudioContextValue | null>(null);

function generateId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function upsertById<T extends { id: string }>(items: T[], nextItem: T): T[] {
  const index = items.findIndex((item) => item.id === nextItem.id);

  if (index === -1) {
    return [nextItem, ...items];
  }

  const copy = [...items];
  copy[index] = nextItem;
  return copy;
}

type SellerStudioProviderProps = {
  initialData: SellerStudioSnapshot;
  children: ReactNode;
};

export function SellerStudioProvider({
  initialData,
  children,
}: Readonly<SellerStudioProviderProps>) {
  const [snapshot, setSnapshot] = useState<SellerStudioSnapshot>(initialData);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as SellerStudioSnapshot;
      if (parsed?.sellerId) {
        setSnapshot(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [snapshot]);

  const saveCourse = useCallback((course: SellerCourse) => {
    setSnapshot((current) => ({
      ...current,
      courses: upsertById(current.courses, {
        ...course,
        updatedAt: new Date().toISOString(),
      }),
    }));
  }, []);

  const setCourseStatus = useCallback((courseId: string, status: CourseStatus) => {
    setSnapshot((current) => ({
      ...current,
      courses: current.courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              status,
              updatedAt: new Date().toISOString(),
              publishedAt:
                status === "published" ? course.publishedAt ?? new Date().toISOString() : course.publishedAt,
            }
          : course,
      ),
    }));
  }, []);

  const saveQuestion = useCallback((question: SellerQuestion) => {
    setSnapshot((current) => ({
      ...current,
      questions: upsertById(current.questions, {
        ...question,
        updatedAt: new Date().toISOString(),
      }),
    }));
  }, []);

  const importQuestions = useCallback((questions: SellerQuestion[]) => {
    if (!questions.length) {
      return;
    }

    setSnapshot((current) => {
      const seen = new Set(current.questions.map((question) => question.id));
      const imported = questions.filter((question) => !seen.has(question.id));

      return {
        ...current,
        questions: [...imported, ...current.questions],
      };
    });
  }, []);

  const saveMockExamConfig = useCallback((config: MockExamConfig) => {
    setSnapshot((current) => ({
      ...current,
      mockExamConfigs: upsertById(current.mockExamConfigs, {
        ...config,
        updatedAt: new Date().toISOString(),
      }),
    }));
  }, []);

  const value = useMemo<SellerStudioContextValue>(
    () => ({
      ...snapshot,
      saveCourse,
      setCourseStatus,
      saveQuestion,
      importQuestions,
      saveMockExamConfig,
      createId: generateId,
    }),
    [
      snapshot,
      saveCourse,
      setCourseStatus,
      saveQuestion,
      importQuestions,
      saveMockExamConfig,
    ],
  );

  return (
    <SellerStudioContext.Provider value={value}>{children}</SellerStudioContext.Provider>
  );
}

export function useSellerStudio(): SellerStudioContextValue {
  const value = useContext(SellerStudioContext);

  if (!value) {
    throw new Error("useSellerStudio must be used within SellerStudioProvider");
  }

  return value;
}
