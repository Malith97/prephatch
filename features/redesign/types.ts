export type NavItem = {
  href: string;
  label: string;
  badge?: string;
};

export type Metric = {
  id: string;
  label: string;
  value: string;
  delta?: string;
};

export type PackageItem = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  description: string;
  price: string;
  tags: string[];
  rating?: number;
};

export type QuestionOption = {
  id: string;
  label: string;
  text: string;
};

export type Question = {
  id: string;
  index: number;
  total: number;
  prompt: string;
  options: QuestionOption[];
};

export type WeakArea = {
  id: string;
  topic: string;
  accuracy: number;
  recommendation: string;
};

export type TableColumn<T> = {
  id: keyof T & string;
  label: string;
  align?: "left" | "center" | "right";
};
