(function () {
    const buttons = document.querySelectorAll(".tab-btn");
    const panes = {
      portfolio: document.getElementById("tab-portfolio"),
      experience: document.getElementById("tab-experience"),
      skill: document.getElementById("tab-skill"),
    };
  
    function setActive(tab) {
      // button active
      buttons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  
      // pane switch with tiny reflow to trigger transition cleanly
      Object.keys(panes).forEach((k) => {
        const el = panes[k];
        if (!el) return;
  
        if (k === tab) {
          el.classList.add("active");
          // restart animation feel (subtle)
          el.style.opacity = "0";
          el.style.transform = "translateY(8px)";
          requestAnimationFrame(() => {
            el.style.opacity = "";
            el.style.transform = "";
          });
        } else {
          el.classList.remove("active");
        }
      });
    }
  
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => setActive(btn.dataset.tab));
    });
  
    // Footer year
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  })();