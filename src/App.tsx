import React, { type ReactNode } from "react";
import { ExpenseTracker } from "./components/ExpenseTracker";

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; message?: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Still log to console so we know where it crashed
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full p-6 text-white">
          <div className="max-w-2xl mx-auto bg-black/50 rounded-xl p-4">
            <div className="font-semibold mb-2">Component crashed.</div>
            <div className="text-sm opacity-80">{this.state.message}</div>
            <div className="mt-3 text-xs opacity-70">
              Open the browser console for the exact file/line.
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_90%_-10%,rgba(255,255,255,0.35),transparent_60%),linear-gradient(135deg,#FF965E_0%,#FF7A59_35%,#FF6FB1_70%,#7B61FF_100%)] p-6">
      <ErrorBoundary>
        <ExpenseTracker expenses={[]} currentYearExpenses={0} currentMonthExpenses={0} totalTransactions={0} />
      </ErrorBoundary>
    </div>
  );
}
