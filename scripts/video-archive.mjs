/** Count transcript coverage across the complete merged archive. */
export function transcriptTotals(videos) {
  const ok = videos.filter(video => typeof video.transcript === "string" && video.transcript.trim()).length;
  return { transcript_ok: ok, transcript_fail: videos.length - ok };
}
