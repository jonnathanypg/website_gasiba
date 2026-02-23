/* ============================================
   BETATRONIC - Version 3 JavaScript
   Extracted from betatronic-website.jsx
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollEffects();
    initContactForm();
    initScrollReveal();
});

/* ============================================
   NAVIGATION
   ============================================ */
let activeSection = 'inicio';

function initNavigation() {
    // Desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const section = link.dataset.section;
            scrollToSection(section);
        });
    });

    // Mobile nav links
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            const section = link.dataset.section;
            scrollToSection(section);
            closeMobileMenu();
        });
    });

    // Update active section on scroll
    window.addEventListener('scroll', updateActiveSection);
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
    }
}

function setActiveSection(id) {
    activeSection = id;

    // Update desktop nav
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.section === id) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function updateActiveSection() {
    const sections = ['inicio', 'nosotros', 'servicios', 'clientes', 'contacto'];
    const scrollPos = window.scrollY + 200;

    for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;

            if (scrollPos >= top && scrollPos < top + height) {
                if (activeSection !== sectionId) {
                    setActiveSection(sectionId);
                }
                break;
            }
        }
    }
}

// Expose to global scope for onclick handlers
window.scrollToSection = scrollToSection;

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');

    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            document.getElementById('mobileMenu').classList.toggle('active');
        });
    }
}

function closeMobileMenu() {
    document.getElementById('mobileToggle')?.classList.remove('active');
    document.getElementById('mobileMenu')?.classList.remove('active');
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function initScrollEffects() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const navbar = document.getElementById('navbar');

        // Add/remove scrolled class for navbar styling
        if (currentScroll > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = form.querySelector('.submit-button');
        const originalText = button.textContent;

        // Show loading state
        button.textContent = 'Enviando...';
        button.disabled = true;

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success state
        button.textContent = '¡Mensaje enviado!';
        button.style.background = 'linear-gradient(135deg, #10B981, #059669)';

        // Reset form
        form.reset();

        // Restore button after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections for reveal
    document.querySelectorAll('.perspective-card, .stats-card, .contact-card, .clients-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add revealed styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   STAGGERED REVEAL FOR GRIDS
   ============================================ */
function initStaggeredReveal() {
    const grids = document.querySelectorAll('.values-grid, .services-grid, .clients-grid');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.children;
                Array.from(items).forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    grids.forEach(grid => {
        Array.from(grid.children).forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        observer.observe(grid);
    });
}

// Initialize staggered reveal
initStaggeredReveal();

/* ============================================
   PARALLAX EFFECT FOR ORBS
   ============================================ */
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.bg-orb');

    if (!orbs.length) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            const yOffset = scrollY * speed;
            orb.style.transform = `translateY(${yOffset}px)`;
        });
    });
}

initParallaxOrbs();

/* ============================================
   MOUSE MOVE EFFECT FOR CARDS
   ============================================ */
function initCardMouseEffect() {
    document.querySelectorAll('.perspective-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            const inner = card.querySelector('.card-inner');
            if (inner) {
                inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.card-inner');
            if (inner) {
                inner.style.transform = 'rotateX(0) rotateY(0)';
            }
        });
    });
}

initCardMouseEffect();

/* ============================================
   TYPING EFFECT (Optional Enhancement)
   ============================================ */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/* ============================================
   ADDITIONAL NAVBAR STYLES ON SCROLL
   ============================================ */
const scrolledNavStyles = document.createElement('style');
scrolledNavStyles.textContent = `
    .navbar.scrolled {
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }
`;
document.head.appendChild(scrolledNavStyles);
