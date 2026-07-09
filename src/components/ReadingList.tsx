import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BOOK_CATEGORIES } from "../data/content";

interface ReadingListBook {
  title: string;
  status: "want-to-read" | "reading" | "completed";
  addedAt: number;
  progress?: number;
  rating?: number; // 1-5 stars
}

export function ReadingList() {
  const [isOpen, setIsOpen] = useState(false);
  const [readingList, setReadingList] = useState<ReadingListBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("readingList");
    if (saved) {
      setReadingList(JSON.parse(saved));
    }
  }, []);

  const addToReadingList = (
    title: string,
    status: ReadingListBook["status"] = "want-to-read",
  ) => {
    const newList = [...readingList, { title, status, addedAt: Date.now() }];
    setReadingList(newList);
    localStorage.setItem("readingList", JSON.stringify(newList));
  };

  const removeFromReadingList = (title: string) => {
    const newList = readingList.filter((item) => item.title !== title);
    setReadingList(newList);
    localStorage.setItem("readingList", JSON.stringify(newList));
  };

  const updateStatus = (title: string, status: ReadingListBook["status"]) => {
    const newList = readingList.map((item) =>
      item.title === title
        ? {
            ...item,
            status,
            progress: status === "completed" ? 100 : item.progress,
          }
        : item,
    );
    setReadingList(newList);
    localStorage.setItem("readingList", JSON.stringify(newList));
  };

  const updateProgress = (title: string, progress: number) => {
    const clamped = Math.max(0, Math.min(100, progress));
    const newList = readingList.map((item) =>
      item.title === title ? { ...item, progress: clamped } : item,
    );
    setReadingList(newList);
    localStorage.setItem("readingList", JSON.stringify(newList));
  };

  const updateRating = (title: string, rating: number) => {
    const newList = readingList.map((item) =>
      item.title === title ? { ...item, rating } : item,
    );
    setReadingList(newList);
    localStorage.setItem("readingList", JSON.stringify(newList));
  };

  const GOAL_KEY = "pk-reading-goal";
  const [goal, setGoal] = useState(() => {
    try {
      return parseInt(localStorage.getItem(GOAL_KEY) || "12");
    } catch {
      return 12;
    }
  });
  const [editingGoal, setEditingGoal] = useState(false);

  const getStatusOrder = (status: ReadingListBook["status"]): number => {
    switch (status) {
      case "reading":
        return 0;
      case "want-to-read":
        return 1;
      case "completed":
        return 2;
    }
  };

  const sortedBooks = [...readingList].sort((a, b) => {
    const statusDiff = getStatusOrder(a.status) - getStatusOrder(b.status);
    if (statusDiff !== 0) return statusDiff;
    return b.addedAt - a.addedAt;
  });

  const totalBooks = readingList.length;
  const readingCount = readingList.filter((b) => b.status === "reading").length;
  const completedCount = readingList.filter(
    (b) => b.status === "completed",
  ).length;
  const readingBooks = readingList.filter((b) => b.status === "reading");
  const avgProgress =
    readingBooks.length > 0
      ? Math.round(
          readingBooks.reduce((sum, b) => sum + (b.progress ?? 0), 0) /
            readingBooks.length,
        )
      : 0;

  const isInList = (title: string) =>
    readingList.some((item) => item.title === title);

  const getStatusColor = (status: ReadingListBook["status"]) => {
    switch (status) {
      case "want-to-read":
        return "#c5a55a";
      case "reading":
        return "#6b7c5e";
      case "completed":
        return "#b8553a";
    }
  };

  const getStatusLabel = (status: ReadingListBook["status"]) => {
    switch (status) {
      case "want-to-read":
        return "Want to Read";
      case "reading":
        return "Currently Reading";
      case "completed":
        return "Completed";
    }
  };

  const [removingTitle, setRemovingTitle] = useState<string | null>(null);

  const handleRemoveClick = (title: string) => {
    if (removingTitle === title) {
      removeFromReadingList(title);
      setRemovingTitle(null);
    } else {
      setRemovingTitle(title);
      setTimeout(() => setRemovingTitle(null), 2000);
    }
  };

  const exportAsMarkdown = () => {
    const reading = readingList.filter((b) => b.status === "reading");
    const wantToRead = readingList.filter((b) => b.status === "want-to-read");
    const completed = readingList.filter((b) => b.status === "completed");

    let md = "# Reading List\n";
    if (reading.length > 0) {
      md += "\n## Currently Reading\n";
      reading.forEach((b) => {
        md += `- ${b.title}${b.rating ? ` — Rating: ${"★".repeat(b.rating)}${"☆".repeat(5 - b.rating)}` : ""}${b.progress != null ? ` — Progress: ${b.progress}%` : ""}\n`;
      });
    }
    if (wantToRead.length > 0) {
      md += "\n## Want to Read\n";
      wantToRead.forEach((b) => {
        md += `- ${b.title}${b.rating ? ` — Rating: ${"★".repeat(b.rating)}${"☆".repeat(5 - b.rating)}` : ""}\n`;
      });
    }
    if (completed.length > 0) {
      md += "\n## Completed\n";
      completed.forEach((b) => {
        md += `- ${b.title} ✓${b.rating ? ` — Rating: ${"★".repeat(b.rating)}${"☆".repeat(5 - b.rating)}` : ""}\n`;
      });
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reading-list.md";
    a.click();
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="reading-list-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "6rem",
          right: "2rem",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--c-terracotta)",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(184, 85, 58, 0.4)",
          zIndex: 1000,
          fontSize: "1.5rem",
        }}
      >
        📚
        {readingList.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#c5a55a",
              color: "#1a1612",
              fontSize: "0.7rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {readingList.length}
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="reading-list-panel"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: 400,
              maxWidth: "90vw",
              background: "var(--c-parchment)",
              borderLeft: "1px solid var(--c-border)",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid var(--c-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    margin: 0,
                  }}
                >
                  Reading List
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--c-ink-muted)",
                    margin: "4px 0 0",
                  }}
                >
                  {readingList.length} book{readingList.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "var(--c-ink-muted)",
                }}
              >
                ×
              </button>
            </div>

            {/* Stats Dashboard */}
            {readingList.length > 0 && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    borderBottom: "1px solid var(--c-border)",
                  }}
                >
                  {[
                    {
                      label: "Total",
                      value: totalBooks,
                      color: "var(--c-ink-muted)",
                    },
                    { label: "Reading", value: readingCount, color: "#6b7c5e" },
                    { label: "Done", value: completedCount, color: "#b8553a" },
                    {
                      label: "Avg %",
                      value: `${avgProgress}%`,
                      color: "#c5a55a",
                    },
                  ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: stat.color,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--c-ink-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reading Goal */}
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "var(--c-parchment-deep)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--c-ink-muted)",
                      marginBottom: "0.25rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {new Date().getFullYear()} Reading Goal
                  </div>
                  {editingGoal ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={goal}
                        onChange={(e) => setGoal(parseInt(e.target.value) || 1)}
                        onBlur={() => {
                          localStorage.setItem(GOAL_KEY, String(goal));
                          setEditingGoal(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            localStorage.setItem(GOAL_KEY, String(goal));
                            setEditingGoal(false);
                          }
                        }}
                        autoFocus
                        style={{
                          width: "50px",
                          textAlign: "center",
                          padding: "4px",
                          border: "1px solid var(--c-border)",
                          borderRadius: "4px",
                          background: "var(--c-parchment)",
                          color: "var(--c-ink)",
                          fontSize: "1rem",
                          fontWeight: 700,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--c-ink-muted)",
                        }}
                      >
                        books
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingGoal(true)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "var(--c-ink)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {
                          readingList.filter((b) => b.status === "completed")
                            .length
                        }
                      </span>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--c-ink-muted)",
                        }}
                      >
                        {" "}
                        / {goal}
                      </span>
                    </button>
                  )}
                  {/* Progress bar */}
                  <div
                    style={{
                      marginTop: "0.5rem",
                      height: "6px",
                      background: "var(--c-border)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, (readingList.filter((b) => b.status === "completed").length / goal) * 100)}%`,
                        background:
                          readingList.filter((b) => b.status === "completed")
                            .length >= goal
                            ? "#6b7c5e"
                            : "var(--c-terracotta)",
                        borderRadius: "3px",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
              }}
            >
              {readingList.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    color: "var(--c-ink-muted)",
                  }}
                >
                  <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>📚</p>
                  <p>Your reading list is empty.</p>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    Click the "Add to Reading List" button on any book to start
                    building your collection.
                  </p>
                </div>
              ) : (
                sortedBooks.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      padding: "1rem",
                      marginBottom: "0.5rem",
                      background: "var(--c-parchment-deep)",
                      borderRadius: "8px",
                      border: "1px solid var(--c-border-light)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: "0.5rem" }}>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            marginBottom: "4px",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: getStatusColor(item.status),
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {getStatusLabel(item.status)}
                        </div>
                        {/* Rating - only show for completed books */}
                        {item.status === "completed" && (
                          <div
                            style={{
                              display: "flex",
                              gap: "2px",
                              marginTop: "0.5rem",
                            }}
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => updateRating(item.title, star)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "1.1rem",
                                  color:
                                    star <= (item.rating || 0)
                                      ? "#c5a55a"
                                      : "var(--c-border)",
                                  padding: "0",
                                  transition: "color 0.15s",
                                }}
                                aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveClick(item.title)}
                        style={{
                          background: "none",
                          border: "none",
                          color:
                            removingTitle === item.title
                              ? "#b8553a"
                              : "var(--c-ink-muted)",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          padding: "4px",
                          fontWeight: removingTitle === item.title ? 600 : 400,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {removingTitle === item.title ? "Remove?" : "×"}
                      </button>
                    </div>

                    {/* Progress bar */}
                    {item.status === "reading" && (
                      <div style={{ marginBottom: "0.75rem" }}>
                        <div
                          style={{
                            height: 4,
                            background: "var(--c-border)",
                            borderRadius: 2,
                            overflow: "hidden",
                            marginBottom: "0.4rem",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${item.progress ?? 0}%`,
                              background: "#6b7c5e",
                              borderRadius: 2,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={item.progress ?? 0}
                            onChange={(e) =>
                              updateProgress(item.title, Number(e.target.value))
                            }
                            style={{ flex: 1, height: 4, cursor: "pointer" }}
                          />
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              color: "#6b7c5e",
                              minWidth: 32,
                              textAlign: "right",
                            }}
                          >
                            {item.progress ?? 0}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Status buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      {(["want-to-read", "reading", "completed"] as const).map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(item.title, status)}
                            style={{
                              flex: 1,
                              padding: "6px 8px",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              background:
                                item.status === status
                                  ? getStatusColor(status)
                                  : "transparent",
                              color:
                                item.status === status
                                  ? "white"
                                  : "var(--c-ink-muted)",
                              border: `1px solid ${item.status === status ? getStatusColor(status) : "var(--c-border)"}`,
                              borderRadius: "4px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {status === "want-to-read"
                              ? "📖"
                              : status === "reading"
                                ? "📚"
                                : "✓"}
                          </button>
                        ),
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Export */}
            {readingList.length > 0 && (
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderTop: "1px solid var(--c-border)",
                }}
              >
                <button
                  onClick={() => {
                    const data = JSON.stringify(readingList, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "reading-list.json";
                    a.click();
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--c-terracotta)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Export JSON
                </button>
                <button
                  onClick={exportAsMarkdown}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "transparent",
                    color: "var(--c-terracotta)",
                    border: "1px solid var(--c-terracotta)",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    marginTop: "0.5rem",
                  }}
                >
                  Export Markdown
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 1000,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
