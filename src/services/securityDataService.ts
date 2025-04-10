
import { Asset, CveEntry, RedTeamOperation, SocAlert, ThreatIntelFeed, Client, MitreAttackTechnique } from '@/types/security';
import { SecurityTicket } from '@/types/common';
import { supabase } from '@/lib/supabase';

// Mock data for security tickets
const mockSecurityTickets: SecurityTicket[] = [
  {
    id: 'ticket-001',
    title: 'Potential XSS Vulnerability in Web App',
    description: 'Detected a potential cross-site scripting vulnerability in the user profile page.',
    status: 'open',
    priority: 'high',
    ticket_type: 'vulnerability',
    created_at: '2023-11-10T08:30:00Z',
    updated_at: '2023-11-10T08:30:00Z',
    reporter_id: 'user-001',
    assignee_id: null,
    category: 'vulnerability',
    labels: ['webapp', 'xss', 'frontend']
  },
  // ... Add more mock tickets as needed
];

// Analytics data structure
export interface TicketAnalytics {
  byStatus: {
    open: number;
    in_progress: number;
    review: number;
    resolved: number;
    closed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  resolution: {
    time: number;
    count: number;
    total: number;
  };
  trend: {
    dates: string[];
    counts: number[];
  };
}

// Function to get security assets
export const getAssets = async (): Promise<Asset[]> => {
  // In a real app, this would fetch from your API
  // For now, return mock data
  const assets: Asset[] = [
    {
      id: 'asset-001',
      name: 'Web Server 01',
      type: 'Server',
      status: 'Active',
      ip: '192.168.1.10',
      ip_address: '192.168.1.10',
      mac_address: '00:1A:2B:3C:4D:5E',
      os: 'Ubuntu 20.04 LTS',
      location: 'Primary Datacenter',
      owner: 'IT Department',
      criticality: 'High',
      security_score: 85,
      last_scan: '2023-11-05T14:30:00Z',
      vulnerabilities: ['CVE-2023-1234', 'CVE-2023-5678'],
      risk_score: 25
    },
    // ... Add more mock assets
  ];
  return assets;
};

// Function to get CVE data
export const getCveData = async (): Promise<CveEntry[]> => {
  // In a real app, this would fetch from your API
  // For now, return mock data
  const cveData: CveEntry[] = [
    {
      id: 'CVE-2023-1234',
      cve_id: 'CVE-2023-1234',
      description: 'Buffer overflow vulnerability in OpenSSL',
      severity: 'High',
      published_date: '2023-06-15T00:00:00Z',
      updated_date: '2023-06-20T00:00:00Z',
      status: 'Confirmed',
      affected_systems: ['Web Server 01', 'App Server 02'],
      references: ['https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-1234'],
      mitigation: 'Upgrade to OpenSSL version 3.1.1 or later',
      cvss_score: 8.5,
      last_modified: '2023-06-20T00:00:00Z',
      vulnerability_type: 'Buffer Overflow'
    },
    // ... Add more mock CVE entries
  ];
  return cveData;
};

// Function to get Red Team Operations
export const getRedTeamOperations = async (): Promise<RedTeamOperation[]> => {
  // In a real app, this would fetch from your API
  // For now, return mock data
  const operations: RedTeamOperation[] = [
    {
      id: 'op-001',
      name: 'Operation Firewall Test',
      status: 'Completed',
      start_date: '2023-10-01T09:00:00Z',
      end_date: '2023-10-05T17:00:00Z',
      description: 'Testing perimeter security and firewall configurations',
      team_id: 'team-001',
      created_by: 'user-002',
      created_at: '2023-09-15T11:30:00Z',
      updated_at: '2023-10-06T10:15:00Z',
      techniques: ['T1190', 'T1133', 'T1566'],
      targets: ['Firewall', 'VPN Servers', 'Email Gateway'],
      severity: 'Medium',
      objective: 'Evaluate perimeter defenses against common attack vectors',
      targeted_systems: ['Firewall-01', 'VPN-01', 'Email-Gateway-01'],
      results: 'Discovered 3 potential vulnerabilities in VPN configuration'
    },
    // ... Add more mock operations
  ];
  return operations;
};

// Function to get MITRE ATT&CK data
export const getMitreAttackData = async () => {
  // In a real app, this would fetch from your API
  // For now, return mock data
  return {
    techniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        tactic: 'Initial Access',
        description: 'Adversaries may attempt to exploit vulnerabilities in internet-facing applications.'
      },
      {
        id: 'T1133',
        name: 'External Remote Services',
        tactic: 'Initial Access',
        description: 'Adversaries may leverage external remote services as a point of entry to a network.'
      },
      {
        id: 'T1566',
        name: 'Phishing',
        tactic: 'Initial Access',
        description: 'Adversaries may send phishing messages to gain access to victim systems.'
      }
    ],
    tactics: [
      {
        id: 'TA0001',
        name: 'Initial Access',
        description: 'Techniques used to gain initial access to a network.'
      },
      {
        id: 'TA0002',
        name: 'Execution',
        description: 'Techniques used to execute adversary-controlled code.'
      }
    ]
  };
};

// Function to get SOC alerts
export const getSocAlerts = async (): Promise<SocAlert[]> => {
  // In a real app, this would fetch from your API
  // For now, return mock data
  const alerts: SocAlert[] = [
    {
      id: 'alert-001',
      title: 'Multiple Failed Login Attempts',
      description: 'Detected multiple failed login attempts from external IP',
      severity: 'Medium',
      status: 'Open',
      source: 'SIEM',
      detected_at: '2023-11-09T03:15:22Z',
      updated_at: '2023-11-09T03:15:22Z',
      asset_id: 'asset-003',
      mitre_technique: 'T1110',
      created_at: '2023-11-09T03:15:22Z',
      details: {
        ip: '203.0.113.45',
        attempts: 25,
        timeframe: '10 minutes'
      }
    },
    // ... Add more mock alerts
  ];
  return alerts;
};

// Function to get threat intelligence feeds
export const getThreatIntelFeeds = async (): Promise<ThreatIntelFeed[]> => {
  // In a real app, this would fetch from your API
  // For now, return mock data
  const feeds: ThreatIntelFeed[] = [
    {
      id: 'feed-001',
      title: 'New Ransomware Campaign Targeting Healthcare',
      name: 'Healthcare Ransomware Alert',
      description: 'A new ransomware campaign specifically targeting healthcare organizations has been detected.',
      source: 'US-CERT',
      severity: 'High',
      published_date: '2023-11-08T12:00:00Z',
      last_updated: '2023-11-09T15:30:00Z',
      ioc_count: 15,
      status: 'Active',
      affected_systems: ['Windows Servers', 'Electronic Medical Record Systems'],
      indicators: ['45.92.159.34', 'ransomware.test.domain', 'b59b25f5d8f03c3e6f7ddb82addb48cf'],
      mitre_techniques: ['T1486', 'T1490', 'T1566.001']
    },
    // ... Add more mock feeds
  ];
  return feeds;
};

// Function to get clients
export const getClients = async (): Promise<Client[]> => {
  // In a real app, this would fetch from your API
  // For now, return mock data
  const clients: Client[] = [
    {
      id: 'client-001',
      name: 'Acme Corporation',
      industry: 'Technology',
      contact_name: 'John Smith',
      contact_email: 'john.smith@acme.example',
      contact_phone: '+1-555-123-4567',
      status: 'Active',
      projects: [
        {
          id: 'project-001',
          name: 'Network Security Assessment',
          status: 'In Progress',
          start_date: '2023-10-01T00:00:00Z',
          end_date: '2023-12-15T00:00:00Z',
          client_id: 'client-001',
          description: 'Comprehensive assessment of network security controls and vulnerabilities'
        },
        {
          id: 'project-002',
          name: 'Web Application Penetration Test',
          status: 'Scheduled',
          start_date: '2023-12-01T00:00:00Z',
          end_date: '2023-12-31T00:00:00Z',
          client_id: 'client-001',
          description: 'Penetration testing of customer-facing web applications'
        }
      ]
    },
    // ... Add more mock clients
  ];
  return clients;
};

// Function to get security tickets
export const getSecurityTickets = async (): Promise<SecurityTicket[]> => {
  return mockSecurityTickets;
};

// Function to get ticket analytics
export const getTicketAnalytics = async (): Promise<TicketAnalytics> => {
  // In a real app, this would calculate analytics from your API data
  // For now, return mock analytics
  return {
    byStatus: {
      open: 12,
      in_progress: 8,
      review: 5,
      resolved: 15,
      closed: 30
    },
    byPriority: {
      low: 18,
      medium: 25,
      high: 12,
      critical: 5
    },
    resolution: {
      time: 4.5, // Average days to resolve
      count: 45, // Number of resolved tickets
      total: 70  // Total tickets
    },
    trend: {
      dates: ['2023-09-01', '2023-10-01', '2023-11-01', '2023-12-01'],
      counts: [15, 22, 18, 25]
    }
  };
};
