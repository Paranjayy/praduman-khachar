import { useReveal } from "../hooks/useAnimations";

export default function Publications() {
  const [ref, visible] = useReveal();

  return (
    <section id="publications" className="section">
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
        <p className="section-label">Publications</p>
        <h2 className="section-title">33 Books.<br />A Scholar's Legacy.</h2>
        <div className="section-divider" />
      </div>

      <div className="books-intro">
        <div>
          <p style={{
            fontSize: "clamp(1rem, 1.15vw, 1.1rem)",
            color: "var(--c-ink-soft)",
            maxWidth: "36rem",
            lineHeight: 1.7,
          }}>
            A prolific author whose work spans the breadth of Saurashtra's 
            history — from ancient kingdoms and Nawabi courts to folk traditions 
            and architectural heritage. Each book represents years of primary 
            research, field documentation, and archival scholarship. Dr. Khachar 
            has also authored sections of the well-known Gujarati Encyclopedia 
            and published 15 research articles in peer-reviewed journals.
          </p>
        </div>
        <div className="books-count">33</div>
      </div>

      <div className="books-grid">
        {[
          {
            num: "Recognition",
            title: "Library of Congress, USA",
            desc: "23 of his 33 books have been selected and preserved by the Library of Congress — one of the highest honors for any regional historian worldwide.",
          },
          {
            num: "Research",
            title: "15 Research Articles",
            desc: "Published in various national and international research journals, covering unexplored dimensions of Saurashtra's medieval and modern history.",
          },
          {
            num: "Encyclopedia",
            title: "Gujarati Vishwakosh",
            desc: "Author of Adhikarn (chapters) in the well-known Gujarati Encyclopedia — contributing authoritative entries on regional history.",
          },
          {
            num: "Legal Impact",
            title: "Cited in 11 Court Cases",
            desc: "His books have served as evidence in Gujarat courts — a testament to the rigor and authority of his historical documentation.",
          },
          {
            num: "Exhibitions",
            title: "Historical Picture Exhibitions",
            desc: "Curated and organized exhibitions of rare historical photographs across multiple cities in Gujarat, bringing visual history to public audiences.",
          },
          {
            num: "Consulting",
            title: "Telefilm Consultant",
            desc: "Historical consultant for various telefilms and documentary productions, ensuring accuracy in visual storytelling of Gujarat's past.",
          },
        ].map((book, i) => (
          <BookCard key={i} {...book} index={i} />
        ))}
      </div>
    </section>
  );
}

function BookCard({ num, title, desc, index }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="book-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ${index * 0.08}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="book-number">{num}</div>
      <div className="book-title">{title}</div>
      <div className="book-desc">{desc}</div>
    </div>
  );
}
