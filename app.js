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
    initLineModal();
    initCoverFlow();
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

/* ========== MEAL ORDERING MODAL (Cover Flow) ========== */
let USER_POINTS = 2580;
let cfIndex = 0;
let cfSelected = new Set(); // selected card indices

function initMealModal() {
    const modal = document.getElementById('mealModal');
    if (!modal) return;
    modal.addEventListener('click', e => { if (e.target === e.currentTarget) closeMealModal(); });
    document.getElementById('mealUsePoints')?.addEventListener('change', updateMealTotal);
}

function initCoverFlow() {
    const stage = document.getElementById('coverflowStage');
    if (!stage) return;
    // Click side cards to focus
    stage.querySelectorAll('.cf-card').forEach(card => {
        card.addEventListener('click', () => {
            const idx = Number(card.dataset.cfIdx);
            if (idx === cfIndex) {
                cfToggleSelect();
            } else {
                cfGoTo(idx);
            }
        });
    });
    // Build dots
    const dotsHost = document.getElementById('cfDots');
    if (dotsHost) {
        const total = stage.querySelectorAll('.cf-card').length;
        dotsHost.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'cf-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => cfGoTo(i));
            dotsHost.appendChild(dot);
        }
    }
    // Keyboard arrows when modal open
    document.addEventListener('keydown', e => {
        const open = document.getElementById('mealModal')?.classList.contains('active');
        if (!open) return;
        if (e.key === 'ArrowLeft') cfPrev();
        else if (e.key === 'ArrowRight') cfNext();
        else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); cfToggleSelect(); }
    });
    cfRender();
}

function cfRender() {
    const cards = document.querySelectorAll('#coverflowTrack .cf-card');
    const total = cards.length;
    cards.forEach(card => {
        const i = Number(card.dataset.cfIdx);
        let pos;
        const diff = i - cfIndex;
        if (diff === 0) pos = 'center';
        else if (diff === -1 || diff === total - 1) pos = 'left-1';
        else if (diff === -2 || diff === total - 2) pos = 'left-2';
        else if (diff === 1 || diff === -(total - 1)) pos = 'right-1';
        else if (diff === 2 || diff === -(total - 2)) pos = 'right-2';
        else pos = 'hidden';
        card.dataset.pos = pos;
        card.classList.toggle('selected', cfSelected.has(i));
    });
    // Dots
    document.querySelectorAll('#cfDots .cf-dot').forEach((d, i) => {
        d.classList.toggle('active', i === cfIndex);
    });
    // Add button label
    const btn = document.getElementById('cfAddBtn');
    if (btn) {
        if (cfSelected.has(cfIndex)) {
            btn.classList.add('added');
            btn.innerHTML = '<span class="material-icons-round">remove_circle</span><span>取消加入</span>';
        } else {
            btn.classList.remove('added');
            btn.innerHTML = '<span class="material-icons-round">add_circle</span><span>加入餐點</span>';
        }
    }
    renderSelectedChips();
}

function renderSelectedChips() {
    const host = document.getElementById('cfSelectedChips');
    if (!host) return;
    host.innerHTML = '';
    cfSelected.forEach(i => {
        const card = document.querySelector(`#coverflowTrack .cf-card[data-cf-idx="${i}"]`);
        if (!card) return;
        const name = card.dataset.name;
        const chip = document.createElement('span');
        chip.className = 'cf-chip';
        chip.innerHTML = `<span class="material-icons-round">check</span>${name}<span class="material-icons-round" data-rm="${i}">close</span>`;
        host.appendChild(chip);
    });
    host.querySelectorAll('[data-rm]').forEach(el => {
        el.addEventListener('click', e => {
            e.stopPropagation();
            cfSelected.delete(Number(el.dataset.rm));
            cfRender();
            updateMealTotal();
        });
    });
}

function cfPrev() {
    const total = document.querySelectorAll('#coverflowTrack .cf-card').length;
    cfIndex = (cfIndex - 1 + total) % total;
    cfRender();
}
function cfNext() {
    const total = document.querySelectorAll('#coverflowTrack .cf-card').length;
    cfIndex = (cfIndex + 1) % total;
    cfRender();
}
function cfGoTo(idx) {
    const total = document.querySelectorAll('#coverflowTrack .cf-card').length;
    cfIndex = ((idx % total) + total) % total;
    cfRender();
}
function cfToggleSelect() {
    if (cfSelected.has(cfIndex)) cfSelected.delete(cfIndex);
    else cfSelected.add(cfIndex);
    cfRender();
    updateMealTotal();
}

function openMealModal() {
    const modal = document.getElementById('mealModal');
    if (!modal) return;
    cfSelected.clear();
    cfIndex = 0;
    const pts = document.getElementById('mealUsePoints'); if (pts) pts.checked = false;
    const pl = document.getElementById('mealAvailPts'); if (pl) pl.textContent = USER_POINTS.toLocaleString();
    cfRender();
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
    let subtotal = 0;
    cfSelected.forEach(i => {
        const card = document.querySelector(`#coverflowTrack .cf-card[data-cf-idx="${i}"]`);
        if (card) subtotal += Number(card.dataset.price || 0);
    });
    const usePoints = document.getElementById('mealUsePoints')?.checked;
    const deduct = usePoints ? Math.min(USER_POINTS, subtotal) : 0;
    const total = Math.max(0, subtotal - deduct);
    const count = cfSelected.size;
    document.getElementById('mealCount').textContent = count;
    document.getElementById('mealSubtotal').textContent = 'NT$' + subtotal.toLocaleString();
    document.getElementById('mealDeduct').textContent = '-' + deduct.toLocaleString() + ' pts';
    document.getElementById('mealTotal').textContent = 'NT$' + total.toLocaleString();
    document.getElementById('btnConfirmMeal').disabled = count === 0;
}
function confirmMeal() {
    if (!cfSelected.size) return;
    const names = [];
    let subtotal = 0;
    cfSelected.forEach(i => {
        const card = document.querySelector(`#coverflowTrack .cf-card[data-cf-idx="${i}"]`);
        if (card) {
            names.push(card.dataset.name);
            subtotal += Number(card.dataset.price || 0);
        }
    });
    const usePoints = document.getElementById('mealUsePoints')?.checked;
    const deduct = usePoints ? Math.min(USER_POINTS, subtotal) : 0;
    if (usePoints) {
        USER_POINTS -= deduct;
        syncPointsDisplay();
    }
    closeMealModal();
    showToast('已加購 ' + names.length + ' 項機上餐點' + (usePoints ? `（折抵 ${deduct} pts）` : ''), 'success');
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
window.cfPrev = cfPrev;
window.cfNext = cfNext;
window.cfToggleSelect = cfToggleSelect;

function syncPointsDisplay() {
    const fmt = USER_POINTS.toLocaleString();
    const hp = document.getElementById('heroPointsVal'); if (hp) hp.textContent = fmt;
    const sp = document.getElementById('sidebarPoints'); if (sp) sp.textContent = fmt;
}
window.syncPointsDisplay = syncPointsDisplay;

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
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeVoucherSelect(); closeMealModal(); closePassportOCR(); closeLineModal(); closeLineWelcome(); closeAncillary(); closeMileage(); closeSupport(); } });

/* ========== LINE QUICK JOIN ========== */
function initLineModal() {
    const modal = document.getElementById('lineModal');
    if (!modal) return;
    modal.addEventListener('click', e => { if (e.target === e.currentTarget) closeLineModal(); });
    modal.querySelectorAll('.line-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const which = tab.dataset.lineTab;
            modal.querySelectorAll('.line-tab').forEach(t => t.classList.toggle('active', t === tab));
            modal.querySelectorAll('.line-pane').forEach(p => p.classList.toggle('active', p.dataset.linePane === which));
        });
    });
    const welcome = document.getElementById('lineWelcomeModal');
    if (welcome) welcome.addEventListener('click', e => { if (e.target === e.currentTarget) closeLineWelcome(); });
}
function openLineModal() {
    const modal = document.getElementById('lineModal');
    if (!modal) return;
    // Reset to QR tab
    modal.querySelectorAll('.line-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
    modal.querySelectorAll('.line-pane').forEach((p, i) => p.classList.toggle('active', i === 0));
    const status = document.getElementById('lineQrStatus');
    if (status) {
        status.classList.remove('success');
        status.innerHTML = '<span class="material-icons-round">qr_code_scanner</span>請使用 LINE App 掃描';
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeLineModal() {
    const modal = document.getElementById('lineModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
function simulateLineScan() {
    const status = document.getElementById('lineQrStatus');
    if (status) {
        status.innerHTML = '<span class="material-icons-round">sync</span>等待 LINE App 確認…';
    }
    setTimeout(() => {
        if (status) {
            status.classList.add('success');
            status.innerHTML = '<span class="material-icons-round">check_circle</span>已成功識別';
        }
        setTimeout(completeLineJoin, 700);
    }, 1100);
}
function completeLineJoin() {
    closeLineModal();
    const welcome = document.getElementById('lineWelcomeModal');
    if (!welcome) return;
    welcome.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeLineWelcome() {
    const w = document.getElementById('lineWelcomeModal');
    if (!w) return;
    w.classList.remove('active');
    document.body.style.overflow = '';
}
function finishLineJoin() {
    closeLineWelcome();
    // Bonus 200 pts already accounted in welcome
    USER_POINTS = 200; // Reset to lightweight member starting pts
    syncPointsDisplay();
    navigateTo('dashboard');
    setTimeout(() => showToast('歡迎加入 tigerclub 輕量會員！+200 pts 已入帳', 'success'), 400);
}
window.openLineModal = openLineModal;
window.closeLineModal = closeLineModal;
window.simulateLineScan = simulateLineScan;
window.completeLineJoin = completeLineJoin;
window.closeLineWelcome = closeLineWelcome;
window.finishLineJoin = finishLineJoin;

/* ========== REGISTER PATH SELECTOR ========== */
function showFullRegister() {
    const sel = document.getElementById('pathSelector');
    const flow = document.getElementById('fullRegisterFlow');
    if (sel) sel.style.display = 'none';
    if (flow) flow.hidden = false;
    goToStep(1);
}
function hideFullRegister() {
    const sel = document.getElementById('pathSelector');
    const flow = document.getElementById('fullRegisterFlow');
    if (sel) sel.style.display = '';
    if (flow) flow.hidden = true;
}
window.showFullRegister = showFullRegister;
window.hideFullRegister = hideFullRegister;

/* ========== TASK CENTER ========== */
function completeTask(key, pts) {
    const row = document.querySelector(`.task-row[data-task="${key}"]`);
    if (!row || row.classList.contains('done')) return;
    row.classList.add('done');
    const state = row.querySelector('.task-row-state');
    if (state) {
        state.classList.remove('state-pending');
        state.classList.add('state-done');
        state.innerHTML = '<span class="material-icons-round">check_circle</span><span>已完成</span>';
    }
    USER_POINTS += pts;
    syncPointsDisplay();
    updateTaskProgress();
    showToast(`任務完成！+${pts} pts`, 'success');
}
function completeTaskPassport() {
    const row = document.querySelector('.task-row[data-task="passport"]');
    // We add passport as a row dynamically via the feature banner, so first ensure it's tracked
    openPassportOCR();
    const origClose = window.closePassportOCR;
    window.closePassportOCR = function() {
        origClose();
        // Mark passport done in the feature banner
        const banner = document.querySelector('.task-feature-banner');
        if (banner && !banner.classList.contains('done')) {
            banner.classList.add('done');
            const btn = banner.querySelector('.tfb-btn');
            if (btn) {
                btn.textContent = '已完成 ✓';
                btn.style.background = '#06C755';
                btn.style.color = '#fff';
            }
            USER_POINTS += 300;
            syncPointsDisplay();
            updateTaskProgress();
            setTimeout(() => showToast('任務完成！+300 pts', 'success'), 200);
        }
        window.closePassportOCR = origClose;
    };
}
function updateTaskProgress() {
    const rows = document.querySelectorAll('.task-row');
    const banner = document.querySelector('.task-feature-banner');
    const total = rows.length + (banner ? 1 : 0);
    let done = document.querySelectorAll('.task-row.done').length;
    if (banner && banner.classList.contains('done')) done += 1;

    const txt = document.getElementById('taskProgressText');
    if (txt) txt.textContent = `${done} / ${total}`;

    const bar = document.getElementById('taskBarFill');
    if (bar) bar.style.width = (total ? (done / total * 100) : 0) + '%';

    const navBadge = document.getElementById('navTaskBadge');
    const remaining = total - done;
    if (navBadge) {
        if (remaining > 0) {
            navBadge.textContent = remaining;
            navBadge.style.display = '';
        } else {
            navBadge.style.display = 'none';
        }
    }
    // Sync the QA dot too
    const qaDot = document.querySelector('.qa-highlight .qa-dot');
    if (qaDot) {
        if (remaining > 0) {
            qaDot.textContent = remaining;
            qaDot.style.display = '';
        } else {
            qaDot.style.display = 'none';
        }
    }
}
function scrollToTasks() {
    navigateTo('tasks');
}
window.completeTask = completeTask;
window.completeTaskPassport = completeTaskPassport;
window.scrollToTasks = scrollToTasks;

/* ========== ANCILLARY SERVICE MODAL ========== */
const ANC_CONFIG = {
    baggage: {
        title: '行李加購',
        icon: 'luggage',
        hint: '託運行李重量選擇',
        options: [
            { name: '15 kg', price: 480, label: '基本', feats: ['含 1 件託運', '經濟艙適用', '無冷凍包裝'] },
            { name: '20 kg', price: 680, label: '推薦', popular: true, feats: ['含 1 件託運', '可分裝 2 件', '含基本保護'] },
            { name: '25 kg', price: 880, label: '寬鬆', feats: ['含 2 件託運', '伴手禮空間', '含基本保護'] },
            { name: '30 kg', price: 1180, label: '充裕', feats: ['含 2 件託運', '搬家/長住', '含全程保險'] },
        ],
    },
    seat: {
        title: '座位選擇',
        icon: 'event_seat',
        hint: '選擇你的航程座位',
        options: [
            { name: '標準座位', price: 0, label: '免費', feats: ['系統隨機分配', '可同行緊鄰', '報到時確認'] },
            { name: '靠窗 / 走道', price: 450, label: '指定', feats: ['前 15 排優先', '指定靠窗或走道', '同行可選'] },
            { name: '前艙加大', price: 880, label: '推薦', popular: true, feats: ['前 5 排寬敞', '加長腿部空間', '優先登機'] },
            { name: '緊急出口', price: 1280, label: '寬敞', feats: ['最大腿部空間', '需限定身高', '優先登機'] },
        ],
    },
    insurance: {
        title: '旅遊險方案',
        icon: 'health_and_safety',
        hint: '選擇適合的旅平+不便險方案',
        options: [
            { name: '基本不便險', price: 199, label: '經濟', feats: ['班機延誤 4 小時起賠', '行李遺失 NT$5,000', '14 天內有效'] },
            { name: '進階旅平險', price: 480, label: '推薦', popular: true, feats: ['含 200 萬旅平', '行李遺失 NT$15,000', '醫療緊急救援'] },
            { name: '尊榮全險', price: 880, label: '完整', feats: ['含 500 萬旅平', '海外醫療上限 NT$50 萬', '24h 全球支援'] },
            { name: '家庭方案', price: 1280, label: '家庭', feats: ['2 大 1 小組合', '完整旅平+不便險', '兒童另享 60% 額度'] },
        ],
    },
};
let ancSelectedIdx = -1;
let ancCurrent = null;

function openAncillary(type, flight) {
    const cfg = ANC_CONFIG[type];
    if (!cfg) return;
    ancCurrent = { type, cfg };
    ancSelectedIdx = -1;

    const modal = document.getElementById('ancillaryModal');
    document.getElementById('ancTitle').textContent = cfg.title;
    document.getElementById('ancFlight').textContent = `航班 ${flight} · 加值服務`;
    document.getElementById('ancHeadIcon').textContent = cfg.icon;
    document.getElementById('ancHint').textContent = cfg.hint;

    const host = document.getElementById('ancOptions');
    host.innerHTML = '';
    cfg.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'anc-option' + (opt.popular ? ' popular' : '');
        btn.dataset.idx = i;
        btn.innerHTML = `
            <span class="anc-opt-label">${opt.label}</span>
            <span class="anc-opt-name">${opt.name}</span>
            <ul class="anc-opt-feats">${opt.feats.map(f => `<li>${f}</li>`).join('')}</ul>
            <span class="anc-opt-price">${opt.price === 0 ? '免費' : 'NT$' + opt.price.toLocaleString()}</span>
        `;
        btn.addEventListener('click', () => {
            host.querySelectorAll('.anc-option').forEach(o => o.classList.remove('selected'));
            btn.classList.add('selected');
            ancSelectedIdx = i;
            document.getElementById('ancPickName').textContent = opt.name;
            document.getElementById('ancPickPrice').textContent = opt.price === 0 ? '免費' : 'NT$' + opt.price.toLocaleString();
            document.getElementById('btnAncConfirm').disabled = false;
        });
        host.appendChild(btn);
    });

    // Reset summary
    document.getElementById('ancPickName').textContent = '—';
    document.getElementById('ancPickPrice').textContent = 'NT$0';
    document.getElementById('btnAncConfirm').disabled = true;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeAncillary() {
    document.getElementById('ancillaryModal').classList.remove('active');
    document.body.style.overflow = '';
}
function confirmAncillary() {
    if (ancSelectedIdx < 0 || !ancCurrent) return;
    const opt = ancCurrent.cfg.options[ancSelectedIdx];
    const labelMap = { baggage: '行李', seat: '選位', insurance: '旅遊險' };
    closeAncillary();
    showToast(`已加購 ${labelMap[ancCurrent.type]}：${opt.name}（NT$${opt.price}）`, 'success');
    // Mark the chip as added on the corresponding flight card
    document.querySelectorAll('.fa-chip').forEach(chip => {
        const lbl = chip.querySelector('.fa-label')?.textContent || '';
        if (
            (ancCurrent.type === 'baggage' && lbl.includes('行李')) ||
            (ancCurrent.type === 'seat' && lbl.includes('選位')) ||
            (ancCurrent.type === 'insurance' && lbl.includes('旅遊險'))
        ) {
            chip.classList.add('added');
            const price = chip.querySelector('.fa-price');
            if (price) { price.className = 'fa-state'; price.textContent = '已加購'; }
        }
    });
}
window.openAncillary = openAncillary;
window.closeAncillary = closeAncillary;
window.confirmAncillary = confirmAncillary;
document.getElementById('ancillaryModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAncillary();
});

/* ========== MILEAGE CLAIM MODAL ========== */
function openMileageClaim() {
    const modal = document.getElementById('mileageModal');
    if (!modal) return;
    // Reset
    document.getElementById('mileageEstimate').hidden = true;
    const upload = document.getElementById('mileageUpload');
    upload.classList.remove('uploaded');
    document.getElementById('mileageUploadTitle').textContent = '上傳登機證 / 電子票根';
    document.getElementById('mileageUploadHint').textContent = 'JPG / PNG / PDF，自動辨識航班編號';
    document.getElementById('mileageUploadBtn').textContent = '選擇檔案';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMileage() {
    document.getElementById('mileageModal').classList.remove('active');
    document.body.style.overflow = '';
}
function simulateBoardingPassUpload() {
    const upload = document.getElementById('mileageUpload');
    document.getElementById('mileageUploadTitle').textContent = '辨識中… IT 198 TPE→KIX';
    document.getElementById('mileageUploadHint').textContent = '請稍候，正在比對航班記錄';
    document.getElementById('mileageUploadBtn').textContent = '處理中';
    setTimeout(() => {
        upload.classList.add('uploaded');
        document.getElementById('mileageUploadTitle').textContent = '✓ 已成功辨識：IT 198 (2026/04/10)';
        document.getElementById('mileageUploadHint').textContent = 'TPE → KIX · 經濟艙 · 已比對訂位記錄';
        document.getElementById('mileageUploadBtn').textContent = '已上傳';
        document.getElementById('mileageEstimate').hidden = false;
    }, 1100);
}
function submitMileage() {
    closeMileage();
    USER_POINTS += 120;
    syncPointsDisplay();
    showToast('補登申請已送出！+120 虎足跡 預計 7 個工作天內入帳', 'success');
}
window.openMileageClaim = openMileageClaim;
window.closeMileage = closeMileage;
window.simulateBoardingPassUpload = simulateBoardingPassUpload;
window.submitMileage = submitMileage;
document.getElementById('mileageModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeMileage();
});

/* ========== SUPPORT MODAL ========== */
function openSupport() {
    const modal = document.getElementById('supportModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeSupport() {
    document.getElementById('supportModal').classList.remove('active');
    document.body.style.overflow = '';
}
function supportPick(topic) {
    closeSupport();
    showToast(`已將「${topic}」轉接客服，將於 LINE 收到專員訊息`, 'success');
}
window.openSupport = openSupport;
window.closeSupport = closeSupport;
window.supportPick = supportPick;
document.getElementById('supportModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSupport();
});

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
