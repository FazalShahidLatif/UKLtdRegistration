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

// 5. Conversion Tracking Logic
document.addEventListener('DOMContentLoaded', () => {
    // Track clicks on elements with data-track attribute
    document.querySelectorAll('[data-track]').forEach(el => {
        el.addEventListener('click', () => {
            const trackId = el.getAttribute('data-track');
            const label = el.innerText.trim() || trackId;
            const ctaType = trackId.includes('whatsapp') ? 'WhatsApp Support' : 'Start Formation';
            
            // Push to GTM DataLayer
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'cta_click',
                'cta_type': ctaType,
                'cta_id': trackId,
                'cta_label': label,
                'page_category': window.pageCategory || 'General',
                'page_path': window.location.pathname
            });
            
            console.log(`GA4 Event: cta_click | Type: ${ctaType} | Category: ${window.pageCategory}`);
        });
    });

    // Track Form Submissions (Lead Capture)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            const formType = form.getAttribute('data-form-type') || 'generic_lead';
            
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'generate_lead',
                'form_type': formType,
                'page_category': window.pageCategory || 'General',
                'page_path': window.location.pathname
            });
            
            console.log(`GA4 Event: generate_lead | Type: ${formType} | Category: ${window.pageCategory}`);
        });
    });
});
