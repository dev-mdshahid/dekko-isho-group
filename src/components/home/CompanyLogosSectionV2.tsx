import type { CSSProperties } from "react";

const logos = [
  { file: "jack_and_jones.png", name: "Jack & Jones", width: 163 },
  { file: "selected.png", name: "Selected", width: 124 },
  { file: "kiabi.png", name: "Kiabi", width: 117 },
  { file: "zara.png", name: "Zara", width: 82 },
  { file: "tommy_hilfiger.png", name: "Tommy Hilfiger", width: 240 },
  { file: "varner.png", name: "Varner", width: 143 },
  { file: "celio.png", name: "Celio", width: 118 },
  { file: "lindex.png", name: "Lindex", width: 100 },
  { file: "tom_tailor.png", name: "Tom Tailor", width: 179 },
  { file: "carhartt.png", name: "Carhartt", width: 140 },
  { file: "lpp.png", name: "LPP", width: 63 },
  { file: "camel_active.png", name: "Camel Active", width: 120 },
  { file: "voice.png", name: "Voice", width: 100 },
  { file: "spring_field.png", name: "Spring Field", width: 162 },
  { file: "ralph_lauren.png", name: "Ralph Lauren", width: 203 },
  { file: "kohls.png", name: "Kohl's", width: 126 },
  { file: "levis.png", name: "Levi's", width: 78 },
  { file: "marks.png", name: "Mark's", width: 124 },
  { file: "sport_chek.png", name: "Sport Chek", width: 101 },
  { file: "j_crew.png", name: "J. Crew", width: 104 },
  { file: "helly_hansen.png", name: "Helly Hansen", width: 63 },
  { file: "musto.png", name: "Musto", width: 108 },
  { file: "target.png", name: "Target", width: 54 },
];

const CompanyLogosSectionV2 = () => {
  const renderLogos = (duplicate: boolean) =>
    logos.map(({ file, name, width }) => (
      <li
        key={file}
        className="company-logos-section-v2__item"
        style={{ "--logo-width": `${width}px` } as CSSProperties}
      >
        <img
          src={`/images/dekko-clients/v5/${file}`}
          alt={duplicate ? "" : name}
          draggable={false}
        />
      </li>
    ));

  return (
    <section
      className="company-logos-section-v2"
      aria-label="Our clients"
    >
      <div
        className="company-logos-section-v2__viewport"
        tabIndex={0}
        role="region"
        aria-label="Client logos. Focus or hover to pause scrolling."
      >
        <div className="company-logos-section-v2__track">
          <ul className="company-logos-section-v2__group">
            {renderLogos(false)}
          </ul>

          {/* Identical copy makes the animation loop seamlessly. */}
          <ul
            className="company-logos-section-v2__group"
            aria-hidden="true"
          >
            {renderLogos(true)}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogosSectionV2;