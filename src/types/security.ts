
// Security specific type definitions
import { AssetType, ClientStatus, AlertSeverity } from './common';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status?: string;
  ip?: string;
  ip_address?: string;
  mac_address?: string;
  os?: string;
  location?: string;
  owner?: string;
  criticality: string;
  security_score: number;
  last_scan: string;
  vulnerabilities: string[];
  risk_score?: number;
}

export interface CveEntry {
  id: string;
  cve_id?: string;
  description: string;
  severity: string;
  published_date: string;
  updated_date: string;
  status: string;
  affected_systems?: string[];
  references?: string[];
  mitigation?: string;
  cvss_score: number;
  last_modified: string;
  vulnerability_type: string;
}

export interface RedTeamOperation {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  description: string;
  team_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  techniques: string[];
  targets: string[];
  severity: string;
  objective: string;
  targeted_systems: string[];
  results?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  status: ClientStatus;
  projects: ClientProject[];
}

export interface ClientProject {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date?: string;
  client_id?: string;
  description?: string;
}

export interface SocAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: string;
  source: string;
  detected_at: string;
  updated_at: string;
  assigned_to?: string;
  affected_assets?: string[];
  mitre_techniques?: string[];
  asset_id?: string;
  mitre_technique?: string;
  created_at?: string;
  details?: any;
}

export interface ThreatIntelFeed {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: AlertSeverity;
  published_date: string;
  affected_systems?: string[];
  indicators?: string[];
  mitre_techniques?: string[];
  name?: string;
  last_updated?: string;
  ioc_count?: number;
  status?: string;
}

export interface MitreAttackTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  published_date: string;
  last_updated: string;
  related_articles?: string[];
}

export function getMitreTechnique(data: any, techniqueId: string): MitreAttackTechnique | undefined {
  if (!data) return undefined;
  
  // If data is an array, search directly
  if (Array.isArray(data)) {
    return data.find((technique) => technique.id === techniqueId);
  }
  
  // If data has a techniques array property
  if (data.techniques && Array.isArray(data.techniques)) {
    return data.techniques.find((technique: MitreAttackTechnique) => technique.id === techniqueId);
  }
  
  return undefined;
}
