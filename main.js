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

/* ── Compte à rebours avant le mariage ───────────────────────
   Mariage le 18 septembre 2027. Si l'heure de la cérémonie
   change, ajustez-la ci-dessous (format "AAAA-MM-JJTHH:MM:SS").
   ──────────────────────────────────────────────────────────── */
(function () {
    const WEDDING_DATE = new Date("2027-09-18T15:00:00");

    const elMonths = document.getElementById("cd-months");
    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMinutes = document.getElementById("cd-minutes");
    const countdownEl = document.getElementById("countdown");

    if (!elMonths || !elDays || !elHours || !elMinutes) return;

    function pad(n) {
        return String(n).padStart(2, "0");
    }

    /* Calcule la différence en mois entiers, puis jours, heures,
       minutes restants — un mois n'ayant pas une durée fixe, on
       avance mois par mois depuis aujourd'hui jusqu'à la date cible. */
    function computeDiff(target) {
        const now = new Date();
        if (target <= now) return null;

        let months = 0;
        let cursor = new Date(now);

        while (true) {
            const next = new Date(cursor);
            next.setMonth(next.getMonth() + 1);
            if (next <= target) {
                months++;
                cursor = next;
            } else {
                break;
            }
        }

        let remainingMs = target - cursor;
        const days = Math.floor(remainingMs / 86400000);
        remainingMs -= days * 86400000;
        const hours = Math.floor(remainingMs / 3600000);
        remainingMs -= hours * 3600000;
        const minutes = Math.floor(remainingMs / 60000);

        return { months, days, hours, minutes };
    }

    function update() {
        const diff = computeDiff(WEDDING_DATE);

        if (!diff) {
            if (countdownEl) {
                countdownEl.innerHTML = '<p class="countdown-ended">C\'est aujourd\'hui — le grand jour est arrivé !</p>';
            }
            return;
        }

        elMonths.textContent = pad(diff.months);
        elDays.textContent = pad(diff.days);
        elHours.textContent = pad(diff.hours);
        elMinutes.textContent = pad(diff.minutes);
    }

    update();
    setInterval(update, 30000);
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
