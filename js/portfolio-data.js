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
      "I am a Data Science and Software Developer based in Mumbai, pursuing my degree at NMIMS (Narsee Monjee Institute of Management Studies).",
      "My work centers on solving complex real-world challenges through first-principles mathematical rigor—from developing Siamese Vision Transformer encoders (ChangeFormerV6) for automated satellite change detection (Smart India Hackathon 2024, 97.8% validation accuracy) to decentralized privacy-preserving federated edge learning with PyTorch and Flower (flwr).",
      "Beyond deep learning models, I build full-stack web and desktop applications using React, TypeScript, Node.js, and high-performance WebGL/Canvas graphics, ensuring complex quantitative workflows feel instantaneous, deterministic, and ergonomic for end users.",
      "Continuously architecting reproducible open-source software, writing research paper dissections, and building tools that bridge theoretical statistics with production engineering."
    ],
    stats: [
      { label: "Flagship Research Systems", value: "2 Featured" },
      { label: "Core Competencies", value: "AI, ML & Full-Stack" },
      { label: "Academic Standing", value: "NMIMS MPSTME" },
      { label: "Status", value: "Available for Roles" }
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
  },

  personality: {
    philosophy: "Pragmatic Builder & First-Principles Grounder — Mathematical rigor makes software resilient, while high-standard intuitive design makes intelligent models genuinely useful to humans.",
    workingStyle: [
      {
        title: "Deterministic Reproducibility",
        icon: "🎯",
        desc: "From seed-fixed stochastic simulations to pinned virtual environments, every model and application pipeline is engineered to execute identically anywhere."
      },
      {
        title: "Full-Spectrum Architecture",
        icon: "⚡",
        desc: "Bridging the gap between heavy computational models (PyTorch, Transformers, Federated Nodes) and responsive, high-framerate client applications."
      },
      {
        title: "Iterative Feedback Loops",
        icon: "🔄",
        desc: "Fast build cycles backed by hypothesis testing, statistical power benchmarks, and continuous peer code reviews."
      }
    ],
    traits: [
      {
        title: "Intellectual Curiosity",
        icon: "🔬",
        desc: "Not content treating models as black boxes; I reverse-engineer papers from scratch to internalize their mathematical core."
      },
      {
        title: "Craftsmanship & Aesthetics",
        icon: "✨",
        desc: "Clean modular code, crisp typography, and 60fps WebGL/Canvas graphics receive equal attention to algorithmic precision."
      },
      {
        title: "Relentless Discipline",
        icon: "⚔️",
        desc: "Consistency over intensity. Daily deep work rituals and continuous technical writing to solidify complex learnings."
      },
      {
        title: "Collaborative Velocity",
        icon: "🤝",
        desc: "Active hackathon builder (SIH), pair programmer, and open-source contributor who elevates team velocity and clarity."
      }
    ]
  },

  hobbies: [
    {
      title: "Competitive Chess & Game Theory",
      icon: "♟️",
      category: "Strategy & Heuristics",
      desc: "1500+ Elo on chess platforms. Analyzing dynamic position trees, minimax branching, and evaluating positional tension under clock pressure directly sharpens my algorithmic problem-solving."
    },
    {
      title: "Electronic Sound Design & Modular Synths",
      icon: "🎧",
      category: "Acoustics & Signal Processing",
      desc: "Fascinated by Fourier transforms, envelope oscillators, and acoustic feedback. Personally engineered the procedural Web Audio synthesizer powering this portfolio's cybernetic sonics."
    },
    {
      title: "Deep Tech Paper Dissections",
      icon: "📚",
      category: "Research & Reading",
      desc: "Reading arXiv preprints across transformer backbones, decentralized federated learning, and branching processes. Writing annotated summaries and building minimal reproduction repos."
    },
    {
      title: "Calisthenics & Progressive Strength",
      icon: "🏋️‍♂️",
      category: "Physical Discipline",
      desc: "Daily discipline and bodyweight control. Progressive overload serves as my physical metaphor for iterative model training — gradual, compounding improvements lead to breakthrough performance."
    },
    {
      title: "Specialty Coffee & Morning Deep Work",
      icon: "☕",
      category: "Focus Rituals",
      desc: "Aeropress dialing-in, zero-distraction 5:30 AM coding blocks, and ambient synthwave playlists to enter uninterrupted flow state."
    },
    {
      title: "Astrophysics & Orbital Mechanics",
      icon: "🌌",
      category: "Cosmic Systems",
      desc: "Captivated by N-body gravity simulations, orbital trajectories, and cosmic coordinate systems — the primary inspiration behind this portfolio's 3D universe."
    }
  ],

  linkedInPosts: [
    {
      id: "post-1",
      date: "October 2024",
      topic: "Decentralized AI & Privacy",
      title: "Demystifying Federated Learning: Training Neural Networks Without Exposing Private Data",
      excerpt: "Why transfer raw patient records or private mobile data to a centralized cloud when you can train locally on edge devices and aggregate only weight differentials? In this deep dive, I break down FedAvg with PyTorch and Flower (flwr), handling non-IID client label skews, and how our network converged in 25 rounds with zero raw data leakage.",
      tags: ["#FederatedLearning", "#MachineLearning", "#PrivacyAI", "#PyTorch", "#DataScience"],
      stats: { likes: "420+", comments: "38", reposts: "18", views: "14.2k" },
      url: "https://www.linkedin.com/in/aarav-shah-681641275/?isSelfProfile=true"
    },
    {
      id: "post-2",
      date: "September 2024",
      topic: "Generative AI Systems",
      title: "From Karpathy's 3-Layer Philosophy to Production Prompt Engineering: Spec, Verifier, Environment",
      excerpt: "Prompt engineering shouldn't be vague natural language gambling. By structuring prompts into a formal Specification, an automated Verification step, and a strict Execution Environment, we elevated first-shot LLM code generation accuracy from 62% to 94% across multi-turn workflows.",
      tags: ["#GenerativeAI", "#PromptEngineering", "#LLMs", "#AIArchitecture", "#SoftwareEngineering"],
      stats: { likes: "385+", comments: "42", reposts: "15", views: "12.8k" },
      url: "https://www.linkedin.com/in/aarav-shah-681641275/?isSelfProfile=true"
    },
    {
      id: "post-3",
      date: "August 2024",
      topic: "Computer Vision & SIH",
      title: "Smart India Hackathon: Deploying ChangeFormer for Satellite Earth Observation & Change Detection",
      excerpt: "Detecting environmental change across bitemporal satellite tiles is fraught with seasonal foliage shifts, illumination changes, and atmospheric distortion. Sharing our architectural insights using Siamese Vision Transformer encoders (ChangeFormerV6) achieving 97.8% validation accuracy for optical and SAR Earth imagery.",
      tags: ["#SIH2024", "#ComputerVision", "#Transformers", "#RemoteSensing", "#DeepLearning"],
      stats: { likes: "610+", comments: "54", reposts: "32", views: "21.5k" },
      url: "https://www.linkedin.com/in/aarav-shah-681641275/?isSelfProfile=true"
    },
    {
      id: "post-4",
      date: "July 2024",
      topic: "Mathematical Rigor",
      title: "Why Pure Machine Learning Fails Without Sound Inferential Statistics",
      excerpt: "A high test R² or 95% accuracy score means very little if your evaluation dataset suffers from selection bias or violated independence assumptions. Why every data science practitioner needs rigorous two-sample hypothesis testing, Cohen's d effect size benchmarking, and power analysis before deploying models to production.",
      tags: ["#Statistics", "#DataScience", "#HypothesisTesting", "#Python", "#Research"],
      stats: { likes: "290+", comments: "27", reposts: "11", views: "9.6k" },
      url: "https://www.linkedin.com/in/aarav-shah-681641275/?isSelfProfile=true"
    }
  ]
};

// Expose projects alias for CLI terminal & quick filters
PortfolioData.projects = PortfolioData.junctions.filter(j => j.type === "project");

if (typeof window !== "undefined") {
  window.PortfolioData = PortfolioData;
}
