"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import styles from "./OptionDataPlusSobre.module.css";

interface ClientType {
  code: string;
  nom: string;
  email: string;
  siren: string;
  secteur: string;
  salaries: string;
  adresse: string;
  ville?: string;
  formeJuridique?: string;
}

interface FieldsType {
  nomEntreprise: string;
  nom: string;
  fonction: string;
  email: string;
  siren: string;
  secteur: string;
  salaries: string;
  adresse: string;
  ville: string;
  capitalSocial: string;
  formeJuridique: string;
  tranche: string;
}

interface PrefillDataType {
  nom?: string;
  email?: string;
  siren?: string;
  secteur?: string;
  salaries?: string;
  adresse?: string;
  ville?: string;
  formeJuridique?: string;
  code?: string;
  clientId?: string;
  nomEntreprise?: string;
  prix?: number;
  periodicite?: string;
  formule?: string;
  formuleLabel?: string;
}

const FORMULES = [
  { value: "0-15", label: "0-15 salariés", prix: 79 },
  { value: "16-49", label: "16-49 salariés", prix: 199 },
  { value: "50-99", label: "50-99 salariés", prix: 360 },
  { value: "100-249", label: "100-249 salariés", prix: 690 },
  { value: "250+", label: "250 salariés et +", prix: 995 },
];

const CONTRACT_TEXT = `Entre les soussignés :

iSkyce, Société individuelle, au capital de [Capital iSkyce] euros, dont le siège social est situé 6, rue schelmenwasen, immatriculée au RCS de Strasbourg sous le numéro 39273610400028, représentée par M. Michel Klein, en qualité de dirigeant, ci-après dénommée &apos;le Prestataire&apos; ou &apos;iSkyce&apos;,

Et

[NomEntreprise], Société [FormeJuridique], au capital de [CapitalClient] euros, dont le siège social est situé [Adresse], immatriculée au RCS de [Ville] sous le numéro [SIRET], représentée par [NomSignataire],

Coordonnées du Client : Email : [Email]

Formule choisie : [Tranche]
Périodicité : [Paiement]
Montant : [Montant] €/[UnitePaiement]
Capital social déclaré : [CapitalClient] €

Il a été convenu ce qui suit :

Article 1 – Objet

Le présent contrat a pour objet la fourniture par iSkyce au Client d&apos;un abonnement au service « Data+ », comprenant la complétude, la vérification et le rafraîchissement mensuel automatisé du jumeau numérique de l&apos;entreprise cliente, selon les modalités précisées ci-après.

Article 2 – Description des Services

iSkyce s&apos;engage à :
- Enrichir et actualiser mensuellement le jumeau numérique du Client à partir des données collectées et vérifiées.
- Fournir un accès sécurisé à la plateforme Data+.
- Envoyer au Client une note de service mensuelle récapitulant les opérations de complétude, de vérification et de rafraîchissement réalisées, ainsi que les éventuelles évolutions ou recommandations.
- Assurer une assistance technique par chat ou email aux horaires ouvrés.

Article 3 – Durée

Le présent contrat est conclu pour une durée ferme d&apos;un (1) an à compter de sa date de signature, renouvelable tacitement par périodes successives d&apos;un (1) an, sauf dénonciation par l&apos;une des parties dans les conditions prévues à l&apos;article 10.

Article 4 – Tarification et Modalités de Paiement

- L&apos;abonnement Data+ est facturé selon la grille tarifaire en vigueur au jour de la souscription, en fonction de la tranche d&apos;effectif déclarée par le Client.
- Le paiement s&apos;effectue par prélèvement automatique via la plateforme Stripe, selon la périodicité convenue (mensuelle ou annuelle).
- Tout retard de paiement entraînera l&apos;application d&apos;intérêts de retard au taux légal et pourra entraîner la suspension des services après mise en demeure restée sans effet.

Article 5 – Obligations des Parties

Obligations d&apos;iSkyce :
- Fournir le service Data+ conformément à la description du présent contrat.
- Garantir la confidentialité, l&apos;intégrité et la sécurité des données du Client, conformément à la norme RGPD.
- Informer le Client de toute évolution majeure du service ou des conditions d&apos;utilisation.

Obligations du Client :
- Fournir des informations exactes et à jour nécessaires à la création et à la maintenance du jumeau numérique.
- S&apos;acquitter du paiement de l&apos;abonnement dans les délais convenus.
- Respecter les conditions d&apos;utilisation de la plateforme Data+.

Article 6 – Propriété Intellectuelle
6.1. Le Client reconnaît que le service Data+, incluant le concept de jumeau numérique, le logiciel
sous-jacent, les algorithmes de complétude, vérification et rafraîchissement, les bases de données,
la documentation, et toute amélioration ou adaptation y afférent, sont et demeurent la propriété
exclusive d&apos;iSkyce ou des tiers lui ayant concédé les droits d&apos;utilisation.
6.2. Le présent Contrat confère au Client un droit d&apos;accès et d&apos;utilisation non-exclusif, non
transférable et limité aux seuls Services Data+ fournis par iSkyce, pour la durée du Contrat. Ce
droit d&apos;utilisation ne saurait en aucun cas être interprété comme une cession, une licence étendue
ou un transfert de propriété intellectuelle des éléments susmentionnés au bénéfice du Client.
6.3. Le Client s&apos;interdit formellement de reproduire, adapter, modifier, traduire, arranger, diffuser,
décompiler, désassembler ou tenter d&apos;accéder au code source du jumeau numérique ou de tout
élément du service Data+, sauf dans les limites expressément autorisées par la loi et le présent
Contrat.
6.4. Le jumeau numérique créé et maintenu dans le cadre du Service Data+, bien qu&apos;il reflète les
données du Client, constitue une œuvre de l&apos;esprit et une base de données dont la conception, la
structure et le mécanisme de mise à jour restent la propriété exclusive d&apos;iSkyce. Le Client n&apos;acquiert
aucun droit de propriété sur ce jumeau numérique en tant que tel.

Article 7 – Disponibilité, Maintenance et Évolution du Service
7.1. iSkyce s&apos;engage à assurer une disponibilité du service Data+ de 99 % sur une base annuelle,
hors périodes de maintenance planifiée notifiées au Client au moins 48h à l&apos;avance.
7.2. iSkyce ne saurait être tenue responsable des interruptions dues à des cas de force majeure ou
à des interventions nécessaires pour garantir la sécurité et la stabilité du service.
7.3. iSkyce se réserve le droit de faire évoluer le service Data+ (fonctionnalités, sécurité, interface...)
dans l&apos;intérêt de ses clients. Toute modification substantielle sera notifiée au Client.

Article 8 – Sous-traitance
iSkyce pourra recourir à des sous-traitants pour l&apos;exécution de tout ou partie du service, tout en
demeurant responsable vis-à-vis du Client.

Article 9 – Sauvegarde et Restitution des Données
À la demande du Client et en cas de résiliation, iSkyce restituera les données brutes fournies par le
Client dans un format standard, à l&apos;exclusion du jumeau numérique et de tout élément relevant de
la propriété intellectuelle d&apos;iSkyce.

Article 10 – Résiliation
- Chacune des parties peut résilier le contrat à l&apos;issue de la période initiale ou de chaque période de
renouvellement, par lettre recommandée avec accusé de réception, moyennant un préavis de trente (30) jours.
- En cas de manquement grave par l&apos;une des parties à ses obligations contractuelles, le contrat
pourra être résilié de plein droit, après mise en demeure restée sans effet pendant quinze (15) jours.
- En cas de résiliation anticipée à l&apos;initiative du Client hors manquement d&apos;iSkyce, les sommes dues
pour la période en cours restent exigibles.

Article 11 – Responsabilité
- iSkyce est tenue à une obligation de moyens pour la fourniture du service Data+. Sa responsabilité
ne saurait être engagée en cas d&apos;indisponibilité temporaire du service pour maintenance, force
majeure ou mauvaise utilisation par le Client.
- En aucun cas, la responsabilité d&apos;iSkyce ne saurait excéder le montant total des sommes versées
par le Client au titre du présent contrat sur les douze (12) derniers mois.

Article 12 – Force majeure
Aucune des parties ne pourra être tenue responsable d&apos;un manquement à ses obligations en cas
de survenance d&apos;un événement de force majeure, tel que défini par la jurisprudence française.

Article 13 – Conformité réglementaire
iSkyce garantit que le service Data+ est conforme à la réglementation en vigueur, notamment le
RGPD. Le Client s&apos;engage à utiliser le service dans le respect de la loi.

Article 14 – Audit et Traçabilité
Toutes les opérations sur les données du Client sont tracées et peuvent faire l&apos;objet d&apos;un audit à la
demande du Client, dans la limite du raisonnable.

Article 15 – Non-sollicitation
Le Client s&apos;interdit de solliciter ou d&apos;embaucher directement ou indirectement tout collaborateur
d&apos;iSkyce ayant participé à l&apos;exécution du contrat, pendant la durée du contrat et un an après sa
cessation.

Article 16 – Limitation d&apos;accès
L&apos;accès au service Data+ est réservé aux seuls salariés/mandataires du Client et ne peut être cédé,
transféré ou mis à disposition de tiers sans accord écrit d&apos;iSkyce.

Article 17 – Communication et Références
Sauf refus exprès du Client, iSkyce est autorisée à mentionner le nom et le logo du Client comme
référence commerciale.

Article 18 – Litiges et Droit applicable
Le présent contrat est régi par le droit français.
En cas de litige, les parties s&apos;efforcerent de résoudre leur différend à l&apos;amiable. À défaut, le litige
sera porté devant le tribunal compétent du ressort du siège social d&apos;iSkyce.

Article 19 – Divers
Toute modification du présent contrat devra faire l&apos;objet d&apos;un avenant écrit signé par les deux
parties.
Les coordonnées de contact pour toute question relative au contrat sont : support@iskyce.com, iskyceman@gmail.com.

Fait à [lieu], le [date]
Pour iSkyce
Michel Klein
[fonction]
Pour le Client
[Nom, fonction]
(Signatures précédées de la mention « Lu et approuvé »)
`.trim();

function generateRef() {
  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `DATAPLUS-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function contratTextToHtml(rawText: string): string {
  const lines = rawText.split(/\r?\n/);
  let html = "";
  let inList = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if(trimmed === "") {
      if(inList){
        html += "</ul>";
        inList=false;
      }
      continue;
    }
    if(/^Article\s+\d+/i.test(trimmed)){
      if(inList){
        html += "</ul>";
        inList=false;
      }
      html += `<h4>${trimmed}</h4>`;
      continue;
    }
    if(/:$/ .test(trimmed)){
      if(inList){
        html += "</ul>";
        inList=false;
      }
      html += `<p>${trimmed}</p>`;
      continue;
    }
    if(/^-\s/.test(trimmed)){
      if(!inList){
        html += "<ul>";
        inList=true;
      }
      html += `<li>${trimmed.replace(/^- /,"")}</li>`;
      continue;
    }
    if(inList){
      html += "</ul>";
      inList=false;
    }
    html += `<p>${trimmed}</p>`;
  }
  if(inList) html += "</ul>";
  return html;
}

// Fonction pour vérifier le code avec le backend (ou simulation)
const verifyDataPlusCode = async (code: string, clientId?: string) => {
  console.log('🔍 Vérification code Data+:', code);
  
  // ✅ MODE SIMULATION - Backend non déployé sur Vercel
  // Pour les codes DATAPLUS, on simule une réponse positive
  
  // 1. Vérifier si c'est un code Data+ valide
  if (code.includes('DATAPLUS')) {
    console.log('✅ Code Data+ valide (mode simulation)');
    
    // Récupérer les données pré-remplies de l'URL si disponibles
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get('data');
      
      if (encodedData) {
        const decodedData = decodeURIComponent(atob(encodedData));
        const prefillData = JSON.parse(decodedData);
        
        console.log('📦 Données pré-remplies trouvées:', prefillData);
        
        return {
          success: true,
          clientName: prefillData.nom || prefillData.nomEntreprise || 'Ecoplus',
          clientId: prefillData.clientId || prefillData.id || clientId || '691b39dc1c286871e23aee33',
          testMode: true,
          prix: prefillData.prix || 690,
          formule: prefillData.formule || '100-249',
          periodicite: prefillData.periodicite || 'annuel'
        };
      }
    } catch (error) {
      console.log('ℹ️ Pas de données pré-remplies dans l\'URL');
    }
    
    // Retour par défaut si pas de données pré-remplies
    return {
      success: true,
      clientName: 'Ecoplus',
      clientId: clientId || '691b39dc1c286871e23aee33',
      testMode: true,
      prix: 690,
      formule: '100-249',
      periodicite: 'annuel'
    };
  }
  
  // 2. Code non reconnu
  console.log('❌ Code invalide ou non reconnu');
  return { 
    success: false, 
    clientName: null, 
    clientId: null, 
    testMode: false 
  };
};

// Fonction pour extraire les données de l'URL
// Fonction pour extraire les données de l'URL - VERSION ROBUSTE
const extractPrefillDataFromUrl = () => {
  try {
    // Ne fonctionne que côté client
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const encodedData = urlParams.get('data');
    
    // 1. Si pas de données encodées mais un code DATAPLUS
    if (code && code.includes('DATAPLUS') && !encodedData) {
      console.log('ℹ️ Code Data+ sans données encodées');
      return {
        code: code,
        nomEntreprise: 'Ecoplus',
        nom: 'Ecoplus',
        formule: '100-249'
      };
    }
    
    // 2. Si données encodées
    if (encodedData) {
      console.log('🔍 Tentative décodage données URL...');
      
      // Essayer différentes méthodes de décodage
      try {
        // Méthode 1 : Décoder base64 puis JSON
        const decoded = atob(encodedData);
        return JSON.parse(decoded);
      } catch (e1) {
        console.log('Méthode 1 échouée, essai méthode 2...');
        
        try {
          // Méthode 2 : Décoder URI puis base64
          const decodedUri = decodeURIComponent(encodedData);
          const decoded = atob(decodedUri);
          return JSON.parse(decoded);
        } catch (e2) {
          console.log('Méthode 2 échouée, données peut-être déjà en JSON');
          
          // Méthode 3 : Parser directement
          try {
            return JSON.parse(encodedData);
          } catch (e3) {
            console.error('Toutes les méthodes de décodage ont échoué');
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erreur extraction données URL:', error);
    return null;
  }
};

function CodeInputSection({
  code,
  setCode,
  accessGranted,
  setFieldsInitialised,
  setShowModal,
  prefillData,
}: {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  accessGranted: boolean;
  setFieldsInitialised: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  prefillData?: PrefillDataType;
}) {
  
  // Si prefillData existe, on masque la saisie manuelle
  if (prefillData) {
    return (
      <div className={styles.centerCodeBox}>
        <div className={styles.codeLabel}>
          ✅ Code Data+ pré-rempli détecté
        </div>
        <div className={styles.prefillInfo}>
          <p>Client: <strong>{prefillData.nom || prefillData.nomEntreprise || 'Client'}</strong></p>
          <p>Code: <strong>{prefillData.code || 'Généré automatiquement'}</strong></p>
          <button
            type="button"
            onClick={() => {
              setFieldsInitialised(false);
              setShowModal(true);
            }}
            className={styles.buttonBlue}
            style={{ marginTop: '15px' }}
          >
            🚀 Accéder à la souscription
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.centerCodeBox}>
      <label htmlFor="code_data_plus" className={styles.codeLabel}>
        Saisissez votre code d'accès Data+ :
      </label>
      <input
        className={styles.select}
        type="text"
        id="code_data_plus"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="EX: DATAPLUS-DATAPLUS-XXXXX"
      />
      <div className={styles.codeMessage}>
        {code.length === 0 && "Un code est requis pour souscrire."}
        {code.length > 3 && !accessGranted && "Code invalide ou expiré. Vérifiez votre code."}
      </div>
      {accessGranted && (
        <button
          type="button"
          onClick={() => {
            setFieldsInitialised(false);
            setShowModal(true);
          }}
          className={styles.buttonBlue}
        >
          S'abonner à Data+
        </button>
      )}
    </div>
  );
}

interface TunnelModalProps {
  step: number;
  steps: string[];
  fields: FieldsType;
  setFields: Dispatch<SetStateAction<FieldsType>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  formule: string;
  setFormule: Dispatch<SetStateAction<string>>;
  paiement: string;
  setPaiement: Dispatch<SetStateAction<string>>;
  prixBase: number;
  prix: number;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  prev: () => void;
  contratLu: boolean;
  setContratLu: Dispatch<SetStateAction<boolean>>;
  contratMenuOpen: boolean;
  setContratMenuOpen: Dispatch<SetStateAction<boolean>>;
  buildContractHtml: () => string;
  handleContratAccept: () => void;
  showSimuStripe: boolean;
  handleSimuStripe: () => void;
  isSaving: boolean;
  refDossier: string;
  pdfReady: boolean;
  handleDownloadPdf: () => void;
  emailSent: boolean;
  confirmation: string;
  onClose: () => void;
}

function TunnelModal({
  step,
  steps,
  fields,
  setFields: _setFields,
  handleChange,
  formule,
  setFormule,
  paiement,
  setPaiement,
  prixBase,
  prix,
  handleFormSubmit,
  prev,
  contratLu,
  setContratLu,
  contratMenuOpen,
  setContratMenuOpen,
  buildContractHtml,
  handleContratAccept,
  showSimuStripe,
  handleSimuStripe,
  isSaving,
  refDossier,
  pdfReady,
  handleDownloadPdf,
  emailSent,
  confirmation,
  onClose,
}: TunnelModalProps) {
  void _setFields;

  return (
    <>
      <div className={styles.modalHeader}>
        <button type="button" aria-label="Fermer" className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <ol className={styles.progressBar}>
          {steps.map((label, idx) => (
            <li key={label} className={idx === step ? styles.stepActive : idx < step ? styles.stepDone : styles.stepTodo}>
              <span>{idx + 1}</span> {label}
            </li>
          ))}
        </ol>
        <div className={styles.modalTitle}>
          <span className={styles.bulletIcon} aria-hidden="true" />
          Abonnement Data+ Sobre
        </div>
      </div>
      <div className={styles.modalBodyWrapper}>
        <div className={styles.modalBodyScrollable}>
          {step === 0 && (
            <form onSubmit={handleFormSubmit} autoComplete="off">
              <label>
                Nom de l'entreprise
                <input type="text" name="nomEntreprise" value={fields.nomEntreprise} onChange={handleChange} required className={styles.select} />
              </label>
              <label>
                Forme juridique
                <input type="text" name="formeJuridique" value={fields.formeJuridique} onChange={handleChange} required className={styles.select} />
              </label>
              <label>
                Nom du souscripteur
                <input type="text" name="nom" value={fields.nom} onChange={handleChange} required className={styles.select} />
              </label>
              <label>
                Fonction du souscripteur
                <input type="text" name="fonction" value={fields.fonction} onChange={handleChange} className={styles.select} />
              </label>
              <label>
                Email professionnel
                <input type="email" name="email" value={fields.email} onChange={handleChange} required className={styles.select} />
              </label>
              <label>
                SIREN
                <input type="text" name="siren" value={fields.siren} onChange={handleChange} required className={styles.select} />
              </label>
              <label>
                Adresse - code postal - ville complet de l'entreprise
                <input type="text" name="adresse" value={fields.adresse} onChange={handleChange} required className={styles.select} />
              </label>
              <label>
                Indiquer Ville ou est immatriculée le rcs de l'entreprise
                <input type="text" name="ville" value={fields.ville} onChange={handleChange} required className={styles.select} />
              </label>
              <label>
                Capital social déclaré
                <input
                  type="text"
                  name="capitalSocial"
                  value={fields.capitalSocial}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      handleChange(e);
                    }
                  }}
                  required
                  className={styles.select}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </label>
              <label>
                Formule Data+
                <select className={styles.select} value={formule} onChange={(e) => setFormule(e.target.value)} required>
                  <option value="">Tranche de salariés</option>
                  {FORMULES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Paiement
                <select className={styles.select} value={paiement} onChange={(e) => setPaiement(e.target.value)}>
                  <option value="mensuel">Mensuel — {prixBase} €/mois</option>
                  <option value="annuel">Annuel (-10%) — {prix} €/an</option>
                </select>
              </label>
              <button type="submit" className={styles.buttonBlue}>
                Suivant →
              </button>
            </form>
          )}
          {step === 1 && (
            <div>
              <h4 className={styles.contractTitle}>Contrat d'abonnement Data+ Sobre</h4>
              <div className={styles.contractMenu}>
                <button
                  className={styles.contractDropdownBtn}
                  type="button"
                  onClick={() => setContratMenuOpen(!contratMenuOpen)}
                  aria-expanded={contratMenuOpen}
                >
                  {contratMenuOpen ? "▲ Masquer le contrat" : "▼ Visualiser le contrat"}
                </button>
                {contratMenuOpen && (
                  <div className={styles.contractZone} style={{ animation: "fadeIn 0.4s" }}>
                    <div dangerouslySetInnerHTML={{ __html: buildContractHtml() }} />
                    <a
                      href="https://drive.google.com/file/d/1_HeICEiGO4vPFQK7gIPniHxc6s3xuMAp/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      📄 Voir le contrat type (PDF Drive)
                    </a>
                  </div>
                )}
              </div>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={contratLu} onChange={(e) => setContratLu(e.target.checked)} />
                J'ai bien lu et j'accepte l'ensemble du contrat ci-dessus.
              </label>
              <button className={styles.buttonBlue} disabled={!contratLu} type="button" onClick={handleContratAccept}>
                Valider et passer au paiement
              </button>
              <button className={styles.buttonOutline} style={{ marginLeft: 12 }} onClick={prev} type="button">
                ← Précédent
              </button>
            </div>
          )}
          {step === 2 && (
            <div style={{ textAlign: "center" }}>
              <h3 className={styles.contractTitle}>Paiement sécurisé</h3>
              {showSimuStripe ? (
                <div className={styles.loader}>Traitement Stripe…</div>
              ) : (
                <button disabled={isSaving} onClick={handleSimuStripe} className={styles.buttonBlue}>
                  Procéder au paiement
                </button>
              )}
              <div style={{ color: "#A66B20", marginTop: 16, fontSize: "1em" }}>
                Référence dossier : <b>{refDossier || "[assignée à l'étape suivante]"}</b>
              </div>
              <button style={{ marginTop: 14 }} onClick={prev} className={styles.buttonOutline} type="button">
                ← Précédent
              </button>
            </div>
          )}
          {step === 3 && (
            <div style={{ textAlign: "center" }}>
              <div dangerouslySetInnerHTML={{ __html: confirmation }} />
              {pdfReady && (
                <>
                  <button onClick={handleDownloadPdf} className={styles.buttonBlue} style={{ marginTop: 10 }}>
                    🖨️ Imprimer / Enregistrer le contrat.
                  </button>
                  {emailSent && (
                    <div className={styles.emailNotif}>
                      Le PDF a été (virtuellement) envoyé à <b>{fields.email}</b> !
                    </div>
                  )}
                </>
              )}
              <div className={styles.successMessage}>
                Félicitations, votre souscription est enregistrée !
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Composant parent OptionDataPlusSobre
export default function OptionDataPlusSobre({ prefillData: externalPrefillData }: { prefillData?: PrefillDataType }) {
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const steps = ["Informations", "Contrat", "Paiement", "Confirmation"];

  const [code, setCode] = useState("");
  const [_client, setClient] = useState<ClientType | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);

  const [fields, setFields] = useState<FieldsType>({
    nomEntreprise: "",
    nom: "",
    fonction: "",
    email: "",
    siren: "",
    secteur: "",
    salaries: "",
    adresse: "",
    ville: "",
    capitalSocial: "",
    formeJuridique: "",
    tranche: "",
  });

  const [fieldsInitialised, setFieldsInitialised] = useState(false);
  const [formule, setFormule] = useState("");
  const [paiement, setPaiement] = useState("mensuel");
  const [contratLu, setContratLu] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [refDossier, setRefDossier] = useState("");
  const [pdfReady, setPdfReady] = useState(false);
  const [showSimuStripe, setShowSimuStripe] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [contratMenuOpen, setContratMenuOpen] = useState(false);
  
  // État pour les données pré-remplies
  const [prefillData, setPrefillData] = useState<PrefillDataType | null>(
    externalPrefillData || null
  );

  // ÉTAPE 1 : Extraire les données de l'URL au chargement
  useEffect(() => {
    // Si on a déjà des données externes, on les utilise
    if (externalPrefillData) {
      console.log("🎯 Données externes reçues:", externalPrefillData);
      setPrefillData(externalPrefillData);
      return;
    }

    // Sinon, on extrait de l'URL
    const urlData = extractPrefillDataFromUrl();
    if (urlData) {
      console.log("🌐 Données extraites de l'URL:", urlData);
      setPrefillData(urlData);
      
      // Extraire le code de l'URL aussi
      const urlParams = new URLSearchParams(window.location.search);
      const urlCode = urlParams.get('code');
      if (urlCode) {
        setCode(urlCode);
      }
    }
  }, [externalPrefillData]);

  // ÉTAPE 2 : Pré-remplir les champs avec prefillData
  useEffect(() => {
    if (prefillData) {
      console.log("🎯 Pré-remplissage avec données:", prefillData);
      
      const newFields: Partial<FieldsType> = {};
      
      // Mapper les données
      if (prefillData.nom || prefillData.nomEntreprise) {
        newFields.nomEntreprise = prefillData.nom || prefillData.nomEntreprise || '';
        newFields.nom = prefillData.nom || prefillData.nomEntreprise || '';
      }
      
      if (prefillData.email) newFields.email = prefillData.email;
      if (prefillData.siren) newFields.siren = prefillData.siren;
      if (prefillData.secteur) newFields.secteur = prefillData.secteur;
      if (prefillData.salaries) newFields.salaries = prefillData.salaries;
      if (prefillData.adresse) newFields.adresse = prefillData.adresse;
      if (prefillData.ville) newFields.ville = prefillData.ville;
      if (prefillData.formeJuridique) newFields.formeJuridique = prefillData.formeJuridique;
      
      // Si on a une formule dans prefillData, la sélectionner
      if (prefillData.formule) {
        setFormule(prefillData.formule);
      }
      
      // Si on a une périodicité dans prefillData, la sélectionner
      if (prefillData.periodicite) {
        setPaiement(prefillData.periodicite === 'annuel' ? 'annuel' : 'mensuel');
      }
      
      setFields(prev => ({ ...prev, ...newFields }));
      
      // Accès automatiquement accordé avec prefillData
      setAccessGranted(true);
      setFieldsInitialised(true);
      
      console.log("✅ Champs pré-remplis:", newFields);
    }
  }, [prefillData]);

  // ÉTAPE 3 : Vérifier le code si pas de prefillData
  useEffect(() => {
    // Si on a prefillData, on skip la vérification manuelle
    if (prefillData) return;

    const checkCode = async () => {
      if (!code.trim()) {
        setAccessGranted(false);
        setClient(null);
        return;
      }

      console.log("🔍 Vérification du code:", code);
      
      // Extraire clientId de l'URL si présent
      const urlParams = new URLSearchParams(window.location.search);
      const clientId = urlParams.get('client');

      // Vérifier le code avec le backend
      const result = await verifyDataPlusCode(code, clientId || undefined);

      if (result.success) {
        console.log("✅ Code valide:", result);
        setAccessGranted(true);
        
        // Mettre à jour les champs avec les infos du backend
        if (result.clientName) {
          setFields(prev => ({
            ...prev,
            nomEntreprise: result.clientName || prev.nomEntreprise,
            nom: result.clientName || prev.nom
          }));
        }
        
        // Si le backend retourne des infos supplémentaires
        if (result.prix || result.formule || result.periodicite) {
          if (result.formule) setFormule(result.formule);
          if (result.periodicite) setPaiement(result.periodicite === 'annuel' ? 'annuel' : 'mensuel');
        }
      } else {
        console.log("❌ Code invalide");
        setAccessGranted(false);
        setClient(null);
        setFields({
          nomEntreprise: "",
          nom: "",
          fonction: "",
          email: "",
          siren: "",
          secteur: "",
          salaries: "",
          adresse: "",
          ville: "",
          capitalSocial: "",
          formeJuridique: "",
          tranche: "",
        });
        setFieldsInitialised(false);
      }
    };

    // Délai pour éviter trop d'appels
    const timeoutId = setTimeout(checkCode, 500);
    return () => clearTimeout(timeoutId);
  }, [code, prefillData]);

  // Gestion du scroll
  useEffect(() => {
    if (showModal || showInfo) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal, showInfo]);

  // Initialiser les champs quand la modal s'ouvre
  useEffect(() => {
    if (showModal && accessGranted && !fieldsInitialised) {
      console.log("📝 Initialisation des champs dans la modal");
      setFieldsInitialised(true);
      
      // Si prefillData existe, on pré-remplit déjà (fait dans l'autre useEffect)
      // Sinon, on garde ce qu'on a
    }
  }, [showModal, accessGranted, fieldsInitialised]);

  const prixBase = FORMULES.find((f) => f.value === formule)?.prix || 0;
  const prix = paiement === "annuel" ? Math.round(prixBase * 12 * 0.9) : prixBase;

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fields.nomEntreprise.trim()) {
      alert("Le nom de l'entreprise est obligatoire.");
      return;
    }
    if (!fields.capitalSocial || Number(fields.capitalSocial) <= 0) {
      alert("Le capital social doit être un nombre supérieur à 0.");
      return;
    }
    if (!formule) {
      alert("Veuillez sélectionner une formule.");
      return;
    }
    next();
  }

  function buildContractHtml(): string {
    const placeholders: Record<string, string> = {
      "[NomEntreprise]": fields.nomEntreprise || "[Nom entreprise]",
      "[FormeJuridique]": fields.formeJuridique || "[Forme juridique]",
      "[CapitalClient]": fields.capitalSocial
        ? Number(fields.capitalSocial).toLocaleString("fr-FR")
        : "[Capital client]",
      "[Adresse]": fields.adresse || "[Adresse]",
      "[SIRET]": fields.siren || "[SIRET]",
      "[Ville]": fields.ville || "[Ville inconnue]",
      "[NomSignataire]":
        fields.nom && fields.fonction ? `${fields.nom}, ${fields.fonction}` : fields.nom || "[Nom signataire]",
      "[Email]": fields.email || "[Email]",
      "[Tranche]": FORMULES.find((f) => f.value === formule)?.label || "[Tranche]",
      "[Paiement]": paiement === "annuel" ? "annuel" : "mensuel",
      "[Montant]": prix?.toString() || "[Montant]",
      "[UnitePaiement]": paiement === "annuel" ? "an" : "mois",
      "[Capital iSkyce]": "1",
      "[Date]": new Date().toLocaleDateString("fr-FR"),
      "[Lieu]": "Strasbourg",
      "[supportEmail]": "support@iskyce.com",
    };

    let contratTextePersonnalise = CONTRACT_TEXT;
    for (const [key, val] of Object.entries(placeholders)) {
      const regex = new RegExp(key.replace(/[[\]]/g, "\\$&"), "g");
      contratTextePersonnalise = contratTextePersonnalise.replace(regex, val);
    }

    const contratHtml = contratTextToHtml(contratTextePersonnalise);

    return `
      <style>
        body {
          margin: 0;
          padding: 8px 20px 10px 20px;
          font-family: 'Montserrat', Arial, sans-serif;
          color: #22305a;
          font-size: 14px;
          white-space: normal;
        }
        h3 {
          color: #f76d3c;
          text-align: center;
          margin-bottom: 1em;
          font-weight: 700;
        }
        h4 {
          color: #f76d3c;
          margin: 20px 0 8px 0;
          font-weight: 600;
          page-break-inside: avoid;
        }
        p {
          margin: 0 0 10px 0;
          line-height: 1.5;
        }
        ul {
          margin: 0 0 15px 1.5em;
          padding: 0;
          line-height: 1.5;
        }
        li {
          margin-bottom: 5px;
        }
        hr {
          border: none;
          border-top: 1px solid #ccc;
          margin: 20px 0;
        }
        .contract-content {
          overflow-wrap: break-word;
        }
      </style>
      <h3>Abonnement Data+ SOBRE <span style="font-size: 1.2em;">📊</span></h3>
      <div class="contract-content">${contratHtml}</div>
      <p>Fait à ${placeholders["[Lieu]"]}, le ${placeholders["[Date]"]}</p>
      <p><b>Pour iSkyce :</b><br/>Michel Klein, Dirigeant</p>
      <p><b>Pour le Client :</b><br/>
        ${fields.nomEntreprise ? fields.nomEntreprise + "<br/>" : ""}
        ${fields.nom ? `${fields.nom}${fields.fonction ? ", " + fields.fonction : ""}` : "[Nom signataire]"}
      </p>
      <p style="font-style: italic; font-size: 0.85em;">
        Signature électronique générée automatiquement par validation en ligne.
      </p>
    `;
  }

  function handleContratAccept() {
    setContratLu(true);
    next();
  }

  function handleSimuStripe() {
    setShowSimuStripe(true);
    setTimeout(() => {
      setShowSimuStripe(false);
      validerPaiement();
    }, 1700);
  }

  function validerPaiement() {
    setIsSaving(true);
    const ref = generateRef();
    setRefDossier(ref);
    setTimeout(() => {
      const dossier = {
        reference: ref,
        ...fields,
        abonnement: "Data+ Sobre",
        formule: FORMULES.find((f) => f.value === formule)?.label,
        paiement,
        prix,
        codeClient: code || prefillData?.code || "DATAPLUS-" + Date.now(),
        contrat: buildContractHtml(),
        date: new Date().toISOString(),
        provenance: "abosDataPlusSobre",
        prefillData: prefillData || null,
      };
      const stored = localStorage.getItem("dossiers");
      const data = stored ? JSON.parse(stored) : [];
      data.push(dossier);
      localStorage.setItem("dossiers", JSON.stringify(data));
      setIsSaving(false);
      setConfirmation(`
        <div>
          <b>Merci, ${fields.nom} !</b><br/>Votre abonnement Data+ est activé.<br/>
          <b>Réf : ${ref}</b><br/><b>Montant :</b> ${prix} €/${
        paiement === "annuel" ? "an" : "mois"
      }
          <hr /><b>Imprimez ou enregistrez votre contrat signé ci-dessous :</b>
        </div>
      `);
      setPdfReady(true);
      next();
    }, 900);
  }

  function handleDownloadPdf() {
    const htmlStr = buildContractHtml();
    const printWindow = window.open("about:blank", "_blank", "width=900,height=700");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <title>Contrat Data+ SOBRE</title>
            <style>
              button.print-btn {
                margin-top: 20px;
                padding: 12px 20px;
                font-size: 1.2em;
                background-color: #f76d3c;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                box-shadow: 0px 2px 5px rgba(0,0,0,0.3);
              }
              button.print-btn:hover {
                background-color: #d95c20;
              }
            </style>
            <script>
              function printPage() { window.print(); }
            </script>
          </head>
          <body>
            ${htmlStr}
            <button class="print-btn" onclick="printPage()">🖨️ Imprimer / Enregistrer le contrat</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert("Impossible d'ouvrir la fenêtre d'impression. Veuillez autoriser les popups pour ce site.");
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    setStep(0);
    setFieldsInitialised(false);
    setContratLu(false);
    setFormule("");
    setPaiement("mensuel");
    setConfirmation("");
    setPdfReady(false);
    setEmailSent(false);
    setRefDossier("");
  }

  function DiscoverModal() {
    return (
      <div className={styles.tunnelModalOverlay}>
        <div className={styles.fullscreenModal}>
          <button className={styles.closeBtn} onClick={() => setShowInfo(false)}>×</button>
          <div className={styles.modalTitle}>Abonnement Data+ Sobre</div>
          <div className={styles.modalContent}>
            <strong style={{ color: "#f76d3c" }}>
              Data+ : l'abonnement réservé aux industriels engagés dans la transformation 5.0
            </strong>
            <br />
            <br />
            Cette offre avancée s'adresse exclusivement aux clients ayant déjà bénéficié d'un Diagnostic,
            d'une Feuille de route ou d'une Analyse IA.
            <br />
            <br />
            Nous créons pour vous un jumeau numérique sur-mesure, mis à jour chaque mois avec vos données réelles,
            pour un pilotage ultra-précis et une optimisation continue.
            <br />
            <br />
            Dès que votre jumeau numérique est prêt, vous recevez une invitation personnalisée
            pour activer votre abonnement Data+.
            <br />
            <br />
            <strong style={{ color: "#f76d3c" }}>
              Rejoignez les industriels qui anticipent, innovent et gardent une longueur d'avance.
            </strong>
            <br />
            <br />
            <a
              href="https://drive.google.com/file/d/1_HeICEiGO4vPFQK7gIPniHxc6s3xuMAp/view"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              📄 Voir le contrat type (PDF Drive)
            </a>
          </div>
          <button className={styles.buttonOrange} onClick={() => setShowInfo(false)}>
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        <span className={styles.bulletIcon} aria-hidden="true" />
        Abonnement Data+ Sobre
      </h2>
      <div style={{ textAlign: "center", margin: "1.1em 0" }}>
        <button className={styles.buttonOrange} onClick={() => setShowInfo(true)}>Découvrir Data+</button>
      </div>
      <p className={styles.text}>
        Pour garantir la pertinence et l'actualisation de vos analyses, nous proposons une formule d'abonnement mensuel.
        <br />
        Elle inclut la complétude, la vérification et le rafraîchissement automatique de vos données chaque mois.
      </p>
      <div className={styles.noteLeft}>
        Accès réservé : code requis (fourni après un diagnostic, feuille ou analyse IA).
      </div>
      
      {!showModal && !showInfo && (
        <CodeInputSection
          code={code}
          setCode={setCode}
          accessGranted={accessGranted}
          setFieldsInitialised={setFieldsInitialised}
          setShowModal={setShowModal}
          prefillData={prefillData || undefined}
        />
      )}
      
      {showInfo && !showModal && <DiscoverModal />}
      
      {showModal && (
        <div className={styles.tunnelModalOverlay}>
          <div className={styles.tunnelModal}>
            <TunnelModal
              step={step}
              steps={steps}
              fields={fields}
              setFields={setFields}
              handleChange={handleChange}
              formule={formule}
              setFormule={setFormule}
              paiement={paiement}
              setPaiement={setPaiement}
              prixBase={prixBase}
              prix={prix}
              handleFormSubmit={handleFormSubmit}
              prev={prev}
              contratLu={contratLu}
              setContratLu={setContratLu}
              contratMenuOpen={contratMenuOpen}
              setContratMenuOpen={setContratMenuOpen}
              buildContractHtml={buildContractHtml}
              handleContratAccept={handleContratAccept}
              showSimuStripe={showSimuStripe}
              handleSimuStripe={handleSimuStripe}
              isSaving={isSaving}
              refDossier={refDossier}
              pdfReady={pdfReady}
              handleDownloadPdf={handleDownloadPdf}
              emailSent={emailSent}
              confirmation={confirmation}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </section>
  );
}