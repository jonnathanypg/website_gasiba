/* ============================================================
   KindiCore AI - Advanced Interactive Script
   Includes: Neural Network Canvas & Global Particles
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();

    // Advanced Visuals
    initNeuralNetwork();
    initGlobalParticles();
    initVisionTimeline();
    initHybridImpact();
});


/* ============================================================
   NEURAL NETWORK ANIMATION (Canvas)
   ============================================================ */
function initNeuralNetwork() {
    const canvas = document.getElementById('neuralCanvas');
    const container = document.querySelector('.neural-wrapper');
    const centerText = document.getElementById('neuralCenterText');
    const cards = document.querySelectorAll('.service-card');

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    // Configuration
    const nodeCount = 5;
    const synapseCount = 15;
    let nodes = [];
    let synapses = [];
    let activeNodeIndex = 0;
    let autoPlayInterval;
    let time = 0;

    // Data with Icons (SVG Path, 24x24 viewbox) and Hook Labels
    const domainData = [
        {
            title: "Salud",
            subtitle: "Preventiva",
            label: "Bienestar", // Hook word
            color: "#6366f1",
            iconPath: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        },
        {
            title: "Nutrición",
            subtitle: "Inteligente",
            label: "Vitalidad",
            color: "#f43f5e",
            iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" // Lightning bolt
        },
        {
            title: "Desarrollo",
            subtitle: "Integral",
            label: "Futuro",
            color: "#10b981",
            iconPath: "M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"
        },
        {
            title: "Asistencia",
            subtitle: "Segura",
            label: "Protección",
            color: "#f59e0b",
            iconPath: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
        },
        {
            title: "Familia",
            subtitle: "Conectada",
            label: "Comunidad",
            color: "#8b5cf6",
            iconPath: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
        }
    ];

    function resize() {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
        initNodes();
    }
    window.addEventListener('resize', resize);
    resize(); // Initial call

    function initNodes() {
        nodes = [];
        synapses = [];
        const radius = width * 0.35;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < nodeCount; i++) {
            const angle = (i * 2 * Math.PI) / nodeCount - Math.PI / 2;
            nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                baseX: centerX + Math.cos(angle) * radius,
                baseY: centerY + Math.sin(angle) * radius,
                angle: angle,
                label: domainData[i].label, // Hook word
                color: domainData[i].color,
                iconPath: domainData[i].iconPath
            });
        }

        for (let i = 0; i < synapseCount; i++) {
            synapses.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        time += 0.01;

        const centerX = width / 2;
        const centerY = height / 2;

        // Draw Synapses
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        synapses.forEach(syn => {
            syn.x += syn.vx;
            syn.y += syn.vy;
            if (syn.x < 0 || syn.x > width) syn.vx *= -1;
            if (syn.y < 0 || syn.y > height) syn.vy *= -1;

            ctx.beginPath();
            ctx.arc(syn.x, syn.y, syn.size, 0, Math.PI * 2);
            ctx.fill();

            nodes.forEach(node => {
                const dx = node.x - syn.x;
                const dy = node.y - syn.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1000})`;
                    ctx.beginPath();
                    ctx.moveTo(syn.x, syn.y);
                    ctx.lineTo(node.x, node.y);
                    ctx.stroke();
                }
            });
        });

        // Draw Main Nodes
        nodes.forEach((node, idx) => {
            node.x = node.baseX + Math.cos(time + idx) * 10;
            node.y = node.baseY + Math.sin(time + idx) * 10;

            const isActive = idx === activeNodeIndex;
            const size = isActive ? 28 : 18;
            const glow = isActive ? 35 : 12;

            // Connection to center
            ctx.strokeStyle = isActive ? node.color : "rgba(255,255,255,0.08)";
            ctx.lineWidth = isActive ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(centerX, centerY);
            ctx.stroke();

            // Connection to next node
            const nextNode = nodes[(idx + 1) % nodes.length];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nextNode.x, nextNode.y);
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.stroke();

            // Node circle
            ctx.shadowBlur = glow;
            ctx.shadowColor = node.color;
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw Icon inside node
            if (node.iconPath) {
                ctx.save();
                ctx.translate(node.x, node.y);
                const scale = isActive ? 0.7 : 0.5;
                ctx.scale(scale, scale);
                ctx.translate(-12, -12); // Center 24x24 icon
                ctx.fillStyle = "white";
                try {
                    const icon = new Path2D(node.iconPath);
                    ctx.fill(icon);
                } catch (e) {
                    // Fallback if Path2D fails
                }
                ctx.restore();
            }

            // Hook Label below node - ONLY for active node
            if (isActive) {
                ctx.fillStyle = "white";
                ctx.font = "600 13px Outfit";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(node.label, node.x, node.y + size + 18);
            }
        });

        requestAnimationFrame(draw);
    }

    function setActive(index) {
        if (activeNodeIndex === index) return;
        activeNodeIndex = index;

        // Update Center Text
        const data = domainData[index];
        centerText.style.opacity = 0;
        centerText.style.transform = "scale(0.9)";

        setTimeout(() => {
            centerText.innerHTML = `<span class="center-title" style="color:${data.color}">${data.title}</span><span class="center-subtitle">${data.subtitle}</span>`;
            centerText.style.opacity = 1;
            centerText.style.transform = "scale(1)";
        }, 200);

        // Update Cards
        cards.forEach((card, idx) => {
            if (idx === index) {
                card.style.borderColor = data.color;
                card.style.background = `rgba(${hexToRgb(data.color)}, 0.15)`;
                card.style.transform = "translateX(10px)";
            } else {
                card.style.borderColor = "";
                card.style.background = "";
                card.style.transform = "";
            }
        });
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            setActive((activeNodeIndex + 1) % nodeCount);
        }, 3000);
    }

    // Canvas Mouse Interaction
    canvas.addEventListener('mousemove', (e) => {
        clearInterval(autoPlayInterval);
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        nodes.forEach((node, idx) => {
            const dist = Math.sqrt((mx - node.x) ** 2 + (my - node.y) ** 2);
            if (dist < 50) setActive(idx);
        });
    });

    canvas.addEventListener('mouseleave', startAutoPlay);

    // Card Click Interaction (Bidirectional)
    cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            setActive(idx);
            startAutoPlay();
        });
        card.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
            setActive(idx);
        });
        card.addEventListener('mouseleave', startAutoPlay);
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
    setActive(0);
    startAutoPlay();
}

/* ============================================================
   GLOBAL INTERACTIVE RIPPLE/WAVE EFFECT
   ============================================================ */
function initGlobalParticles() {
    let canvas = document.getElementById('globalCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'globalCanvas';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let ripples = [];
    let particles = [];
    let mouse = { x: -1000, y: -1000, active: false };
    let lastMousePos = { x: 0, y: 0 };
    let scrollY = 0;

    const colors = {
        primary: 'rgba(99, 102, 241, 0.5)',    // Indigo - more visible
        secondary: 'rgba(244, 63, 94, 0.4)',   // Rose - more visible
        light: 'rgba(99, 102, 241, 0.3)'       // For lighter effects
    };


    function resize() {
        width = window.innerWidth;
        height = window.innerHeight; // Viewport height for fixed position
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }


    function initParticles() {
        particles = [];
        const count = Math.floor(width * height / 50000);
        for (let i = 0; i < Math.min(count, 60); i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.15 + Math.random() * 0.1; // Very slow, consistent speed
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2.5 + 1,
                color: Math.random() > 0.5 ? colors.primary : colors.secondary
            });
        }
    }


    // Create ripple at position (viewport coordinates for fixed canvas)
    function createRipple(x, y) {
        ripples.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 150 + Math.random() * 100,
            opacity: 0.4,
            speed: 2 + Math.random() * 2,
            lineWidth: 2,
            color: Math.random() > 0.5 ? colors.primary : colors.secondary
        });
    }


    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw ripples (no scroll adjustment needed for fixed canvas)
        ripples = ripples.filter(ripple => {
            ripple.radius += ripple.speed;
            ripple.opacity *= 0.97;

            if (ripple.opacity < 0.01) return false;

            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.strokeStyle = ripple.color.replace('0.3', ripple.opacity.toString()).replace('0.25', ripple.opacity.toString());
            ctx.lineWidth = ripple.lineWidth * (1 - ripple.radius / ripple.maxRadius);
            ctx.stroke();

            // Inner glow ring
            if (ripple.radius < ripple.maxRadius * 0.5) {
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius * 0.6, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            return ripple.radius < ripple.maxRadius;
        });

        // Draw floating particles
        particles.forEach(p => {
            // Gentle floating
            p.x += p.vx;
            p.y += p.vy;

            // Wrap edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Mouse interaction - push particles away
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150 && mouse.active) {
                const angle = Math.atan2(dy, dx);
                const force = (150 - dist) / 150;
                p.x -= Math.cos(angle) * force * 3;
                p.y -= Math.sin(angle) * force * 3;
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Connect nearby particles
            particles.forEach(p2 => {
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (dist2 < 80 && dist2 > 0) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - dist2 / 1600})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        // Draw cursor trail/glow when moving
        if (mouse.active) {
            const gradient = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, 100
            );
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
            gradient.addColorStop(0.5, 'rgba(244, 63, 94, 0.08)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    // Event listeners
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;

        // Create ripples on significant movement
        const moveDistance = Math.sqrt(
            Math.pow(e.clientX - lastMousePos.x, 2) +
            Math.pow(e.clientY - lastMousePos.y, 2)
        );

        if (moveDistance > 50) {
            createRipple(e.clientX, e.clientY);
            lastMousePos = { x: e.clientX, y: e.clientY };
        }
    });

    window.addEventListener('mousedown', e => {
        createRipple(e.clientX, e.clientY);
        createRipple(e.clientX, e.clientY); // Double ripple for click
    });

    window.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        createRipple(touch.clientX, touch.clientY);
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    resize();
    draw();

    // Debounced resize on scroll (for height recalculation)
    let resizeTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (document.documentElement.scrollHeight !== height) {
                resize();
            }
        }, 200);
    });
}


/* ============================================================
   NAVBAR & UTILS
   ============================================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-link, .mobile-menu .nav-cta');

    if (!toggle || !menu) return;

    // Toggle menu on button click
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking links
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on scroll
    window.addEventListener('scroll', () => {
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}


function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animated');
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/* ============================================================
   VISION TIMELINE - Scroll Activated
   ============================================================ */
function initVisionTimeline() {
    const timeline = document.querySelector('.vision-timeline');
    if (!timeline) return;

    const nodes = timeline.querySelectorAll('.timeline-node');
    const cards = timeline.querySelectorAll('.vision-timeline-card');

    let currentActiveIndex = 0;
    let autoPlayInterval;

    function setActive(index) {
        // Update nodes
        nodes.forEach((node, i) => {
            if (i === index) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });

        // Update cards
        cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        currentActiveIndex = index;
    }

    // Scroll-based activation using IntersectionObserver
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.dataset.index);
                setActive(index);
            }
        });
    }, {
        threshold: 0.6,
        rootMargin: "-100px 0px -100px 0px"
    });

    cards.forEach(card => cardObserver.observe(card));

    // Auto-play animation when timeline is visible
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start auto-play
                autoPlayInterval = setInterval(() => {
                    const nextIndex = (currentActiveIndex + 1) % nodes.length;
                    setActive(nextIndex);
                }, 2500);
            } else {
                // Stop auto-play
                clearInterval(autoPlayInterval);
            }
        });
    }, { threshold: 0.3 });

    timelineObserver.observe(timeline);

    // Clickable nodes
    nodes.forEach((node, index) => {
        node.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            setActive(index);
        });
    });

    // Hover/click interaction on cards
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
            setActive(index);
        });

        card.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            setActive(index);
        });
    });

    // Initialize first node as active
    setActive(0);

}

/* ============================================================
   HYBRID IMPACT ANIMATION
   ============================================================ */
function initHybridImpact() {
    // Select ALL dashboard cards to ensure we find the one with stats
    const cards = document.querySelectorAll('.impact-dashboard-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find stats WITHIN this intersecting card
                const values = entry.target.querySelectorAll('.impact-stat');

                values.forEach(value => {
                    const targetStr = value.getAttribute('data-target');
                    if (!targetStr) return; // Skip if no target
                    const target = parseInt(targetStr);
                    let current = 0;

                    // Determine format
                    let suffix = "%";
                    let prefix = "";

                    // Custom formatting based on target value context
                    if (target === 80) prefix = "-";
                    if (target === 24) suffix = "/7";

                    const duration = 1500; // 1.5 seconds
                    const steps = 50;
                    const stepTime = duration / steps;
                    const increment = target / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }

                        // Format specifically for the 24/7 case to avoid decimals
                        let displayValue = Math.floor(current);
                        value.textContent = `${prefix}${displayValue}${suffix}`;
                    }, stepTime);
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 }); // Trigger sooner

    cards.forEach(card => observer.observe(card));
}
