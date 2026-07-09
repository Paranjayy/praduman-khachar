import { usePageTracking, useScrollDepth } from "../hooks/useAnalytics";

export default function Analytics() {
  usePageTracking();
  useScrollDepth();
  return null;
}
