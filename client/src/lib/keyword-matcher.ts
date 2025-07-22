import { JobRole, MissingKeyword } from '../types/resume';

export const JOB_ROLES: JobRole[] = [
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    keywords: [
      'React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Vue.js', 'Angular',
      'Responsive Design', 'Git', 'Webpack', 'npm', 'Redux', 'Tailwind CSS',
      'Bootstrap', 'SCSS', 'jQuery', 'API Integration', 'ES6+', 'Testing',
      'Jest', 'Cypress', 'Performance Optimization', 'Cross-browser Compatibility',
      'Accessibility', 'UI/UX', 'Figma', 'Adobe XD'
    ],
    priorityKeywords: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Git']
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    keywords: [
      'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL',
      'Express.js', 'Django', 'Spring Boot', 'REST API', 'GraphQL', 'Docker',
      'AWS', 'Microservices', 'Redis', 'Git', 'Testing', 'Authentication',
      'Authorization', 'Database Design', 'Server Administration', 'Linux',
      'Kubernetes', 'CI/CD', 'Jenkins', 'Performance Optimization'
    ],
    priorityKeywords: ['Node.js', 'Python', 'SQL', 'REST API', 'Git', 'Docker']
  },
  {
    id: 'fullstack-developer',
    name: 'Full Stack Developer',
    keywords: [
      'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'MongoDB',
      'PostgreSQL', 'Express.js', 'HTML', 'CSS', 'REST API', 'GraphQL', 'Git',
      'Docker', 'AWS', 'Redux', 'Testing', 'Agile', 'Scrum', 'CI/CD',
      'Responsive Design', 'Database Design', 'Authentication', 'Performance Optimization'
    ],
    priorityKeywords: ['React', 'Node.js', 'JavaScript', 'SQL', 'Git', 'REST API']
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    keywords: [
      'Python', 'R', 'Machine Learning', 'Deep Learning', 'SQL', 'Pandas',
      'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Jupyter', 'Statistics',
      'Data Visualization', 'Matplotlib', 'Seaborn', 'Plotly', 'Big Data',
      'Hadoop', 'Spark', 'AWS', 'Google Cloud', 'A/B Testing', 'Git',
      'Feature Engineering', 'Model Deployment', 'Data Mining', 'NLP'
    ],
    priorityKeywords: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Statistics', 'Git']
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    keywords: [
      'Product Strategy', 'Roadmap Planning', 'User Research', 'Agile', 'Scrum',
      'Jira', 'A/B Testing', 'Data Analysis', 'Market Research', 'Wireframing',
      'Prototyping', 'Stakeholder Management', 'Requirements Gathering',
      'User Stories', 'KPIs', 'Analytics', 'Google Analytics', 'SQL',
      'Product Launch', 'Go-to-Market', 'Competitive Analysis', 'User Experience'
    ],
    priorityKeywords: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Roadmap Planning', 'Scrum']
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    keywords: [
      'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision',
      'Prototyping', 'Wireframing', 'User Research', 'Usability Testing',
      'Design Systems', 'Typography', 'Color Theory', 'Responsive Design',
      'Mobile Design', 'Web Design', 'Information Architecture', 'User Journey',
      'Personas', 'A/B Testing', 'Accessibility', 'Design Thinking', 'Branding'
    ],
    priorityKeywords: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems', 'Wireframing']
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    keywords: [
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Jenkins', 'GitLab CI',
      'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Shell Scripting',
      'Python', 'Monitoring', 'Logging', 'Prometheus', 'Grafana', 'ELK Stack',
      'CI/CD', 'Infrastructure as Code', 'Microservices', 'Load Balancing',
      'Security', 'Networking', 'Git', 'Version Control'
    ],
    priorityKeywords: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Git']
  },
  {
    id: 'mobile-developer',
    name: 'Mobile Developer',
    keywords: [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java', 'iOS', 'Android',
      'Xcode', 'Android Studio', 'API Integration', 'Mobile UI/UX', 'Git',
      'App Store', 'Google Play', 'Push Notifications', 'Firebase', 'SQLite',
      'Core Data', 'Navigation', 'Performance Optimization', 'Testing',
      'Unit Testing', 'UI Testing', 'Responsive Design'
    ],
    priorityKeywords: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android']
  }
];

export class KeywordMatcher {
  private jobRoles: Map<string, JobRole>;

  constructor() {
    this.jobRoles = new Map(JOB_ROLES.map(role => [role.id, role]));
  }

  getJobRole(roleId: string): JobRole | undefined {
    return this.jobRoles.get(roleId);
  }

  getAllJobRoles(): JobRole[] {
    return JOB_ROLES;
  }

  matchKeywords(resumeText: string, roleId: string): { found: string[], missing: MissingKeyword[] } {
    const role = this.getJobRole(roleId);
    if (!role) {
      return { found: [], missing: [] };
    }

    const normalizedText = resumeText.toLowerCase();
    const found: string[] = [];
    const missing: MissingKeyword[] = [];

    role.keywords.forEach(keyword => {
      const normalizedKeyword = keyword.toLowerCase();
      if (normalizedText.includes(normalizedKeyword)) {
        found.push(keyword);
      } else {
        const priority = this.determinePriority(keyword, role);
        missing.push({ keyword, priority });
      }
    });

    // Sort missing keywords by priority
    missing.sort((a, b) => {
      const priorityOrder = { 'High Priority': 0, 'Medium Priority': 1, 'Low Priority': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return { found, missing };
  }

  private determinePriority(keyword: string, role: JobRole): 'High Priority' | 'Medium Priority' | 'Low Priority' {
    if (role.priorityKeywords.includes(keyword)) {
      return 'High Priority';
    }
    
    // Common important keywords get medium priority
    const mediumPriorityKeywords = ['Git', 'Testing', 'Agile', 'API', 'Database'];
    if (mediumPriorityKeywords.some(important => keyword.includes(important))) {
      return 'Medium Priority';
    }
    
    return 'Low Priority';
  }
}
