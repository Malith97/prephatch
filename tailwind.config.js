/** @type {import('tailwindcss').Config} */
const withOpacity = (variableName) => `rgb(var(${variableName}) / <alpha-value>)`;

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: withOpacity("--color-bg"),
        surface: withOpacity("--color-surface"),
        "surface-elevated": withOpacity("--color-surface-elevated"),
        primary: withOpacity("--color-primary"),
        secondary: withOpacity("--color-secondary"),
        accent: withOpacity("--color-accent"),
        "text-primary": withOpacity("--color-text-primary"),
        "text-secondary": withOpacity("--color-text-secondary"),
        border: withOpacity("--color-border"),
        success: withOpacity("--color-success"),
        warning: withOpacity("--color-warning"),
        danger: withOpacity("--color-danger"),
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        panel: "var(--shadow-panel)",
        elevated: "var(--shadow-elevated)",
        glow: "var(--shadow-glow)",
      },
      backgroundImage: {
        aurora: "var(--gradient-aurora)",
        "aurora-soft": "var(--gradient-aurora-soft)",
        "accent-mesh": "var(--gradient-accent-mesh)",
      },
      transitionTimingFunction: {
        premium: "var(--ease-premium)",
      },
      keyframes: {
        aurora: {
          "0%": {
            transform: "translate3d(-6%, -3%, 0) scale(1)",
            opacity: "0.42",
          },
          "50%": {
            transform: "translate3d(4%, 4%, 0) scale(1.08)",
            opacity: "0.7",
          },
          "100%": {
            transform: "translate3d(8%, -2%, 0) scale(1.02)",
            opacity: "0.5",
          },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translate3d(0, 16px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "score-pop": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "60%": { opacity: "1", transform: "scale(1.04)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "question-enter": {
          "0%": { opacity: "0", transform: "translate3d(14px, 0, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite alternate",
        reveal: "reveal 560ms var(--ease-premium) both",
        "score-pop": "score-pop 720ms var(--ease-premium) both",
        "question-enter": "question-enter 320ms var(--ease-premium) both",
      },
    },
  },
  plugins: [],
};
