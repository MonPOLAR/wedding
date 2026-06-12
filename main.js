/* ============================================================
   ALEXANDRA & BENOIT — MARIAGE
   main.js
   ============================================================ */

/* ── Navigation : toujours visible, même en descendant ─────── */
(function () {
    const navbar = document.getElementById("navbar");
    let lastScrollTop = 0;
    let ticking = false;

    function handleNav() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop <= 10) {
            /* Tout en haut : toujours visible */
            navbar.classList.remove("nav-hidden");
        } else {
            /* Partout ailleurs : toujours visible aussi */
            navbar.classList.remove("nav-hidden");
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            requestAnimationFrame(handleNav);
            ticking = true;
        }
    }, { passive: true });
})();

/* ── Frise horizontale : drag-to-scroll ─────────────────────── */
(function () {
    const frise = document.querySelector(".esprit-frise");
    if (!frise) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    frise.addEventListener("mousedown", function (e) {
        isDown = true;
        startX = e.pageX - frise.offsetLeft;
        scrollLeft = frise.scrollLeft;
    });

    frise.addEventListener("mouseleave", function () { isDown = false; });
    frise.addEventListener("mouseup",    function () { isDown = false; });

    frise.addEventListener("mousemove", function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x    = e.pageX - frise.offsetLeft;
        const walk = (x - startX) * 1.5;
        frise.scrollLeft = scrollLeft - walk;
    });
})();
