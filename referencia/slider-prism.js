/**
 * Prism 3D Slider
 * Futuristic cube rotation effect
 */

(function () {
    'use strict';

    const CONFIG = {
        autoplay: true,
        autoplayInterval: 5000,
        slideCount: 10
    };

    const sliderStates = new Map();

    /**
     * Initialize all prism sliders
     */
    function initPrismSlider() {
        const sections = document.querySelectorAll('.slider-prism-section');

        sections.forEach((section) => {
            const state = {
                currentIndex: 0,
                isPlaying: CONFIG.autoplay,
                autoplayTimer: null,
                slides: section.querySelectorAll('.prism-face'),
                indicators: section.querySelectorAll('.indicator-line'),
                counterCurrent: section.querySelector('.info-counter .current'),
                infoTitle: section.querySelector('.info-title'),
                titles: []
            };

            // Store titles for info display
            state.slides.forEach(slide => {
                const h3 = slide.querySelector('.face-content h3');
                state.titles.push(h3 ? h3.textContent : '');
            });

            sliderStates.set(section, state);

            setupSlideClicks(section, state);
            setupNavigation(section, state);
            setupIndicators(section, state);
            setupTouchEvents(section, state);
            setupKeyboardNav(section, state);
            setupHoverPause(section, state);

            updateSlides(section, state);

            if (state.isPlaying) {
                startAutoplay(section, state);
            }
        });
    }

    /**
     * Setup slide click handlers
     */
    function setupSlideClicks(section, state) {
        state.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                if (!slide.classList.contains('active')) {
                    goToSlide(section, state, index);
                }
            });
        });
    }

    /**
     * Setup navigation
     */
    function setupNavigation(section, state) {
        const prevBtn = section.querySelector('.slider-prism-nav.prev');
        const nextBtn = section.querySelector('.slider-prism-nav.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => prevSlide(section, state));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => nextSlide(section, state));
        }
    }

    /**
     * Setup indicator clicks
     */
    function setupIndicators(section, state) {
        state.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(section, state, index);
            });
        });
    }

    /**
     * Setup touch events
     */
    function setupTouchEvents(section, state) {
        const container = section.querySelector('.slider-prism-container');
        if (!container) return;

        let touchStartX = 0;
        let touchStartY = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            pauseAutoplay(state);
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    prevSlide(section, state);
                } else {
                    nextSlide(section, state);
                }
            }

            if (state.isPlaying) {
                startAutoplay(section, state);
            }
        }, { passive: true });

        // Mouse drag
        let mouseStartX = 0;
        let isDragging = false;

        container.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isDragging = true;
            container.style.cursor = 'grabbing';
            pauseAutoplay(state);
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            container.style.cursor = 'grab';

            const diffX = e.clientX - mouseStartX;
            if (Math.abs(diffX) > 60) {
                if (diffX > 0) {
                    prevSlide(section, state);
                } else {
                    nextSlide(section, state);
                }
            }

            if (state.isPlaying) {
                startAutoplay(section, state);
            }
        });

        container.style.cursor = 'grab';
    }

    /**
     * Setup keyboard navigation
     */
    function setupKeyboardNav(section, state) {
        section.setAttribute('tabindex', '0');

        section.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide(section, state);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide(section, state);
                    break;
                case ' ':
                    e.preventDefault();
                    state.isPlaying = !state.isPlaying;
                    if (state.isPlaying) {
                        startAutoplay(section, state);
                    } else {
                        pauseAutoplay(state);
                    }
                    break;
            }
        });
    }

    /**
     * Pause on hover
     */
    function setupHoverPause(section, state) {
        const wrapper = section.querySelector('.slider-prism-wrapper');
        if (!wrapper) return;

        wrapper.addEventListener('mouseenter', () => pauseAutoplay(state));
        wrapper.addEventListener('mouseleave', () => {
            if (state.isPlaying) startAutoplay(section, state);
        });
    }

    /**
     * Navigation functions
     */
    function prevSlide(section, state) {
        state.currentIndex = (state.currentIndex - 1 + state.slides.length) % state.slides.length;
        updateSlides(section, state);
        resetAutoplay(section, state);
    }

    function nextSlide(section, state) {
        state.currentIndex = (state.currentIndex + 1) % state.slides.length;
        updateSlides(section, state);
        resetAutoplay(section, state);
    }

    function goToSlide(section, state, index) {
        state.currentIndex = index;
        updateSlides(section, state);
        resetAutoplay(section, state);
    }

    /**
     * Update slide positions
     */
    function updateSlides(section, state) {
        const total = state.slides.length;

        state.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'left-1', 'right-1', 'left-2', 'right-2', 'hidden');

            let diff = index - state.currentIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            if (diff === 0) {
                slide.classList.add('active');
            } else if (diff === -1) {
                slide.classList.add('left-1');
            } else if (diff === 1) {
                slide.classList.add('right-1');
            } else if (diff === -2) {
                slide.classList.add('left-2');
            } else if (diff === 2) {
                slide.classList.add('right-2');
            } else {
                slide.classList.add('hidden');
            }
        });

        // Update indicators
        state.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === state.currentIndex);
        });

        // Update counter
        if (state.counterCurrent) {
            state.counterCurrent.textContent = String(state.currentIndex + 1).padStart(2, '0');
        }

        // Update info title
        if (state.infoTitle && state.titles[state.currentIndex]) {
            state.infoTitle.textContent = state.titles[state.currentIndex];
        }
    }

    /**
     * Autoplay controls
     */
    function startAutoplay(section, state) {
        pauseAutoplay(state);
        state.autoplayTimer = setInterval(() => {
            nextSlide(section, state);
        }, CONFIG.autoplayInterval);
    }

    function pauseAutoplay(state) {
        if (state.autoplayTimer) {
            clearInterval(state.autoplayTimer);
            state.autoplayTimer = null;
        }
    }

    function resetAutoplay(section, state) {
        if (state.isPlaying) {
            pauseAutoplay(state);
            startAutoplay(section, state);
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPrismSlider);
    } else {
        initPrismSlider();
    }

    window.initPrismSlider = initPrismSlider;

})();
