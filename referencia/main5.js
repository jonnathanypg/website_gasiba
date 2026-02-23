/* ============================================================
   BETATRONIC - Index5 JavaScript
   Animations, Circle Animation, Scroll Effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initServiceCircle();
    initCounterAnimation();
});

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"], button[data-section]').forEach(element => {
        element.addEventListener('click', function (e) {
            let targetId;

            if (this.hasAttribute('data-section')) {
                targetId = this.getAttribute('data-section');
            } else {
                targetId = this.getAttribute('href').substring(1);
            }

            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Global function for onclick handlers
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

/* ============================================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* ============================================================
   SERVICE CIRCLE ANIMATION WITH DYNAMIC TEXT
   ============================================================ */
function initServiceCircle() {
    const nodes = document.querySelectorAll('.service-node');
    const cards = document.querySelectorAll('.service-card');
    const centerText = document.getElementById('circleCenterText');

    if (!nodes.length) return;

    let currentIndex = 0;
    const totalNodes = nodes.length;
    let autoPlayInterval;

    // Update center text and sync card
    function updateActiveState(index) {
        // Remove all active states
        nodes.forEach(n => n.classList.remove('active'));
        cards.forEach(c => c.classList.remove('active'));

        // Add active to current node
        const activeNode = nodes[index];
        activeNode.classList.add('active');

        // Add active to corresponding card
        if (cards[index]) {
            cards[index].classList.add('active');
        }

        // Update center text
        if (centerText && activeNode) {
            const title = activeNode.getAttribute('data-title') || 'Protección';
            const subtitle = activeNode.getAttribute('data-subtitle') || 'Integral';

            // Fade out, change, fade in
            centerText.style.opacity = '0';
            setTimeout(() => {
                centerText.innerHTML = `
                    <span class="center-title">${title}</span>
                    <span class="center-subtitle">${subtitle}</span>
                `;
                centerText.style.opacity = '1';
            }, 150);
        }

        currentIndex = index;
    }

    // Initial state
    updateActiveState(0);

    // Start auto-cycling
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % totalNodes;
            updateActiveState(nextIndex);
        }, 3000);
    }

    // Pause on hover
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    startAutoPlay();

    // Add hover interaction to nodes
    nodes.forEach((node, index) => {
        node.addEventListener('mouseenter', () => {
            stopAutoPlay();
            updateActiveState(index);
        });

        node.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    });

    // Add hover interaction to cards
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            stopAutoPlay();
            updateActiveState(index);
        });

        card.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    });
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ============================================================
   FORM HANDLING
   ============================================================ */
function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const button = form.querySelector('.submit-btn');
    const originalText = button.innerHTML;

    // Show loading state
    button.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" opacity="0.25"/>
            <path d="M12 2a10 10 0 0110 10" stroke-linecap="round"/>
        </svg>
        Enviando...
    `;
    button.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            ¡Mensaje enviado!
        `;
        button.style.background = '#10b981';

        // Reset form
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = '';
        }, 3000);
    }, 1500);
}

/* ============================================================
   PARALLAX EFFECT FOR BACKGROUND IMAGES
   ============================================================ */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-bg-image');

    if (!parallaxElements.length) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const rate = 0.3;
            element.style.transform = `translateY(${scrolled * rate}px)`;
        });
    });
}

/* ============================================================
   UTILITY: Add CSS Class for Spin Animation
   ============================================================ */
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
