"use client";
import styles from "./BeneficesSobre.module.css";
import { 
  FaBolt, 
  FaCoins, 
  FaShieldAlt, 
  FaLeaf, 
  FaChartLine,
  FaCrown 
} from "react-icons/fa";

const gradients = [
  { id: "benefit-gradient1", from: "#FFB86C", to: "#FF8C42" },
  { id: "benefit-gradient2", from: "#F76D3C", to: "#FFB86C" },
  { id: "benefit-gradient3", from: "#FF8C42", to: "#F76D3C" },
  { id: "benefit-gradient4", from: "#FFD200", to: "#FFA502" },
  { id: "benefit-gradient5", from: "#FF6A00", to: "#FFD200" },
  { id: "benefit-gradient6", from: "#F7971E", to: "#F44336" },
];

const icons = [
  FaBolt, 
  FaCoins, 
  FaShieldAlt, 
  FaLeaf, 
  FaChartLine, 
  FaCrown
];

const benefices = [
  {
    title: "Productivité immédiate",
    desc: "+15 % en 72h grâce à l&apos;IA embarquée",
  },
  {
    title: "Coûts maîtrisés", 
    desc: "-20 % coûts maintenance via algorithmes prédictifs",
  },
  {
    title: "Conformité totale",
    desc: "100 % audit optimisé prédictif, AI Act",
  },
  {
    title: "Éco-performance",
    desc: "-40 % empreinte carbone avec solutions vertes", 
  },
  {
    title: "ROI garanti",
    desc: "ROI x3 d&apos;ici 2030",
  },
  {
    title: "Excellence opérationnelle",
    desc: "99,5 % disponibilité machines",
  },
];

export default function BeneficesSobre() {
  return (
    <section className={styles.section}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          {gradients.map((g) => (
            <linearGradient id={g.id} key={g.id} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={g.from} />
              <stop offset="100%" stopColor={g.to} />
            </linearGradient>
          ))}
        </defs>
      </svg>
      
      <div className="container px-4 sm:px-6 lg:px-8">
        <h2 className={styles.benefitTitle}>
          <FaChartLine className={styles.benefitIcon} />
          Bénéfices Concrets &amp; Premium
        </h2>
        
        <p className={styles.benefitIntro}>
          D&apos;ici 2027, 80 % des leaders industriels auront intégré l&apos;IA. Soyez parmi les premiers.
        </p>

        <div className={styles.grid}>
          {benefices.map((b, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                tabIndex={0}
                className={styles.card}
                aria-label={b.title + ' : ' + b.desc}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={32} style={{ fill: `url(#${gradients[i].id})` }} />
                </div>
                <h3 className={styles.cardTitle}>
                  {b.title}
                </h3>
                <p className={styles.cardDesc}>
                  {b.desc}
                </p>
                <span className={styles.highlight}></span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
