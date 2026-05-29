'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminDossiers.module.css";
import { getDossiers, supprimerDossier as delDossier, supprimerSelection as delSelection } from "@services/DataService";
import { syncAllDossiers } from "@services/SyncService";
// Import relatif
import type { Dossier } from "../../types/dossier";

export default function AdminDossiers() {
  const [dossiers, setDossiersState] = useState<Dossier[]>([]);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("");
  const router = useRouter();
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.replace("/login");
    } else {
      getDossiers().then((dossiers) => setDossiersState(dossiers));
    }
  }, [router]);

  useEffect(() => {
    if (tableWrapperRef.current) {
      tableWrapperRef.current.scrollLeft = 0;
    }
  }, [dossiers]);

  // FONCTION DE SYNCHRONISATION AVEC L'APP PRINCIPALE
  async function synchroniserDossiers() {
    if (!window.confirm("Synchroniser tous les dossiers vers l'application principale ?")) return;
    
    setSyncLoading(true);
    setSyncStatus("⏳ Synchronisation en cours...");
    
    try {
      await syncAllDossiers();
      setSyncStatus("✅ Synchronisation terminée avec succès !");
      setTimeout(() => setSyncStatus(""), 5000); // Efface le message après 5s
    } catch (error) {
      console.error('Erreur synchronisation:', error);
      setSyncStatus("❌ Erreur lors de la synchronisation");
      setTimeout(() => setSyncStatus(""), 5000);
    } finally {
      setSyncLoading(false);
    }
  }

  function toggleSelection(ref: string) {
    setSelected((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(ref)) {
        newSelected.delete(ref);
      } else {
        newSelected.add(ref);
      }
      return newSelected;
    });
  }

  function toggleSelectAll() {
    if (!dossiers) return;
    if (selected.size === dossiers.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(dossiers.map((d) => d.reference)));
    }
  }

  async function supprimerDossier(ref: string) {
    if (!window.confirm("Supprimer ce dossier ?")) return;
    const updated = await delDossier(ref);
    setDossiersState(updated);
    setSelected((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(ref);
      return newSelected;
    });
  }

  async function supprimerSelection() {
    if (selected.size === 0) return;
    if (!window.confirm(`Supprimer ${selected.size} dossier${selected.size > 1 ? "s" : ""} ?`))
      return;
    const updated = await delSelection(selected);
    setDossiersState(updated);
    setSelected(new Set());
  }

  function exportCSV() {
    if (!dossiers || dossiers.length === 0) return;
    const sep = ";";
    const headers = [
      "N° dossier",
      "Offre",
      "Nom",
      "Email",
      "SIREN",
      "Effectif",
      "Prix",
      "Date",
      "Sujets",
      "Observation",
      "Provenance",
    ];
    const rows = dossiers.map((d) =>
      [
        d.reference,
        d.offre?.nom || "",
        d.nom || "",
        d.email || "",
        d.siren || "",
        d.effectif || "",
        d.prix ?? "",
        d.date ? new Date(d.date).toLocaleString() : "",
        d.sujets ? Object.values(d.sujets).join(" / ") : "",
        d.observation || "",
        d.provenance || "?",
      ]
        .map((cell) => `"${(cell ?? "").toString().replace(/"/g, '""')}"`)
        .join(sep)
    );
    const csv = [headers.join(sep), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dossiers.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  if (dossiers.length === 0) {
    return <p>Aucun dossier enregistré.</p>;
  }

  return (
    <main style={{ padding: 20, maxWidth: 1200, margin: "auto" }}>
      <h1>Interface de gestion des dossiers</h1>
      
      {/* SECTION BOUTONS PRINCIPAUX */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            router.push("/");
          }}
          className={styles.adminBtn}
          style={{ background: "#999", marginBottom: 10 }}
        >
          🔒 Déconnexion
        </button>
        
        {/* NOUVEAU BOUTON DE SYNCHRONISATION */}
        <button
          onClick={synchroniserDossiers}
          disabled={syncLoading || dossiers.length === 0}
          className={dossiers.length && !syncLoading ? styles.adminBtn : `${styles.adminBtn} ${styles.Disabled}`}
          style={{ 
            background: syncLoading ? "#ccc" : "#00ff7f", 
            marginBottom: 10, 
            marginLeft: 10,
            opacity: syncLoading ? 0.7 : 1
          }}
        >
          {syncLoading ? "⏳ Synchronisation..." : "🔄 Synchroniser vers l'App Principale"}
        </button>
      </div>

      {/* STATUT DE SYNCHRONISATION */}
      {syncStatus && (
        <div style={{
          padding: "10px 15px",
          marginBottom: 15,
          borderRadius: "8px",
          backgroundColor: syncStatus.includes("✅") ? "rgba(0, 255, 127, 0.1)" : "rgba(255, 107, 107, 0.1)",
          border: syncStatus.includes("✅") ? "1px solid #00ff7f" : "1px solid #ff6b6b",
          color: syncStatus.includes("✅") ? "#00ff7f" : "#ff6b6b",
          fontWeight: "500"
        }}>
          {syncStatus}
        </div>
      )}

      {/* SECTION ACTIONS */}
      <div
        style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: "15px" }}
      >
        <button
          onClick={exportCSV}
          disabled={dossiers.length === 0}
          className={dossiers.length ? styles.adminBtn : `${styles.adminBtn} ${styles.Disabled}`}
        >
          Exporter CSV
        </button>
        <button
          onClick={supprimerSelection}
          disabled={selected.size === 0}
          className={selected.size ? styles.adminBtn : `${styles.adminBtn} ${styles.Disabled}`}
        >
          Supprimer la sélection
        </button>
        <span style={{ color: "#888", fontSize: "0.97em" }}>
          {dossiers.length} dossier{dossiers.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* MODAL POUR CONTRAT */}
      {modalContent && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalContent(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 4000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 30,
              borderRadius: 10,
              maxWidth: "90%",
              maxHeight: "90%",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalContent(null)}
              style={{
                position: "absolute",
                top: 10,
                right: 15,
                fontSize: 24,
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <div dangerouslySetInnerHTML={{ __html: modalContent }} />
          </div>
        </div>
      )}

      {/* TABLEAU DES DOSSIERS */}
      {dossiers.length > 0 && (
        <div ref={tableWrapperRef} className={styles.tableWrapper}>
          <table className={styles.tableAdmin} style={{ minWidth: "1200px" }}>
            <thead>
              <tr className={styles.theadMain}>
                <th>
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={dossiers.length > 0 && selected.size === dossiers.length}
                    aria-label="Sélectionner tout"
                  />
                </th>
                <th>N° dossier</th>
                <th>Offre</th>
                <th>Nom</th>
                <th>Email</th>
                <th>SIREN</th>
                <th>Effectif</th>
                <th>Prix</th>
                <th>Date</th>
                <th>Sujets</th>
                <th>Observation</th>
                <th>Contrat</th>
                <th>Provenance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((dossier) => {
                const sujetsList = dossier.sujets
                  ? Object.values(dossier.sujets).filter((s) => s && s.trim() !== "")
                  : [];
                return (
                  <tr key={dossier.reference} className={styles.tbodyRow}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(dossier.reference)}
                        onChange={() => toggleSelection(dossier.reference)}
                        aria-label={`Sélectionner dossier ${dossier.reference}`}
                      />
                    </td>
                    <td>{dossier.reference}</td>
                    <td>{dossier.offre?.nom || ""}</td>
                    <td>{dossier.nom || ""}</td>
                    <td>{dossier.email || "—"}</td>
                    <td>
                      <a
                        href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${dossier.siren}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0051ff", textDecoration: "underline" }}
                      >
                        {dossier.siren}
                      </a>
                    </td>
                    <td>{dossier.effectif}</td>
                    <td>{dossier.prix ?? "—"}</td>
                    <td>{dossier.date ? new Date(dossier.date).toLocaleString() : ""}</td>
                    <td>
                      {sujetsList.length > 0 ? (
                        <span className={styles.infobulleRoot} tabIndex={0}>
                          {sujetsList.length} sujet{(sujetsList.length > 1 ? "s" : "")}
                          <span className={styles.infobulleBox}>
                            {sujetsList.map((r, i) => (
                              <div key={i}>{r}</div>
                            ))}
                          </span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {dossier.observation && dossier.observation.trim() !== "" ? (
                        <span className={styles.infobulleRoot} tabIndex={0}>
                          Voir
                          <span className={styles.infobulleBox} style={{ whiteSpace: "pre-line", maxWidth: 340 }}>
                            {dossier.observation}
                          </span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {dossier.contrat ? (
                        <button onClick={() => setModalContent(dossier.contrat ?? null)} style={{ cursor: "pointer" }}>
                          Voir contrat
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          color:
                            dossier.provenance === "NosOffresSobre"
                              ? "#FF8C42"
                              : dossier.provenance === "NosOffresItech"
                              ? "#0051ff"
                              : dossier.provenance === "CalculateurItech"
                              ? "#00eaff"
                              : dossier.provenance === "CalculateurSobre"
                              ? "#F76D3C"
                              : dossier.provenance === "abosDataPlusItech"
                              ? "#4e50ff"
                              : "#888",
                          fontWeight: 600,
                        }}
                      >
                        {dossier.provenance || "?"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => supprimerDossier(dossier.reference)}
                        className={`${styles.adminBtn} ${styles.Delete}`}
                        title="Supprimer ce dossier"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
