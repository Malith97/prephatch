"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="phx-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="phx-modal-title"
        className="phx-modal-panel"
      >
        <header className="mb-4 flex items-center justify-between gap-4">
          <h2 id="phx-modal-title" className="phx-heading-md">
            {title}
          </h2>
          <button className="phx-icon-btn" aria-label="Close modal" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="phx-body-md">{children}</div>
        {footer ? <footer className="mt-6">{footer}</footer> : null}
      </div>
    </div>
  );
}
