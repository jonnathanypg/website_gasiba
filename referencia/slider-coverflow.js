/**
 * Coverflow Photo Slider
 * Modern, elegant slider with depth effect
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        autoplay: true,
        autoplayInterval: 5000, // 5 seconds
        slideCount: 10
    };

    // State per slider instance
    const sliderStates = new Map();

    /**
     * Initialize all coverflow sliders on the page
     */
    function initCoverflowSlider() {
        const sections = document.querySelectorAll('.slider-coverflow-section');

        sections.forEach((section, index) => {
            const state = {
                currentIndex: 0,
                isPlaying: CONFIG.autoplay,
                autoplayTimer: null,
                slides: section.querySelectorAll('.slider-coverflow-slide'),
                progressFill: section.querySelector('.progress-fill'),
                counter: section.querySelector('.progress-counter'),
                playBtn: section.querySelector('.control-btn.play'),
                pauseBtn: section.querySelector('.control-btn.pause')
            };

            sliderStates.set(section, state);

            setupSlides(section, state);
            setupNavigation(section, state);
            setupControls(section, state);
            setupTouchEvents(section, state);
            setupKeyboardNavigation(section, state);

            updateSlides(section, state);

            if (state.isPlaying) {
                startAutoplay(section, state);
            }
        });
    }

    /**
     * Setup initial slide click handlers
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
        const prevBtn = section.querySelector('.slider-coverflow-nav.prev');
        const nextBtn = section.querySelector('.slider-coverflow-nav.next');

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
     * Setup play/pause controls
     */
    function setupControls(section, state) {
        if (state.playBtn) {
            state.playBtn.addEventListener('click', () => {
                if (!state.isPlaying) {
                    state.isPlaying = true;
                    startAutoplay(section, state);
                    updateControlButtons(state);
                }
            });
        }

        if (state.pauseBtn) {
            state.pauseBtn.addEventListener('click', () => {
                if (state.isPlaying) {
                    state.isPlaying = false;
                    stopAutoplay(state);
                    updateControlButtons(state);
                }
            });
        }
    }

    /**
     * Update control button states
     */
    function updateControlButtons(state) {
        if (state.playBtn) {
            state.playBtn.classList.toggle('active', state.isPlaying);
        }
        if (state.pauseBtn) {
            state.pauseBtn.classList.toggle('active', !state.isPlaying);
        }
    }

    /**
     * Setup touch events for mobile swiping
     */
    function setupTouchEvents(section, state) {
        const container = section.querySelector('.slider-coverflow-container');
        if (!container) return;

        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay(state);
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    prevSlide(section, state);
                } else {
                    nextSlide(section, state);
                }
            }

            if (state.isPlaying) {
                startAutoplay(section, state);
            }
        }, { passive: true });
    }

    /**
     * Setup keyboard navigation
     */
    function setupKeyboardNavigation(section, state) {
        section.setAttribute('tabindex', '0');

        section.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide(section, state);
            } else if (e.key === 'ArrowRight') {
                nextSlide(section, state);
            } else if (e.key === ' ') {
                e.preventDefault();
                state.isPlaying = !state.isPlaying;
                if (state.isPlaying) {
                    startAutoplay(section, state);
                } else {
                    stopAutoplay(state);
                }
                updateControlButtons(state);
            }
        });
    }

    /**
     * Go to previous slide
     */
    function prevSlide(section, state) {
        state.currentIndex = (state.currentIndex - 1 + state.slides.length) % state.slides.length;
        updateSlides(section, state);
        resetAutoplayTimer(section, state);
    }

    /**
     * Go to next slide
     */
    function nextSlide(section, state) {
        state.currentIndex = (state.currentIndex + 1) % state.slides.length;
        updateSlides(section, state);
        resetAutoplayTimer(section, state);
    }

    /**
     * Go to specific slide
     */
    function goToSlide(section, state, index) {
        state.currentIndex = index;
        updateSlides(section, state);
        resetAutoplayTimer(section, state);
    }

    /**
     * Update slide positions and classes
     */
    function updateSlides(section, state) {
        const total = state.slides.length;

        state.slides.forEach((slide, index) => {
            // Remove all state classes
            slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');

            // Calculate relative position
            let diff = index - state.currentIndex;

            // Handle wrapping for circular navigation
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            // Apply appropriate class based on position
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

        // Update progress
        updateProgress(state);
    }

    /**
     * Update progress bar and counter
     */
    function updateProgress(state) {
        const progress = ((state.currentIndex + 1) / state.slides.length) * 100;

        if (state.progressFill) {
            state.progressFill.style.width = progress + '%';
        }

        if (state.counter) {
            state.counter.innerHTML = `<span class="current">${String(state.currentIndex + 1).padStart(2, '0')}</span> / ${String(state.slides.length).padStart(2, '0')}`;
        }
    }

    /**
     * Start autoplay
     */
    function startAutoplay(section, state) {
        stopAutoplay(state);
        state.autoplayTimer = setInterval(() => {
            nextSlide(section, state);
        }, CONFIG.autoplayInterval);
    }

    /**
     * Stop autoplay
     */
    function stopAutoplay(state) {
        if (state.autoplayTimer) {
            clearInterval(state.autoplayTimer);
            state.autoplayTimer = null;
        }
    }

    /**
     * Reset autoplay timer
     */
    function resetAutoplayTimer(section, state) {
        if (state.isPlaying) {
            stopAutoplay(state);
            startAutoplay(section, state);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCoverflowSlider);
    } else {
        initCoverflowSlider();
    }

    // Expose init function globally
    window.initCoverflowSlider = initCoverflowSlider;

})();
