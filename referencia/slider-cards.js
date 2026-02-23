/**
 * Card Stack Parallax Slider
 * Modern 3D layered cards effect
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        autoplay: true,
        autoplayInterval: 4500,
        slideCount: 10
    };

    // State per slider instance
    const sliderStates = new Map();

    /**
     * Initialize all card sliders on the page
     */
    function initCardsSlider() {
        const sections = document.querySelectorAll('.slider-cards-section');

        sections.forEach((section) => {
            const state = {
                currentIndex: 0,
                isPlaying: CONFIG.autoplay,
                autoplayTimer: null,
                slides: section.querySelectorAll('.slider-card'),
                thumbs: section.querySelectorAll('.thumb-item'),
                counterCurrent: section.querySelector('.slider-cards-counter .current'),
                counterTotal: section.querySelector('.slider-cards-counter .total')
            };

            sliderStates.set(section, state);

            setupSlides(section, state);
            setupNavigation(section, state);
            setupThumbnails(section, state);
            setupTouchEvents(section, state);
            setupKeyboardNav(section, state);
            setupAutoHide(section, state);

            updateSlides(section, state);

            if (state.isPlaying) {
                startAutoplay(section, state);
            }
        });
    }

    /**
     * Setup slide click handlers
     */
    function setupSlides(section, state) {
        state.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                if (!slide.classList.contains('active')) {
                    goToSlide(section, state, index);
                }
            });
        });
    }

    /**
     * Setup navigation buttons
     */
    function setupNavigation(section, state) {
        const prevBtn = section.querySelector('.slider-cards-nav.prev');
        const nextBtn = section.querySelector('.slider-cards-nav.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide(section, state);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide(section, state);
            });
        }
    }

    /**
     * Setup thumbnail click handlers
     */
    function setupThumbnails(section, state) {
        state.thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                goToSlide(section, state, index);
            });
        });
    }

    /**
     * Setup touch/swipe events
     */
    function setupTouchEvents(section, state) {
        const container = section.querySelector('.slider-cards-container');
        if (!container) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let isDragging = false;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isDragging = true;
            pauseAutoplay(state);
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            // Only swipe if horizontal movement is greater than vertical
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

        // Mouse drag support
        let mouseStartX = 0;
        let isMouseDragging = false;

        container.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            container.style.cursor = 'grabbing';
            pauseAutoplay(state);
        });

        document.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
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
                    toggleAutoplay(section, state);
                    break;
            }
        });
    }

    /**
     * Pause autoplay on hover
     */
    function setupAutoHide(section, state) {
        const wrapper = section.querySelector('.slider-cards-wrapper');
        if (!wrapper) return;

        wrapper.addEventListener('mouseenter', () => {
            pauseAutoplay(state);
        });

        wrapper.addEventListener('mouseleave', () => {
            if (state.isPlaying) {
                startAutoplay(section, state);
            }
        });
    }

    /**
     * Previous slide
     */
    function prevSlide(section, state) {
        state.currentIndex = (state.currentIndex - 1 + state.slides.length) % state.slides.length;
        updateSlides(section, state);
        resetAutoplay(section, state);
    }

    /**
     * Next slide
     */
    function nextSlide(section, state) {
        state.currentIndex = (state.currentIndex + 1) % state.slides.length;
        updateSlides(section, state);
        resetAutoplay(section, state);
    }

    /**
     * Go to specific slide
     */
    function goToSlide(section, state, index) {
        state.currentIndex = index;
        updateSlides(section, state);
        resetAutoplay(section, state);
    }

    /**
     * Update slide positions and states
     */
    function updateSlides(section, state) {
        const total = state.slides.length;

        state.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');

            let diff = index - state.currentIndex;

            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            if (diff === 0) {
                slide.classList.add('active');
            } else if (diff === -1) {
                slide.classList.add('prev');
            } else if (diff === 1) {
                slide.classList.add('next');
            } else if (diff === -2) {
                slide.classList.add('far-prev');
            } else if (diff === 2) {
                slide.classList.add('far-next');
            } else {
                slide.classList.add('hidden');
            }
        });

        // Update thumbnails
        state.thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === state.currentIndex);
        });

        // Update counter
        if (state.counterCurrent) {
            state.counterCurrent.textContent = String(state.currentIndex + 1).padStart(2, '0');
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

    function toggleAutoplay(section, state) {
        state.isPlaying = !state.isPlaying;
        if (state.isPlaying) {
            startAutoplay(section, state);
        } else {
            pauseAutoplay(state);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCardsSlider);
    } else {
        initCardsSlider();
    }

    // Global access
    window.initCardsSlider = initCardsSlider;

})();
