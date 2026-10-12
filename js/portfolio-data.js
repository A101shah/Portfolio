/**
 * Portfolio Data Configuration for Aarav Shah
 * Centralized data store: 1 dedicated junction per repo/project, plus core sections.
 */
const PortfolioData = {
  personal: {
    name: "Aarav Shah",
    handle: "A101shah",
    title: "Data Science & Full-Stack Developer",
    subtitle: "Transforming raw data, predictive algorithms, and machine learning models into intuitive digital systems.",
    education: "NMIMS (Narsee Monjee Institute of Management Studies)",
    location: "Mumbai, India",
    status: "OPEN TO COLLABORATION & ROLES",
    avatar: "assets/images/avatar.jpg",
    bio: [
      "I am a Data Science and Software Developer at NMIMS passionate about designing intelligent computational systems, statistical deployments, and modern web architectures.",
      "With hands-on experience in Python, Machine Learning (Scikit-Learn, predictive regression), Inferential Statistics (hypothesis testing, 2-sample t-tests), and full-stack web technologies, I build reproducible, data-driven solutions.",
      "Continuously creating open-source tools across AI job tracking, auction valuation engines, image processing pipelines, and web analytics."
    ],
    stats: [
      { label: "GitHub Repositories", value: "15+" },
      { label: "Core Focus", value: "Data Science & AI" },
      { label: "Academic Standing", value: "NMIMS" },
      { label: "Status", value: "Available" }
    ],
    social: {
      github: "https://github.com/A101shah",
      linkedin: "https://www.linkedin.com/in/aarav-shah-681641275/?isSelfProfile=true",
      email: "shahaarav602@gmail.com"
    }
  },

  // 1 Major Web Junction per Project/Repo + Core Sections
  junctions: [
    {
      id: "nexus",
      type: "core",
      code: "00",
      label: "00 // NEXUS",
      title: "Aarav Shah Core Hub",
      badge: "IDENTITY CORE",
      worldX: 0,
      worldY: 0,
      radius: 360,
      spokeCount: 22,
      ringCount: 16
    },
    {
      id: "repo-ipl",
      type: "project",
      code: "R1",
      label: "REPO // IPL AUCTION",
      title: "IPL Auction Predictive Analytics",
      badge: "PYTHON & ML",
      worldX: -560,
      worldY: -420,
      radius: 260,
      spokeCount: 16,
      ringCount: 11,
      repoName: "A101shah/ipl_auction",
      category: "Data Science & AI",
      summary: "Comprehensive statistical valuation model and machine learning pipeline analyzing IPL player metrics, auction bidding trends, and squad optimization.",
      overview: "Built using Python, Pandas, and predictive regression models to analyze historical player performance against auction clearing prices, uncovering undervalued talent and bidding war trends.",
      techStack: ["Python", "Pandas", "NumPy", "Matplotlib", "Scikit-Learn"],
      metrics: { records: "1,200+ Players", accuracy: "High Correlation", license: "MIT" },
      links: {
        github: "https://github.com/A101shah/ipl_auction",
        demo: "https://github.com/A101shah/ipl_auction"
      }
    },
    {
      id: "repo-ttest",
      type: "project",
      code: "R2",
      label: "REPO // T-TEST DEPLOYMENT",
      title: "2-Sample T-Test Inferential Suite",
      badge: "STATISTICAL DEPLOYMENT",
      worldX: 620,
      worldY: -450,
      radius: 250,
      spokeCount: 16,
      ringCount: 11,
      repoName: "A101shah/2_sample_ttest_deployment",
      category: "Inferential Statistics",
      summary: "End-to-end automated hypothesis testing deployment for two-sample t-tests, variance diagnostics, normality checks, and confidence intervals.",
      overview: "Designed for researchers and data analysts to evaluate statistical significance between two distributions, automating p-value calculations and null-hypothesis decisions.",
      techStack: ["Python", "SciPy", "Statsmodels", "HTML5", "CSS3"],
      metrics: { latency: "< 35ms", type: "Two-Sample", threshold: "α = 0.05" },
      links: {
        github: "https://github.com/A101shah/2_sample_ttest_deployment",
        demo: "https://github.com/A101shah/2_sample_ttest_deployment"
      }
    },
    {
      id: "repo-jobtrack",
      type: "project",
      code: "R3",
      label: "REPO // JOB TRACK AI",
      title: "Job Track AI Platform",
      badge: "AI APPLICATION",
      worldX: 980,
      worldY: 160,
      radius: 270,
      spokeCount: 17,
      ringCount: 12,
      repoName: "A101shah/Job_Track_AI",
      category: "Full-Stack AI",
      summary: "Intelligent career opportunity tracker and application analytics tool utilizing AI parsing for job listings and status pipeline workflows.",
      overview: "Helps job seekers track applications, analyze resume-to-description fit, and manage interview progression through an intuitive web interface.",
      techStack: ["TypeScript", "React", "Node.js", "AI APIs", "TailwindCSS"],
      metrics: { tracking: "Real-time", stack: "Full-Stack", status: "Active" },
      links: {
        github: "https://github.com/A101shah/Job_Track_AI",
        demo: "https://github.com/A101shah/Job_Track_AI"
      }
    },
    {
      id: "repo-isp",
      type: "project",
      code: "R4",
      label: "REPO // ISP SUITE",
      title: "Image & Signal Processing Suite",
      badge: "NMIMS ACADEMIC",
      worldX: 560,
      worldY: 720,
      radius: 250,
      spokeCount: 16,
      ringCount: 11,
      repoName: "A101shah/Isp-Practicals-",
      category: "Computer Vision & Signals",
      summary: "Extensive laboratory suite of digital signal processing and computer vision transformations developed for the NMIMS curriculum.",
      overview: "Implements spatial domain filtering (Sobel, Prewitt, Gaussian), frequency domain Fourier transforms, edge detection, and histogram equalization.",
      techStack: ["Jupyter Notebook", "Python", "OpenCV", "NumPy", "Matplotlib"],
      metrics: { algorithms: "15+ Filters", institution: "NMIMS", format: "Jupyter" },
      links: {
        github: "https://github.com/A101shah/Isp-Practicals-",
        demo: "https://github.com/A101shah/Isp-Practicals-"
      }
    },
    {
      id: "repo-iris",
      type: "project",
      code: "R5",
      label: "REPO // IRIS CLASSIFIER",
      title: "Iris Taxonomy Classifier & Visualizer",
      badge: "WEB ML MODEL",
      worldX: -520,
      worldY: 620,
      radius: 240,
      spokeCount: 15,
      ringCount: 10,
      repoName: "A101shah/Datasetsirirsdep",
      category: "Machine Learning",
      summary: "Interactive classifier and exploratory data analysis visualizer deployed for multi-feature Iris botanical categorization.",
      overview: "Demonstrates complete ML pipeline from exploratory feature distributions to interactive browser predictions.",
      techStack: ["Python", "Scikit-Learn", "JavaScript", "HTML/CSS"],
      metrics: { classes: "3 Varieties", latency: "Instant", format: "Web ML" },
      links: {
        github: "https://github.com/A101shah/Datasetsirirsdep",
        demo: "https://github.com/A101shah/Datasetsirirsdep"
      }
    },
    {
      id: "repo-dashboard",
      type: "project",
      code: "R6",
      label: "REPO // ANALYTICS DASHBOARD",
      title: "Analytical Data Dashboard",
      badge: "DATA VISUALIZATION",
      worldX: -950,
      worldY: -80,
      radius: 250,
      spokeCount: 16,
      ringCount: 11,
      repoName: "A101shah/Analytical_dashboard",
      category: "Web & Analytics",
      summary: "Interactive data visualization dashboard presenting multi-metric telemetry, charts, and real-time analytical drill-downs.",
      overview: "Engineered to deliver clean data comprehension with fluid responsive charts, KPI counters, and statistical metrics.",
      techStack: ["JavaScript", "HTML5", "CSS3", "Charts API", "Data Viz"],
      metrics: { charts: "Multi-Panel", speed: "60 FPS", format: "Client-side" },
      links: {
        github: "https://github.com/A101shah/Analytical_dashboard",
        demo: "https://github.com/A101shah/Analytical_dashboard"
      }
    },
    {
      id: "skills",
      type: "section",
      code: "S1",
      label: "01 // SKILLS MATRIX",
      title: "Technical Capabilities Matrix",
      badge: "CORE COMPETENCIES",
      worldX: 120,
      worldY: -820,
      radius: 240,
      spokeCount: 15,
      ringCount: 10
    },
    {
      id: "terminal",
      type: "section",
      code: "S2",
      label: "02 // DEV SHELL",
      title: "Developer CLI Terminal",
      badge: "INTERACTIVE CLI",
      worldX: -920,
      worldY: 520,
      radius: 230,
      spokeCount: 15,
      ringCount: 10
    },
    {
      id: "transmit",
      type: "section",
      code: "S3",
      label: "03 // TRANSMIT",
      title: "Direct Connect & Channels",
      badge: "COMMUNICATIONS",
      worldX: 860,
      worldY: -860,
      radius: 230,
      spokeCount: 15,
      ringCount: 10
    }
  ],

  skills: {
    categories: ["All", "Data Science & AI", "Languages & Core", "Web & Frameworks", "Tools & Platforms"],
    items: [
      { name: "Python", category: "Languages & Core", level: 95, icon: "🐍", exp: "Core Language" },
      { name: "Machine Learning & Scikit-Learn", category: "Data Science & AI", level: 90, icon: "🧠", exp: "Modeling & Predictive" },
      { name: "Statistical Hypothesis Testing (T-Tests)", category: "Data Science & AI", level: 92, icon: "📊", exp: "Inferential Stats" },
      { name: "Pandas & NumPy", category: "Data Science & AI", level: 95, icon: "🐼", exp: "Data Wrangling" },
      { name: "Image & Signal Processing (ISP)", category: "Data Science & AI", level: 88, icon: "🔬", exp: "NMIMS Practicals" },
      { name: "JavaScript / ES6+", category: "Web & Frameworks", level: 88, icon: "⚡", exp: "Interactive Web" },
      { name: "HTML5 & CSS3 / SCSS", category: "Web & Frameworks", level: 92, icon: "🎨", exp: "Modern UI/UX" },
      { name: "Jupyter Notebooks", category: "Tools & Platforms", level: 96, icon: "🪐", exp: "Analysis & Research" },
      { name: "Git & GitHub", category: "Tools & Platforms", level: 92, icon: "🐙", exp: "Version Control" },
      { name: "Model Deployment & Web APIs", category: "Data Science & AI", level: 86, icon: "🚀", exp: "Cloud & Local" },
      { name: "SQL & Relational Databases", category: "Languages & Core", level: 85, icon: "🗄️", exp: "Data Queries" }
    ]
  }
};

if (typeof window !== "undefined") {
  window.PortfolioData = PortfolioData;
}
