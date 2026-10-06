export function transcriptTotals(videos: { transcript?: string | null }[]): {
  transcript_ok: number;
  transcript_fail: number;
};
