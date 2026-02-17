(function () {
    const buttons = document.querySelectorAll(".tab-btn");
    const panes = {
      portfolio: document.getElementById("tab-portfolio"),
      experience: document.getElementById("tab-experience"),
      skill: document.getElementById("tab-skill"),
    };
  
    function setActive(tab) {
      buttons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  
      Object.keys(panes).forEach((k) => {
        if (!panes[k]) return;
        panes[k].classList.toggle("active", k === tab);
      });
    }
  
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => setActive(btn.dataset.tab));
    });
  
    // Footer year
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  })();