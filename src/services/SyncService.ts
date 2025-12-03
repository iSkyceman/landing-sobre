// src/services/SyncService.ts - VERSION CORRIGÉE POUR PRODUCTION
import type { Dossier } from '../types/dossier';

// ✅ CORRECTION : URL conditionnelle pour production/développement
const getApiBaseUrl = (): string => {
  // Si on est côté client (browser)
  if (typeof window !== 'undefined') {
    // En production sur Vercel
    if (window.location.hostname.includes('vercel.app')) {
      return ''; // Désactivé en production
    }
    // En développement local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }
  // Par défaut, désactivé
  return '';
};

const API_BASE_URL = getApiBaseUrl();

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
  // ✅ CORRECTION : Gestion spéciale pour Data+
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

// Fonction pour envoyer les données vers l'API principale - CORRIGÉE
export async function syncDossierToMainApp(dossier: Dossier): Promise<boolean> {
  try {
    // ✅ CORRECTION : Vérification si l'API est disponible
    if (!API_BASE_URL) {
      console.log('🔒 Synchronisation désactivée (production ou API non disponible)');
      return false;
    }
    
    const clientData = transformDossierToClient(dossier);
    
    // Validation adaptée pour Data+
    if (!clientData.dossierNumber || !clientData.username || !clientData.email) {
      console.error('❌ Champs requis manquants pour:', clientData.dossierNumber);
      return false;
    }
    
    console.log('🔄 Envoi vers API:', clientData);
    
    const response = await fetch(`${API_BASE_URL}/landing/sync-client`, {
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
      console.error('❌ Erreur synchronisation:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur réseau lors de la synchronisation:', error);
    return false;
  }
}

// Fonction pour synchroniser tous les dossiers existants - CORRIGÉE
export async function syncAllDossiers(): Promise<{success: boolean; count: number; message: string}> {
  try {
    // ✅ CORRECTION : Vérification préalable
    if (!API_BASE_URL) {
      const message = '🔒 Synchronisation désactivée en production - Fonctionne uniquement en développement local';
      console.log(message);
      return { success: false, count: 0, message };
    }
    
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
      // Log spécial pour Data+
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
    const dataPlusMsg = dataPlusCount > 0 ? ` (dont ${dataPlusCount} Data+)` : '';
    const message = successCount > 0 
      ? `✅ ${successCount} dossier(s) synchronisé(s) avec succès vers l'application principale!${dataPlusMsg}`
      : '❌ Aucun dossier n\'a pu être synchronisé. Vérifiez que votre backend local est démarré sur localhost:5000';
    
    if (typeof window !== 'undefined') {
      alert(message);
    }
    
    return { 
      success: successCount > 0, 
      count: successCount, 
      message 
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation globale:', error);
    const message = '❌ Erreur lors de la synchronisation. Vérifiez la console.';
    
    if (typeof window !== 'undefined') {
      alert(message);
    }
    
    return { success: false, count: 0, message };
  }
}

// Hook pour la synchronisation automatique
export function useAutoSync() {
  return {
    syncAllDossiers,
    syncDossierToMainApp
  };
}