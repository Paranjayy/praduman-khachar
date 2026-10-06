import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportError } from "../lib/errorReporting";

interface Props {
  children: ReactNode;
  label?: string;
  fullPage?: boolean;
}

export class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, this.props.label ?? "Archive", info.componentStack ?? undefined);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const label = this.props.label ?? "Archive";
    return (
      <section className={`recovery-panel${this.props.fullPage ? " recovery-panel-full" : ""}`} role="alert">
        <h2>{label} is temporarily unavailable</h2>
        <p>Something went wrong while loading this section. You can try again or continue browsing the archive.</p>
        <div className="recovery-actions">
          <button type="button" onClick={() => this.setState({ hasError: false })}>Try again</button>
          {this.props.fullPage && <button type="button" onClick={() => window.location.reload()}>Reload page</button>}
          <a href="/books">Browse books</a>
        </div>
      </section>
    );
  }
}
