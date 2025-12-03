"use client";
import React, { useRef, useState, ReactNode, MouseEvent } from "react";
import Image from "next/image";
import { FaCertificate, FaChartLine, FaArrowRight } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";

// Effet glitch typé typescript
function GlitchText({ children }: { children: ReactNode }) {
  return (
    <span
      className="relative inline-block glitch"
      aria-label={typeof children === "string" ? children : undefined}
    >
      <span aria-hidden="true" className="glitch-before">
        {children}
      </span>
      <span aria-hidden="true" className="glitch-after">
        {children}
      </span>
      {children}
      <style jsx>{`
        .glitch {
          color: #000;
          position: relative;
          display: inline-block;
        }
        .glitch-before,
        .glitch-after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.7;
          pointer-events: none;
        }
        .glitch-before {
          color: #0ff;
          animation: glitchTop 1.2s infinite linear alternate-reverse;
          z-index: 2;
        }
        .glitch-after {
          color: #f0f;
          animation: glitchBot 1.2s infinite linear alternate-reverse;
          z-index: 1;
        }
        @keyframes glitchTop {
          0% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(-2px, -2px);
          }
          40% {
            transform: translate(-2px, 2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        @keyframes glitchBot {
          0% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          60% {
            transform: translate(-2px, -2px);
          }
          80% {
            transform: translate(-2px, 2px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </span>
  );
}

export default function HeaderHero() {
  const [halo, setHalo] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHalo({ x, y });
  };
  const handleMouseLeave = () => setHalo({ x: 50, y: 50 });

  return (
    <header
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-screen min-h-screen overflow-x-hidden flex flex-col items-center justify-center bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#00fff7] text-black px-0"
      aria-label="En-tête principal version Itech"
      style={{
        backgroundSize: "200% 200%",
        animation: "gradientMove 8s ease-in-out infinite alternate",
      }}
    >
      {/* Halo lumineux */}
      <div
        className="absolute z-10 pointer-events-none hidden md:block"
        style={{
          left: `calc(50% - 80px)`,
          top: `calc(15% - 40px)`,
          width: 160,
          height: 160,
          background: `radial-gradient(circle at ${halo.x}% ${halo.y}%, #00fff7bb 0%, #00fff700 80%)`,
          filter: "blur(32px)",
          transition: shouldReduceMotion
            ? undefined
            : "background-position 0.2s, left 0.2s, top 0.2s",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-20 flex flex-col items-center justify-center w-full max-w-full md:max-w-3xl py-6"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97, y: 60 }}
        animate={shouldReduceMotion ? false : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.45, 1.8, 0.43, 1.03] }}
        role="main"
      >
        {/* Logo flottant animé */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8, y: -30 }}
          animate={
            shouldReduceMotion
              ? false
              : {
                  opacity: 1,
                  scale: [1, 1.07, 1],
                  y: [0, -8, 0],
                }
          }
          transition={{
            duration: 1.2,
            scale: { repeat: Infinity, repeatType: "mirror", duration: 2.5 },
            y: { repeat: Infinity, repeatType: "mirror", duration: 3 },
            ease: "easeInOut",
          }}
          className="mb-6 w-auto max-w-xs md:max-w-md"
          style={{ willChange: "transform, filter", marginTop: 0 }}
        >
          <Image
            src="/images/logo-iSkyce-industrie-5.0.png"
            alt="Logo iSkyce industrie 5.0"
            width={110}
            height={55}
            priority
            className="block drop-shadow-lg w-auto h-auto max-w-full"
          />
        </motion.div>

        {/* Titre principal avec effet glitch */}
        <h1
          className="font-black leading-tight mb-4 tracking-tight text-center text-black max-w-full md:max-w-2xl"
          style={{ fontSize: "clamp(1.4rem, 5vw, 2.8rem)", lineHeight: 1.15 }}
          tabIndex={0}
        >
          Transformez votre entreprise avec <GlitchText>l’IA avancé</GlitchText>
        </h1>

        {/* Texte descriptif */}
        <motion.p
  className="font-semibold max-w-md md:max-w-xl mb-6 text-center text-white"
  style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.4, color: '#fff' }}
  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
  animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
  transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
>
  +15% de performance, -20% de coûts, 40% de réduction CO₂.
  <br />
  Analyse IA personnalisée, résultats en 72h.
  <span className="text-cyan-600 font-bold ml-1">Prenez une longueur d’avance.</span>
</motion.p>


        {/* Bouton CTA */}
        <motion.button
          type="button"
          className="relative flex justify-center items-center gap-4 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold py-3 px-5 text-lg md:py-6 md:px-12 md:text-2xl rounded-full shadow-lg hover:shadow-xl uppercase tracking-wider transition-all duration-200 hover:scale-110 focus:ring-4 focus:ring-cyan-400 mb-5 border-transparent outline-none focus:outline-cyan-400 overflow-hidden"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={shouldReduceMotion ? false : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={
            shouldReduceMotion
              ? {}
              : { scale: 1.15, boxShadow: "0 0 24px #0592a1, 0 0 48px #096d75" }
          }
          whileTap={{ scale: 0.96 }}
          aria-label="Découvrez nos solutions IA"
          tabIndex={0}
          onClick={() => window.dispatchEvent(new Event("ouvrirCalculateurIA1"))}
        >
          <span className="relative z-10">Découvrez nos solutions IA</span>
          <motion.span
            initial={shouldReduceMotion ? false : { x: 0 }}
            animate={shouldReduceMotion ? false : { x: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            aria-hidden="true"
            style={{ willChange: "transform" }}
          >
            <FaArrowRight className="ml-2 text-3xl md:text-4xl" />
          </motion.span>
          <span className="absolute inset-0 pointer-events-none">
            <span className="scan-bar" />
          </span>
        </motion.button>

        {/* Cartes flottantes */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 w-full max-w-sm mx-auto mt-2">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.92 }}
            animate={
              shouldReduceMotion
                ? false
                : {
                    opacity: 1,
                    y: [0, -6, 0, 6, 0],
                    scale: 1,
                  }
            }
            transition={{
              delay: 0.5,
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="flex items-center gap-2 bg-white/30 backdrop-blur-lg text-white font-semibold rounded-2xl px-3 py-2 shadow-2xl border border-white/40 min-w-0 sm:min-w-[120px] justify-center transition-transform text-base md:text-lg"
            tabIndex={0}
            style={{ willChange: "transform, box-shadow", color: "#fff" }}
          >
            <FaCertificate className="text-white text-xl md:text-2xl" />
            Audit prédictif
          </motion.div>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -30, scale: 0.92 }}
            animate={
              shouldReduceMotion
                ? false
                : {
                    opacity: 1,
                    y: [0, 6, 0, -6, 0],
                    scale: 1,
                  }
            }
            transition={{
              delay: 0.7,
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="flex items-center gap-2 bg-white/30 backdrop-blur-lg text-white font-semibold rounded-2xl px-3 py-2 shadow-2xl border border-white/40 min-w-0 sm:min-w-[110px] justify-center transition-transform text-base md:text-lg"
            tabIndex={0}
            style={{ willChange: "transform, box-shadow", color: "#fff" }}
          >
            <FaChartLine className="text-white text-xl md:text-2xl" />
            ROI x3
          </motion.div>
        </div>
      </motion.div>
      <style jsx>{`
        .bg-gradient-animate {
          background: linear-gradient(
            120deg,
            #0f2027 0%,
            #2c5364 50%,
            #00fff7 100%
          );
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite alternate;
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .scan-bar {
          position: absolute;
          left: -60%;
          top: 0;
          bottom: 0;
          width: 60%;
          background: linear-gradient(
            90deg,
            transparent,
            #fff8,
            transparent
          );
          filter: blur(4px);
          animation: scanMove 1.8s linear infinite;
        }
        @keyframes scanMove {
          0% {
            left: -60%;
          }
          100% {
            left: 120%;
          }
        }
      `}</style>
    </header>
  );
} 