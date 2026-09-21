/**
 * UK LTD Registration - Main JS Cache
 * Consolidates UI logic to improve performance and SEO quality.
 */

// 1. Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger-icon');
    const close = document.getElementById('close-icon');
    if (menu && hamburger && close) {
        menu.classList.toggle('hidden');
        hamburger.classList.toggle('hidden');
        close.classList.toggle('hidden');
    }
}

// 2. Exit Intent Popup
let popupShown = false;
document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0 && !popupShown) {
        showExitPopup();
    }
});

function showExitPopup() {
    const popup = document.getElementById('exit-popup');
    const content = document.getElementById('popup-content');
    if (popup && content) {
        popup.classList.remove('hidden');
        popup.classList.add('flex');
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
        }, 10);
        popupShown = true;
    }
}

function closeExitPopup() {
    const popup = document.getElementById('exit-popup');
    if (popup) {
        popup.classList.add('hidden');
        popup.classList.remove('flex');
    }
}

// 3. Social Proof Simulation
const names = ["James from Leeds", "Aarav from Birmingham", "Elena from Manchester", "Michael from Bristol", "Wei from London", "Lucas from Cardiff"];
const spToast = document.getElementById('social-proof');
const spText = document.getElementById('sp-text');

function showSocialProof() {
    if (spToast && spText) {
        const name = names[Math.floor(Math.random() * names.length)];
        spText.innerText = name;
        spToast.classList.remove('hidden');
        setTimeout(() => {
            spToast.classList.add('hidden');
        }, 5000);
    }
}

// Initialize Social Proof if element exists
if (spToast) {
    setTimeout(() => {
        showSocialProof();
        setInterval(showSocialProof, 25000);
    }, 8000);
}

// 4. Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 5. Conversion & CTA Tracking Logic
document.addEventListener('DOMContentLoaded', () => {
    // Track clicks on elements with data-track attribute
    document.querySelectorAll('[data-track]').forEach(el => {
        el.addEventListener('click', function(e) {
            const trackId = this.getAttribute('data-track');
            const label = this.innerText.trim() || trackId;
            let ctaType = 'General CTA';

            if (trackId.includes('formation')) ctaType = 'Formation CTA';
            else if (trackId.includes('contact')) ctaType = 'Contact CTA';
            else if (trackId.includes('whatsapp')) ctaType = 'WhatsApp Support';
            else if (trackId.includes('consultation')) ctaType = 'Consultation CTA';
            else if (trackId.includes('strategy')) ctaType = 'Strategy CTA';
            else if (trackId.includes('enquiry') || trackId.includes('lead')) ctaType = 'Lead Capture';

            // Push to GTM DataLayer
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'cta_click',
                'cta_type': ctaType,
                'cta_id': trackId,
                'cta_label': label,
                'page_category': window.pageCategory || 'General',
                'page_path': window.location.pathname,
                'page_title': document.title
            });

            // Also fire GA4 event directly (fallback if GTM not loaded)
            if (typeof gtag === 'function') {
                gtag('event', 'cta_click', {
                    cta_type: ctaType,
                    cta_id: trackId,
                    cta_label: label,
                    page_category: window.pageCategory || 'General',
                    page_path: window.location.pathname
                });
            }

            console.log(`GA4 Event: cta_click | Type: ${ctaType} | ID: ${trackId} | Page: ${window.location.pathname}`);
        });
    });

    // Track Form Submissions (Lead Capture)
    const forms = document.querySelectorAll('form[data-form-type]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const formType = this.getAttribute('data-form-type') || 'generic_lead';
            const formAction = this.getAttribute('action') || 'inline';

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'generate_lead',
                'form_type': formType,
                'form_action': formAction,
                'page_category': window.pageCategory || 'General',
                'page_path': window.location.pathname,
                'form_fields_count': this.elements.length
            });

            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    form_type: formType,
                    form_action: formAction,
                    page_category: window.pageCategory || 'General',
                    page_path: window.location.pathname
                });
            }

            console.log(`GA4 Event: generate_lead | Type: ${formType} | Page: ${window.location.pathname}`);
        });
    });

    // Track Scroll Depth (25%, 50%, 75%, 90%) — reduces bounce rate signal
    let scrollDepths = new Set();
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent >= 25 && !scrollDepths.has('25')) {
            scrollDepths.add('25');
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'scroll_depth',
                'depth': 25,
                'page_path': window.location.pathname
            });
            if (typeof gtag === 'function') {
                gtag('event', 'scroll_depth', { depth: 25, page_path: window.location.pathname });
            }
        }
        if (scrollPercent >= 50 && !scrollDepths.has('50')) {
            scrollDepths.add('50');
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'scroll_depth',
                'depth': 50,
                'page_path': window.location.pathname
            });
            if (typeof gtag === 'function') {
                gtag('event', 'scroll_depth', { depth: 50, page_path: window.location.pathname });
            }
        }
        if (scrollPercent >= 75 && !scrollDepths.has('75')) {
            scrollDepths.add('75');
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'scroll_depth',
                'depth': 75,
                'page_path': window.location.pathname
            });
        }
        if (scrollPercent >= 90 && !scrollDepths.has('90')) {
            scrollDepths.add('90');
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'scroll_depth',
                'depth': 90,
                'page_path': window.location.pathname
            });
        }
    }, { passive: true });

    // Track Time on Page (engaged session signal)
    let pageEngaged = false;
    const trackEngagement = () => {
        if (!pageEngaged && (window.scrollY > 100 || window.history.scrollRestoration)) {
            pageEngaged = true;
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'page_engagement',
                'engagement_type': 'scroll',
                'page_path': window.location.pathname
            });
        }
    };
    // Mark engaged after 10 seconds or on first scroll
    setTimeout(trackEngagement, 10000);
});
