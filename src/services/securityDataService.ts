
import { supabase } from '@/lib/supabase';
import { 
  SecurityTicket, 
  RedTeamOperation, 
  CveEntry, 
  Asset,
  SocAlert,
  ThreatIntelFeed,
  Client
} from '@/types/common';
import { parseTicketDate } from '@/types/common';

// Simulated data as fallback when real data is unavailable
const SAMPLE_TICKETS: SecurityTicket[] = [
  {
    id: 'ticket-001',
    title: 'SQL Injection in Login Form',
    description: 'Discovered a potential SQL injection vulnerability in the login form',
    status: 'open',
    priority: 'high',
    ticket_type: 'Vulnerability',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    reporter_id: 'user-001',
    assignee_id: null,
    category: 'vulnerability',
    due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    labels: ['sql-injection', 'authentication']
  },
  {
    id: 'ticket-002',
    title: 'Outdated OpenSSL Version',
    description: 'Server is running an outdated version of OpenSSL with known vulnerabilities',
    status: 'in_progress',
    priority: 'medium',
    ticket_type: 'Vulnerability',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    reporter_id: 'user-002',
    assignee_id: 'user-003',
    assignee_name: 'Jane Smith',
    category: 'compliance',
    labels: ['openssl', 'outdated-dependency']
  }
];

// Security Tickets API
export const getSecurityTickets = async (): Promise<SecurityTicket[]> => {
  try {
    const { data, error } = await supabase
      .from('security_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as SecurityTicket[] || SAMPLE_TICKETS;
  } catch (error) {
    console.error('Error fetching security tickets:', error);
    return SAMPLE_TICKETS;
  }
};

// Asset Management API
export const getAssets = async (): Promise<Asset[]> => {
  try {
    // Mock implementation returning asset data
    return [
      { 
        id: 'asset-001', 
        name: 'Production Web Server', 
        type: 'Server', 
        status: 'active', 
        ip: '10.0.0.1', 
        ip_address: '10.0.0.1',
        os: 'Ubuntu 20.04', 
        location: 'Primary Data Center',
        owner: 'IT Ops Team',
        last_scan: '2023-01-15', 
        criticality: 'Critical',
        security_score: 65,
        vulnerabilities: ['cve-001', 'cve-003'],
        risk_score: 35
      },
      { 
        id: 'asset-002', 
        name: 'Database Server', 
        type: 'Server', 
        status: 'active', 
        ip: '10.0.0.2', 
        ip_address: '10.0.0.2',
        os: 'RHEL 8', 
        location: 'Primary Data Center',
        owner: 'Database Team',
        last_scan: '2023-01-14', 
        criticality: 'High',
        security_score: 72,
        vulnerabilities: ['cve-002'],
        risk_score: 28
      },
      { 
        id: 'asset-003', 
        name: 'Development Server', 
        type: 'Server', 
        status: 'active', 
        ip: '10.0.0.3', 
        ip_address: '10.0.0.3',
        os: 'Debian 11', 
        location: 'Secondary Data Center',
        owner: 'Dev Team',
        last_scan: '2023-01-16', 
        criticality: 'Medium',
        security_score: 85,
        vulnerabilities: [],
        risk_score: 15
      }
    ];
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
};

// CVE Data API
export const getCveData = async (): Promise<CveEntry[]> => {
  try {
    // Mock implementation returning CVE data
    return [
      { 
        id: 'cve-001', 
        cve_id: 'CVE-2022-1234', 
        description: 'Buffer overflow vulnerability in OpenSSL', 
        severity: 'High', 
        published_date: '2022-10-15', 
        updated_date: '2022-11-01', 
        status: 'active', 
        affected_systems: ['asset-002'], 
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2022-1234'], 
        mitigation: 'Update to latest version',
        cvss_score: 7.5,
        last_modified: '2022-11-01',
        vulnerability_type: 'Buffer Overflow'
      },
      { 
        id: 'cve-002', 
        cve_id: 'CVE-2022-5678', 
        description: 'SQL injection vulnerability in legacy code', 
        severity: 'Critical', 
        published_date: '2022-09-12', 
        updated_date: '2022-10-05', 
        status: 'active', 
        affected_systems: ['asset-001'], 
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2022-5678'], 
        mitigation: 'Apply patch from vendor',
        cvss_score: 9.8,
        last_modified: '2022-10-05',
        vulnerability_type: 'SQL Injection'
      },
      { 
        id: 'cve-003', 
        cve_id: 'CVE-2022-9012', 
        description: 'Cross-site scripting vulnerability in web application', 
        severity: 'Medium', 
        published_date: '2022-11-20', 
        updated_date: '2022-12-01', 
        status: 'active', 
        affected_systems: ['asset-001'], 
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2022-9012'], 
        mitigation: 'Implement proper input sanitization',
        cvss_score: 6.1,
        last_modified: '2022-12-01',
        vulnerability_type: 'XSS'
      }
    ];
  } catch (error) {
    console.error('Error fetching CVE data:', error);
    return [];
  }
};

// SOC Alerts API
export const getSocAlerts = async (): Promise<SocAlert[]> => {
  try {
    // Mock implementation returning SOC alert data
    return [
      { 
        id: 'alert-001', 
        title: 'Multiple Failed Login Attempts', 
        description: 'Multiple failed login attempts detected from suspicious IP',
        severity: 'Medium', 
        source: 'SIEM', 
        status: 'Open', 
        created_at: '2023-01-18T10:23:45Z',
        detected_at: '2023-01-18T10:23:45Z',
        updated_at: '2023-01-18T10:23:45Z',
        asset_id: 'asset-001', 
        mitre_technique: 'T1110',
        details: { 
          ip: '192.168.1.105', 
          attempts: 5, 
          timeframe: '10 minutes' 
        }
      },
      { 
        id: 'alert-002', 
        title: 'Suspicious Outbound Connection', 
        description: 'Unusual outbound connection to known malicious IP address',
        severity: 'High', 
        source: 'NIDS', 
        status: 'Investigating',
        created_at: '2023-01-17T15:12:30Z',
        detected_at: '2023-01-17T15:12:30Z',
        updated_at: '2023-01-17T16:45:12Z',
        asset_id: 'asset-002', 
        mitre_technique: 'T1571',
        details: { 
          destination_ip: '198.51.100.77', 
          port: 4444, 
          protocol: 'TCP' 
        }
      }
    ];
  } catch (error) {
    console.error('Error fetching SOC alerts:', error);
    return [];
  }
};

// Red Team Operations API
export const getRedTeamOperations = async (): Promise<RedTeamOperation[]> => {
  try {
    // Mock implementation returning red team operation data
    return [
      { 
        id: 'op-001', 
        name: 'Internal Network Assessment', 
        status: 'Completed', 
        start_date: '2022-12-01', 
        end_date: '2022-12-15', 
        description: 'Comprehensive assessment of internal network security', 
        team_id: 'team-001', 
        created_by: 'user-001', 
        created_at: '2022-11-15T00:00:00Z', 
        updated_at: '2022-12-16T00:00:00Z', 
        techniques: ['T1110', 'T1190', 'T1133'], 
        targets: ['asset-001', 'asset-002'],
        severity: 'Medium',
        objective: 'Identify network security vulnerabilities',
        targeted_systems: ['Internal LAN', 'VPN Gateway', 'Domain Controllers'],
        results: 'Identified 3 critical and 5 medium vulnerabilities'
      },
      { 
        id: 'op-002', 
        name: 'Web Application Penetration Test', 
        status: 'In Progress', 
        start_date: '2023-01-10', 
        end_date: '2023-01-25', 
        description: 'Security assessment of customer portal web application', 
        team_id: 'team-001', 
        created_by: 'user-001', 
        created_at: '2023-01-05T00:00:00Z', 
        updated_at: '2023-01-18T00:00:00Z', 
        techniques: ['T1190', 'T1212'], 
        targets: ['asset-003'],
        severity: 'High',
        objective: 'Test customer portal for vulnerabilities',
        targeted_systems: ['Web Server', 'Application Server', 'Database'],
        results: 'In progress'
      }
    ];
  } catch (error) {
    console.error('Error fetching red team operations:', error);
    return [];
  }
};

// MITRE ATT&CK Data API
export const getMitreAttackData = async () => {
  try {
    // Mock implementation returning MITRE ATT&CK data
    return {
      techniques: [
        { id: 'T1110', name: 'Brute Force', tactic: 'Credential Access', description: 'Adversaries may use brute force techniques to gain access to accounts.' },
        { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access', description: 'Adversaries may exploit vulnerabilities in public-facing applications.' },
        { id: 'T1133', name: 'External Remote Services', tactic: 'Initial Access', description: 'Adversaries may leverage external remote services as an entry point into a network.' },
        { id: 'T1212', name: 'Exploitation for Credential Access', tactic: 'Credential Access', description: 'Adversaries may exploit software vulnerabilities to collect credentials.' },
        { id: 'T1571', name: 'Non-Standard Port', tactic: 'Command And Control', description: 'Adversaries may communicate using a protocol and port pairing that are typically not paired together.' }
      ],
      tactics: [
        { id: 'TA0001', name: 'Initial Access', description: 'The adversary is trying to get into your network.' },
        { id: 'TA0006', name: 'Credential Access', description: 'The adversary is trying to steal account names and passwords.' },
        { id: 'TA0011', name: 'Command And Control', description: 'The adversary is trying to communicate with compromised systems to control them.' }
      ]
    };
  } catch (error) {
    console.error('Error fetching MITRE ATT&CK data:', error);
    return {
      techniques: [],
      tactics: []
    };
  }
};

// Threat Intel Feeds API
export const getThreatIntelFeeds = async (): Promise<ThreatIntelFeed[]> => {
  try {
    // Mock implementation returning threat intel feed data
    return [
      { 
        id: 'feed-001', 
        name: 'APT Campaign Indicators', 
        title: 'APT Campaign Indicators',
        source: 'Internal', 
        last_updated: '2023-01-17T00:00:00Z', 
        published_date: '2023-01-15T00:00:00Z',
        ioc_count: 156, 
        status: 'active', 
        description: 'Indicators related to current APT campaigns',
        severity: 'High',
        affected_systems: ['Web Servers', 'Email Gateways'],
        indicators: ['45.132.192.12', 'malware.domain.com'],
        mitre_techniques: ['T1190', 'T1566']
      },
      { 
        id: 'feed-002', 
        name: 'Ransomware IOCs', 
        title: 'Ransomware IOCs',
        source: 'CISA', 
        last_updated: '2023-01-15T00:00:00Z', 
        published_date: '2023-01-10T00:00:00Z',
        ioc_count: 89, 
        status: 'active', 
        description: 'Indicators for recent ransomware variants',
        severity: 'Critical',
        affected_systems: ['Windows Servers', 'Domain Controllers'],
        indicators: ['23.106.223.55', 'ransom.domain.net'],
        mitre_techniques: ['T1486', 'T1490']
      },
      { 
        id: 'feed-003', 
        name: 'Phishing Domains', 
        title: 'Phishing Domains',
        source: 'PhishTank', 
        last_updated: '2023-01-18T00:00:00Z', 
        published_date: '2023-01-18T00:00:00Z',
        ioc_count: 241, 
        status: 'active', 
        description: 'Known phishing domains and URLs',
        severity: 'Medium',
        affected_systems: ['Email Users', 'Web Browsers'],
        indicators: ['phishing-site.com', 'fake-login.net'],
        mitre_techniques: ['T1566']
      }
    ];
  } catch (error) {
    console.error('Error fetching threat intel feeds:', error);
    return [];
  }
};

// Client Portal API
export const getClients = async (): Promise<Client[]> => {
  try {
    // Mock implementation returning client data
    return [
      { 
        id: 'client-001', 
        name: 'Acme Corporation', 
        industry: 'Manufacturing', 
        contact_name: 'John Smith', 
        contact_email: 'john@acme.com', 
        status: 'Active', 
        projects: [
          { 
            id: 'proj-001', 
            name: 'Infrastructure Assessment', 
            status: 'Completed', 
            start_date: '2022-10-01', 
            end_date: '2022-11-15',
            client_id: 'client-001',
            description: 'Complete assessment of network infrastructure and security controls'
          },
          { 
            id: 'proj-002', 
            name: 'Web Application Security', 
            status: 'In Progress', 
            start_date: '2023-01-05', 
            end_date: '2023-02-28',
            client_id: 'client-001',
            description: 'Security assessment of customer-facing web applications'
          }
        ]
      },
      { 
        id: 'client-002', 
        name: 'TechSolutions Inc', 
        industry: 'Technology', 
        contact_name: 'Lisa Johnson', 
        contact_email: 'lisa@techsolutions.com', 
        status: 'Active', 
        projects: [
          { 
            id: 'proj-003', 
            name: 'Penetration Testing', 
            status: 'In Progress', 
            start_date: '2023-01-10', 
            end_date: '2023-02-10',
            client_id: 'client-002',
            description: 'External and internal penetration testing of key systems'
          }
        ]
      }
    ];
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

// For ticket analytics
export interface TicketsByStatus {
  open: number;
  in_progress: number;
  review: number;
  resolved: number;
  closed: number;
  total: number;
}

export interface TicketsByPriority {
  low: number;
  medium: number;
  high: number;
  critical: number;
  total: number;
}

export interface TicketAnalytics {
  byStatus: TicketsByStatus;
  byPriority: TicketsByPriority;
  resolution: {
    averageTimeToResolve: number; // in hours
    resolvedCount: number;
  };
  trend: {
    dates: string[];
    counts: number[];
  };
}

export const getTicketAnalytics = async (): Promise<TicketAnalytics> => {
  try {
    const tickets = await getSecurityTickets();
    
    // Initialize counters
    const byStatus: TicketsByStatus = {
      open: 0,
      in_progress: 0,
      review: 0,
      resolved: 0,
      closed: 0,
      total: tickets.length
    };
    
    const byPriority: TicketsByPriority = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      total: tickets.length
    };
    
    // Count tickets by status and priority
    tickets.forEach(ticket => {
      // For status, handle both lowercase and title case formats
      const normalizedStatus = ticket.status.toLowerCase().replace(' ', '_');
      if (normalizedStatus === 'open') byStatus.open++;
      else if (normalizedStatus === 'in_progress') byStatus.in_progress++;
      else if (normalizedStatus === 'review' || normalizedStatus === 'pending') byStatus.review++;
      else if (normalizedStatus === 'resolved') byStatus.resolved++;
      else if (normalizedStatus === 'closed') byStatus.closed++;
      
      // For priority, handle both lowercase and title case formats
      const normalizedPriority = ticket.priority.toLowerCase();
      if (normalizedPriority === 'low') byPriority.low++;
      else if (normalizedPriority === 'medium') byPriority.medium++;
      else if (normalizedPriority === 'high') byPriority.high++;
      else if (normalizedPriority === 'critical') byPriority.critical++;
    });
    
    // Calculate resolution metrics
    const resolvedTickets = tickets.filter(t => 
      t.status.toLowerCase() === 'resolved' || t.status.toLowerCase() === 'closed'
    );
    
    let totalResolutionTime = 0;
    resolvedTickets.forEach(ticket => {
      const createdDate = new Date(ticket.created_at);
      const updatedDate = new Date(ticket.updated_at);
      const resolutionTime = (updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60); // in hours
      totalResolutionTime += resolutionTime;
    });
    
    const averageTimeToResolve = resolvedTickets.length ? totalResolutionTime / resolvedTickets.length : 0;
    
    // Generate trend data (last 14 days)
    const today = new Date();
    const dates: string[] = [];
    const counts: number[] = [];
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(dateString);
      
      const count = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.created_at).toISOString().split('T')[0];
        return ticketDate === dateString;
      }).length;
      
      counts.push(count);
    }
    
    return {
      byStatus,
      byPriority,
      resolution: {
        averageTimeToResolve,
        resolvedCount: resolvedTickets.length
      },
      trend: {
        dates,
        counts
      }
    };
  } catch (error) {
    console.error('Error getting ticket analytics:', error);
    // Return default data
    return {
      byStatus: {
        open: 5,
        in_progress: 3,
        review: 2,
        resolved: 8,
        closed: 12,
        total: 30
      },
      byPriority: {
        low: 10,
        medium: 12,
        high: 6,
        critical: 2,
        total: 30
      },
      resolution: {
        averageTimeToResolve: 36,
        resolvedCount: 20
      },
      trend: {
        dates: [...Array(14)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (13 - i));
          return date.toISOString().split('T')[0];
        }),
        counts: [2, 1, 3, 2, 0, 1, 4, 2, 1, 3, 2, 5, 1, 3]
      }
    };
  }
};

// Function to update ticket status
export const updateTicketStatus = async (
  ticketId: string, 
  status: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('security_tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticketId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
};

// Function to assign ticket to user
export const assignTicket = async (
  ticketId: string, 
  userId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('security_tickets')
      .update({ 
        assignee_id: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error assigning ticket:', error);
    throw error;
  }
};
