
import { Asset, CveEntry, RedTeamOperation, SocAlert, ThreatIntelFeed, Client } from '@/types/common';
import { MitreAttackTechnique } from '@/types/security';
import { supabase } from '@/lib/supabase';

// Mock data retrieval functions - in a real app, these would hit actual API endpoints

export async function getAssets(): Promise<Asset[]> {
  try {
    // In a real implementation, this would be a Supabase query
    const mockAssets: Asset[] = [
      {
        id: '1',
        name: 'Web Server',
        type: 'Server',
        status: 'Active',
        ip: '192.168.1.10',
        ip_address: '192.168.1.10',
        mac_address: '00:1A:2B:3C:4D:5E',
        os: 'Ubuntu 22.04 LTS',
        location: 'US East Data Center',
        owner: 'IT Department',
        criticality: 'High',
        security_score: 85,
        last_scan: '2023-09-15',
        vulnerabilities: ['CVE-2023-1234', 'CVE-2023-5678'],
        risk_score: 25
      },
      {
        id: '2',
        name: 'Database Server',
        type: 'Server',
        status: 'Active',
        ip: '192.168.1.11',
        ip_address: '192.168.1.11',
        mac_address: '00:1A:2B:3C:4D:5F',
        os: 'PostgreSQL on CentOS 8',
        location: 'US East Data Center',
        owner: 'Database Team',
        criticality: 'Critical',
        security_score: 92,
        last_scan: '2023-09-17',
        vulnerabilities: ['CVE-2023-9876'],
        risk_score: 15
      },
      {
        id: '3',
        name: 'Development Workstation',
        type: 'Workstation',
        status: 'Active',
        ip: '192.168.2.50',
        ip_address: '192.168.2.50',
        mac_address: '00:1A:2B:3C:4D:60',
        os: 'Windows 11 Pro',
        location: 'HQ Floor 3',
        owner: 'John Smith',
        criticality: 'Medium',
        security_score: 78,
        last_scan: '2023-09-10',
        vulnerabilities: ['CVE-2023-4321', 'CVE-2023-8765', 'CVE-2023-2468'],
        risk_score: 35
      }
    ];
    
    return mockAssets;
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
}

export async function getCveData(): Promise<CveEntry[]> {
  try {
    // In a real implementation, this would be a Supabase query
    const mockCveData: CveEntry[] = [
      {
        id: 'cve-1',
        cve_id: 'CVE-2023-1234',
        description: 'Remote code execution vulnerability in web server component',
        severity: 'High',
        published_date: '2023-05-12',
        updated_date: '2023-06-01',
        status: 'Confirmed',
        affected_systems: ['Web Server'],
        references: ['https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-1234'],
        mitigation: 'Update to version 2.5.8 or apply patch',
        cvss_score: 7.8,
        last_modified: '2023-06-01',
        vulnerability_type: 'Remote Code Execution'
      },
      {
        id: 'cve-2',
        cve_id: 'CVE-2023-5678',
        description: 'SQL injection vulnerability in API endpoint',
        severity: 'Critical',
        published_date: '2023-07-20',
        updated_date: '2023-07-25',
        status: 'Confirmed',
        affected_systems: ['Web Server'],
        references: ['https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-5678'],
        mitigation: 'Apply security patch and update input validation',
        cvss_score: 9.1,
        last_modified: '2023-07-25',
        vulnerability_type: 'SQL Injection'
      },
      {
        id: 'cve-3',
        cve_id: 'CVE-2023-9876',
        description: 'Privilege escalation vulnerability in database server',
        severity: 'High',
        published_date: '2023-08-05',
        updated_date: '2023-08-10',
        status: 'Confirmed',
        affected_systems: ['Database Server'],
        references: ['https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-9876'],
        mitigation: 'Apply security patch from vendor',
        cvss_score: 8.2,
        last_modified: '2023-08-10',
        vulnerability_type: 'Privilege Escalation'
      }
    ];
    
    return mockCveData;
  } catch (error) {
    console.error('Error fetching CVE data:', error);
    return [];
  }
}

export async function getSocAlerts(): Promise<SocAlert[]> {
  try {
    // Mock SOC alerts
    const mockSocAlerts: SocAlert[] = [
      {
        id: 'alert-1',
        title: 'Suspicious Login Activity',
        description: 'Multiple failed login attempts detected from unusual IP address',
        severity: 'High',
        status: 'Open',
        source: 'SIEM',
        detected_at: '2023-09-20T15:30:00Z',
        updated_at: '2023-09-20T15:35:00Z',
        affected_assets: ['dev-workstation-12'],
        mitre_techniques: ['T1110'],
        asset_id: '3',
        mitre_technique: 'T1110',
        created_at: '2023-09-20T15:30:00Z',
        details: {
          ip: '45.142.120.45',
          attempts: 12,
          timeframe: '15 minutes'
        }
      },
      {
        id: 'alert-2',
        title: 'Unusual Network Traffic',
        description: 'Unexpected outbound connections to known malicious IP',
        severity: 'Critical',
        status: 'In Progress',
        source: 'Network IDS',
        detected_at: '2023-09-20T12:45:00Z',
        updated_at: '2023-09-20T13:00:00Z',
        affected_assets: ['web-server-01'],
        mitre_techniques: ['T1071'],
        asset_id: '1',
        mitre_technique: 'T1071',
        created_at: '2023-09-20T12:45:00Z',
        details: {
          destination_ip: '91.234.56.78',
          port: 8080,
          protocol: 'HTTP'
        }
      }
    ];
    
    return mockSocAlerts;
  } catch (error) {
    console.error('Error fetching SOC alerts:', error);
    return [];
  }
}

export async function getRedTeamOperations(): Promise<RedTeamOperation[]> {
  try {
    // Mock red team operations
    const mockOperations: RedTeamOperation[] = [
      {
        id: 'op-1',
        name: 'Internal Network Penetration Test',
        status: 'Completed',
        start_date: '2023-08-01',
        end_date: '2023-08-15',
        description: 'Assessment of internal network security controls and defenses',
        team_id: 'team-1',
        created_by: 'user-001',
        created_at: '2023-07-25T10:00:00Z',
        updated_at: '2023-08-16T09:30:00Z',
        techniques: ['T1110', 'T1078', 'T1021'],
        targets: ['Internal Network', 'VPN', 'Active Directory'],
        severity: 'Medium',
        objective: 'Evaluate internal network security controls',
        targeted_systems: ['Domain Controller', 'File Server', 'Development Environment'],
        results: 'Successfully identified 5 critical vulnerabilities and 12 medium-risk issues'
      },
      {
        id: 'op-2',
        name: 'Web Application Security Assessment',
        status: 'In Progress',
        start_date: '2023-09-10',
        end_date: '2023-09-30',
        description: 'Comprehensive security assessment of customer-facing web applications',
        team_id: 'team-2',
        created_by: 'user-002',
        created_at: '2023-09-05T14:20:00Z',
        updated_at: '2023-09-18T11:45:00Z',
        techniques: ['T1190', 'T1059', 'T1203'],
        targets: ['E-commerce Platform', 'Customer Portal', 'Payment Gateway'],
        severity: 'High',
        objective: 'Identify vulnerabilities in web applications',
        targeted_systems: ['Web Server', 'Application Server', 'Database Server'],
        results: 'Ongoing assessment - 3 critical vulnerabilities identified so far'
      }
    ];
    
    return mockOperations;
  } catch (error) {
    console.error('Error fetching red team operations:', error);
    return [];
  }
}

export async function getMitreAttackData(): Promise<{ techniques: MitreAttackTechnique[], tactics: any[] }> {
  try {
    // Mock MITRE ATT&CK data
    const mockMitreData = {
      techniques: [
        {
          id: 'T1110',
          name: 'Brute Force',
          tactic: 'Credential Access',
          description: 'Adversaries may use brute force techniques to gain access to accounts'
        },
        {
          id: 'T1078',
          name: 'Valid Accounts',
          tactic: 'Defense Evasion',
          description: 'Adversaries may obtain and abuse credentials of existing accounts'
        },
        {
          id: 'T1021',
          name: 'Remote Services',
          tactic: 'Lateral Movement',
          description: 'Adversaries may use remote services to access other systems'
        },
        {
          id: 'T1190',
          name: 'Exploit Public-Facing Application',
          tactic: 'Initial Access',
          description: 'Adversaries may exploit vulnerabilities in public-facing applications'
        },
        {
          id: 'T1059',
          name: 'Command and Scripting Interpreter',
          tactic: 'Execution',
          description: 'Adversaries may abuse command and script interpreters to execute commands'
        },
        {
          id: 'T1071',
          name: 'Application Layer Protocol',
          tactic: 'Command and Control',
          description: 'Adversaries may use standard application layer protocols for command and control'
        }
      ],
      tactics: [
        {
          id: 'TA0001',
          name: 'Initial Access',
          description: 'The adversary is trying to get into your network'
        },
        {
          id: 'TA0002',
          name: 'Execution',
          description: 'The adversary is trying to run malicious code'
        },
        {
          id: 'TA0003',
          name: 'Persistence',
          description: 'The adversary is trying to maintain their foothold'
        },
        {
          id: 'TA0004',
          name: 'Privilege Escalation',
          description: 'The adversary is trying to gain higher-level permissions'
        }
      ]
    };
    
    return mockMitreData;
  } catch (error) {
    console.error('Error fetching MITRE ATT&CK data:', error);
    return { techniques: [], tactics: [] };
  }
}

export async function getThreatIntelFeeds(): Promise<ThreatIntelFeed[]> {
  try {
    // Mock threat intel feeds
    const mockFeeds: ThreatIntelFeed[] = [
      {
        id: 'ti-1',
        title: 'Emerging Ransomware Threat',
        name: 'Emerging Ransomware Threat',
        description: 'New ransomware variant targeting healthcare sector with sophisticated delivery mechanisms',
        source: 'Threat Intelligence Platform',
        severity: 'Critical',
        published_date: '2023-09-15',
        last_updated: '2023-09-18',
        affected_systems: ['Windows Servers', 'Healthcare Applications'],
        indicators: ['45.142.120.45', 'ransomX.exe', 'c4ff02b8a9f11c33cf5b5193f81c236e'],
        mitre_techniques: ['T1486', 'T1190', 'T1566'],
        ioc_count: 24,
        status: 'Active'
      },
      {
        id: 'ti-2',
        title: 'APT Group Activity',
        name: 'APT Group Activity',
        description: 'Increased activity from APT group targeting financial institutions',
        source: 'Security Vendor Advisory',
        severity: 'High',
        published_date: '2023-09-10',
        last_updated: '2023-09-16',
        affected_systems: ['Financial Software', 'Payment Processing Systems'],
        indicators: ['91.234.56.78', 'malicious.dll', 'e67f1d5549f4f05a03bcef739e05f61a'],
        mitre_techniques: ['T1078', 'T1105', 'T1059'],
        ioc_count: 18,
        status: 'Active'
      }
    ];
    
    return mockFeeds;
  } catch (error) {
    console.error('Error fetching threat intel feeds:', error);
    return [];
  }
}

export async function getClients(): Promise<Client[]> {
  try {
    // Mock client data
    const mockClients: Client[] = [
      {
        id: 'client-1',
        name: 'Acme Corporation',
        industry: 'Technology',
        contact_name: 'John Smith',
        contact_email: 'john.smith@acme.com',
        contact_phone: '555-123-4567',
        status: 'Active',
        projects: [
          {
            id: 'project-1',
            name: 'Network Security Assessment',
            status: 'Completed',
            start_date: '2023-06-01',
            end_date: '2023-07-15',
            client_id: 'client-1',
            description: 'Comprehensive assessment of network security controls and defenses'
          },
          {
            id: 'project-2',
            name: 'Web Application Penetration Test',
            status: 'In Progress',
            start_date: '2023-08-15',
            end_date: '2023-09-30',
            client_id: 'client-1',
            description: 'In-depth penetration testing of customer portal and e-commerce applications'
          }
        ]
      },
      {
        id: 'client-2',
        name: 'Healthcare Solutions Inc.',
        industry: 'Healthcare',
        contact_name: 'Sarah Johnson',
        contact_email: 'sarah.johnson@hcsolve.com',
        contact_phone: '555-987-6543',
        status: 'Active',
        projects: [
          {
            id: 'project-3',
            name: 'HIPAA Compliance Assessment',
            status: 'Completed',
            start_date: '2023-05-10',
            end_date: '2023-06-30',
            client_id: 'client-2',
            description: 'Assessment of security controls against HIPAA requirements'
          }
        ]
      },
      {
        id: 'client-3',
        name: 'Financial Services Group',
        industry: 'Finance',
        contact_name: 'Michael Williams',
        contact_email: 'm.williams@fingroup.com',
        contact_phone: '555-345-6789',
        status: 'Prospect',
        projects: []
      }
    ];
    
    return mockClients;
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}
