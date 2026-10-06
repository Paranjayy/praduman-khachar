import { expect, test } from "vitest";
import { sanitizeErrorEvent } from "../../src/lib/errorReporting";

test("private reports remove request data and queries from global error frames", () => {
  const event = {
    type: undefined,
    request: { url: "https://www.praduman.com/?email=private" },
    user: { email: "private@example.com" },
    breadcrumbs: [{ message: "private draft" }],
    exception: { values: [{ stacktrace: { frames: [{ filename: "https://www.praduman.com/books?key=private#draft" }] } }] },
  };
  const sanitized = sanitizeErrorEvent(event);
  expect(sanitized.request).toBeUndefined();
  expect(sanitized.user).toBeUndefined();
  expect(sanitized.breadcrumbs).toBeUndefined();
  expect(sanitized.exception?.values?.[0].stacktrace?.frames?.[0].filename).toBe("https://www.praduman.com/books");
});
