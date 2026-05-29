// src/services/DataService.ts
import type { Dossier } from '../types/dossier';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function getDossiers(): Promise<Dossier[]> {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem("dossiers");
  return saved ? JSON.parse(saved) : [];
}

export async function setDossiers(dossiers: Dossier[]): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // 1. Sauvegarde locale
  localStorage.setItem("dossiers", JSON.stringify(dossiers));
  
  // 2. Synchronisation automatique vers le backend
  const dernierDossier = dossiers[dossiers.length - 1];
  
  if (dernierDossier && API_URL) {
    try {
      // Nettoyer le prix (enlever € et espaces)
      const cleanPrix = dernierDossier.prix 
        ? parseInt(dernierDossier.prix.toString().replace(/[^\d]/g, '')) || 0 
        : 0;
      
      // Récupérer les sujets (format objet vers tableau)
      const sujetsArray = dernierDossier.sujets 
        ? Object.values(dernierDossier.sujets).filter(Boolean)
        : [];
      
      // Payload pour le backend
      const payload = {
        dossierNumber: dernierDossier.reference,
        offre: dernierDossier.offre?.nom || 'diagnostic_express',
        username: dernierDossier.nom,
        email: dernierDossier.email || 'client@exemple.com',
        siren: dernierDossier.siren || '',
        effectif: parseInt(dernierDossier.effectif) || 0,
        prix: cleanPrix,
        date: dernierDossier.date || new Date().toISOString(),
        sujets: sujetsArray,
        observation: dernierDossier.observation || '',
        contrat: dernierDossier.contrat === 'true' ? 'true' : 'false',
        provenance: dernierDossier.provenance || 'landing-itech'
      };
      
      console.log('🔄 Synchronisation auto vers backend:', payload);
      
      const response = await fetch(`${API_URL}/api/landing/sync-client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Sync réussie:', result.message);
      } else {
        console.warn('⚠️ Sync échec HTTP:', response.status);
      }
      
    } catch (error) {
      console.error('❌ Erreur sync (non bloquante):', error);
      // Ne pas bloquer - les données sont déjà en localStorage
    }
  }
}

export async function supprimerDossier(ref: string): Promise<Dossier[]> {
  const dossiers = await getDossiers();
  const updated = dossiers.filter(d => d.reference !== ref);
  await setDossiers(updated);
  return updated;
}

export async function supprimerSelection(refs: Set<string>): Promise<Dossier[]> {
  const dossiers = await getDossiers();
  const updated = dossiers.filter(d => !refs.has(d.reference));
  await setDossiers(updated);
  return updated;
}