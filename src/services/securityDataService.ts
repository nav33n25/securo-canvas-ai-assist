
import { 
  CveEntry, 
  MitreAttackTechnique, 
  Asset, 
  SecurityTicket, 
  ComplianceFramework,
  ThreatIntelFeed,
  KnowledgeBaseArticle,
  LearningResource,
  Client,
  SocAlert,
  RedTeamOperation
} from '@/types/security';

const SAMPLE_CVE_DATA: CveEntry[] = [
  {
    id: "CVE-2023-23397",
    description: "Microsoft Outlook Elevation of Privilege Vulnerability that could enable an attacker to access a user's Net-NTLMv2 hash which could be used for NTLM relay attacks.",
    cvss_score: 9.8,
    published_date: "2023-03-14",
    last_modified: "2023-06-21",
    vulnerability_type: "Elevation of Privilege",
    severity: "Critical",
    status: "New",
    references: [
      "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-23397",
      "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
    ]
  },
  {
    id: "CVE-2022-27518",
    description: "Citrix ADC and Gateway Authentication Bypass vulnerability that allows unauthenticated remote attackers to execute arbitrary commands on vulnerable devices.",
    cvss_score: 9.0,
    published_date: "2022-12-13",
    last_modified: "2023-01-05",
    vulnerability_type: "Authentication Bypass",
    severity: "Critical",
    status: "Remediation",
    references: [
      "https://support.citrix.com/article/CTX474995/citrix-adc-and-citrix-gateway-security-bulletin-for-cve202227518"
    ]
  },
  {
    id: "CVE-2023-20887",
    description: "VMware Aria Operations for Networks contains an authentication bypass vulnerability in the API Authentication mechanism.",
    cvss_score: 9.8,
    published_date: "2023-06-01",
    last_modified: "2023-06-15",
    vulnerability_type: "Authentication Bypass",
    severity: "Critical",
    status: "Analyzing",
    references: [
      "https://www.vmware.com/security/advisories/VMSA-2023-0009.html"
    ]
  },
  {
    id: "CVE-2023-3079",
    description: "Use-after-free vulnerability in Google Chrome V8 engine that could lead to remote code execution.",
    cvss_score: 8.8,
    published_date: "2023-06-12",
    last_modified: "2023-06-25",
    vulnerability_type: "Use After Free",
    severity: "High",
    status: "Resolved",
    references: [
      "https://chromereleases.googleblog.com/2023/06/stable-channel-update-for-desktop.html"
    ]
  },
  {
    id: "CVE-2022-42948",
    description: "Apache Commons Text prior to 1.10.0 allows RCE when applied to untrusted input due to insecure interpolation defaults.",
    cvss_score: 9.8,
    published_date: "2022-10-13",
    last_modified: "2022-11-24",
    vulnerability_type: "Remote Code Execution",
    severity: "Critical",
    status: "Resolved",
    references: [
      "https://lists.apache.org/thread/3rj84onj9w10ro4mron3v9woxm2v0kwd"
    ]
  }
];

const SAMPLE_MITRE_DATA: MitreAttackTechnique[] = [
  {
    id: "T1566",
    name: "Phishing",
    tactic: "Initial Access",
    description: "Adversaries may send phishing messages to gain access to victim systems. Phishing is a common method of obtaining initial access to a network.",
    platforms: ["Windows", "macOS", "Linux", "Cloud", "Office 365"],
    detection: "Monitor for suspicious email attachments, URLs, and newly created processes that may indicate successful phishing attempts.",
    mitigation: "Implement DMARC, SPF, and DKIM protocols. Train users to identify and report phishing attempts. Deploy anti-phishing tools.",
    references: [
      "https://attack.mitre.org/techniques/T1566/"
    ]
  },
  {
    id: "T1059",
    name: "Command and Scripting Interpreter",
    tactic: "Execution",
    description: "Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries.",
    platforms: ["Windows", "macOS", "Linux", "Cloud"],
    detection: "Monitor for execution of unexpected or suspicious scripts and commands, especially those that attempt to disable security features.",
    mitigation: "Disable or limit scripting languages that are not required. Restrict PowerShell execution policies. Implement application whitelisting.",
    references: [
      "https://attack.mitre.org/techniques/T1059/"
    ]
  },
  {
    id: "T1053",
    name: "Scheduled Task/Job",
    tactic: "Persistence",
    description: "Adversaries may use task scheduling functionality to facilitate initial or recurring execution of malicious code.",
    platforms: ["Windows", "macOS", "Linux", "Cloud"],
    detection: "Monitor for the creation or modification of scheduled tasks, cron jobs, or systemd timers.",
    mitigation: "Configure access controls to limit which users can create scheduled tasks. Monitor for unexpected scheduled tasks.",
    references: [
      "https://attack.mitre.org/techniques/T1053/"
    ]
  },
  {
    id: "T1027",
    name: "Obfuscated Files or Information",
    tactic: "Defense Evasion",
    description: "Adversaries may attempt to make an executable or file difficult to discover or analyze.",
    platforms: ["Windows", "macOS", "Linux", "Cloud"],
    detection: "Use heuristic-based detection methods to identify obfuscated files. Look for suspicious encoding patterns.",
    mitigation: "Use anti-malware solutions that can detect common obfuscation techniques. Implement network monitoring to detect suspicious traffic.",
    references: [
      "https://attack.mitre.org/techniques/T1027/"
    ]
  },
  {
    id: "T1078",
    name: "Valid Accounts",
    tactic: "Defense Evasion, Persistence, Initial Access, Privilege Escalation",
    description: "Adversaries may steal the credentials of a specific user or service account to use in authentication.",
    platforms: ["Windows", "macOS", "Linux", "Cloud", "Network"],
    detection: "Monitor for authentication anomalies, such as logins at unusual times or from unusual locations.",
    mitigation: "Enforce MFA. Implement just-enough and just-in-time access. Regularly audit accounts and permissions.",
    references: [
      "https://attack.mitre.org/techniques/T1078/"
    ]
  }
];

const SAMPLE_ASSETS: Asset[] = [
  {
    id: "AST-001",
    name: "Web Application Server",
    type: "Server",
    ip_address: "10.0.1.5",
    os: "Ubuntu 22.04 LTS",
    location: "AWS us-east-1",
    owner: "IT Department",
    criticality: "High",
    security_score: 78,
    last_scan: "2023-11-15",
    vulnerabilities: ["CVE-2023-3079", "CVE-2022-42948"]
  },
  {
    id: "AST-002",
    name: "Finance Database",
    type: "Server",
    ip_address: "10.0.1.8",
    os: "Windows Server 2019",
    location: "On-premise Data Center",
    owner: "Finance Department",
    criticality: "Critical",
    security_score: 92,
    last_scan: "2023-11-10",
    vulnerabilities: []
  },
  {
    id: "AST-003",
    name: "CFO Laptop",
    type: "Workstation",
    mac_address: "00:1B:44:11:3A:B7",
    os: "MacOS 13.4",
    location: "Remote",
    owner: "Jane Smith (CFO)",
    criticality: "High",
    security_score: 85,
    last_scan: "2023-11-12",
    vulnerabilities: ["CVE-2023-3079"]
  },
  {
    id: "AST-004",
    name: "Customer Relationship Management",
    type: "Application",
    location: "SaaS",
    owner: "Sales Department",
    criticality: "Medium",
    security_score: 76,
    last_scan: "2023-11-05",
    vulnerabilities: []
  },
  {
    id: "AST-005",
    name: "Core Network Router",
    type: "Network",
    ip_address: "10.0.0.1",
    mac_address: "00:1A:2B:3C:4D:5E",
    location: "Primary Office",
    owner: "Infrastructure Team",
    criticality: "Critical",
    security_score: 94,
    last_scan: "2023-11-14",
    vulnerabilities: []
  }
];

// Sample security tickets
const SAMPLE_TICKETS: SecurityTicket[] = [
  {
    id: "TICKET-001",
    title: "Critical Vulnerability in Web Application Server",
    description: "Multiple vulnerabilities were identified in the web application server during the latest scan.",
    status: "In Progress",
    priority: "High",
    category: "Vulnerability",
    assignee: "Sarah Johnson",
    created_by: "Security Scanner",
    created_at: "2023-11-15T09:23:15Z",
    updated_at: "2023-11-15T14:45:30Z",
    due_date: "2023-11-22T23:59:59Z",
    related_assets: ["AST-001"],
    related_cves: ["CVE-2023-3079", "CVE-2022-42948"]
  },
  {
    id: "TICKET-002",
    title: "Suspicious Login Activity",
    description: "Multiple failed login attempts followed by a successful login from an unusual location.",
    status: "Open",
    priority: "Critical",
    category: "Incident",
    created_by: "SIEM Alert",
    created_at: "2023-11-16T02:14:22Z",
    updated_at: "2023-11-16T02:14:22Z",
    related_assets: ["AST-003"],
    related_cves: []
  }
];

// Sample compliance frameworks
const SAMPLE_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: "ISO27001",
    name: "ISO 27001:2022",
    description: "Information security management system standard",
    controls: [
      {
        id: "ISO27001-A.5.1",
        control_id: "A.5.1",
        title: "Information security policies",
        description: "To provide management direction and support for information security in accordance with business requirements and relevant laws and regulations.",
        status: "Compliant",
        implementation_notes: "Information security policy document created and approved by management.",
        evidence: "Policy document v2.3, approval record from 2023-08-15",
        last_assessment: "2023-09-01"
      },
      {
        id: "ISO27001-A.6.1",
        control_id: "A.6.1",
        title: "Organization of information security",
        description: "To establish a management framework to initiate and control the implementation and operation of information security within the organization.",
        status: "Partially Compliant",
        implementation_notes: "Security roles defined but some responsibilities are not clearly assigned.",
        evidence: "Organization chart, security responsibility matrix",
        last_assessment: "2023-09-01"
      }
    ]
  },
  {
    id: "NIST-CSF",
    name: "NIST Cybersecurity Framework",
    description: "Framework for improving critical infrastructure cybersecurity",
    controls: [
      {
        id: "NIST-CSF-ID.AM-1",
        control_id: "ID.AM-1",
        title: "Physical devices and systems inventory",
        description: "Physical devices and systems within the organization are inventoried",
        status: "Compliant",
        implementation_notes: "Asset management system implemented and regularly updated.",
        evidence: "Asset inventory report from 2023-10-15",
        last_assessment: "2023-10-20"
      },
      {
        id: "NIST-CSF-PR.AC-1",
        control_id: "PR.AC-1",
        title: "Identity and credential management",
        description: "Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users and processes",
        status: "Non-Compliant",
        implementation_notes: "Current credential management process lacks regular auditing.",
        last_assessment: "2023-10-20"
      }
    ]
  }
];

// Sample threat intelligence feeds
const SAMPLE_THREAT_INTEL: ThreatIntelFeed[] = [
  {
    id: "THREAT-001",
    title: "Emerging Ransomware Campaign Targeting Healthcare",
    description: "A new ransomware variant is actively targeting healthcare organizations with spear-phishing emails containing malicious attachments.",
    source: "Malware Research Team",
    severity: "Critical",
    published_date: "2023-11-10T00:00:00Z",
    affected_systems: ["Windows Servers", "Email Systems"],
    indicators: ["email.malicious-domain.com", "45a2b1c3d4e5f6a7b8c9d0e1f2a3b4c5"],
    mitre_techniques: ["T1566", "T1059"]
  },
  {
    id: "THREAT-002",
    title: "APT Group Exploiting Zero-Day in VPN Software",
    description: "An advanced persistent threat group is actively exploiting a previously unknown vulnerability in popular VPN software.",
    source: "External Intelligence Feed",
    severity: "High",
    published_date: "2023-11-14T00:00:00Z",
    affected_systems: ["VPN Appliances"],
    indicators: ["198.51.100.123", "203.0.113.45"],
    mitre_techniques: ["T1133", "T1078"]
  }
];

// Sample knowledge base articles
const SAMPLE_KB_ARTICLES: KnowledgeBaseArticle[] = [
  {
    id: "KB-001",
    title: "Implementing Zero Trust Security Model",
    content: "This article covers the principles of Zero Trust and provides a step-by-step guide for implementation...",
    category: "Security Architecture",
    tags: ["zero trust", "network security", "access control"],
    author: "Jane Smith",
    published_date: "2023-10-01T00:00:00Z",
    last_updated: "2023-10-15T00:00:00Z",
    related_articles: ["KB-003"]
  },
  {
    id: "KB-002",
    title: "Security Incident Response Playbook",
    content: "A comprehensive guide to handling security incidents from detection to resolution...",
    category: "Incident Response",
    tags: ["incident response", "playbook", "security operations"],
    author: "John Doe",
    published_date: "2023-09-15T00:00:00Z",
    last_updated: "2023-11-02T00:00:00Z",
    related_articles: ["KB-004"]
  },
  {
    id: "KB-003",
    title: "Secure Configuration for Cloud Services",
    content: "Best practices for securing various cloud service providers including AWS, Azure, and GCP...",
    category: "Cloud Security",
    tags: ["cloud", "configuration", "best practices"],
    author: "Sarah Johnson",
    published_date: "2023-08-22T00:00:00Z",
    last_updated: "2023-11-01T00:00:00Z",
    related_articles: ["KB-001"]
  }
];

// Sample learning resources
const SAMPLE_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: "LRN-001",
    title: "Web Application Security Fundamentals",
    description: "A comprehensive course covering the basics of securing web applications against common threats.",
    type: "Course",
    url: "https://example.com/courses/web-app-security",
    skill_level: "Beginner",
    topics: ["OWASP Top 10", "Secure Coding", "Input Validation"],
    duration: "4 hours",
    author: "Security Training Inc."
  },
  {
    id: "LRN-002",
    title: "Advanced Network Penetration Testing",
    description: "Learn advanced techniques for identifying and exploiting network vulnerabilities.",
    type: "Course",
    url: "https://example.com/courses/adv-network-pentest",
    skill_level: "Advanced",
    topics: ["Network Security", "Penetration Testing", "Vulnerability Assessment"],
    duration: "8 hours",
    author: "Ethical Hacking Academy"
  },
  {
    id: "LRN-003",
    title: "Security Automation with Python",
    description: "Tutorial on how to automate common security tasks using Python scripts.",
    type: "Video",
    url: "https://example.com/videos/security-automation",
    skill_level: "Intermediate",
    topics: ["Python", "Automation", "Security Tools"],
    duration: "45 minutes",
    author: "DevSecOps Channel"
  }
];

// Sample client data
const SAMPLE_CLIENTS: Client[] = [
  {
    id: "CLIENT-001",
    name: "Acme Corporation",
    industry: "Manufacturing",
    contact_name: "John Smith",
    contact_email: "jsmith@acme-example.com",
    contact_phone: "+1-555-123-4567",
    status: "Active",
    projects: [
      {
        id: "PROJ-001",
        name: "Security Assessment",
        description: "Comprehensive security assessment of IT infrastructure and applications.",
        status: "Completed",
        start_date: "2023-05-15",
        end_date: "2023-06-30",
        client_id: "CLIENT-001"
      },
      {
        id: "PROJ-002",
        name: "Security Monitoring Implementation",
        description: "Implementation of a SIEM solution and security monitoring program.",
        status: "In Progress",
        start_date: "2023-08-01",
        client_id: "CLIENT-001"
      }
    ]
  },
  {
    id: "CLIENT-002",
    name: "Globex Financial",
    industry: "Finance",
    contact_name: "Sarah Johnson",
    contact_email: "sjohnson@globex-example.com",
    contact_phone: "+1-555-987-6543",
    status: "Active",
    projects: [
      {
        id: "PROJ-003",
        name: "PCI DSS Compliance",
        description: "Assessment and remediation assistance for PCI DSS compliance.",
        status: "In Progress",
        start_date: "2023-07-01",
        client_id: "CLIENT-002"
      }
    ]
  }
];

// Sample SOC alerts
const SAMPLE_SOC_ALERTS: SocAlert[] = [
  {
    id: "ALERT-001",
    title: "Multiple Failed Login Attempts",
    description: "Multiple failed login attempts detected from external IP address.",
    severity: "Medium",
    status: "New",
    source: "SIEM Rule: Failed Authentication",
    detected_at: "2023-11-16T03:45:22Z",
    updated_at: "2023-11-16T03:45:22Z",
    affected_assets: ["AST-003"],
    mitre_techniques: ["T1078"]
  },
  {
    id: "ALERT-002",
    title: "Potential Data Exfiltration",
    description: "Unusual outbound data transfer detected from a server to an unknown external endpoint.",
    severity: "High",
    status: "Investigating",
    source: "Network Traffic Analysis",
    detected_at: "2023-11-15T22:17:45Z",
    updated_at: "2023-11-16T01:30:12Z",
    assigned_to: "John Doe",
    affected_assets: ["AST-001"],
    mitre_techniques: ["T1048"]
  }
];

// Sample Red Team operations
const SAMPLE_RED_TEAM_OPS: RedTeamOperation[] = [
  {
    id: "RT-OP-001",
    name: "Annual Penetration Test",
    objective: "Identify vulnerabilities in external-facing infrastructure and applications.",
    status: "Completed",
    start_date: "2023-09-10",
    end_date: "2023-09-24",
    techniques: ["T1566", "T1190", "T1133"],
    targeted_systems: ["Web Applications", "VPN", "Email Gateway"],
    results: "Successfully identified 3 critical and 5 high-risk vulnerabilities. Full report available."
  },
  {
    id: "RT-OP-002",
    name: "Phishing Campaign Simulation",
    objective: "Assess employee awareness and response to phishing attempts.",
    status: "Active",
    start_date: "2023-11-01",
    techniques: ["T1566"],
    targeted_systems: ["End Users"],
  }
];

// Functions to get data
export const getCveData = async (): Promise<CveEntry[]> => {
  // In a real implementation, this would fetch from an API
  return Promise.resolve(SAMPLE_CVE_DATA);
};

export const getMitreAttackData = async (): Promise<MitreAttackTechnique[]> => {
  return Promise.resolve(SAMPLE_MITRE_DATA);
};

export const getAssets = async (): Promise<Asset[]> => {
  return Promise.resolve(SAMPLE_ASSETS);
};

export const getSecurityTickets = async (): Promise<SecurityTicket[]> => {
  return Promise.resolve(SAMPLE_TICKETS);
};

export const getComplianceFrameworks = async (): Promise<ComplianceFramework[]> => {
  return Promise.resolve(SAMPLE_COMPLIANCE_FRAMEWORKS);
};

export const getThreatIntelFeeds = async (): Promise<ThreatIntelFeed[]> => {
  return Promise.resolve(SAMPLE_THREAT_INTEL);
};

export const getKnowledgeBaseArticles = async (): Promise<KnowledgeBaseArticle[]> => {
  return Promise.resolve(SAMPLE_KB_ARTICLES);
};

export const getLearningResources = async (): Promise<LearningResource[]> => {
  return Promise.resolve(SAMPLE_LEARNING_RESOURCES);
};

export const getClients = async (): Promise<Client[]> => {
  return Promise.resolve(SAMPLE_CLIENTS);
};

export const getSocAlerts = async (): Promise<SocAlert[]> => {
  return Promise.resolve(SAMPLE_SOC_ALERTS);
};

export const getRedTeamOperations = async (): Promise<RedTeamOperation[]> => {
  return Promise.resolve(SAMPLE_RED_TEAM_OPS);
};
