
export interface CveEntry {
  id: string;
  description: string;
  cvss_score: number;
  published_date: string;
  last_modified: string;
  vulnerability_type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Analyzing' | 'Remediation' | 'Resolved' | 'Not Affected';
  references: string[];
}

export interface MitreAttackTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
  platforms: string[];
  detection: string;
  mitigation: string;
  references: string[];
}

export interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Workstation' | 'Mobile' | 'Network' | 'Service' | 'Application' | 'Other';
  ip_address?: string;
  mac_address?: string;
  os?: string;
  location?: string;
  owner?: string;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  security_score: number;
  last_scan: string;
  vulnerabilities: string[]; // CVE IDs
}

export interface SecurityTicket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Vulnerability' | 'Incident' | 'Request' | 'Task' | 'Other';
  assignee?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  related_assets?: string[];
  related_cves?: string[];
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  controls: ComplianceControl[];
}

export interface ComplianceControl {
  id: string;
  control_id: string;
  title: string;
  description: string;
  status: 'Compliant' | 'Non-Compliant' | 'Partially Compliant' | 'Not Applicable';
  implementation_notes?: string;
  evidence?: string;
  last_assessment?: string;
}

export interface ThreatIntelFeed {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  published_date: string;
  affected_systems?: string[];
  indicators?: string[];
  mitre_techniques?: string[];
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

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'Article' | 'Video' | 'Course' | 'Documentation' | 'Tool';
  url: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  topics: string[];
  duration?: string;
  author?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  status: 'Active' | 'Inactive' | 'Prospect';
  projects: ClientProject[];
}

export interface ClientProject {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  start_date: string;
  end_date?: string;
  client_id: string;
}

export interface SocAlert {
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Investigating' | 'Contained' | 'Resolved' | 'False Positive';
  source: string;
  detected_at: string;
  updated_at: string;
  assigned_to?: string;
  affected_assets?: string[];
  mitre_techniques?: string[];
}

export interface RedTeamOperation {
  id: string;
  name: string;
  objective: string;
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled';
  start_date: string;
  end_date?: string;
  techniques: string[]; // MITRE ATT&CK technique IDs
  targeted_systems: string[];
  results?: string;
}
