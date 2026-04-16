/* ============================================================
   TIGERCLUB — PREMIUM MEMBER PORTAL
   Features: Theme Toggle, Parallax, 3D Card, Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initParallax();
    initMemberCardTilt();
    initCheckin();
    initOrderTabs();
    initHeroSlideshow();
    animateCounters();
    triggerPageAnimations('dashboard');
});

/* ========== HERO SLIDESHOW (cross-fade every 5s) ========== */
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-bg-img');
    if (slides.length < 2) return;
    let idx = 0;
    setInterval(() => {
        slides[idx].classList.remove('active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('active');
    }, 5000);
}

/* ========== NAVIGATION ========== */
function initNavigation() {
    const allNav = document.querySelectorAll('[data-page]');
    allNav.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) navigateTo(page);
        });
    });

    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
        document.addEventListener('click', e => {
            if (sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                e.target !== menuBtn &&
                !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

function navigateTo(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${pageName}`);
    if (target) target.classList.add('active');

    // Update sidebar nav
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(i =>
        i.classList.toggle('active', i.dataset.page === pageName)
    );

    // Update bottom nav
    document.querySelectorAll('.bnav-item, .bnav-fab').forEach(b =>
        b.classList.toggle('active', b.dataset.page === pageName)
    );

    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');

    // Scroll to top
    document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-trigger animations
    triggerPageAnimations(pageName);
}
window.navigateTo = navigateTo;

/* ========== THEME TOGGLE ========== */
function initThemeToggle() {
    const toggle = document.getElementById('styleToggle');
    const label = document.getElementById('toggleLabel');
    const panel = document.getElementById('togglePanel');
    const btnDark = document.getElementById('btnDark');
    const btnLight = document.getElementById('btnLight');

    if (!toggle) return;

    label.addEventListener('click', e => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    document.addEventListener('click', e => {
        if (!toggle.contains(e.target)) panel.classList.remove('open');
    });

    [btnDark, btnLight].forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            btnDark.classList.toggle('active', theme === 'dark');
            btnLight.classList.toggle('active', theme === 'light');
            localStorage.setItem('tigerclub-theme', theme);
        });
    });

    const saved = localStorage.getItem('tigerclub-theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        btnDark.classList.toggle('active', saved === 'dark');
        btnLight.classList.toggle('active', saved === 'light');
    }
}

/* ========== PARALLAX ========== */
function initParallax() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const update = () => {
        const scrollTop = mainContent.scrollTop || window.scrollY;
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.3;
            const container = el.closest('.parallax-container');
            if (!container) return;
            const rect = container.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const offset = (scrollTop - (container.offsetTop || 0)) * speed;
                el.style.transform = `translateY(${offset}px) scale(1.1)`;
            }
        });
    };

    mainContent.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
}

/* ========== 3D MEMBERSHIP CARD ========== */
function initMemberCardTilt() {
    const card = document.getElementById('memberCard');
    if (!card) return;

    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;

        const shine = card.querySelector('.card-shine');
        if (shine) {
            shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        card.style.transition = 'transform 0.5s ease';
        const shine = card.querySelector('.card-shine');
        if (shine) shine.style.background = 'none';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
}

/* ========== DAILY CHECK-IN ========== */
function initCheckin() {
    const btn = document.getElementById('btnCheckin');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const today = document.querySelector('.day.today');
        if (today) {
            today.classList.remove('today');
            today.classList.add('checked');
            today.innerHTML = '<span class="material-icons-round">check</span><small>五</small>';
        }
        btn.innerHTML = '<span class="material-icons-round">check_circle</span> 已簽到';
        btn.classList.add('checked-state');
        btn.disabled = true;

        const streak = document.querySelector('.streak-badge');
        if (streak) streak.innerHTML = '<span class="material-icons-round">local_fire_department</span> 5 天連續';

        showToast('+10 虎足跡', 'success');
    });
}

/* ========== ORDER TABS ========== */
function initOrderTabs() {
    document.querySelectorAll('.otab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.otab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

/* ========== TOAST ========== */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="material-icons-round">${type === 'success' ? 'check_circle' : 'info'}</span> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

/* ========== MODAL ========== */
function showRedemption() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
window.showRedemption = showRedemption;
window.closeModal = closeModal;

document.getElementById('modalOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ========== COUNTER ANIMATION ========== */
function animateCounters() {
    const el = document.getElementById('heroPointsVal');
    if (!el) return;
    const target = 2580;
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(eased * target);
        const formatted = val.toLocaleString();
        el.textContent = formatted;

        // Sync sidebar points
        const sidebar = document.getElementById('sidebarPoints');
        if (sidebar) sidebar.textContent = formatted;

        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

/* ========== PAGE ANIMATIONS ========== */
function triggerPageAnimations(pageName) {
    const page = document.getElementById(`page-${pageName}`);
    if (!page) return;

    const els = page.querySelectorAll('.card, .trip-ticket, .order-card, .hero-cinema, .featured-reward, .reward-card, .voucher-card, .tier-status-card, .stat-card, .upgrade-cta, .referral-banner, .tier-reminder, .tier-compare-card, .how-to-card, .settings-card, .settings-alert, .quick-actions');

    els.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 60 * i);
    });

    // Animate progress bars
    setTimeout(() => {
        page.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { bar.style.width = width; });
            });
        });
    }, 200);
}

/* ========== INTERSECTION OBSERVER ========== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.card, .reward-card, .voucher-card, .trip-ticket, .order-card').forEach(el => observer.observe(el));
