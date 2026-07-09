/* ============================================================
   ALEXANDRA & BENOIT — MARIAGE
   main.js
   ============================================================ */

/* ── Navigation : se cache en descendant, réapparaît en remontant ── */
(function () {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    let lastScrollTop = 0;

    function handleNav() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop <= 10) {
            /* Tout en haut : toujours visible */
            navbar.classList.remove("nav-hidden");
        } else if (scrollTop > lastScrollTop) {
            /* On descend : on cache */
            navbar.classList.add("nav-hidden");
        } else {
            /* On remonte : on montre */
            navbar.classList.remove("nav-hidden");
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    let ticking = false;
    window.addEventListener("scroll", function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                handleNav();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

/* ── Apparition en douceur des blocs au scroll ───────────────
   Amélioration progressive : le contenu est visible par défaut
   (voir style.css). On ne masque les blocs que si tout se passe
   bien ici, pour ne jamais risquer de contenu invisible. ───── */
(function () {
    if (!("IntersectionObserver" in window)) return;

    try {
        const items = document.querySelectorAll(".reveal");
        if (!items.length) return;

        items.forEach(el => el.classList.add("reveal-init"));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add("in-view"), index * 40);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

        items.forEach(el => observer.observe(el));

        /* Filet de sécurité : si un élément n'a jamais été détecté
           (ex: page très courte, cas limite), on le révèle après 3s. */
        setTimeout(() => {
            document.querySelectorAll(".reveal-init:not(.in-view)")
                .forEach(el => el.classList.add("in-view"));
        }, 3000);
    } catch (e) {
        /* En cas de souci, on ne prend aucun risque : rien n'est masqué. */
    }
})();
