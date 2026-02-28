/* ==========================================================
   reza PORTFOLIO 2026 — main.js
   - Scroll progress
   - Navbar shrink + active section highlight
   - Smooth anchor (fallback)
   - Ripple effect
   - IntersectionObserver reveal
   - Counters
   - Skills progress animation
   - Project filter with animated transitions
   - Project modal dynamic data + carousel
   - Testimonials slider (auto 5s, pause hover)
   - Parallax blobs + hero mouse parallax
   - Audio toggle + localStorage + fallback "Audio not found"
   ========================================================== */

   (function () {
    "use strict";
  
    // --------------------------
    // Helpers
    // --------------------------
    const $ = window.jQuery;
  
    function qs(sel, root = document) { return root.querySelector(sel); }
    function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
  
    function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  
    function prefersReducedMotion() {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  
    // Toast UI
    function showToast({ title = "Info", message = "", icon = "fa-circle-info", timeout = 3200 } = {}) {
      const stack = qs("#toastStack");
      if (!stack) return;
  
      const toast = document.createElement("div");
      toast.className = "toast-ui";
      toast.setAttribute("role", "status");
  
      toast.innerHTML = `
        <div class="toast-ui__icon" aria-hidden="true"><i class="fa-solid ${icon}"></i></div>
        <div>
          <p class="toast-ui__title">${escapeHtml(title)}</p>
          <p class="toast-ui__msg">${escapeHtml(message)}</p>
        </div>
        <button class="toast-ui__close" type="button" aria-label="Close toast">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      `;
  
      const closeBtn = qs(".toast-ui__close", toast);
      closeBtn.addEventListener("click", () => toast.remove());
  
      stack.appendChild(toast);
  
      if (timeout > 0) {
        window.setTimeout(() => {
          if (toast.isConnected) toast.remove();
        }, timeout);
      }
    }
  
    function escapeHtml(str) {
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  
    // --------------------------
    // Year
    // --------------------------
    const yearNow = qs("#yearNow");
    if (yearNow) yearNow.textContent = String(new Date().getFullYear());
  
    // --------------------------
    // Scroll progress bar + backtop + navbar shrink
    // --------------------------
    const scrollBar = qs("#scrollBar");
    const backTop = qs("#backTop");
    const navbar = qs("#navbar");
  
    function onScrollUI() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const p = docH > 0 ? (scrollTop / docH) * 100 : 0;
  
      if (scrollBar) scrollBar.style.width = `${p}%`;
  
      if (navbar) {
        navbar.classList.toggle("is-shrink", scrollTop > 12);
      }
  
      if (backTop) {
        backTop.classList.toggle("is-show", scrollTop > 650);
      }
    }
  
    window.addEventListener("scroll", onScrollUI, { passive: true });
    window.addEventListener("resize", onScrollUI);
    onScrollUI();
  
    if (backTop) {
      backTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      });
    }
  
    // --------------------------
    // Smooth scrolling for anchors (works even without CSS smooth)
    // --------------------------
    qsa('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href.length < 2) return;
        const target = qs(href);
        if (!target) return;
  
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  
        // Close bootstrap nav collapse on mobile
        const navMenu = qs("#navMenu");
        if (navMenu && navMenu.classList.contains("show")) {
          const bsCollapse = window.bootstrap?.Collapse?.getOrCreateInstance(navMenu);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  
    // --------------------------
    // Active nav highlight by section
    // --------------------------
    const navLinks = qsa(".nav-links .nav-link");
    const sections = navLinks
      .map((l) => l.getAttribute("href"))
      .filter((h) => h && h.startsWith("#"))
      .map((h) => qs(h))
      .filter(Boolean);
  
    const activeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
        });
      },
      { root: null, threshold: 0.35 }
    );
  
    sections.forEach((sec) => activeObs.observe(sec));
  
    // --------------------------
    // Ripple micro-interaction for .btn-ripple
    // --------------------------
    function attachRipples() {
      qsa(".btn-ripple").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const rect = btn.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
  
          const span = document.createElement("span");
          span.className = "ripple";
          span.style.width = span.style.height = size + "px";
          span.style.left = x + "px";
          span.style.top = y + "px";
  
          btn.appendChild(span);
          window.setTimeout(() => span.remove(), 650);
        });
      });
    }
    attachRipples();
  
    // --------------------------
    // Scroll reveal all .reveal
    // --------------------------
    const revealEls = qsa(".reveal");
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  
    // --------------------------
    // Counters (hero stats)
    // --------------------------
    const counters = qsa(".counter");
    let countersStarted = false;
  
    function animateCounter(el, target, dur = 900) {
      const start = 0;
      const startTime = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  
      function tick(now) {
        const p = clamp((now - startTime) / dur, 0, 1);
        const val = Math.round(start + (target - start) * easeOut(p));
        el.textContent = String(val);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || countersStarted) return;
          countersStarted = true;
          counters.forEach((c) => animateCounter(c, Number(c.dataset.target || "0")));
        });
      },
      { threshold: 0.35 }
    );
  
    const heroSection = qs("#homeSection");
    if (heroSection) counterObs.observe(heroSection);
  
    // --------------------------
    // Skills progress bars
    // --------------------------
    const progressBars = qsa(".progress-bar");
    let skillsStarted = false;
  
    const skillsObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || skillsStarted) return;
          skillsStarted = true;
          progressBars.forEach((bar) => {
            const val = Number(bar.dataset.progress || "0");
            bar.style.width = clamp(val, 0, 100) + "%";
          });
        });
      },
      { threshold: 0.25 }
    );
  
    const skillsSection = qs("#skills");
    if (skillsSection) skillsObs.observe(skillsSection);
  
    // --------------------------
    // Projects filter (fade/scale)
    // --------------------------
    const filterButtons = qsa(".filters .chip");
    const projectItems = qsa(".project-item");
    const grid = qs("#projectGrid");
  
    function setPressed(btn) {
      filterButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
  
    function filterProjects(cat) {
      if (!grid) return;
  
      // animate container slight
      grid.style.opacity = "0.55";
      grid.style.transform = "scale(0.995)";
      window.setTimeout(() => {
        projectItems.forEach((item) => {
          const cats = (item.getAttribute("data-cat") || "").split(/\s+/).filter(Boolean);
          const show = cat === "all" ? true : cats.includes(cat);
          item.classList.toggle("is-hidden", !show);
        });
  
        grid.style.opacity = "1";
        grid.style.transform = "scale(1)";
      }, 120);
    }
  
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.filter || "all";
        setPressed(btn);
        filterProjects(cat);
      });
    });
  
    // --------------------------
    // Modal project data + carousel
    // --------------------------
    const projectData = {
      p1: {
        title: "Blue Landing System",
        sub: "Web • Landing • Premium",
        desc: "Landing page premium dengan layout playful tapi rapi: badges, cards, spacing lega, dan micro-interactions. Cocok untuk produk/kelas/agency.",
        stack: ["HTML", "CSS", "JavaScript", "Bootstrap 5"],
        demo: "https://example.com/demo",
        git: "https://github.com/example/repo",
        images: [
          "https://placehold.co/1200x800/png?text=Blue+Landing+01",
          "https://placehold.co/1200x800/png?text=Blue+Landing+02",
          "https://placehold.co/1200x800/png?text=Blue+Landing+03",
        ],
      },
      p2: {
        title: "Admin Cards Dashboard",
        sub: "Web • Dashboard • Components",
        desc: "Dashboard UI berbasis card untuk monitoring data. Fokus pada clarity, hierarchy, dan responsif di mobile.",
        stack: ["Bootstrap Grid", "A11y", "UI Kit"],
        demo: "https://example.com/demo",
        git: "https://github.com/example/repo",
        images: [
          "https://placehold.co/1200x800/png?text=Dashboard+01",
          "https://placehold.co/1200x800/png?text=Dashboard+02",
        ],
      },
      p3: {
        title: "Booking Form Flow",
        sub: "Web • Form UX • Toast",
        desc: "Form flow untuk booking/registrasi dengan validasi ringan dan feedback toast yang elegan.",
        stack: ["Forms", "Validation", "Toast UI"],
        demo: "https://example.com/demo",
        git: "https://github.com/example/repo",
        images: [
          "https://placehold.co/1200x800/png?text=Booking+01",
          "https://placehold.co/1200x800/png?text=Booking+02",
        ],
      },
      p4: {
        title: "Blue Badge Kit",
        sub: "UI • Design System • Tokens",
        desc: "Satu set badge/chip, spacing, dan style card yang konsisten untuk mempercepat produksi UI.",
        stack: ["Figma", "Design Tokens", "Typography"],
        demo: "https://example.com/demo",
        git: "https://github.com/example/repo",
        images: [
          "https://placehold.co/1200x800/png?text=Badge+Kit+01",
          "https://placehold.co/1200x800/png?text=Badge+Kit+02",
        ],
      },
      p5: {
        title: "Mobile Cards Layout",
        sub: "UI • Mobile-first • Premium",
        desc: "Layout mobile 360px yang tetap terasa premium: whitespace, radius besar, border lembut.",
        stack: ["Mobile UX", "Grid", "Components"],
        demo: "https://example.com/demo",
        git: "https://github.com/example/repo",
        images: [
          "https://placehold.co/1200x800/png?text=Mobile+Layout+01",
          "https://placehold.co/1200x800/png?text=Mobile+Layout+02",
        ],
      },
      p6: {
        title: "Modal Detail Pattern",
        sub: "UI • Modal • Carousel",
        desc: "Pattern modal detail yang bersih dan fokus konten: carousel + tech stack + links.",
        stack: ["Bootstrap Modal", "Carousel", "Focus Management"],
        demo: "https://example.com/demo",
        git: "https://github.com/example/repo",
        images: [
          "https://placehold.co/1200x800/png?text=Modal+01",
          "https://placehold.co/1200x800/png?text=Modal+02",
        ],
      },
      p7: {
        title: "Character Sketch Set",
        sub: "Illustration • Character • Minimal",
        desc: "Ilustrasi karakter minimal dengan aksen biru transparan. Fokus pada ekspresi dan gesture.",
        stack: ["Sketch", "Color", "Composition"],
        demo: "https://example.com/demo",
        git: "https://github.com/example/repo",
        images: [
          "https://placehold.co/1200x800/png?text=Character+01",
          "https://placehold.co/1200x800/png?text=Character+02",
        ],
      },
      p8: {
        title: "Poster Wave Series",
        sub: "Illustration • Poster • SVG vibe",
        desc: "Seri poster bertema wave/laut minimalis dengan bentuk organik dan whitespace lega.",
        stack: ["Poster", "SVG", "Layout"],
        demo: "https://example.com/demo",
        git: "https://github.com/example/repo",
        images: [
          "https://placehold.co/1200x800/png?text=Poster+Wave+01",
          "https://placehold.co/1200x800/png?text=Poster+Wave+02",
          "https://placehold.co/1200x800/png?text=Poster+Wave+03",
        ],
      },
      p9: {
        title: "Brand Mascot Mini",
        sub: "Illustration • Branding • Mascot",
        desc: "Mascot mini untuk brand: friendly, memorable, dan mudah dipakai di berbagai media.",
        stack: ["Branding", "Mascot", "Visual Kit"],
        demo: "https://example.com/demo",
        git: "https://github.com/example/repo",
        images: [
          "https://placehold.co/1200x800/png?text=Mascot+01",
          "https://placehold.co/1200x800/png?text=Mascot+02",
        ],
      },
    };
  
    const modalEl = qs("#projectModal");
    const modalTitle = qs("#projectModalTitle");
    const modalSub = qs("#projectModalSub");
    const modalDesc = qs("#projectModalDesc");
    const modalStack = qs("#projectModalStack");
    const modalDemo = qs("#projectModalDemo");
    const modalGit = qs("#projectModalGit");
    const carouselInner = qs("#carouselInner");
  
    function buildCarousel(images) {
      if (!carouselInner) return;
      carouselInner.innerHTML = "";
  
      images.forEach((src, idx) => {
        const item = document.createElement("div");
        item.className = "carousel-item" + (idx === 0 ? " active" : "");
        item.innerHTML = `
          <img src="${src}" alt="Preview image ${idx + 1}" loading="lazy" />
        `;
        carouselInner.appendChild(item);
      });
  
      // Reset to first slide
      const carouselEl = qs("#projectCarousel");
      if (carouselEl && window.bootstrap?.Carousel) {
        const instance = window.bootstrap.Carousel.getOrCreateInstance(carouselEl, { interval: false });
        instance.to(0);
      }
    }
  
    function fillModal(data) {
      if (!data) return;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalSub) modalSub.textContent = data.sub;
      if (modalDesc) modalDesc.textContent = data.desc;
  
      if (modalStack) {
        modalStack.innerHTML = "";
        data.stack.forEach((s) => {
          const pill = document.createElement("span");
          pill.className = "pill";
          pill.textContent = s;
          modalStack.appendChild(pill);
        });
      }
  
      if (modalDemo) modalDemo.href = data.demo || "#";
      if (modalGit) modalGit.href = data.git || "#";
      buildCarousel(data.images || []);
    }
  
    qsa(".btn-view").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.project;
        fillModal(projectData[key]);
      });
    });
  
    // --------------------------
    // Testimonials slider
    // --------------------------
    const testimonials = [
      {
        quote:
          "Layoutnya bersih, spacing lega, dan animasinya halus. Hasil akhirnya terasa premium.",
        name: "Dimas Pratama",
        role: "Founder • Local Business",
      },
      {
        quote:
          "Komunikasi enak, revisi cepat, dan UI-nya konsisten. Cocok untuk landing conversion.",
        name: "Salsa Ayuningtyas",
        role: "Marketing • Course Creator",
      },
      {
        quote:
          "Responsifnya rapi banget dari 360px sampai desktop. Detail micro-interactionsnya bikin hidup.",
        name: "Adit Surya Mahendra",
        role: "Product Lead • SaaS",
      },
    ];
  
    const testiSlider = qs("#testiSlider");
    const testiDots = qs("#testiDots");
    const testiWrap = qs("#testiWrap");
    const testiPrev = qs("#testiPrev");
    const testiNext = qs("#testiNext");
  
    let testiIndex = 0;
    let testiTimer = null;
    let testiPaused = false;
  
    function renderTestimonial(i) {
      if (!testiSlider || !testiDots) return;
      testiSlider.innerHTML = "";
      testiDots.innerHTML = "";
  
      const t = testimonials[i];
      const item = document.createElement("div");
      item.className = "testi-item is-active";
      item.innerHTML = `
        <p class="testi-quote">“${escapeHtml(t.quote)}”</p>
        <div class="testi-meta">
          <div>
            <div class="testi-name">${escapeHtml(t.name)}</div>
            <div class="testi-role">${escapeHtml(t.role)}</div>
          </div>
          <span class="badge-chip badge-chip--primary"><i class="fa-solid fa-star" aria-hidden="true"></i> 5.0</span>
        </div>
      `;
      testiSlider.appendChild(item);
  
      testimonials.forEach((_, idx) => {
        const d = document.createElement("button");
        d.type = "button";
        d.className = "dot" + (idx === i ? " is-active" : "");
        d.setAttribute("aria-label", `Go to testimonial ${idx + 1}`);
        d.addEventListener("click", () => {
          testiIndex = idx;
          renderTestimonial(testiIndex);
          restartTestiTimer();
        });
        testiDots.appendChild(d);
      });
    }
  
    function nextTesti() {
      testiIndex = (testiIndex + 1) % testimonials.length;
      renderTestimonial(testiIndex);
    }
    function prevTesti() {
      testiIndex = (testiIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(testiIndex);
    }
  
    function startTestiTimer() {
      if (testiTimer) window.clearInterval(testiTimer);
      testiTimer = window.setInterval(() => {
        if (!testiPaused) nextTesti();
      }, 5000);
    }
    function restartTestiTimer() {
      startTestiTimer();
    }
  
    if (testiSlider) {
      renderTestimonial(testiIndex);
      startTestiTimer();
    }
    if (testiPrev) testiPrev.addEventListener("click", () => { prevTesti(); restartTestiTimer(); });
    if (testiNext) testiNext.addEventListener("click", () => { nextTesti(); restartTestiTimer(); });
  
    if (testiWrap) {
      testiWrap.addEventListener("mouseenter", () => { testiPaused = true; });
      testiWrap.addEventListener("mouseleave", () => { testiPaused = false; });
    }
  
    // --------------------------
    // Contact form validation + toast
    // --------------------------
    const contactForm = qs("#contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const name = qs("#name");
        const email = qs("#email");
        const msg = qs("#message");
  
        const nameOk = name && name.value.trim().length >= 2;
        const emailOk = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        const msgOk = msg && msg.value.trim().length >= 10;
  
        if (name) name.classList.toggle("is-invalid", !nameOk);
        if (email) email.classList.toggle("is-invalid", !emailOk);
        if (msg) msg.classList.toggle("is-invalid", !msgOk);
  
        if (!nameOk || !emailOk || !msgOk) {
          showToast({
            title: "Check again",
            message: "Pastikan semua field terisi dengan benar.",
            icon: "fa-triangle-exclamation",
          });
          return;
        }
  
        showToast({
          title: "Message prepared",
          message: "Pesanmu sudah siap. (Dummy) Tinggal integrasi backend jika mau.",
          icon: "fa-paper-plane",
        });
  
        contactForm.reset();
        [name, email, msg].forEach((el) => el && el.classList.remove("is-invalid"));
      });
    }
  
    // Copy email
    const copyEmail = qs("#copyEmail");
    if (copyEmail) {
      copyEmail.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText("rifki.dermawan@email.com");
          showToast({ title: "Copied", message: "Email disalin ke clipboard.", icon: "fa-copy" });
        } catch {
          showToast({ title: "Copy failed", message: "Browser tidak mengizinkan clipboard.", icon: "fa-circle-xmark" });
        }
      });
    }
  
    // --------------------------
    // Parallax: blobs move slightly on scroll
    // --------------------------
    const blobA = qs("#blobA");
    const blobB = qs("#blobB");
    const blobC = qs("#blobC");
  
    function parallaxBlobs() {
      if (prefersReducedMotion()) return;
      const y = window.scrollY || 0;
      const a = y * 0.05;
      const b = y * -0.035;
      const c = y * 0.03;
  
      if (blobA) blobA.style.transform = `translate3d(${a * 0.3}px, ${a}px, 0)`;
      if (blobB) blobB.style.transform = `translate3d(${b * 0.25}px, ${b}px, 0)`;
      if (blobC) blobC.style.transform = `translate3d(${c * 0.35}px, ${c}px, 0)`;
    }
    window.addEventListener("scroll", parallaxBlobs, { passive: true });
    parallaxBlobs();
  
    // --------------------------
    // Hero mouse parallax (desktop)
    // --------------------------
    const heroParallax = qs("#heroParallax");
    function bindMouseParallax() {
      if (!heroParallax || prefersReducedMotion()) return;
  
      const isFinePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
      if (!isFinePointer) return;
  
      heroParallax.addEventListener("mousemove", (e) => {
        const rect = heroParallax.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
  
        const rx = clamp(y * -6, -8, 8);
        const ry = clamp(x * 10, -10, 10);
  
        heroParallax.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
  
      heroParallax.addEventListener("mouseleave", () => {
        heroParallax.style.transform = "";
      });
    }
    bindMouseParallax();
  
    // --------------------------
    // Accent toggle (not full dark)
    // --------------------------
    const accentToggle = qs("#accentToggle");
    const ACCENT_KEY = "rd_accent_tone";
  
    function applyAccent(val) {
      if (val === "deep") document.documentElement.setAttribute("data-accent", "deep");
      else document.documentElement.removeAttribute("data-accent");
    }
  
    const savedAccent = localStorage.getItem(ACCENT_KEY);
    applyAccent(savedAccent);
  
    if (accentToggle) {
      accentToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-accent");
        const next = current === "deep" ? "" : "deep";
        applyAccent(next || null);
        localStorage.setItem(ACCENT_KEY, next || "");
        showToast({
          title: "Accent updated",
          message: next === "deep" ? "Aksen biru dibuat lebih deep." : "Aksen kembali normal.",
          icon: "fa-droplet",
          timeout: 2200,
        });
      });
    }
  
    // --------------------------
    // Audio: white noise toggle + volume + localStorage + fallback
    // --------------------------
    const audio = qs("#whiteNoise");
    const audioToggle = qs("#audioToggle");
    const audioIcon = qs("#audioIcon");
    const audioMore = qs("#audioMore");
    const audioPop = qs("#audioPop");
    const volumeRange = qs("#volumeRange");
  
    const AUDIO_KEY = "rd_audio_state"; // { playing:boolean, volume:number }
  
    function getAudioState() {
      try {
        const raw = localStorage.getItem(AUDIO_KEY);
        if (!raw) return { playing: false, volume: 0.15 };
        const obj = JSON.parse(raw);
        return {
          playing: !!obj.playing,
          volume: typeof obj.volume === "number" ? clamp(obj.volume, 0, 1) : 0.15,
        };
      } catch {
        return { playing: false, volume: 0.15 };
      }
    }
  
    function saveAudioState(state) {
      try {
        localStorage.setItem(AUDIO_KEY, JSON.stringify(state));
      } catch {}
    }
  
    function setAudioUI(isPlaying) {
      if (!audioToggle || !audioIcon) return;
      audioToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      audioToggle.setAttribute("aria-label", isPlaying ? "Mute white noise" : "Play white noise");
      audioIcon.className = "fa-solid " + (isPlaying ? "fa-volume-high" : "fa-volume-off");
    }
  
    async function tryPlayAudio() {
      if (!audio) return false;
      try {
        await audio.play();
        return true;
      } catch (err) {
        // Could be not found, or browser block, etc.
        return false;
      }
    }
  
    // Load saved state (DO NOT autoplay)
    const audioState = getAudioState();
    if (audio && typeof audioState.volume === "number") {
      audio.volume = audioState.volume;
    }
    if (volumeRange) {
      volumeRange.value = String(Math.round((audioState.volume || 0.15) * 100));
    }
    setAudioUI(false);
  
    if (volumeRange) {
      volumeRange.addEventListener("input", () => {
        const v = clamp(Number(volumeRange.value || "15") / 100, 0, 1);
        if (audio) audio.volume = v;
        const st = getAudioState();
        st.volume = v;
        saveAudioState(st);
      });
    }
  
    if (audioToggle) {
      audioToggle.addEventListener("click", async () => {
        if (!audio) return;
  
        const st = getAudioState();
        const willPlay = !st.playing;
  
        // set volume (ensure not zero)
        if (audio.volume <= 0) audio.volume = st.volume || 0.15;
  
        if (willPlay) {
          const ok = await tryPlayAudio();
          if (!ok) {
            // fallback toast — could be file missing OR play blocked
            showToast({
              title: "Audio not found",
              message: "File assets/audio/white-noise.mp3 tidak tersedia atau browser memblokir playback.",
              icon: "fa-volume-xmark",
            });
            st.playing = false;
            saveAudioState(st);
            setAudioUI(false);
            return;
          }
  
          audio.muted = false;
          st.playing = true;
          saveAudioState(st);
          setAudioUI(true);
          showToast({ title: "Playing", message: "White noise aktif.", icon: "fa-volume-high", timeout: 1800 });
        } else {
          audio.pause();
          st.playing = false;
          saveAudioState(st);
          setAudioUI(false);
          showToast({ title: "Muted", message: "White noise dimatikan.", icon: "fa-volume-off", timeout: 1600 });
        }
      });
    }
  
    // Audio popover
    function closeAudioPop() {
      if (!audioPop || !audioMore) return;
      audioPop.classList.remove("is-open");
      audioMore.setAttribute("aria-expanded", "false");
    }
    function toggleAudioPop() {
      if (!audioPop || !audioMore) return;
      const open = audioPop.classList.toggle("is-open");
      audioMore.setAttribute("aria-expanded", open ? "true" : "false");
    }
  
    if (audioMore) {
      audioMore.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleAudioPop();
      });
    }
    document.addEventListener("click", (e) => {
      if (!audioPop) return;
      if (audioPop.classList.contains("is-open")) closeAudioPop();
    });
    if (audioPop) {
      audioPop.addEventListener("click", (e) => e.stopPropagation());
    }
  
    // If user previously set playing=true, we still must not autoplay.
    // We show a hint toast once per load.
    if (audioState.playing) {
      showToast({
        title: "Tip",
        message: "Klik tombol White Noise untuk melanjutkan playback (browser butuh interaksi).",
        icon: "fa-circle-info",
        timeout: 3500,
      });
    }
  
    // --------------------------
    // Also guard for missing audio file (fetch HEAD-ish check)
    // Lightweight: try load metadata and catch error.
    // --------------------------
    if (audio) {
      audio.addEventListener("error", () => {
        // only show if user tries to play later; still safe to mention once
        // (we keep it quiet here)
      });
    }
  
  })();