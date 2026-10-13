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
      "With hands-on experience across Generative AI prompt architecture, Federated Learning, Computer Vision (satellite change detection), Cloud platforms (AWS), and full-stack web & desktop applications, I engineer reproducible, production-grade systems.",
      "Continuously creating open-source software spanning AI prompt generators, academic intelligence suites, desktop productivity tools, and statistical valuation engines."
    ],
    stats: [
      { label: "Active Project Nodes", value: "13 Deployed" },
      { label: "Core Competencies", value: "AI, ML & Full-Stack" },
      { label: "Academic Standing", value: "NMIMS MPSTME" },
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
      metrics: { records: "1,200+ Players", accuracy: "R² = 0.84", license: "MIT" },
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
      overview: "Helps job seekers track applications, analyze resume-to-description fit with LLMs, and manage interview progression through an intuitive web interface.",
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
      overview: "Demonstrates complete ML pipeline from exploratory feature distributions to interactive browser predictions and decision boundary plots.",
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
      id: "repo-aws",
      type: "project",
      code: "R7",
      label: "REPO // AWS ACADEMIC PORTAL",
      title: "AWS Student Portal & Academic Intelligence",
      badge: "AWS & REACT 19",
      worldX: -360,
      worldY: -940,
      radius: 260,
      spokeCount: 16,
      ringCount: 11,
      repoName: "A101shah/AWS_Student_Portal",
      category: "Cloud & Academic Systems",
      summary: "Comprehensive academic performance tracking suite and student portal deployed on AWS infrastructure with dynamic ICA grading, PDF syllabus parsing, and grade target forecasts.",
      overview: "Engineered with React 19, TypeScript, Vite, and Recharts, tailored for university academic guidelines. Ingests syllabus PDFs with PDF.js, models target grade requirements (>85 A+, >80 A, >75 B+, etc.), and provides interactive course telemetry.",
      techStack: ["AWS Cloud", "React 19", "TypeScript", "Vite", "Recharts", "PDF.js"],
      metrics: { platform: "AWS Cloud", grading: "Dynamic ICA", parser: "PDF.js Engine", ui: "Recharts & Vite" },
      links: {
        github: "https://github.com/A101shah",
        demo: "https://github.com/A101shah"
      }
    },
    {
      id: "repo-promptgen",
      type: "project",
      code: "R8",
      label: "REPO // PROMPT ARCHITECT",
      title: "Karpathy 3-Layer Prompt Architect & AI Generator",
      badge: "GENAI & BENCHMARKING",
      worldX: 1160,
      worldY: -320,
      radius: 265,
      spokeCount: 17,
      ringCount: 12,
      repoName: "A101shah/Prompt_Generator",
      category: "Generative AI & LLM Systems",
      summary: "Systematic prompt engineering platform built upon Andrej Karpathy's 3-Layer Method (Spec, Verifier, Environment), with automated prompt.md synthesis and multi-LLM benchmark evaluation.",
      overview: "Features dual workflows: an intuitive manual builder and an AI Auto-Builder with live streaming. Includes Python CORS proxy routing to LLMs (Pollinations / Bedrock / Gemini API), automated prompt.md refactoring, and quantitative benchmark scoring.",
      techStack: ["Python", "JavaScript", "Prompt Engineering", "LLM APIs", "CORS Server", "CSS Glassmorphism"],
      metrics: { method: "Karpathy 3-Layer", latency: "< 650ms", output: "Auto prompt.md", bench: "Multi-Model Matrix" },
      links: {
        github: "https://github.com/A101shah",
        demo: "https://github.com/A101shah"
      }
    },
    {
      id: "repo-mnist",
      type: "project",
      code: "R9",
      label: "REPO // MNIST NEURAL CIPHER",
      title: "MNIST Federated Learning & Neural Cyphering Engine",
      badge: "PYTORCH & FLOWER",
      worldX: -1180,
      worldY: -560,
      radius: 260,
      spokeCount: 16,
      ringCount: 11,
      repoName: "A101shah/MNIST_Neural_Cypher",
      category: "Deep Learning & Federated Privacy",
      summary: "Decentralized privacy-preserving neural network training platform leveraging Flower (flwr), PyTorch, non-IID client data distribution, and encrypted gradient aggregation.",
      overview: "Trains multi-client deep learning models (ResNet-20 and MLP) on imbalanced, non-IID MNIST handwritten digit partitions without exposing raw client data. Features custom FedAvg strategy collecting per-round accuracy trajectories across 25 federated communication rounds.",
      techStack: ["PyTorch", "Flower (flwr)", "Python", "NumPy", "Matplotlib", "Torchvision"],
      metrics: { rounds: "25 FedAvg", partition: "Non-IID Labels", privacy: "Client Encrypted", models: "ResNet & MLP" },
      links: {
        github: "https://github.com/A101shah",
        demo: "https://github.com/A101shah"
      }
    },
    {
      id: "repo-blitzit",
      type: "project",
      code: "R10",
      label: "REPO // BLITZIT PRODUCTIVITY",
      title: "Blitzit Desktop Deep Work & Task Focus Suite",
      badge: "NEXT.JS 16 & ELECTRON",
      worldX: 1120,
      worldY: 620,
      radius: 265,
      spokeCount: 16,
      ringCount: 11,
      repoName: "A101shah/Blitzit_App",
      category: "Desktop & Productivity",
      summary: "High-performance desktop productivity suite modeled after Blitzit, featuring native macOS titlebars, persistent floating pill timers, deep focus mode, and SQLite task persistence via Prisma.",
      overview: "Engineered with Next.js 16, React 19, TypeScript, Electron, and Prisma ORM. Offers seamless distraction-free task management with customizable Pomodoro intervals, floating pill timer widget, daily planner queues, and granular productivity metrics.",
      techStack: ["Next.js 16", "Electron", "React 19", "TypeScript", "Prisma ORM", "SQLite", "Lucide Icons"],
      metrics: { environment: "Desktop App", orm: "Prisma SQLite", timer: "Floating Pill", mode: "Deep Focus" },
      links: {
        github: "https://github.com/A101shah",
        demo: "https://github.com/A101shah"
      }
    },
    {
      id: "repo-changeformer",
      type: "project",
      code: "R11",
      label: "REPO // CHANGEFORMER EO",
      title: "ChangeFormer Satellite Earth Observation AI",
      badge: "SIH & PYTORCH",
      worldX: 20,
      worldY: 960,
      radius: 260,
      spokeCount: 16,
      ringCount: 11,
      repoName: "A101shah/sih_trial1",
      category: "Computer Vision & Remote Sensing",
      summary: "High-resolution bitemporal satellite change detection platform developed for Smart India Hackathon (SIH), deploying ChangeFormerV6 for optical and SAR Earth imagery.",
      overview: "Combines hierarchical vision transformers with Siamese feature extraction and difference modules to detect environmental, agricultural, and urban shifts. Benchmarked on DSIFN and multi-spectral GeoTIFF satellite imagery, achieving over 97% change detection accuracy.",
      techStack: ["PyTorch", "Vision Transformers", "GeoTIFF", "OpenCV", "DSIFN Dataset", "Docker"],
      metrics: { accuracy: "97.8% Peak", architecture: "ChangeFormerV6", imagery: "Optical & SAR", benchmark: "DSIFN" },
      links: {
        github: "https://github.com/A101shah/sih_trial1",
        demo: "https://github.com/A101shah/sih_trial1"
      }
    },
    {
      id: "repo-startupval",
      type: "project",
      code: "R12",
      label: "REPO // STOCHASTIC VALUATION",
      title: "Stochastic Startup Valuation & Branching Engine",
      badge: "STOCHASTIC MODELING",
      worldX: -1160,
      worldY: 920,
      radius: 250,
      spokeCount: 16,
      ringCount: 11,
      repoName: "A101shah/Startup_Valuation",
      category: "Financial Engineering & Stats",
      summary: "Galton-Watson branching process simulation platform computing startup valuation probability distributions under variance and customer churn uncertainty.",
      overview: "Applies stochastic Poisson and negative binomial branching samplers, discounted cash flow multipliers, and Monte Carlo trajectories deployed through an interactive Streamlit and Plotly dashboard.",
      techStack: ["Python", "NumPy", "SciPy", "Streamlit", "Plotly", "Pandas"],
      metrics: { paths: "10,000 Paths", math: "Galton-Watson", horizon: "5-Year Horizon", interface: "Streamlit" },
      links: {
        github: "https://github.com/A101shah/Startup_Valuation",
        demo: "https://github.com/A101shah/Startup_Valuation"
      }
    },
    {
      id: "repo-linkedin",
      type: "project",
      code: "R13",
      label: "REPO // LINKEDIN INTELLIGENCE",
      title: "LinkedIn Intelligence & Talent Pipeline Scraper",
      badge: "DATA PIPELINE",
      worldX: -540,
      worldY: 1120,
      radius: 245,
      spokeCount: 15,
      ringCount: 10,
      repoName: "A101shah/linkedin_test1",
      category: "Automation & Data Pipelines",
      summary: "Automated recruitment data extraction pipeline and profile parser collecting structured hiring metrics, skill endorsements, and experience timelines.",
      overview: "Features headless browser automation with stealth user-agent rotation, intelligent DOM traversal, rate-limiting safeguards, and structured JSON/CSV dataset export for data science modeling.",
      techStack: ["Python", "Selenium", "BeautifulSoup4", "Pandas", "Chrome Driver"],
      metrics: { pipeline: "Automated", stealth: "Rotated Headers", format: "JSON & CSV", status: "Active" },
      links: {
        github: "https://github.com/A101shah/linkedin_test1",
        demo: "https://github.com/A101shah/linkedin_test1"
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
      { name: "Python", category: "Languages & Core", level: 96, icon: "🐍", exp: "Core Language" },
      { name: "PyTorch & Deep Learning", category: "Data Science & AI", level: 92, icon: "🔥", exp: "Vision & Transformers" },
      { name: "Machine Learning & Scikit-Learn", category: "Data Science & AI", level: 94, icon: "🧠", exp: "Modeling & Predictive" },
      { name: "Federated Learning (Flower)", category: "Data Science & AI", level: 88, icon: "🌸", exp: "Privacy & FedAvg" },
      { name: "Prompt Engineering & GenAI", category: "Data Science & AI", level: 93, icon: "✨", exp: "3-Layer Spec & LLMs" },
      { name: "Statistical Hypothesis Testing (T-Tests)", category: "Data Science & AI", level: 92, icon: "📊", exp: "Inferential Stats" },
      { name: "Pandas & NumPy", category: "Data Science & AI", level: 96, icon: "🐼", exp: "Data Wrangling" },
      { name: "React 19 & Next.js 16", category: "Web & Frameworks", level: 90, icon: "⚛️", exp: "Modern Frontends" },
      { name: "TypeScript / JavaScript (ES6+)", category: "Languages & Core", level: 91, icon: "⚡", exp: "Interactive Web" },
      { name: "Electron Desktop Apps", category: "Web & Frameworks", level: 86, icon: "💻", exp: "Cross-Platform" },
      { name: "AWS Cloud Infrastructure", category: "Tools & Platforms", level: 88, icon: "☁️", exp: "Deployments & Services" },
      { name: "Prisma ORM & SQLite / SQL", category: "Languages & Core", level: 88, icon: "🗄️", exp: "Databases & Schemas" },
      { name: "Image & Signal Processing (OpenCV)", category: "Data Science & AI", level: 89, icon: "🔬", exp: "CV2 & Filters" },
      { name: "HTML5 & CSS3 / SCSS", category: "Web & Frameworks", level: 94, icon: "🎨", exp: "Cyberpunk & Glass UI" },
      { name: "Jupyter Notebooks", category: "Tools & Platforms", level: 96, icon: "🪐", exp: "Research & Analysis" },
      { name: "Git & GitHub", category: "Tools & Platforms", level: 93, icon: "🐙", exp: "Version Control" }
    ]
  }
};

// Expose projects alias for CLI terminal & quick filters
PortfolioData.projects = PortfolioData.junctions.filter(j => j.type === "project");

if (typeof window !== "undefined") {
  window.PortfolioData = PortfolioData;
}
