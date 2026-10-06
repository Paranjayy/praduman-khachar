import { expect, test } from "vitest";
import { transcriptTotals } from "../../scripts/video-archive.mjs";

test("a resumed scrape with no new videos retains cumulative coverage", () => {
  expect(transcriptTotals([{ transcript: "Existing transcript" }, { transcript: "" }]))
    .toEqual({ transcript_ok: 1, transcript_fail: 1 });
});

test("limited and healed batches count coverage across all merged videos", () => {
  const existing = new Map([
    ["old", { transcript: "Existing transcript" }],
    ["healed", { transcript: "" }],
    ["missing", { transcript: null }],
  ]);
  existing.set("healed", { transcript: "Recovered transcript" });
  existing.set("new", { transcript: "New transcript" });
  expect(transcriptTotals([...existing.values()]))
    .toEqual({ transcript_ok: 3, transcript_fail: 1 });
  expect(transcriptTotals([{ transcript: "  " }, {}]))
    .toEqual({ transcript_ok: 0, transcript_fail: 2 });
});
