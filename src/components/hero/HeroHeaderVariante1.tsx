"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight, FaCertificate, FaChartLine } from "react-icons/fa";
import { motion, AnimatePresence, Variants } from "framer-motion";

const titleVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.04, 1],
    transition: {
      duration: 0.9,
      ease: [0.45, 1.8, 0.43, 1.03],
      repeat: Infinity,
      repeatType: "mirror" as const,
    },
  },
};

function useOrientation() {
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);

  useEffect(() => {
    function checkOrientation() {
      const match = window.matchMedia(
        "(orientation: landscape) and (max-width: 900px)"
      );
      setIsLandscapeMobile(match.matches);
    }
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  return isLandscapeMobile;
}

export default function HeaderHero() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLElement>(null);
  const [isVisible] = useState(true);
  const isLandscapeMobile = useOrientation();

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const { top, height } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const yPos = Math.min(
        100,
        Math.max(0, ((top + height) / (windowHeight + height)) * 100)
      );
      setPos((old) => ({ x: old.x, y: yPos }));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPos({ x, y });
  };

  const handleMouseLeave = () => setPos({ x: 50, y: 50 });

  const horizontalMargin = isLandscapeMobile ? "1rem" : "max(3vw, 2rem)";
  const headerMinHeight = isLandscapeMobile ? "70vh" : "100vh";

  return (
    <header
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden"
      style={{ cursor: "pointer", minHeight: headerMinHeight }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/usine.webp')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${pos.x}% ${pos.y}%`,
          height: "100%",
          width: "100%",
          transition: "background-position 0.3s ease",
          willChange: "background-position",
        }}
        aria-hidden="true"
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-black/40 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="hero-content"
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(4px)" }}
            transition={{ duration: 0.8 }}
            className="relative z-20 flex flex-col items-start w-full max-w-7xl"
            style={{
              marginLeft: horizontalMargin,
              marginRight: horizontalMargin,
              paddingTop: "6rem",
              paddingBottom: "2rem",
            }}
          >
            {/* Logo */}
            <motion.div
              initial={false}
              whileHover={{ rotate: 2, filter: "brightness(1.15)" }}
              className="mb-5"
              style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
            >
              <Image
                src="/images/logo-iSkyce-industrie-5.0.png"
                alt="Logo iSkyce industrie 5.0"
                width={112}
                height={58}
                style={{ width: 112, height: "auto" }}
                priority
              />
            </motion.div>

            {/* Content container */}
            <div
              className="w-full max-w-full"
              style={{
                boxSizing: "border-box",
                overflow: "hidden",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <motion.h1
                className="font-black drop-shadow-lg mb-4 leading-tight tracking-tight"
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 3.2rem)",
                  lineHeight: 1.15,
                  color: "white",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: "100vw",
                }}
                variants={titleVariants}
                initial="initial"
                animate="animate"
              >
                Transformez votre entreprise
                <span className="block" style={{ color: "white" }}>
                  avec l’IA avancé
                </span>
              </motion.h1>
              <motion.p
                className="font-semibold drop-shadow max-w-3xl mb-5"
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                  lineHeight: 1.35,
                  color: "white",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: "100vw",
                }}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
              >
                +15% de performance, -20% de coûts, 40% de réduction CO₂.
                <br />
                Analyse IA personnalisée, résultats en 72h.
                <span
                  className="text-orange-300 font-bold ml-1"
                  style={{ color: "#fbbf24" }}
                >
                  Prenez une longueur d’avance.
                </span>
              </motion.p>
            </div>

            {/* Call to action button */}
            <motion.button
              type="button"
              className="flex justify-center items-center gap-3 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-extrabold py-3 px-7 rounded-full shadow-2xl uppercase tracking-wider animate-btn-pop transition-all duration-200 text-base sm:text-lg md:text-xl hover:scale-105 focus:ring-2 focus:ring-orange-200 mb-12 max-w-md"
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{
                scale: 1.07,
                boxShadow: "0 8px 32px rgba(251,191,36,0.25)",
              }}
              onClick={() => window.dispatchEvent(new Event("ouvrirCalculateurIA"))}
              style={{ background: "linear-gradient(90deg, #f97316 0%, #fbbf24 100%)" }}
            >
              Découvrez nos solutions IA
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              >
                <FaArrowRight className="ml-2 text-2xl" />
              </motion.span>
            </motion.button>

            {/* Bottom cards */}
            <div className="flex flex-row items-start w-full max-w-3xl mt-12 landscape:flex-wrap landscape:overflow-x-auto">
              <motion.div
                key="audit-predictif"
                style={{
                  position: "relative",
                  zIndex: 9999,
                  opacity: 1,
                  visibility: "visible",
                  marginRight: "3.5rem",
                }}
                initial={{ opacity: 1, x: 0, scale: 1 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0, duration: 0 }}
                whileHover={{ scale: 1.06, boxShadow: "0 8px 32px rgba(251,191,54,0.18)" }}
                className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-2xl border border-gray-200 min-w-[140px] justify-center transition-transform"
              >
                <FaCertificate
                  className="text-orange-400 text-2xl"
                  style={{
                    position: "relative",
                    zIndex: 10000,
                    opacity: 1,
                    visibility: "visible",
                    filter:
                      "drop-shadow(0 0 5px rgba(251, 191, 54, 0.8)) drop-shadow(0 0 8px rgba(251, 191, 54, 0.5))",
                  }}
                />
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                    lineHeight: 1.35,
                    color: "#1e3a8a",
                    textShadow: "0 0 6px rgba(0,0,0,0.4)",
                  }}
                >
                  Audit prédictif
                </span>
              </motion.div>

              <motion.div
                key="roi-x3"
                style={{
                  position: "relative",
                  zIndex: 9999,
                  opacity: 1,
                  visibility: "visible",
                }}
                initial={{ opacity: 0, x: 30, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.06, boxShadow: "0 8px 32px rgba(34,197,94,0.18)" }}
                className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-2xl border border-gray-200 min-w-[110px] justify-center transition-transform"
              >
                <motion.span
                  initial={{ rotate: 20, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
                  style={{ textShadow: "0 0 6px rgba(0,0,0,0.4)" }}
                >
                  <FaChartLine
                    className="text-green-500 text-2xl"
                    style={{
                      position: "relative",
                      zIndex: 10000,
                      opacity: 1,
                      visibility: "visible",
                      filter:
                        "drop-shadow(0 0 5px rgba(34, 197, 94, 0.8)) drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))",
                    }}
                  />
                </motion.span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                    lineHeight: 1.35,
                    color: "#1e3a8a",
                    textShadow: "0 0 6px rgba(0,0,0,0.4)",
                  }}
                >
                  ROI x3
                </span>
              </motion.div>
            </div>

            <style jsx>{`
              .animate-btn-pop {
                animation: btn-pop 0.65s cubic-bezier(.45,1.8,.43,1.03) both;
              }
              @keyframes btn-pop {
                0% {
                  transform: scale(0.8);
                }
                70% {
                  transform: scale(1.1);
                }
                100% {
                  transform: scale(1);
                }
              }
              /* Anti-débordement stricte mobile */
              @media (max-width: 600px) {
                .max-w-full,
                .w-full {
                  max-width: 100vw !important;
                  padding-left: 4vw !important;
                  padding-right: 4vw !important;
                }
                h1,
                p {
                  font-size: 4vw !important;
                  white-space: normal !important;
                  word-break: break-word !important;
                  overflow-wrap: break-word !important;
                }
              }
              /* Paysage mobile : débordement possible wrap et scroll */
              @media (orientation: landscape) and (max-width: 900px) {
                .max-w-full,
                .w-full,
                h1,
                p {
                  max-width: 100vw !important;
                  font-size: 3vw !important;
                  padding-left: 3vw !important;
                  padding-right: 3vw !important;
                }
                /* Permet le wrap pour cartes en paysage sur petit écran */
                .landscape\\:flex-wrap {
                  flex-wrap: wrap;
                }
                /* Permet scroll horizontal si débordement */
                .landscape\\:overflow-x-auto {
                  overflow-x: auto;
                }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}