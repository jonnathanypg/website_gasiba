/**
 * BETATRONIC - Main JavaScript
 * Handles navigation, animations, and interactions
 */

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initAccordion();
});

/**
 * Navbar scroll behavior
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('active');

            // Toggle icon animation
            if (menu.classList.contains('active')) {
                toggle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
            } else {
                toggle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="4" x2="20" y1="12" y2="12"></line>
                        <line x1="4" x2="20" y1="6" y2="6"></line>
                        <line x1="4" x2="20" y1="18" y2="18"></line>
                    </svg>
                `;
            }
        });
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.getElementById('mobileToggle');

    if (menu) {
        menu.classList.remove('active');
        toggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
        `;
    }
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        closeMobileMenu();
    }
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation class
    const animatedElements = document.querySelectorAll('.glass-card, .value-card, .client-card, .stat-card');
    animatedElements.forEach(function (el) {
        // Add initial hidden state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-slide-up {
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Accordion functionality for services
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(function (item) {
        // Set initial state for items that are open
        if (item.classList.contains('open')) {
            const content = item.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
            }
        }
    });
}

/**
 * Toggle accordion item
 */
function toggleAccordion(button) {
    const item = button.closest('.accordion-item');
    const content = item.querySelector('.accordion-content');
    const allItems = document.querySelectorAll('.accordion-item');

    // Close other items (optional: remove this block for multi-open)
    allItems.forEach(function (otherItem) {
        if (otherItem !== item && otherItem.classList.contains('open')) {
            otherItem.classList.remove('open');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherContent) {
                otherContent.style.maxHeight = '0';
                otherContent.style.opacity = '0';
            }
        }
    });

    // Toggle current item
    if (item.classList.contains('open')) {
        item.classList.remove('open');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
    } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
    }
}

/**
 * Handle contact form submission
 */
function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = {};

    formData.forEach(function (value, key) {
        data[key] = value;
    });

    // Show success message
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');

    // Reset form
    form.reset();

    // Here you can add AJAX submission to your backend
    console.log('Form data:', data);
}

/**
 * Parallax effect for hero section (optional)
 */
window.addEventListener('scroll', function () {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const scrolled = window.pageYOffset;
        const heroBg = heroSection.querySelector('.hero-bg');

        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
});

/**
 * Add staggered animation delays to grid items
 */
document.addEventListener('DOMContentLoaded', function () {
    const grids = document.querySelectorAll('.values-grid, .clients-grid');

    grids.forEach(function (grid) {
        const items = grid.querySelectorAll('.glass-card');
        items.forEach(function (item, index) {
            item.style.animationDelay = `${index * 100}ms`;
        });
    });
});
