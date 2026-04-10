/* ============================================================
   TIGERAIR 台灣虎航 — MEMBER SYSTEM APPLICATION
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    initCheckin();
    animatePointsCounter();
});

/* ---------- NAVIGATION ---------- */
function initNavigation() {
    // Sidebar nav items
    const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
    // Top tabs
    const topTabs = document.querySelectorAll('.top-tab');
    // Bottom nav items
    const bottomItems = document.querySelectorAll('.bottom-nav-item, .bottom-nav-fab');

    const allNavItems = [...sidebarItems, ...topTabs, ...bottomItems];

    allNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) navigateTo(page);
        });
    });
}

function navigateTo(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update sidebar nav
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });

    // Update top tabs
    document.querySelectorAll('.top-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.page === pageName);
    });

    // Update bottom nav
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-trigger animations for the new page
    triggerPageAnimations(pageName);
}

// Make navigateTo available globally
window.navigateTo = navigateTo;

/* ---------- PAGE ANIMATIONS ---------- */
function triggerPageAnimations(pageName) {
    const page = document.getElementById(`page-${pageName}`);
    if (!page) return;

    const animatedElements = page.querySelectorAll('.card, .featured-reward, .reward-card, .voucher-card, .tier-status-card, .stat-card, .benefit-card, .upgrade-cta, .referral-banner, .tier-reminder-bar, .points-hero');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';

        setTimeout(() => {
            el.style.transition = `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)`;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 80 * index);
    });
}

function initAnimations() {
    // Initial page load animations
    triggerPageAnimations('dashboard');

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.card, .reward-card, .voucher-card, .benefit-card').forEach(el => {
        observer.observe(el);
    });
}

/* ---------- POINTS COUNTER ANIMATION ---------- */
function animatePointsCounter() {
    const counterEl = document.getElementById('hero-points-value');
    if (!counterEl) return;

    const target = 25420;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        counterEl.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ---------- DAILY CHECK-IN ---------- */
function initCheckin() {
    const btn = document.getElementById('btn-checkin');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const todayEl = document.querySelector('.day.today');
        if (todayEl) {
            // Mark today as checked
            todayEl.classList.remove('today');
            todayEl.classList.add('checked');
            todayEl.innerHTML = '<span class="material-icons-round">check</span><small>今天</small>';

            // Highlight next day
            const nextDay = todayEl.nextElementSibling;
            if (nextDay && !nextDay.classList.contains('checked')) {
                nextDay.classList.add('today');
                nextDay.innerHTML = '<span class="material-icons-round">card_giftcard</span>' + nextDay.innerHTML;
            }

            // Update button
            btn.textContent = '✓ 已簽到';
            btn.style.background = 'linear-gradient(135deg, #0d7a4e, #4edea3)';
            btn.style.color = '#fff';
            btn.disabled = true;

            // Update streak
            const streakEl = document.querySelector('.streak-info span:last-child');
            if (streakEl) {
                streakEl.textContent = '5 天連續';
            }

            // Animate points
            showPointsToast('+10 積分');
        }
    });
}

/* ---------- POINTS TOAST ---------- */
function showPointsToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 40px;
        padding: 14px 24px;
        background: linear-gradient(135deg, #0d7a4e, #4edea3);
        color: #fff;
        border-radius: 9999px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        z-index: 2000;
        box-shadow: 0 8px 24px rgba(13, 122, 78, 0.3);
        animation: toastIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    toast.textContent = message;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastIn {
            from { opacity: 0; transform: translateY(-16px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(-16px) scale(0.9); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 300);
    }, 2500);
}

/* ---------- MODAL (REDEMPTION) ---------- */
function showRedemption() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Make modal functions globally available
window.showRedemption = showRedemption;
window.closeModal = closeModal;

// Close modal on overlay click
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

/* ---------- HOVER EFFECTS ---------- */
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple-like hover state to interactive cards
    const interactiveCards = document.querySelectorAll('.reward-card, .benefit-card, .voucher-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Progress bar animation on scroll
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        bar.style.width = width;
                    });
                });
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => progressObserver.observe(bar));
});
