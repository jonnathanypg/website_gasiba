/**
 * 3D Photo Carousel Slider - Improved
 * JS-driven rotation for synchronized dots and active labels
 * Infinite loop implementation (no rewind)
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        autoRotate: true,
        rotationInterval: 4000, // Time per slide in ms
        slideCount: 10,
        anglePerSlide: 36 // 360 / 10 slides
    };

    // State
    const sliderStates = new Map();

    /**
     * Initialize all 3D sliders on the page
     */
    function initSlider3D() {
        const sections = document.querySelectorAll('.slider3d-section');

        sections.forEach(section => {
            const slider = section.querySelector('.slider3d-wrapper');
            if (!slider) return;

            // Initialize state
            const state = {
                currentIndex: 0,
                currentAngle: 0,
                timer: null,
                isPlaying: CONFIG.autoRotate
            };
            sliderStates.set(slider, state);

            setupNavigation(slider, section, state);
            setupDots(slider, section, state);
            setupTouchEvents(slider, section, state);
            setupHoverPause(slider, state);
            setupSlideClicks(slider, section, state);

            // Initial render
            updateSlider(slider, section, state);

            // Start Auto Rotation
            if (state.isPlaying) {
                startAutoRotation(slider, section, state);
            }
        });
    }

    /**
     * Navigation setup
     */
    function setupNavigation(slider, section, state) {
        const prevBtn = slider.querySelector('.slider3d-nav.prev');
        const nextBtn = slider.querySelector('.slider3d-nav.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                rotate(slider, section, state, 'prev');
                resetAutoRotation(slider, section, state);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                rotate(slider, section, state, 'next');
                resetAutoRotation(slider, section, state);
            });
        }
    }

    /**
     * Dots setup
     */
    function setupDots(slider, section, state) {
        const dots = section.querySelectorAll('.slider3d-dot');

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(slider, section, state, index);
                resetAutoRotation(slider, section, state);
            });
        });
    }

    /**
     * Rotate slider (cumulative)
     */
    function rotate(slider, section, state, direction) {
        if (direction === 'next') {
            state.currentIndex = (state.currentIndex + 1) % CONFIG.slideCount;
            state.currentAngle -= CONFIG.anglePerSlide;
        } else {
            state.currentIndex = (state.currentIndex - 1 + CONFIG.slideCount) % CONFIG.slideCount;
            state.currentAngle += CONFIG.anglePerSlide;
        }
        updateSlider(slider, section, state);
    }

    /**
     * Go to specific slide (smart shortest path)
     */
    function goToSlide(slider, section, state, targetIndex) {
        if (targetIndex === state.currentIndex) return;

        // Determine distance
        let diff = targetIndex - state.currentIndex;

        // Optimize path (shortest way around circle)
        if (diff > CONFIG.slideCount / 2) diff -= CONFIG.slideCount;
        if (diff < -CONFIG.slideCount / 2) diff += CONFIG.slideCount;

        // Update state
        state.currentIndex = targetIndex;
        // Negative angle for forward (next) rotation, Positive for backward (prev)
        state.currentAngle -= (diff * CONFIG.anglePerSlide);

        updateSlider(slider, section, state);
    }

    // Helper removed as it's no longer needed for logic, but index calculation is now direct

    /**
     * Update slider visual state
     */
    function updateSlider(slider, section, state) {
        const carousel = slider.querySelector('.slider3d-carousel');
        const dots = section.querySelectorAll('.slider3d-dot');
        const slides = carousel.querySelectorAll('.slider3d-slide');

        // Apply rotation
        // Ensure angle snaps to perfect multiples if needed, but cumulative is smoother for infinite
        carousel.style.transform = `rotateY(${state.currentAngle}deg)`;

        // Update Dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === state.currentIndex);
        });

        // Update Slides (Active Class for Labels)
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === state.currentIndex);
        });
    }

    /**
     * Click on invisible zones for side navigation
     */
    function setupSlideClicks(slider, section, state) {
        const leftZone = slider.querySelector('.slider3d-click-zone.left');
        const rightZone = slider.querySelector('.slider3d-click-zone.right');

        if (leftZone) {
            leftZone.addEventListener('click', () => {
                rotate(slider, section, state, 'prev');
                resetAutoRotation(slider, section, state);
            });
        }

        if (rightZone) {
            rightZone.addEventListener('click', () => {
                rotate(slider, section, state, 'next');
                resetAutoRotation(slider, section, state);
            });
        }
    }

    /**
     * Auto Rotation Control
     */
    function startAutoRotation(slider, section, state) {
        if (state.timer) clearInterval(state.timer);
        state.timer = setInterval(() => {
            rotate(slider, section, state, 'next');
        }, CONFIG.rotationInterval);
    }

    function stopAutoRotation(state) {
        if (state.timer) {
            clearInterval(state.timer);
            state.timer = null;
        }
    }

    function resetAutoRotation(slider, section, state) {
        stopAutoRotation(state);
        if (state.isPlaying) {
            startAutoRotation(slider, section, state);
        }
    }

    /**
     * Hover Pause
     */
    function setupHoverPause(slider, state) {
        slider.addEventListener('mouseenter', () => stopAutoRotation(state));
        slider.addEventListener('mouseleave', () => {
            if (state.isPlaying) {
                const section = slider.closest('.slider3d-section');
                startAutoRotation(slider, section, state);
            }
        });
    }

    /**
     * Touch Events
     */
    function setupTouchEvents(slider, section, state) {
        const container = slider.querySelector('.slider3d-container');
        let touchStartX = 0;
        let mouseStartX = 0;
        let isMouseDown = false;
        let hasDragged = false; // Track if actual drag movement occurred

        // Touch
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoRotation(state);
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    rotate(slider, section, state, 'prev');
                } else {
                    rotate(slider, section, state, 'next');
                }
            }
            if (state.isPlaying) startAutoRotation(slider, section, state);
        }, { passive: true });

        // Mouse Drag - Track if actual drag occurred
        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            hasDragged = false;
            mouseStartX = e.clientX;
            stopAutoRotation(state);
            container.style.cursor = 'grabbing';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            // If mouse moved more than 10px, consider it a drag
            if (Math.abs(e.clientX - mouseStartX) > 10) {
                hasDragged = true;
            }
        });

        // Prevent native image dragging
        container.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        document.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            isMouseDown = false;
            container.style.cursor = 'grab';

            // Only process as drag if actual drag movement occurred
            if (hasDragged) {
                const diff = e.clientX - mouseStartX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        rotate(slider, section, state, 'prev');
                    } else {
                        rotate(slider, section, state, 'next');
                    }
                }
            }
            // If hasDragged is false, the click event on the carousel will handle navigation

            if (state.isPlaying) startAutoRotation(slider, section, state);
        });
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider3D);
    } else {
        initSlider3D();
    }
})();
