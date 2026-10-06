import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../../src/components/ErrorBoundary";

afterEach(cleanup);

test("a crashed section preserves siblings, hides exception details, and can retry", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  let broken = true;
  function Widget() {
    if (broken) throw new Error("private diagnostic detail");
    return <p>Recovered widget</p>;
  }
  render(<><nav>Archive navigation</nav><ErrorBoundary><Widget /></ErrorBoundary></>);
  expect(screen.getByText("Archive navigation")).toBeTruthy();
  expect(screen.queryByText(/private diagnostic detail/)).toBeNull();
  broken = false;
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(screen.getByText("Recovered widget")).toBeTruthy();
});
