
import { 
  Asset, 
  CveEntry, 
  RedTeamOperation, 
  SocAlert, 
  ThreatIntelFeed, 
  Client 
} from '@/types/common';
import { MitreAttackTechnique } from '@/types/security';

// Helper to ensure API responses are safely typed

export function getMitreTechniqueById(data: any, techniqueId: string): MitreAttackTechnique | undefined {
  if (!data) return undefined;
  
  // Handle both array and object with techniques array formats
  if (Array.isArray(data)) {
    return data.find((t: MitreAttackTechnique) => t.id === techniqueId);
  }
  
  if (data.techniques && Array.isArray(data.techniques)) {
    return data.techniques.find((t: MitreAttackTechnique) => t.id === techniqueId);
  }
  
  return undefined;
}

// Map asset data from API to our Asset interface
export function mapAssetData(apiAsset: any): Asset {
  return {
    id: apiAsset.id,
    name: apiAsset.name,
    type: apiAsset.type,
    status: apiAsset.status,
    ip: apiAsset.ip,
    ip_address: apiAsset.ip || apiAsset.ip_address,
    mac_address: apiAsset.mac_address,
    os: apiAsset.os,
    location: apiAsset.location,
    owner: apiAsset.owner,
    criticality: apiAsset.criticality || 'Medium',
    security_score: apiAsset.security_score || apiAsset.risk_score || 0,
    last_scan: apiAsset.last_scan,
    vulnerabilities: apiAsset.vulnerabilities || [],
    risk_score: apiAsset.risk_score
  };
}

// Map SOC alert data from API to our SocAlert interface
export function mapSocAlertData(apiAlert: any): SocAlert {
  return {
    id: apiAlert.id,
    title: apiAlert.title,
    description: apiAlert.description || 'No description provided',
    severity: apiAlert.severity,
    status: apiAlert.status,
    source: apiAlert.source,
    detected_at: apiAlert.detected_at || apiAlert.created_at,
    updated_at: apiAlert.updated_at || apiAlert.created_at,
    assigned_to: apiAlert.assigned_to,
    affected_assets: apiAlert.affected_assets,
    mitre_techniques: apiAlert.mitre_techniques,
    asset_id: apiAlert.asset_id,
    mitre_technique: apiAlert.mitre_technique,
    created_at: apiAlert.created_at,
    details: apiAlert.details
  };
}

// Map threat intel feed data from API to our ThreatIntelFeed interface
export function mapThreatIntelData(apiFeed: any): ThreatIntelFeed {
  return {
    id: apiFeed.id,
    title: apiFeed.title || apiFeed.name,
    description: apiFeed.description,
    source: apiFeed.source,
    severity: apiFeed.severity || 'Medium',
    published_date: apiFeed.published_date || apiFeed.last_updated,
    affected_systems: apiFeed.affected_systems,
    indicators: apiFeed.indicators,
    mitre_techniques: apiFeed.mitre_techniques,
    name: apiFeed.name,
    last_updated: apiFeed.last_updated,
    ioc_count: apiFeed.ioc_count,
    status: apiFeed.status
  };
}

// Map client project data from API to our ClientProject interface
export function mapClientProjectData(apiProject: any, clientId: string): Client['projects'][0] {
  return {
    id: apiProject.id,
    name: apiProject.name,
    status: apiProject.status,
    start_date: apiProject.start_date,
    end_date: apiProject.end_date,
    client_id: clientId,
    description: apiProject.description || 'No description provided'
  };
}
