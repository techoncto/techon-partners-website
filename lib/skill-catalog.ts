export interface Skill {
  id: string
  name: string
}

export interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

export const SKILL_CATALOG: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Front-end Development',
    skills: [
      { id: 'html-css', name: 'HTML/CSS' },
      { id: 'js-vanilla', name: 'JavaScript (vanilla)' },
      { id: 'react', name: 'React' },
      { id: 'vue', name: 'Vue.js' },
      { id: 'angular', name: 'Angular' },
      { id: 'responsive', name: 'Responsive design (mobile-first)' },
      { id: 'pwa', name: 'Progressive web apps (PWA)' },
      { id: 'a11y', name: 'Accessibility (WCAG compliance)' },
      { id: 'ui-ux', name: 'UI/UX implementation' },
      { id: 'browser-compat', name: 'Browser compatibility testing' },
    ],
  },
  {
    id: 'backend',
    name: 'Back-end Development',
    skills: [
      { id: 'nodejs', name: 'Node.js' },
      { id: 'python', name: 'Python' },
      { id: 'php', name: 'PHP' },
      { id: 'ruby', name: 'Ruby' },
      { id: 'java', name: 'Java' },
      { id: 'dotnet', name: '.NET/C#' },
      { id: 'api-design', name: 'API design and development' },
      { id: 'rest', name: 'RESTful services' },
      { id: 'graphql', name: 'GraphQL' },
      { id: 'microservices', name: 'Microservices architecture' },
    ],
  },
  {
    id: 'data',
    name: 'Databases & Data',
    skills: [
      { id: 'sql-dbs', name: 'MySQL/PostgreSQL' },
      { id: 'mongodb', name: 'MongoDB' },
      { id: 'redis', name: 'Redis' },
      { id: 'db-design', name: 'Database design and optimization' },
      { id: 'data-modeling', name: 'Data modeling' },
      { id: 'query-opt', name: 'Query optimization' },
      { id: 'migrations', name: 'Database migrations' },
      { id: 'pipelines', name: 'Data pipeline management' },
      { id: 'etl', name: 'ETL processes' },
      { id: 'sql-analytics', name: 'Basic SQL analytics' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & Infrastructure',
    skills: [
      { id: 'aws', name: 'AWS services' },
      { id: 'azure', name: 'Azure services' },
      { id: 'gcp', name: 'Google Cloud Platform' },
      { id: 'docker', name: 'Docker' },
      { id: 'k8s', name: 'Kubernetes' },
      { id: 'web-server', name: 'Server configuration (nginx/Apache)' },
      { id: 'cicd', name: 'CI/CD pipelines' },
      { id: 'iac', name: 'Infrastructure as code (Terraform/CloudFormation)' },
      { id: 'observability', name: 'Monitoring and observability' },
      { id: 'scaling', name: 'Load balancing and scaling' },
    ],
  },
  {
    id: 'security',
    name: 'Security & Compliance',
    skills: [
      { id: 'web-sec', name: 'Web application security' },
      { id: 'sec-audit', name: 'Security auditing' },
      { id: 'pentest', name: 'Penetration testing' },
      { id: 'owasp', name: 'OWASP Top 10' },
      { id: 'auth', name: 'Authentication/authorization (OAuth, JWT)' },
      { id: 'encryption', name: 'Data encryption' },
      { id: 'gdpr', name: 'GDPR/CCPA compliance' },
      { id: 'soc2', name: 'SOC 2 compliance' },
      { id: 'incident', name: 'Incident response' },
      { id: 'vuln-mgmt', name: 'Vulnerability management' },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & Automation',
    skills: [
      { id: 'git', name: 'Version control (Git workflows)' },
      { id: 'testing', name: 'Automated testing (unit/integration)' },
      { id: 'ci', name: 'Continuous integration' },
      { id: 'cd', name: 'Continuous deployment' },
      { id: 'build', name: 'Build automation' },
      { id: 'release', name: 'Release management' },
      { id: 'env-mgmt', name: 'Environment management' },
      { id: 'config-mgmt', name: 'Configuration management' },
      { id: 'dr', name: 'Disaster recovery planning' },
      { id: 'backup', name: 'Backup and restore procedures' },
    ],
  },
  {
    id: 'ai',
    name: 'AI & Emerging Tech',
    skills: [
      { id: 'ml-basics', name: 'Machine learning basics' },
      { id: 'llm', name: 'AI/LLM integration' },
      { id: 'prompt', name: 'Prompt engineering' },
      { id: 'ai-apis', name: 'API integration (OpenAI, Anthropic)' },
      { id: 'ml-data', name: 'Data preparation for ML' },
      { id: 'model-deploy', name: 'Model deployment' },
      { id: 'ai-ethics', name: 'AI ethics and safety' },
      { id: 'automation-strat', name: 'Automation strategy' },
    ],
  },
  {
    id: 'platforms',
    name: 'Platforms & Tools',
    skills: [
      { id: 'wordpress', name: 'WordPress' },
      { id: 'shopify', name: 'Shopify' },
      { id: 'salesforce', name: 'Salesforce' },
      { id: 'hubspot', name: 'HubSpot' },
      { id: 'stripe', name: 'Stripe/payment processing' },
      { id: 'analytics', name: 'Analytics platforms (Google Analytics, Mixpanel)' },
      { id: 'mkt-auto', name: 'Marketing automation tools' },
      { id: 'crm', name: 'CRM systems' },
      { id: 'pm-tools', name: 'Project management tools (Jira, Asana)' },
    ],
  },
  {
    id: 'seo',
    name: 'SEO & Digital Marketing',
    skills: [
      { id: 'tech-seo', name: 'Technical SEO' },
      { id: 'local-seo', name: 'Local SEO' },
      { id: 'gsc', name: 'Google Search Console' },
      { id: 'gads', name: 'Google Ads' },
      { id: 'cro', name: 'Conversion rate optimization' },
      { id: 'ab-test', name: 'A/B testing' },
      { id: 'perf', name: 'Website performance optimization' },
      { id: 'cwv', name: 'Core Web Vitals' },
      { id: 'schema', name: 'Schema markup' },
      { id: 'analytics-impl', name: 'Analytics implementation' },
    ],
  },
  {
    id: 'architecture',
    name: 'Architecture & Design',
    skills: [
      { id: 'sys-arch', name: 'System architecture design' },
      { id: 'scalability', name: 'Scalability planning' },
      { id: 'stack-select', name: 'Technology stack selection' },
      { id: 'int-arch', name: 'Integration architecture' },
      { id: 'legacy', name: 'Legacy system modernization' },
      { id: 'tech-debt', name: 'Technical debt assessment' },
      { id: 'perf-opt', name: 'Performance optimization' },
      { id: 'caching', name: 'Caching strategies' },
      { id: 'vendor-eval', name: 'Third-party service evaluation' },
    ],
  },
  {
    id: 'leadership',
    name: 'Leadership & Communication',
    skills: [
      { id: 'roadmap', name: 'Technical roadmap planning' },
      { id: 'adr', name: 'Architecture decision documentation' },
      { id: 'xfn', name: 'Cross-functional collaboration' },
      { id: 'client-comm', name: 'Client technical communication' },
      { id: 'exec-present', name: 'Executive presentation skills' },
      { id: 'mentoring', name: 'Technical mentoring' },
      { id: 'code-review', name: 'Code review leadership' },
      { id: 'conflict', name: 'Conflict resolution' },
      { id: 'change-mgmt', name: 'Change management' },
      { id: 'stakeholders', name: 'Stakeholder management' },
    ],
  },
  {
    id: 'bizops',
    name: 'Business Operations',
    skills: [
      { id: 'vendor-neg', name: 'Vendor selection and negotiation' },
      { id: 'budget', name: 'Budget planning and tracking' },
      { id: 'roi', name: 'ROI analysis' },
      { id: 'risk', name: 'Risk assessment and mitigation' },
      { id: 'slo', name: 'SLA/SLO definition' },
      { id: 'capacity', name: 'Capacity planning' },
      { id: 'debt-prio', name: 'Technical debt prioritization' },
      { id: 'build-buy', name: 'Build vs. buy decisions' },
      { id: 'contracts', name: 'Contract negotiation' },
      { id: 'resource-alloc', name: 'Resource allocation' },
    ],
  },
  {
    id: 'pm',
    name: 'Project Management',
    skills: [
      { id: 'agile', name: 'Agile/Scrum methodologies' },
      { id: 'sprint', name: 'Sprint planning' },
      { id: 'backlog', name: 'Backlog management' },
      { id: 'estimate', name: 'Timeline estimation' },
      { id: 'deps', name: 'Dependency mapping' },
      { id: 'risk-mgmt', name: 'Risk management' },
      { id: 'team-coord', name: 'Team coordination' },
      { id: 'status', name: 'Status reporting' },
      { id: 'delivery', name: 'Delivery management' },
    ],
  },
]

export const ALL_SKILLS = SKILL_CATALOG.flatMap(c => c.skills)

export function coverageLevel(countAt22: number): 'none' | 'one' | 'two' {
  if (countAt22 >= 2) return 'two'
  if (countAt22 === 1) return 'one'
  return 'none'
}
