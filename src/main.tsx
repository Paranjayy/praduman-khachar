import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ConvexClientProvider } from "./components/ConvexProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ConvexClientProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
