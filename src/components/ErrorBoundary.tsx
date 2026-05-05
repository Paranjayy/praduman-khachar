import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f0e8",
          color: "#2c2418",
          fontFamily: "sans-serif",
          padding: "2rem",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Archival Engine Interrupted</h1>
          <p style={{ maxWidth: "500px", marginBottom: "2rem", opacity: 0.8 }}>
            A telemetry error occurred during the rendering of the archive. This usually happens on older browsers or due to cache mismatches.
          </p>
          <pre style={{
            background: "rgba(0,0,0,0.05)",
            padding: "1rem",
            borderRadius: "8px",
            fontSize: "0.8rem",
            marginBottom: "2rem",
            maxWidth: "90%",
            overflow: "auto"
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: "#b8553a",
              color: "white",
              border: "none",
              padding: "0.8rem 2rem",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Reload Workstation
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
