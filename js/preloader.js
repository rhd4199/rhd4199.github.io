/* =========================================
   PRELOADER CINEMATIC FULL BLACK
   ========================================= */

   window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    const body = document.body;

    // Optional delay cinematic
    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.8s ease';
            setTimeout(() => {
                preloader.style.display = 'none';
                // Show body content smoothly
                body.classList.add('page-transition', 'show');
            }, 800);
        } else {
            body.classList.add('page-transition', 'show');
        }
    }, 1000); // 1 detik preloader minimum
});
