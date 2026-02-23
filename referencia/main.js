/* ============================================
   BETATRONIC - Main JavaScript
   Hyper-Modern Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
    initParallaxOrbs();
});

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-badge, .section-title, .section-subtitle, ' +
        '.stat-card, .value-card, .service-card, .client-logo, ' +
        '.contact-card, .contact-form-container, .about-text, .clients-card'
    );

    // Add reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };

    // Initial check
    revealOnScroll();

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                revealOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ============================================
   SMOOTH SCROLLING
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   CONTACT FORM HANDLING
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = form.querySelector('.submit-button');
        const originalText = button.innerHTML;

        // Show loading state
        button.innerHTML = `
            <span>Enviando...</span>
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
            </svg>
        `;
        button.disabled = true;

        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success state
        button.innerHTML = `
            <span>¡Mensaje enviado!</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <path d="m9 11 3 3L22 4"/>
            </svg>
        `;
        button.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

        // Reset form
        form.reset();

        // Restore button after delay
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    });
}

/* ============================================
   PARALLAX FLOATING ORBS
   ============================================ */
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.orb');

    if (!orbs.length) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateOrbs() {
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.02;
        currentY += (mouseY - currentY) * 0.02;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 15;
            const x = currentX * speed;
            const y = currentY * speed;

            orb.style.transform = `translate(${x}px, ${y}px)`;
        });

        requestAnimationFrame(animateOrbs);
    }

    animateOrbs();
}

/* ============================================
   INTERSECTION OBSERVER FOR STAGGERED ANIMATIONS
   ============================================ */
function initStaggeredAnimations() {
    const staggerContainers = document.querySelectorAll('.values-grid, .services-grid, .clients-grid');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.children;
                Array.from(items).forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    staggerContainers.forEach(container => {
        observer.observe(container);
    });
}

/* ============================================
   CURSOR GLOW EFFECT (Optional Enhancement)
   ============================================ */
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(12, 172, 162, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
    `;
    document.body.appendChild(glow);

    let glowX = 0;
    let glowY = 0;
    let currentGlowX = 0;
    let currentGlowY = 0;

    document.addEventListener('mousemove', (e) => {
        glowX = e.clientX;
        glowY = e.clientY;
    });

    function animateGlow() {
        currentGlowX += (glowX - currentGlowX) * 0.1;
        currentGlowY += (glowY - currentGlowY) * 0.1;

        glow.style.left = currentGlowX + 'px';
        glow.style.top = currentGlowY + 'px';

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

// Initialize cursor glow on non-touch devices
if (!('ontouchstart' in window)) {
    initCursorGlow();
}

// Initialize staggered animations
initStaggeredAnimations();

/* ============================================
   TYPING EFFECT FOR HERO (Optional)
   ============================================ */
function initTypingEffect() {
    const text = document.querySelector('.gradient-text');
    if (!text) return;

    const originalText = text.textContent;
    text.textContent = '';

    let i = 0;
    function type() {
        if (i < originalText.length) {
            text.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }

    // Start typing after a delay
    setTimeout(type, 1000);
}

/* ============================================
   ADD CSS FOR SPINNER ANIMATION
   ============================================ */
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
    .spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .cursor-glow {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body:hover .cursor-glow {
        opacity: 1;
    }
`;
document.head.appendChild(spinnerStyles);
