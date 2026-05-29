// src/services/SyncService.ts - VERSION CORRIGÉE POUR PRODUCTION DATAPLUS
import type { Dossier } from '../types/dossier';

// ✅ CORRECTION : Utilisation de la variable d'environnement Vercel
const getApiBaseUrl = (): string => {
  // Priorité à la variable d'environnement NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined') {
    // Vérifier si la variable d'environnement est accessible côté client
    // @ts-ignore - process.env est accessible côté client avec NEXT_PUBLIC_
    if (process.env.NEXT_PUBLIC_API_URL) {
      // @ts-ignore
      console.log('🌐 Utilisation de NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      // @ts-ignore
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Fallback pour le développement local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('🏠 Mode développement local');
      return 'http://localhost:5000';
    }
  }
  
  // Fallback final (ngrok)
  console.log('🔗 Fallback vers ngrok');
  return 'https://periscope-chatroom-oversleep.ngrok-free.dev';
};

const API_BASE_URL = getApiBaseUrl();
console.log('📡 API_BASE_URL configurée:', API_BASE_URL);

export interface ClientData {
  dossierNumber: string;
  offre: string;
  username: string;
  email: string;
  siren: string;
  effectif: string;
  prix?: string;
  date: string;
  sujets: string[];
  observation?: string;
  contrat: boolean;
  provenance: string;
}

// Fonction pour transformer un Dossier en ClientData pour l'API
function transformDossierToClient(dossier: Dossier): ClientData {
  const isDataPlus = dossier.reference.includes('DATAPLUS');
  const offreName = isDataPlus ? 'DataPlus' : (dossier.offre?.nom || 'Non spécifiée');
  
  return {
    dossierNumber: dossier.reference,
    offre: offreName,
    username: dossier.nom || 'Non renseigné',
    email: dossier.email || '',
    siren: dossier.siren || '',
    effectif: dossier.effectif || '',
    prix: dossier.prix,
    date: dossier.date,
    sujets: dossier.sujets ? Object.values(dossier.sujets).filter(s => s) : [],
    observation: dossier.observation,
    contrat: isDataPlus,
    provenance: dossier.provenance || 'Landing Page'
  };
}

// Fonction pour envoyer les données vers l'API principale
export async function syncDossierToMainApp(dossier: Dossier): Promise<boolean> {
  try {
    if (!API_BASE_URL) {
      console.error('❌ API_BASE_URL non définie');
      return false;
    }
    
    const clientData = transformDossierToClient(dossier);
    
    if (!clientData.dossierNumber || !clientData.username || !clientData.email) {
      console.error('❌ Champs requis manquants pour:', clientData.dossierNumber);
      return false;
    }
    
    console.log('🔄 Envoi vers API:', clientData);
    
    const response = await fetch(`${API_BASE_URL}/api/landing/sync-client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Dossier synchronisé avec succès:', dossier.reference, result);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Erreur synchronisation (HTTP ' + response.status + '):', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur réseau lors de la synchronisation:', error);
    return false;
  }
}

// Fonction pour synchroniser tous les dossiers existants
export async function syncAllDossiers(): Promise<{success: boolean; count: number; message: string}> {
  try {
    // Récupère tous les dossiers du localStorage
    const saved = localStorage.getItem("dossiers");
    if (!saved) {
      console.log('ℹ️ Aucun dossier à synchroniser');
      return { success: true, count: 0, message: 'Aucun dossier à synchroniser' };
    }

    const dossiers: Dossier[] = JSON.parse(saved);
    let successCount = 0;
    let dataPlusCount = 0;

    console.log(`🔄 Début synchronisation de ${dossiers.length} dossiers...`);

    for (const dossier of dossiers) {
      const isDataPlus = dossier.reference.includes('DATAPLUS');
      if (isDataPlus) {
        console.log(`📊 Traitement Data+ spécial: ${dossier.reference}`);
        dataPlusCount++;
      }
      
      const success = await syncDossierToMainApp(dossier);
      if (success) successCount++;
      
      // Petite pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ Synchronisation terminée: ${successCount}/${dossiers.length} dossiers synchronisés`);
    console.log(`📊 Dont ${dataPlusCount} abonnement(s) Data+`);
    
    // Notification pour l'utilisateur
    if (successCount > 0) {
      const dataPlusMsg = dataPlusCount > 0 ? ` (dont ${dataPlusCount} Data+)` : '';
      alert(`✅ ${successCount} dossier(s) synchronisé(s) avec succès vers l'application principale!${dataPlusMsg}`);
    } else {
      console.warn('⚠️ Aucun dossier synchronisé');
    }
    
    return { 
      success: successCount > 0, 
      count: successCount, 
      message: successCount > 0 
        ? `✅ ${successCount} dossier(s) synchronisé(s)${dataPlusCount > 0 ? ` (dont ${dataPlusCount} Data+)` : ''}`
        : '❌ Aucun dossier synchronisé'
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation globale:', error);
    return { success: false, count: 0, message: '❌ Erreur lors de la synchronisation' };
  }
}