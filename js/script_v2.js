/* ============================================================
   FUNDACIÓN GASIBA GI - SCRIPT V2
   Lógica del Carrusel 3D y Efectos de Scroll de las referencias
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Scroll Animations (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .stagger-children');

    if (animatedElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optional: observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // 2. Parallax Hero Effect
    const parallaxElements = document.querySelectorAll('.hero-bg-image-v2');
    if (parallaxElements.length) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(element => {
                const rate = 0.3;
                element.style.transform = `translateY(${scrolled * rate}px)`;
            });
        });
    }

    // 3. Slider 3D Initialization
    initSlider3D();

    // 4. Cursor Glow Effect in Dark Sections
    initCursorGlow();
});

/* ============================================================
   CURSOR GLOW LOGIC
   ============================================================ */
function initCursorGlow() {
    const darkSections = document.querySelectorAll('.section-dark');

    darkSections.forEach(section => {
        // Create the glow element
        const glow = document.createElement('div');
        glow.classList.add('cursor-glow');

        // Add to the top of the section (background)
        if (section.firstChild) {
            section.insertBefore(glow, section.firstChild);
        } else {
            section.appendChild(glow);
        }

        // Track cursor only when inside the section
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Use requestAnimationFrame for smoother performance
            requestAnimationFrame(() => {
                glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            });
        });
    });
}

/* ============================================================
   3D CAROUSEL LOGIC
   ============================================================ */
function initSlider3D() {
    const sliders = document.querySelectorAll('.slider3d-section');

    sliders.forEach(section => {
        const carousel = section.querySelector('.slider3d-carousel');
        const slides = carousel.querySelectorAll('.slider3d-slide');
        if (!slides.length) return;

        const slideCount = slides.length;
        const anglePerSlide = 360 / slideCount;

        // Translate Z distance formula for standard 3D carousel
        const tz = Math.round((280 / 2) / Math.tan(Math.PI / slideCount));
        // Add a bit more space
        const translateZ = tz + 50;

        // Initial setup of slides
        slides.forEach((slide, index) => {
            slide.style.transform = `rotateY(${index * anglePerSlide}deg) translateZ(${translateZ}px)`;
        });

        // State variables
        let currentIndex = 0;
        let currentAngle = 0;
        let timer = null;

        // Visual update function
        function updateSlider() {
            carousel.style.transform = `rotateY(${currentAngle}deg)`;

            // Calculate actual active slide
            // When angle goes negative, index moves forward.
            // Normalize angle to [0, 360)
            let normalizedAngle = currentAngle % 360;
            if (normalizedAngle > 0) normalizedAngle -= 360;

            // Map angle back to index
            let activeIdx = Math.round(Math.abs(normalizedAngle) / anglePerSlide) % slideCount;

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === activeIdx);
            });
        }

        // Navigation functions
        function rotateNext() {
            currentAngle -= anglePerSlide;
            updateSlider();
        }

        function rotatePrev() {
            currentAngle += anglePerSlide;
            updateSlider();
        }

        // Event listeners
        const nextBtn = section.querySelector('.slider3d-nav.next');
        const prevBtn = section.querySelector('.slider3d-nav.prev');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                rotateNext();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                rotatePrev();
                resetAutoplay();
            });
        }

        // Autoplay
        function startAutoplay() {
            timer = setInterval(() => {
                rotateNext();
            }, 3500);
        }

        function resetAutoplay() {
            clearInterval(timer);
            startAutoplay();
        }

        // Hover pause
        carousel.addEventListener('mouseenter', () => clearInterval(timer));
        carousel.addEventListener('mouseleave', startAutoplay);

        // Initial launch
        updateSlider();
        startAutoplay();
    });
}
