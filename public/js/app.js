/* ============================================================
   LifeLink — SPA Router & App Controller
   ============================================================ */


(function () {
    'use strict';

    // --- View Registry ---
    const views = {
        dashboard: renderDashboard,
        donors: renderDonors,
        blood: renderBlood,
        organs: renderOrgans,
        hospitals: renderHospitals,
        patients: renderPatients,
        requests: renderRequests,
        matching: renderMatching,
        allocations: renderAllocations,
        alerts: renderAlerts,
    };

    let currentView = 'dashboard';

    // --- Navigation ---
    function navigateTo(viewName) {
        if (!views[viewName]) return;
        currentView = viewName;

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.view === viewName);
        });

        // Close mobile sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }

        // Fade transition
        const container = document.getElementById('view-container');
        container.classList.add('view-exit');

        setTimeout(() => {
            // Clear any organ countdown intervals from previous view
            if (typeof organInterval !== 'undefined' && organInterval) {
                clearInterval(organInterval);
                organInterval = null;
            }

            // Render the view
            views[viewName]();

            // Update topbar title
            const pageTitleEl = document.getElementById('page-title');
            const activeLink = document.querySelector('.nav-link.active span');
            if (pageTitleEl && activeLink) {
                pageTitleEl.textContent = activeLink.textContent;
            }

            container.classList.remove('view-exit');
            container.classList.add('view-enter');

            setTimeout(() => container.classList.remove('view-enter'), 300);
        }, 150);
    }

    // --- Init ---
    function init() {
        // Bind sidebar nav clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.dataset.view;
                if (view) navigateTo(view);
            });
        });

        // Mobile sidebar toggle
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (toggle) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Close sidebar on clicking outside (mobile)
        document.getElementById('content').addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });

        // Replace feather icons
        feather.replace();

        // Load default view
        navigateTo('dashboard');

        // Initial fetch for alerts badge
        async function fetchAlertsBadge() {
            try {
                const alerts = await API.get('alerts');
                const badge = document.getElementById('topbar-alert-badge');
                if (badge && alerts) {
                    badge.textContent = alerts.length;
                    badge.style.display = alerts.length > 0 ? 'flex' : 'none';
                }
            } catch (e) {}
        }
        fetchAlertsBadge();

        // Refresh alert badge periodically
        setInterval(fetchAlertsBadge, 60000);

        // Set date attribute for print media
        const currentDataStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const contentEl = document.getElementById('content');
        if(contentEl) contentEl.setAttribute('data-date', currentDataStr);
    }

    // --- Global UX Utilities ---
    // showToast is provided by api.js (loaded first), no duplicate needed here

    // 2. Custom Confirm Dialog
    function showConfirm(options) {
        let overlay = document.getElementById('confirm-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'confirm-overlay';
            overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.3); z-index:99999; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s ease;';
            document.body.appendChild(overlay);
        }

        const title = options.title || "Confirm";
        const msg = options.message || "Are you sure you want to proceed?";
        const confirmText = options.confirmText || "Confirm";
        const confirmClass = options.confirmClass || "btn-primary";

        overlay.innerHTML = `
            <div class="confirm-card" style="background:var(--bg-surface); width:400px; max-width:90vw; border-radius:10px; box-shadow:var(--shadow-md); padding:var(--space-xl); transform:scale(0.95); transition:transform 0.2s ease;">
                <h3 style="font-size:18px; font-weight:600; margin-bottom:12px;">${title}</h3>
                <p style="font-size:14px; color:var(--text-secondary); margin-bottom:24px; line-height:1.5;">${msg}</p>
                <div style="display:flex; justify-content:flex-end; gap:12px;">
                    <button class="btn btn-secondary" id="confirm-btn-cancel">Cancel</button>
                    <button class="btn ${confirmClass}" id="confirm-btn-ok">${confirmText}</button>
                </div>
            </div>
        `;

        const close = () => {
            overlay.style.opacity = '0';
            overlay.querySelector('.confirm-card').style.transform = 'scale(0.95)';
            setTimeout(() => overlay.remove(), 200);
        };

        const handleEscape = (e) => {
            if(e.key === 'Escape') {
                document.removeEventListener('keydown', handleEscape);
                close();
            }
        };

        document.getElementById('confirm-btn-cancel').onclick = close;
        document.getElementById('confirm-btn-ok').onclick = () => {
            if(options.onConfirm) options.onConfirm();
            close();
        };
        overlay.onclick = (e) => { if(e.target === overlay) close(); };
        document.addEventListener('keydown', handleEscape);

        // Animate in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.confirm-card').style.transform = 'scale(1)';
        });
    }

    // 3. Reusable Empty State
    function renderEmptyState(containerIdOrElement, options) {
        const container = typeof containerIdOrElement === 'string' ? document.getElementById(containerIdOrElement) : containerIdOrElement;
        if(!container) return;
        
        const icon = options.icon || 'inbox';
        const title = options.title || 'No data found';
        const subtitle = options.subtitle || 'There is nothing to display here right now.';
        
        // Optional action button structure
        let actionHtml = '';
        if (options.actionClick && options.actionText) {
            actionHtml = `<button class="btn btn-primary mt-lg" onclick="${options.actionClick}"><i data-feather="plus"></i> ${options.actionText}</button>`;
        }

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 20px; text-align:center;">
                <div style="width:80px; height:80px; border-radius:50%; background:var(--bg-subtle); display:flex; align-items:center; justify-content:center; margin-bottom:var(--space-md);">
                    <i data-feather="${icon}" style="width:48px; height:48px; color:var(--text-muted); opacity:0.5;"></i>
                </div>
                <div style="font-family:var(--font-heading); font-size:16px; font-weight:600; color:var(--text-primary); margin-bottom:4px;">${title}</div>
                <div style="font-size:13px; color:var(--text-secondary); max-width:300px; line-height:1.5;">${subtitle}</div>
                ${actionHtml}
            </div>
        `;
        feather.replace();
    }

    // Expose globals
    window.navigateTo = navigateTo;
    window.showConfirm = showConfirm;
    window.renderEmptyState = renderEmptyState;

    // --- Boot app when DOM is ready ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
