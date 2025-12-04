import HeroHeaderVariante1 from "@components/hero/HeroHeaderVariante1";
import HeroHeaderVariante2 from "@components/hero/HeroHeaderVariante2";
import CalculateurIA from "@components/calculateur/CalculateurIA";
import CalculateurIA1 from "@components/calculateur/CalculateurIA1";
import "@styles/calculateur-ia.css";
import "../styles/calculateur-ia1.css";
import NosOffresSobre from "@components/NosOffres/NosOffresSobre";
import NosOffresItech from "@components/NosOffres/NosOffresItech";
import SuccesFee from "@components/SuccesFee/SuccesFee";
import SuccesFee1 from "@components/SuccesFee/SuccesFee1";
import ClientOnlyOptionDataPlusSobre from "@components/ClientOnlyOptionDataPlusSobre";
import OptionDataPlusItech from "@components/OptionDataPlusItech";
import BeneficesSobre from "@components/Benefices/BeneficesSobre";
import BeneficesItech from "@components/Benefices/BeneficesItech";
import RisquesSobre from "@components/RisquesSection/RisquesSobre";
import RisquesItech from "@components/RisquesSection/RisquesItech";
import ConfidentialiteSobre from "@components/ConfidentialiteSection/ConfidentialiteSobre";
import ConfidentialiteItech from "@components/ConfidentialiteSection/ConfidentialiteItech";
import CtaFinalSobre from "@components/CtaFinalSection/CtaFinalSobre";
import CtaFinalItech from "@components/CtaFinalSection/CtaFinalItech";
import FooterSobre from "@components/Footer/FooterSobre";
import FooterItech from "@components/Footer/FooterItech";

// Tape explicitement la constante pour autoriser 1 ou 2
const VARIANTE: 1 | 2 = 2; // 2 = i-tech, 1 = sobre 

export const metadata = {
  title: "iSkyce Industrie 5.0 – IA & Data pour l’industrie",
  description:
    "Boostez votre performance industrielle grâce à l'IA avancé : +15% de rendement, -20% de coûts, 40% de réduction CO₂. Diagnostic IA personnalisé, résultats en 72h.",
  openGraph: {
    title: "iSkyce Industrie 5.0",
    description: "Landing page IA, data, automatisation et offres sur-mesure.",
    url: "https://essai26-images.vercel.app/",
    images: [
      {
        url: "/images/logo-iskyce-industrie-5.0.png",
        width: 800,
        height: 600,
        alt: "Logo iSkyce Industrie 5.0",
      },
    ],
    siteName: "iSkyce Industrie 5.0",
  },
};

export default function Home() {
  // Le choix dynamique reste simple :
  return (
    <>
      {/* Choix du header selon variante */}
      {VARIANTE === 1 ? <HeroHeaderVariante1 /> : <HeroHeaderVariante2 />}

      {/* Contenu principal */}
      <main className="bg-white">
        {VARIANTE === 1 ? <CalculateurIA /> : <CalculateurIA1 />}
        {VARIANTE === 1 ? <NosOffresSobre /> : <NosOffresItech />}
        {VARIANTE === 1 ? <SuccesFee /> : <SuccesFee1 />}
        {VARIANTE === 1 ? <ClientOnlyOptionDataPlusSobre key="sobre" /> : <OptionDataPlusItech />}
        {VARIANTE === 1 ? <BeneficesSobre /> : <BeneficesItech />}
        {VARIANTE === 1 ? <RisquesSobre /> : <RisquesItech />}
        {VARIANTE === 1 ? <ConfidentialiteSobre /> : <ConfidentialiteItech />}
        {VARIANTE === 1 ? <CtaFinalSobre /> : <CtaFinalItech />}
        {VARIANTE === 1 ? <FooterSobre /> : <FooterItech />}
      </main>
    </>
  );
}
