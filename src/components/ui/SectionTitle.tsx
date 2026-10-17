export default function SectionTitle({
  number,

  title,

  note,
}: {
  number: string;

  title: string;

  note: string;
}) {
  return (
    <div className="lab-section-title">
      <div>
        <span className="lab-kicker">
          <b>/{number}</b>
        </span>

        <h2
          style={{
            textShadow: `
      0 0 5px rgba(232, 232, 229, 0.45),
      0 0 15px rgba(232, 232, 229, 0.25),
      0 0 35px rgba(232, 232, 229, 0.12),
      0 0 65px rgba(232, 232, 229, 0.05)
    `,
          }}
        >
          {title}
        </h2>
      </div>

      <span className="lab-note">{note}</span>
    </div>
  );
}
