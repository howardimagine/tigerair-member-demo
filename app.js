/* ============================================================
   TIGERCLUB — PREMIUM MEMBER PORTAL
   Features: Theme Toggle, Parallax, 3D Card, Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initParallax();
    initMemberCardTilt();
    initOrderTabs();
    initHeroSlideshow();
    initNotifPanel();
    initPassportModal();
    initMealModal();
    initVoucherSelect();
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

/* ========== NOTIFICATION PANEL ========== */
function initNotifPanel() {
    const panel = document.getElementById('notifPanel');
    const btnNotif = document.getElementById('btnNotif');
    if (!panel || !btnNotif) return;

    btnNotif.addEventListener('click', e => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });
    document.addEventListener('click', e => {
        if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btnNotif && !btnNotif.contains(e.target)) {
            panel.classList.remove('open');
        }
    });
}
function toggleNotif() {
    document.getElementById('notifPanel')?.classList.toggle('open');
    document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
    document.querySelector('.notif-dot')?.remove();
}
window.toggleNotif = toggleNotif;

/* ========== PASSPORT OCR MODAL ========== */
function initPassportModal() {
    document.getElementById('passportModal')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) closePassportOCR();
    });
}
function openPassportOCR() {
    const modal = document.getElementById('passportModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Sequentially reveal OCR fields for effect
    const fields = modal.querySelectorAll('.ocr-field');
    fields.forEach(f => f.classList.remove('ok'));
    fields.forEach((f, i) => setTimeout(() => f.classList.add('ok'), 600 + i * 350));
}
function closePassportOCR() {
    const modal = document.getElementById('passportModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // If on register flow, auto-fill both steps
    if (document.getElementById('page-register')?.classList.contains('active')) {
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
        set('regLastName', 'CHEN');
        set('regFirstName', 'ALEX');
        set('regDOB', '1990-08-15');
        set('regPassportNum', '300000045');
        set('regPassportExp', '2030-08-15');
        showToast('已自動帶入護照資料', 'success');
    } else {
        showToast('護照資料已儲存', 'success');
    }
}
window.openPassportOCR = openPassportOCR;
window.closePassportOCR = closePassportOCR;

/* ========== MEAL ORDERING MODAL ========== */
let USER_POINTS = 2580;
function initMealModal() {
    const modal = document.getElementById('mealModal');
    if (!modal) return;
    modal.addEventListener('click', e => { if (e.target === e.currentTarget) closeMealModal(); });
    modal.querySelectorAll('.meal-option input').forEach(i => i.addEventListener('change', updateMealTotal));
    document.getElementById('mealUsePoints')?.addEventListener('change', updateMealTotal);
}
function openMealModal() {
    const modal = document.getElementById('mealModal');
    if (!modal) return;
    // reset
    modal.querySelectorAll('.meal-option input').forEach(i => i.checked = false);
    const pts = document.getElementById('mealUsePoints'); if (pts) pts.checked = false;
    const pl = document.getElementById('mealAvailPts'); if (pl) pl.textContent = USER_POINTS.toLocaleString();
    updateMealTotal();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMealModal() {
    const modal = document.getElementById('mealModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
function updateMealTotal() {
    const inputs = document.querySelectorAll('#mealGrid .meal-option input:checked');
    const count = inputs.length;
    let subtotal = 0;
    inputs.forEach(i => subtotal += Number(i.dataset.price || 0));
    const usePoints = document.getElementById('mealUsePoints')?.checked;
    const deduct = usePoints ? Math.min(USER_POINTS, subtotal) : 0;
    const total = Math.max(0, subtotal - deduct);
    document.getElementById('mealCount').textContent = count;
    document.getElementById('mealSubtotal').textContent = 'NT$' + subtotal.toLocaleString();
    document.getElementById('mealDeduct').textContent = '-' + deduct.toLocaleString() + ' pts';
    document.getElementById('mealTotal').textContent = 'NT$' + total.toLocaleString();
    document.getElementById('btnConfirmMeal').disabled = count === 0;
}
function confirmMeal() {
    const inputs = document.querySelectorAll('#mealGrid .meal-option input:checked');
    const names = Array.from(inputs).map(i => i.dataset.name);
    const usePoints = document.getElementById('mealUsePoints')?.checked;
    const subtotal = Array.from(inputs).reduce((s, i) => s + Number(i.dataset.price || 0), 0);
    const deduct = usePoints ? Math.min(USER_POINTS, subtotal) : 0;
    if (usePoints) {
        USER_POINTS -= deduct;
        // update hero + sidebar points
        const fmt = USER_POINTS.toLocaleString();
        const hp = document.getElementById('heroPointsVal'); if (hp) hp.textContent = fmt;
        const sp = document.getElementById('sidebarPoints'); if (sp) sp.textContent = fmt;
    }
    closeMealModal();
    showToast('已加購 ' + names.length + ' 項機上餐點' + (usePoints ? `（折抵 ${deduct} pts）` : ''), 'success');
    // Mark the meal chip as added on the corresponding flight card
    document.querySelectorAll('.fa-chip').forEach(chip => {
        if (chip.querySelector('.fa-label')?.textContent.includes('機上餐')) {
            chip.classList.add('added');
            const price = chip.querySelector('.fa-price');
            if (price) { price.className = 'fa-state'; price.textContent = '已加購'; }
        }
    });
}
window.openMealModal = openMealModal;
window.closeMealModal = closeMealModal;
window.confirmMeal = confirmMeal;

/* ========== REGISTER STEPPER ========== */
let currentStep = 1;
const totalSteps = 5;
function goToStep(n) {
    currentStep = Math.max(1, Math.min(totalSteps, n));
    document.querySelectorAll('#registerStepper .step-dot').forEach(d => {
        const s = Number(d.dataset.step);
        d.classList.toggle('active', s === currentStep);
        d.classList.toggle('done', s < currentStep);
    });
    document.querySelectorAll('.register-step').forEach(s => {
        s.classList.toggle('active', Number(s.dataset.step) === currentStep);
    });
    const prev = document.getElementById('btnStepPrev');
    const next = document.getElementById('btnStepNext');
    const actions = document.getElementById('registerActions');
    if (prev) prev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    if (next) next.innerHTML = currentStep === totalSteps - 1
        ? '完成註冊<span class="material-icons-round">check</span>'
        : '下一步<span class="material-icons-round">arrow_forward</span>';
    if (actions) actions.style.display = currentStep === totalSteps ? 'none' : 'flex';
}
function stepNext() {
    if (currentStep < totalSteps) goToStep(currentStep + 1);
}
function stepPrev() {
    if (currentStep > 1) goToStep(currentStep - 1);
}
window.stepNext = stepNext;
window.stepPrev = stepPrev;
// Reset stepper each time /register opens
const _navOrig = window.navigateTo;
window.navigateTo = function(page) {
    _navOrig(page);
    if (page === 'register') goToStep(1);
};

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

/* ========== VOUCHER REDEMPTION FLOW ========== */
let vsSelectedPts = 0;

function showRedemption() {
    openVoucherSelect();
}
function openVoucherSelect() {
    const modal = document.getElementById('voucherSelectModal');
    if (!modal) return;
    vsSelectedPts = 0;
    document.querySelectorAll('#vsGrid .vden-card').forEach(c => {
        c.classList.remove('selected');
        const pts = Number(c.dataset.pts || 0);
        c.classList.toggle('disabled', pts > USER_POINTS);
    });
    document.getElementById('vsAvailPts').textContent = USER_POINTS.toLocaleString();
    document.getElementById('vsSummary').hidden = true;
    document.getElementById('btnConfirmVoucher').disabled = true;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeVoucherSelect() {
    const modal = document.getElementById('voucherSelectModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
function initVoucherSelect() {
    const modal = document.getElementById('voucherSelectModal');
    if (!modal) return;
    modal.addEventListener('click', e => { if (e.target === e.currentTarget) closeVoucherSelect(); });
    modal.querySelectorAll('#vsGrid .vden-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('disabled')) return;
            modal.querySelectorAll('#vsGrid .vden-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            vsSelectedPts = Number(card.dataset.pts);
            document.getElementById('vsPickAmt').textContent = 'NT$' + vsSelectedPts.toLocaleString();
            document.getElementById('vsPickPts').textContent = '-' + vsSelectedPts.toLocaleString() + ' pts';
            document.getElementById('vsPickRemain').textContent = (USER_POINTS - vsSelectedPts).toLocaleString() + ' pts';
            document.getElementById('vsSummary').hidden = false;
            document.getElementById('btnConfirmVoucher').disabled = false;
        });
    });
}
function confirmVoucher() {
    if (!vsSelectedPts || vsSelectedPts > USER_POINTS) return;
    USER_POINTS -= vsSelectedPts;
    const fmt = USER_POINTS.toLocaleString();
    const hp = document.getElementById('heroPointsVal'); if (hp) hp.textContent = fmt;
    const sp = document.getElementById('sidebarPoints'); if (sp) sp.textContent = fmt;
    closeVoucherSelect();
    // Show success with correct amount
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.querySelector('.modal-desc').innerHTML = `已成功兌換 <strong>NT$${vsSelectedPts.toLocaleString()} Voucher</strong>，請於 60 天內使用。`;
        const rows = modal.querySelectorAll('.mvp-row strong');
        if (rows[0]) rows[0].textContent = 'NT$' + vsSelectedPts.toLocaleString();
        if (rows[1]) rows[1].textContent = '-' + vsSelectedPts.toLocaleString() + ' pts';
        if (rows[2]) {
            const d = new Date(); d.setDate(d.getDate() + 60);
            rows[2].textContent = d.getFullYear() + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()).padStart(2,'0');
        }
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
window.openVoucherSelect = openVoucherSelect;
window.closeVoucherSelect = closeVoucherSelect;
window.confirmVoucher = confirmVoucher;
window.closeModal = closeModal;

document.getElementById('modalOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeVoucherSelect(); closeMealModal(); closePassportOCR(); } });

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
