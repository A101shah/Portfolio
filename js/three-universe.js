/**
 * ThreeUniverse — High-End WebGL Cinematic 3D Engine
 * Aarav Shah Portfolio — Dark Cosmic Obsidian, Delicate Silver Silk, and Ice-Cyan Optics.
 * 
 * Subsystems:
 * 1. Landing: Silver Quantum Astrolabe / Celestial Silk Gyroscope with harmonic mouse tilt.
 * 2. Warp: Relativistic hyperspace tunnel with silver-white light filaments and spacetime fold.
 * 3. Universe: 3D Celestial Dewdrop Optics Layer with real-time mouse-tracking specular glints
 *              and synchronized camera parallax with the 2D Spider Web canvas.
 */

class ThreeUniverse {
  constructor(canvasId = "three-universe-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.id = canvasId;
      document.body.prepend(this.canvas);
    }

    if (typeof THREE === "undefined") {
      console.warn("Three.js not found. 3D universe standby.");
      return;
    }

    this.mode = "landing"; // "landing", "warp", "universe"
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 4000);
    this.camera.position.set(0, 0, 750);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Mouse Tracking (Normalized -1 to +1 and Screen Space)
    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      screenX: this.width / 2,
      screenY: this.height / 2
    };

    // Subsystem Groups
    this.landingGroup = new THREE.Group();
    this.warpGroup = new THREE.Group();
    this.universeGroup = new THREE.Group();

    this.scene.add(this.landingGroup);
    this.scene.add(this.warpGroup);
    this.scene.add(this.universeGroup);

    this.warpGroup.visible = false;
    this.universeGroup.visible = false;

    // Parallax & Camera Sync from 2D Spider Web
    this.webCamera = { x: 0, y: 0, zoom: 1.0, targetX: 0, targetY: 0, targetZoom: 1.0 };

    // Astrolabe Interactive Gyro Drag & Momentum
    this.astrolabeDrag = {
      isDragging: false,
      lastX: 0,
      lastY: 0,
      rotX: 0,
      rotY: 0,
      velX: 0,
      velY: 0
    };

    // 3D Optical Silk Shockwave Ripples
    this.silkShockwaves = [];

    // Initialize Subsystems
    this.initLighting();
    this.initLandingAstrolabe();
    this.initHyperspaceWarp();
    this.initUniverseDewdrops();
    this.setupEvents();

    // Warp animation state
    this.warpProgress = 0;
    this.isWarping = false;
    this.warpStartTime = 0;

    // Animation Clock
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // =========================================================================
  // 1. LIGHTING (Atmospheric Silver / Dark Graphite / Ice Cyan)
  // =========================================================================
  initLighting() {
    this.ambientLight = new THREE.AmbientLight(0x0e1118, 1.5);
    this.scene.add(this.ambientLight);

    // Subtle silver key light
    this.keyLight = new THREE.DirectionalLight(0xe2e8f0, 1.6);
    this.keyLight.position.set(350, 450, 500);
    this.scene.add(this.keyLight);

    // Rim specular light (deep obsidian blue)
    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    this.rimLight.position.set(-400, -300, 300);
    this.scene.add(this.rimLight);

    // Dynamic mouse point light for real-time dewdrop specular glints in universe mode
    this.mousePointLight = new THREE.PointLight(0x00f0ff, 2.5, 450, 2);
    this.mousePointLight.position.set(0, 0, 100);
    this.universeGroup.add(this.mousePointLight);

    // Secondary soft fill light following mouse
    this.mouseSpecularLight = new THREE.PointLight(0xffffff, 1.2, 300, 2);
    this.mouseSpecularLight.position.set(0, 0, 120);
    this.universeGroup.add(this.mouseSpecularLight);
  }

  // =========================================================================
  // 2. LANDING: SILVER QUANTUM ASTROLABE / CELESTIAL SILK GYROSCOPE
  // =========================================================================
  initLandingAstrolabe() {
    this.astrolabeHolder = new THREE.Group();
    this.landingGroup.add(this.astrolabeHolder);

    // 1. Delicate Concentric Silver Wireframe Gimbal Rings
    this.gimbalRings = [];
    const ringRadii = [140, 195, 255];
    const ringTilts = [
      { x: 0.35, y: 0.15, z: 0 },
      { x: -0.25, y: 0.45, z: 0.2 },
      { x: 0.1, y: -0.3, z: -0.15 }
    ];

    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0x27272a,
      emissiveIntensity: 0.3
    });

    ringRadii.forEach((radius, idx) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.set(ringTilts[idx].x, ringTilts[idx].y, ringTilts[idx].z);

      // Fine wireframe torus loop
      const tubeRadius = idx === 0 ? 0.75 : 0.6;
      const torusGeo = new THREE.TorusGeometry(radius, tubeRadius, 8, 128);
      const torusMesh = new THREE.Mesh(torusGeo, silverMetalMat);
      ringGroup.add(torusMesh);

      // Delicate tick marks on outer ring (resembling navigational astrolabe)
      if (idx === 2) {
        const tickCount = 48;
        const tickGeo = new THREE.BufferGeometry();
        const tickPos = [];
        for (let t = 0; t < tickCount; t++) {
          const angle = (t / tickCount) * Math.PI * 2;
          const r1 = radius - 4;
          const r2 = radius + (t % 4 === 0 ? 6 : 3);
          tickPos.push(Math.cos(angle) * r1, Math.sin(angle) * r1, 0);
          tickPos.push(Math.cos(angle) * r2, Math.sin(angle) * r2, 0);
        }
        tickGeo.setAttribute("position", new THREE.Float32BufferAttribute(tickPos, 3));
        const tickMat = new THREE.LineBasicMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.55
        });
        const ticks = new THREE.LineSegments(tickGeo, tickMat);
        ringGroup.add(ticks);
      }

      // Orbiting Liquid Silver / Mercury Dewdrops along the ring
      const dropCount = idx === 0 ? 2 : (idx === 1 ? 3 : 4);
      const droplets = [];
      const dropGeo = new THREE.SphereGeometry(2.4, 16, 16);
      const dropMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.05,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.25
      });

      for (let d = 0; d < dropCount; d++) {
        const dropMesh = new THREE.Mesh(dropGeo, dropMat);
        ringGroup.add(dropMesh);
        droplets.push({
          mesh: dropMesh,
          angle: (d / dropCount) * Math.PI * 2 + Math.random(),
          speed: (0.003 + Math.random() * 0.004) * (idx % 2 === 0 ? 1 : -1)
        });
      }

      this.astrolabeHolder.add(ringGroup);
      this.gimbalRings.push({
        group: ringGroup,
        rotSpeedX: (0.0025 + idx * 0.001) * (idx % 2 === 0 ? 1 : -1),
        rotSpeedY: (0.0035 - idx * 0.0008) * (idx % 2 === 0 ? -1 : 1),
        rotSpeedZ: 0.0015 * (idx === 1 ? 1 : -1),
        droplets: droplets,
        radius: radius
      });
    });

    // 2. Central Astrolabe Core: Nested Silver Geometric Wireframe Cages
    this.coreCageGroup = new THREE.Group();

    // Inner Icosahedron Cage
    const icoGeo = new THREE.IcosahedronGeometry(48, 1);
    const icoEdges = new THREE.EdgesGeometry(icoGeo);
    const silverEdgeMat = new THREE.LineBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.65
    });
    this.coreIcoEdges = new THREE.LineSegments(icoEdges, silverEdgeMat);
    this.coreCageGroup.add(this.coreIcoEdges);

    // Glowing Vertex Pinpoints on Icosahedron
    const icoPtsMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 3.5,
      transparent: true,
      opacity: 0.9
    });
    this.coreIcoPts = new THREE.Points(icoGeo, icoPtsMat);
    this.coreCageGroup.add(this.coreIcoPts);

    // Outer Dodecahedron Cage
    const dodecaGeo = new THREE.DodecahedronGeometry(78, 0);
    const dodecaEdges = new THREE.EdgesGeometry(dodecaGeo);
    const faintDodecaMat = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.35
    });
    this.coreDodecaEdges = new THREE.LineSegments(dodecaEdges, faintDodecaMat);
    this.coreCageGroup.add(this.coreDodecaEdges);

    // Central Singularity Node (Pulsating Ice-Cyan Point)
    const singGeo = new THREE.SphereGeometry(12, 24, 24);
    const singMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    this.coreSingularity = new THREE.Mesh(singGeo, singMat);
    this.coreCageGroup.add(this.coreSingularity);

    this.astrolabeHolder.add(this.coreCageGroup);

    // 3. Ambient Stardust Field (Deep Cosmic Drift)
    const starCount = 850;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const silverColor = new THREE.Color(0xf1f5f9);
    const cyanColor = new THREE.Color(0x38bdf8);
    const slateColor = new THREE.Color(0x64748b);

    for (let i = 0; i < starCount; i++) {
      const idx3 = i * 3;
      // Spherical distribution around center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dist = 220 + Math.random() * 1100;

      starPositions[idx3] = dist * Math.sin(phi) * Math.cos(theta);
      starPositions[idx3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      starPositions[idx3 + 2] = dist * Math.cos(phi);

      const rnd = Math.random();
      const col = rnd < 0.65 ? silverColor : (rnd < 0.88 ? slateColor : cyanColor);
      starColors[idx3] = col.r;
      starColors[idx3 + 1] = col.g;
      starColors[idx3 + 2] = col.b;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.landingStars = new THREE.Points(starGeo, starMat);
    this.landingGroup.add(this.landingStars);
  }

  // =========================================================================
  // 3. WARP: RELATIVISTIC HYPERSPACE WORMHOLE TUNNEL
  // =========================================================================
  initHyperspaceWarp() {
    this.wormholeHolder = new THREE.Group();
    this.warpGroup.add(this.wormholeHolder);

    // 1. Relativistic Light Filaments (Streaking past camera)
    const streakCount = 420;
    const streakGeo = new THREE.BufferGeometry();
    const streakPos = new Float32Array(streakCount * 6); // 2 vertices per line segment
    const streakColors = new Float32Array(streakCount * 6);

    this.streakData = [];
    const silverCol = new THREE.Color(0xffffff);
    const iceCyanCol = new THREE.Color(0x38bdf8);

    for (let i = 0; i < streakCount; i++) {
      const i6 = i * 6;
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 420;
      const z = -600 + Math.random() * 1600;
      const length = 120 + Math.random() * 320;
      const speed = 18 + Math.random() * 22;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      streakPos[i6] = x;
      streakPos[i6 + 1] = y;
      streakPos[i6 + 2] = z;

      streakPos[i6 + 3] = x;
      streakPos[i6 + 4] = y;
      streakPos[i6 + 5] = z - length;

      const col = Math.random() < 0.7 ? silverCol : iceCyanCol;
      streakColors[i6] = col.r; streakColors[i6 + 1] = col.g; streakColors[i6 + 2] = col.b;
      streakColors[i6 + 3] = col.r * 0.3; streakColors[i6 + 4] = col.g * 0.3; streakColors[i6 + 5] = col.b * 0.3;

      this.streakData.push({ angle, radius, z, length, speed, baseRadius: radius });
    }

    streakGeo.setAttribute("position", new THREE.BufferAttribute(streakPos, 3));
    streakGeo.setAttribute("color", new THREE.BufferAttribute(streakColors, 3));

    const streakMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.warpLines = new THREE.LineSegments(streakGeo, streakMat);
    this.wormholeHolder.add(this.warpLines);

    // 2. Concentric Spacetime Grid Rings contracting into the focal point
    this.warpRings = [];
    const warpRingMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4
    });

    for (let r = 0; r < 8; r++) {
      const ringRadius = 60 + r * 50;
      const ringGeo = new THREE.BufferGeometry();
      const pts = [];
      const segs = 64;
      for (let s = 0; s <= segs; s++) {
        const a = (s / segs) * Math.PI * 2;
        pts.push(Math.cos(a) * ringRadius, Math.sin(a) * ringRadius, -150 - r * 140);
      }
      ringGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      const ringMesh = new THREE.Line(ringGeo, warpRingMat);
      this.wormholeHolder.add(ringMesh);
      this.warpRings.push(ringMesh);
    }
  }

  // =========================================================================
  // 4. UNIVERSE: 3D CELESTIAL DEWDROP OPTICS LAYER & PARALLAX MATRIX
  // =========================================================================
  initUniverseDewdrops() {
    this.dewdropGroup = new THREE.Group();
    this.universeGroup.add(this.dewdropGroup);

    // 1. 3D Volumetric Suspended Liquid Dewdrops
    // These respond with real-time specular flares when the mouse gets near!
    const dewdropCount = 750;
    this.dewdropCount = dewdropCount;
    this.dewdropPositions = new Float32Array(dewdropCount * 3);
    this.dewdropBasePositions = new Float32Array(dewdropCount * 3);
    this.dewdropColors = new Float32Array(dewdropCount * 3);
    this.dewdropSizes = new Float32Array(dewdropCount);
    this.dewdropBaseSizes = new Float32Array(dewdropCount);

    const silverColor = new THREE.Color(0xf8fafc);
    const iceCyanColor = new THREE.Color(0x00f0ff);
    const deepSlateColor = new THREE.Color(0x64748b);

    for (let i = 0; i < dewdropCount; i++) {
      const i3 = i * 3;
      // Spread across wide canvas coordinate space
      const x = (Math.random() - 0.5) * 3600;
      const y = (Math.random() - 0.5) * 2800;
      // Z depth gives true stereoscopic parallax
      const z = (Math.random() - 0.5) * 800 - 100;

      this.dewdropPositions[i3] = x;
      this.dewdropPositions[i3 + 1] = y;
      this.dewdropPositions[i3 + 2] = z;

      this.dewdropBasePositions[i3] = x;
      this.dewdropBasePositions[i3 + 1] = y;
      this.dewdropBasePositions[i3 + 2] = z;

      const rnd = Math.random();
      const col = rnd < 0.65 ? silverColor : (rnd < 0.88 ? deepSlateColor : iceCyanColor);
      this.dewdropColors[i3] = col.r;
      this.dewdropColors[i3 + 1] = col.g;
      this.dewdropColors[i3 + 2] = col.b;

      // Base dewdrop sizes (delicate pinpoints)
      const baseSz = 2.2 + Math.random() * 3.5;
      this.dewdropSizes[i] = baseSz;
      this.dewdropBaseSizes[i] = baseSz;
    }

    this.dewdropGeo = new THREE.BufferGeometry();
    this.dewdropGeo.setAttribute("position", new THREE.BufferAttribute(this.dewdropPositions, 3));
    this.dewdropGeo.setAttribute("color", new THREE.BufferAttribute(this.dewdropColors, 3));

    // Crisp circular dewdrop shader-like texture via programmatic canvas
    const dewdropCanvas = document.createElement("canvas");
    dewdropCanvas.width = 64;
    dewdropCanvas.height = 64;
    const dctx = dewdropCanvas.getContext("2d");
    const grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.35, "rgba(220, 240, 255, 0.85)");
    grad.addColorStop(0.65, "rgba(0, 240, 255, 0.35)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    dctx.fillStyle = grad;
    dctx.beginPath();
    dctx.arc(32, 32, 30, 0, Math.PI * 2);
    dctx.fill();

    const dewdropTex = new THREE.CanvasTexture(dewdropCanvas);

    this.dewdropMat = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      map: dewdropTex,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.dewdropPoints = new THREE.Points(this.dewdropGeo, this.dewdropMat);
    this.dewdropGroup.add(this.dewdropPoints);

    // 2. Clean void: removed unnecessary floating strings in 3D universe
    this.silkStrands = [];
  }

  // =========================================================================
  // 5. INTERACTION & CAMERA SYNCHRONIZATION
  // =========================================================================
  setupEvents() {
    window.addEventListener("resize", () => this.onResize());

    window.addEventListener("mousemove", (e) => {
      this.mouse.screenX = e.clientX;
      this.mouse.screenY = e.clientY;

      // Normalized coordinates (-1 to +1)
      this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
      this.mouse.targetY = -(e.clientY / this.height) * 2 + 1;

      // Astrolabe touch/drag interaction on Landing Page
      if (this.landingGroup.visible && this.astrolabeDrag.isDragging) {
        const dx = e.clientX - this.astrolabeDrag.lastX;
        const dy = e.clientY - this.astrolabeDrag.lastY;
        this.astrolabeDrag.velY = dx * 0.006;
        this.astrolabeDrag.velX = dy * 0.006;
        this.astrolabeDrag.rotY += this.astrolabeDrag.velY;
        this.astrolabeDrag.rotX += this.astrolabeDrag.velX;
        this.astrolabeDrag.lastX = e.clientX;
        this.astrolabeDrag.lastY = e.clientY;
      }
    }, { passive: true });

    window.addEventListener("mousedown", (e) => {
      if (this.landingGroup.visible && !e.target.closest("#landing-enter-btn") && !e.target.closest("a")) {
        this.astrolabeDrag.isDragging = true;
        this.astrolabeDrag.lastX = e.clientX;
        this.astrolabeDrag.lastY = e.clientY;
      }
    });

    window.addEventListener("mouseup", () => {
      this.astrolabeDrag.isDragging = false;
    });

    // Touch Support for Astrolabe
    window.addEventListener("touchstart", (e) => {
      if (this.landingGroup.visible && e.touches && e.touches[0]) {
        this.astrolabeDrag.isDragging = true;
        this.astrolabeDrag.lastX = e.touches[0].clientX;
        this.astrolabeDrag.lastY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (this.landingGroup.visible && this.astrolabeDrag.isDragging && e.touches && e.touches[0]) {
        const dx = e.touches[0].clientX - this.astrolabeDrag.lastX;
        const dy = e.touches[0].clientY - this.astrolabeDrag.lastY;
        this.astrolabeDrag.velY = dx * 0.006;
        this.astrolabeDrag.velX = dy * 0.006;
        this.astrolabeDrag.rotY += this.astrolabeDrag.velY;
        this.astrolabeDrag.rotX += this.astrolabeDrag.velX;
        this.astrolabeDrag.lastX = e.touches[0].clientX;
        this.astrolabeDrag.lastY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      this.astrolabeDrag.isDragging = false;
    });
  }

  /**
   * Generates a 3D expanding optical shockwave through the dewdrop field.
   * Triggered when silk threads are plucked or nodes are navigated to.
   */
  pulseSilkAt(wx, wy) {
    if (!this.silkShockwaves) this.silkShockwaves = [];
    this.silkShockwaves.push({
      x: wx,
      y: -wy,
      radius: 0,
      maxRadius: 850,
      speed: 18,
      alpha: 1.0
    });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.dpr);
  }

  /**
   * Called by SpiderWeb to sync 2D pan/zoom with 3D dewdrop parallax.
   */
  updateCameraSync(webCamX, webCamY, webCamZoom) {
    this.webCamera.targetX = webCamX;
    this.webCamera.targetY = webCamY;
    this.webCamera.targetZoom = webCamZoom;
  }

  /**
   * Switches display modes ("landing", "warp", "universe")
   */
  setMode(mode) {
    this.mode = mode;
    if (mode === "landing") {
      this.landingGroup.visible = true;
      this.warpGroup.visible = false;
      this.universeGroup.visible = false;
      this.camera.position.set(0, 0, 750);
      this.camera.lookAt(0, 0, 0);
    } else if (mode === "warp") {
      this.landingGroup.visible = true;
      this.warpGroup.visible = true;
      this.universeGroup.visible = false;
    } else if (mode === "universe") {
      this.landingGroup.visible = false;
      this.warpGroup.visible = false;
      this.universeGroup.visible = true;
      this.camera.position.set(0, 0, 800);
      this.camera.lookAt(0, 0, 0);
    }
  }

  /**
   * Triggers the cinematic hyperspace warp sequence.
   * Called by landing.js when user clicks "INITIALIZE SYSTEM".
   */
  triggerHyperspaceWarp() {
    this.setMode("warp");
    this.isWarping = true;
    this.warpStartTime = performance.now();
    this.warpProgress = 0;
  }

  // =========================================================================
  // 6. MAIN RENDER & ANIMATION LOOP
  // =========================================================================
  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Mouse Interpolation (High-damping inertia)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.065;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.065;

    // -----------------------------------------------------------------------
    // MODE 1: LANDING PAGE ASTROLABE
    // -----------------------------------------------------------------------
    if (this.landingGroup.visible) {
      // 1. Harmonic Rotation of Gimbal Rings
      if (this.gimbalRings) {
        this.gimbalRings.forEach(ring => {
          ring.group.rotation.x += ring.rotSpeedX;
          ring.group.rotation.y += ring.rotSpeedY;
          ring.group.rotation.z += ring.rotSpeedZ;

          // Orbiting mercury dewdrops along circumference
          ring.droplets.forEach(drop => {
            drop.angle += drop.speed;
            drop.mesh.position.x = Math.cos(drop.angle) * ring.radius;
            drop.mesh.position.y = Math.sin(drop.angle) * ring.radius;
          });
        });
      }

      // 2. Central Core Wireframe Pulsing & Gentle Counter-Rotation
      if (this.coreCageGroup) {
        this.coreCageGroup.rotation.x -= 0.003;
        this.coreCageGroup.rotation.y += 0.004;

        if (this.coreSingularity) {
          const pulse = 1.0 + Math.sin(elapsedTime * 2.5) * 0.12;
          this.coreSingularity.scale.set(pulse, pulse, pulse);
        }
      }

      // 3. Ambient Stardust Gentle Drift
      if (this.landingStars) {
        this.landingStars.rotation.y = elapsedTime * 0.015;
        this.landingStars.rotation.x = Math.sin(elapsedTime * 0.01) * 0.08;
      }

      // 4. Smooth Physical Mouse Tilt + Tactile Gyro Momentum on Astrolabe
      if (this.astrolabeHolder) {
        // Apply inertia decay when not actively dragging
        if (!this.astrolabeDrag.isDragging) {
          this.astrolabeDrag.velX *= 0.94;
          this.astrolabeDrag.velY *= 0.94;
          this.astrolabeDrag.rotX += this.astrolabeDrag.velX;
          this.astrolabeDrag.rotY += this.astrolabeDrag.velY;
        }

        const targetTiltX = -this.mouse.y * 0.35 + this.astrolabeDrag.rotX;
        const targetTiltY = this.mouse.x * 0.35 + this.astrolabeDrag.rotY;
        this.astrolabeHolder.rotation.x += (targetTiltX - this.astrolabeHolder.rotation.x) * 0.08;
        this.astrolabeHolder.rotation.y += (targetTiltY - this.astrolabeHolder.rotation.y) * 0.08;
      }
    }

    // -----------------------------------------------------------------------
    // MODE 2: HYPERSPACE WARP
    // -----------------------------------------------------------------------
    if (this.isWarping && this.warpGroup.visible) {
      const now = performance.now();
      const elapsedWarp = (now - this.warpStartTime) / 1000; // in seconds
      this.warpProgress = Math.min(elapsedWarp / 1.8, 1.0); // 1.8s duration

      // Relativistic Line Filament Stream
      if (this.warpLines && this.streakData) {
        const posAttr = this.warpLines.geometry.attributes.position;
        const arr = posAttr.array;
        const accel = 1.0 + this.warpProgress * 4.5; // Exponential speed-up

        for (let i = 0; i < this.streakData.length; i++) {
          const s = this.streakData[i];
          const i6 = i * 6;

          s.z += s.speed * accel;
          if (s.z > 900) {
            s.z = -1200;
          }

          arr[i6 + 2] = s.z;
          arr[i6 + 5] = s.z - (s.length * (1 + this.warpProgress * 1.5));
        }
        posAttr.needsUpdate = true;
      }

      // Spacetime Grid Rings Compression
      if (this.warpRings) {
        this.warpRings.forEach((ring, idx) => {
          ring.position.z += (15 + idx * 8) * (1 + this.warpProgress * 3);
          if (ring.position.z > 800) ring.position.z = -1200;
          ring.rotation.z += 0.02;
        });
      }

      // Camera Drive forward into Singularity
      this.camera.position.z = 750 - (this.warpProgress * 950);

      // Dissolve Landing Astrolabe during warp
      if (this.landingGroup) {
        const landingAlpha = Math.max(0, 1 - this.warpProgress * 1.6);
        this.landingGroup.scale.set(landingAlpha, landingAlpha, landingAlpha);
      }

      // End of Warp sequence -> Seamless switch to Universe
      if (this.warpProgress >= 1.0) {
        this.isWarping = false;
        this.setMode("universe");
      }
    }

    // -----------------------------------------------------------------------
    // MODE 3: SPIDER WEB UNIVERSE (3D Dewdrop Optics & Parallax)
    // -----------------------------------------------------------------------
    if (this.universeGroup.visible) {
      // 1. Smooth Camera Synchronization with 2D Spider Web Pan / Zoom
      this.webCamera.x += (this.webCamera.targetX - this.webCamera.x) * 0.08;
      this.webCamera.y += (this.webCamera.targetY - this.webCamera.y) * 0.08;
      this.webCamera.zoom += (this.webCamera.targetZoom - this.webCamera.zoom) * 0.08;

      // Parallax offset on dewdrop group based on 2D camera coordinates
      if (this.dewdropGroup) {
        // Subtle depth shift (divided by zoom so parallax scales organically)
        const parallaxX = -this.webCamera.x * 0.28;
        const parallaxY = this.webCamera.y * 0.28; // inverted for 3D Y-axis
        this.dewdropGroup.position.x = parallaxX;
        this.dewdropGroup.position.y = parallaxY;
        this.dewdropGroup.scale.set(this.webCamera.zoom, this.webCamera.zoom, this.webCamera.zoom);
      }

      // 2. Mouse Dynamic Point Light Tracking in 3D Space
      // Convert screen mouse to 3D world space at Z=100
      const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
      vector.unproject(this.camera);
      const dir = vector.sub(this.camera.position).normalize();
      const distance = (100 - this.camera.position.z) / dir.z;
      const mouse3DPos = this.camera.position.clone().add(dir.multiplyScalar(distance));

      this.mousePointLight.position.x = mouse3DPos.x;
      this.mousePointLight.position.y = mouse3DPos.y;
      this.mouseSpecularLight.position.x = mouse3DPos.x;
      this.mouseSpecularLight.position.y = mouse3DPos.y;

      // 3. Ambient Undulating 3D Background Silk Filaments
      if (this.silkStrands) {
        this.silkStrands.forEach(strand => {
          const posArr = strand.geo.attributes.position.array;
          const numPts = strand.pts.length;

          for (let p = 0; p < numPts; p++) {
            const t = p / (numPts - 1);
            // Standing wave equation: sine envelope * time phase
            const waveEnvelope = Math.sin(t * Math.PI); // 0 at ends, 1 at center
            const wave = Math.sin(elapsedTime * strand.speed + t * strand.freq * Math.PI * 2 + strand.phase) * 18 * waveEnvelope;

            const i3 = p * 3;
            posArr[i3] = strand.startX + (strand.endX - strand.startX) * t + (wave * 0.4);
            posArr[i3 + 1] = strand.startY + (strand.endY - strand.startY) * t + wave;
          }
          strand.geo.attributes.position.needsUpdate = true;
        });
      }

      // 4. Interactive Dewdrop Specular Flare Calculation
      // Dewdrops closest to the mouse cursor flare up subtly
      if (this.dewdropPoints && this.dewdropBasePositions && this.dewdropColors) {
        const colors = this.dewdropColors;
        const colorAttr = this.dewdropGeo.attributes.color;

        // Check a sample of dewdrops for specular flaring (efficient)
        const mouseXWorld = mouse3DPos.x - (this.dewdropGroup.position.x || 0);
        const mouseYWorld = mouse3DPos.y - (this.dewdropGroup.position.y || 0);

        for (let i = 0; i < this.dewdropCount; i += 2) {
          const i3 = i * 3;
          const dx = this.dewdropBasePositions[i3] - mouseXWorld;
          const dy = this.dewdropBasePositions[i3 + 1] - mouseYWorld;
          const distSq = dx * dx + dy * dy;

          if (distSq < 75000) { // Within ~270px radius
            const flare = Math.max(0, 1 - Math.sqrt(distSq) / 270);
            colors[i3] = Math.min(1.0, colors[i3] + flare * 0.4);
            colors[i3 + 1] = Math.min(1.0, colors[i3 + 1] + flare * 0.7);
            colors[i3 + 2] = 1.0;
          }
        }
        // 5. 3D Silk Optical Shockwaves Propagation
        if (this.silkShockwaves && this.silkShockwaves.length) {
          for (let s = this.silkShockwaves.length - 1; s >= 0; s--) {
            const sw = this.silkShockwaves[s];
            sw.radius += sw.speed;
            sw.alpha *= 0.955;

            if (sw.alpha <= 0.04 || sw.radius >= sw.maxRadius) {
              this.silkShockwaves.splice(s, 1);
              continue;
            }

            // Dewdrops near the shockwave perimeter flare brilliantly
            const swX = sw.x - (this.dewdropGroup.position.x || 0);
            const swY = sw.y - (this.dewdropGroup.position.y || 0);

            for (let i = 0; i < this.dewdropCount; i += 2) {
              const i3 = i * 3;
              const dx = this.dewdropBasePositions[i3] - swX;
              const dy = this.dewdropBasePositions[i3 + 1] - swY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const deltaR = Math.abs(dist - sw.radius);

              if (deltaR < 55) {
                const flare = (1 - deltaR / 55) * sw.alpha;
                colors[i3] = Math.min(1.0, colors[i3] + flare * 0.7);
                colors[i3 + 1] = Math.min(1.0, colors[i3 + 1] + flare * 0.9);
                colors[i3 + 2] = 1.0;
              }
            }
          }
        }

        colorAttr.needsUpdate = true;
      }
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Global expose
if (typeof window !== "undefined") {
  window.ThreeUniverse = ThreeUniverse;
}
