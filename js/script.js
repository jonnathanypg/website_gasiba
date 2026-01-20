// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');

mobileMenuBtn.addEventListener('click', () => {
 nav.classList.toggle('active');
 const icon = mobileMenuBtn.querySelector('i');
 icon.classList.toggle('fa-bars');
 icon.classList.toggle('fa-times');
});

// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
 if (window.scrollY > 50) { // Reduced scroll distance
 header.classList.add('scrolled');
 } else {
 header.classList.remove('scrolled');
 }
});

// Active Link Highlighting
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
 let current = '';
 sections.forEach(section => {
 const sectionTop = section.offsetTop;
 const sectionHeight = section.clientHeight;
 if (scrollY >= sectionTop - 200) {
 current = section.getAttribute('id');
 }
 });

 navLinks.forEach(link => {
 link.classList.remove('active');
 if (link.getAttribute('href') === `#${current}`) {
 link.classList.add('active');
 }
 });
});

// Smooth Scrolling
navLinks.forEach(link => {
 link.addEventListener('click', (e) => {
 e.preventDefault();
 const targetId = link.getAttribute('href');
 const targetSection = document.querySelector(targetId);
 if (targetSection) {
 targetSection.scrollIntoView({
 behavior: 'smooth',
 block: 'start'
 });
 nav.classList.remove('active');
 mobileMenuBtn.querySelector('i').classList.add('fa-bars');
 mobileMenuBtn.querySelector('i').classList.remove('fa-times');
 }
 });
});

// Counter Animation
const counters = document.querySelectorAll('.stat-number');
const speed = 200;

const animateCounter = (counter) => {
 const target = parseInt(counter.getAttribute('data-target'));
 const updateCount = () => {
 const count = parseInt(counter.innerText);
 const inc = target / speed;
 if (count < target) {
 counter.innerText = Math.ceil(count + inc);
 setTimeout(updateCount, 15);
 } else {
 counter.innerText = target.toLocaleString();
 }
 };
 updateCount();
};

const counterObserver = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 const counter = entry.target;
 animateCounter(counter);
 counterObserver.unobserve(counter);
 }
 });
}, { threshold: 0.8 });

counters.forEach(counter => {
 counter.innerText = '0';
 counterObserver.observe(counter);
});

// Project Slider
const projectsTrack = document.getElementById('projectsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;
const totalSlides = 3;

const updateSlider = () => {
 projectsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
 sliderDots.forEach((dot, index) => {
 dot.classList.toggle('active', index === currentSlide);
 });
};

prevBtn.addEventListener('click', () => {
 currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
 updateSlider();
});

nextBtn.addEventListener('click', () => {
 currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
 updateSlider();
});

sliderDots.forEach((dot, index) => {
 dot.addEventListener('click', () => {
 currentSlide = index;
 updateSlider();
 });
});

// Auto-slide
setInterval(() => {
 currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
 updateSlider();
}, 5000);

// Scroll Animations
const scrollElements = document.querySelectorAll('.scroll-animate');
const elementInView = (el, dividend = 1) => {
 const elementTop = el.getBoundingClientRect().top;
 return (
 elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
 );
};

const displayScrollElement = (element) => {
 element.classList.add('animate');
};

const handleScrollAnimation = () => {
 scrollElements.forEach((el) => {
 if (elementInView(el, 1.25)) {
 displayScrollElement(el);
 }
 });
};

window.addEventListener('scroll', () => {
 handleScrollAnimation();
});

// Initial load animations
handleScrollAnimation();

// Form Handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
 e.preventDefault();
 
 // Simulate form submission
 formStatus.innerHTML = '<div style="color: var(--color-success); margin-top: 1rem; padding: 1rem; background: rgba(67, 233, 123, 0.1); border-radius: 10px; border: 1px solid var(--color-success);"><i class="fas fa-check-circle"></i> Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.</div>';
 
 contactForm.reset();
 
 setTimeout(() => {
 formStatus.innerHTML = '';
 }, 5000);
});

// Parallax Effect for Floating Shapes
window.addEventListener('scroll', () => {
 const scrolled = window.pageYOffset;
 const shapes = document.querySelectorAll('.floating-shape');
 
 shapes.forEach((shape, index) => {
 const speed = 0.5 + (index * 0.1);
 shape.style.transform = `translateY(${scrolled * speed}px)`;
 });
});

// Add Loading Animation
window.addEventListener('load', () => {
 document.body.style.opacity = '0';
 document.body.style.transition = 'opacity 0.5s ease';
 
 setTimeout(() => {
 document.body.style.opacity = '1';
 }, 100);
});

// Enhanced Button Interactions
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
 btn.addEventListener('mouseenter', (e) => {
 const ripple = document.createElement('span');
 ripple.classList.add('ripple');
 e.target.appendChild(ripple);
 
 setTimeout(() => {
 ripple.remove();
 }, 600);
 });
});

// Intersection Observer for better performance
const observerOptions = {
 threshold: 0.1,
 rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 entry.target.classList.add('animate');
 }
 });
}, observerOptions);

scrollElements.forEach(el => {
 observer.observe(el);
});

// Dynamic Gradient Background
let gradientAngle = 135;
setInterval(() => {
 gradientAngle += 1;
 document.querySelector('.hero').style.background = 
 `linear-gradient(${gradientAngle}deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`;
}, 100);

// Add Typing Effect to Hero Title
const heroTitle = document.querySelector('.hero h1');
const originalText = heroTitle.textContent;
heroTitle.textContent = '';

let i = 0;
const typeWriter = () => {
 if (i < originalText.length) {
 heroTitle.textContent += originalText.charAt(i);
 i++;
 setTimeout(typeWriter, 50);
 }
};

setTimeout(typeWriter, 1000);

// Add Mouse Cursor Trail Effect
const cursor = document.createElement('div');
cursor.classList.add('cursor-trail');
cursor.style.cssText = `
 position: fixed;
 width: 20px;
 height: 20px;
 background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
 border-radius: 50%;
 pointer-events: none;
 z-index: 9999;
 opacity: 0.7;
 transition: all 0.1s ease;
 `;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
 cursor.style.left = e.clientX - 10 + 'px';
 cursor.style.top = e.clientY - 10 + 'px';
});

// Hide cursor trail on mobile
if (window.innerWidth <= 768) {
 cursor.style.display = 'none';
}

// Progressive Enhancement for Images
const images = document.querySelectorAll('img');
images.forEach(img => {
 img.addEventListener('load', () => {
 img.style.opacity = '0';
 img.style.transition = 'opacity 0.5s ease';
 setTimeout(() => {
 img.style.opacity = '1';
 }, 100);
 });
});

// Add Scroll Progress Indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
 position: fixed;
 top: 0;
 left: 0;
 width: 0%;
 height: 4px;
 background: var(--primary-gradient);
 z-index: 9999;
 transition: width 0.3s ease;
 `;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
 const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
 const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
 const scrolled = (winScroll / height) * 100;
 progressBar.style.width = scrolled + '%';
});

// Add Easter Egg - Konami Code
let konamiCode = [];
const konamiSequence = [
 'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
 'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
 konamiCode.push(e.code);
 if (konamiCode.length > konamiSequence.length) {
 konamiCode.shift();
 }
 
 if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
 // Easter egg activated
 document.body.style.filter = 'hue-rotate(180deg)';
 setTimeout(() => {
 document.body.style.filter = 'none';
 }, 3000);
 
 // Show confetti or special message
 alert('¡Código secreto activado! 🎉 ¡Gracias por explorar nuestra página!');
 konamiCode = [];
 }
});
// 3D Carousel Logic
const initCarousel = () => {
    const stage = document.querySelector('.carousel-stage');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (!stage || items.length === 0) return;

    const numberOfItems = items.length;
    const itemWidth = 250; // Match CSS width
    const gap = 20;
    const theta = 360 / numberOfItems;
    // Calculate radius to fit items in a circle
    // Circumference ≈ n * w
    // r = C / 2π
    // A bit of spacing is good, so let's use a slightly larger radius or standard formula
    // r = (w / 2) / tan(π / n)
    const radius = Math.round((itemWidth + gap) / 2 / Math.tan(Math.PI / numberOfItems));

    // Position items
    items.forEach((item, index) => {
        const angle = theta * index;
        item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        // Add slight opacity to non-front items for depth effect if desired
        // item.style.opacity = '0.8';
    });

    // Rotation logic
    let currRotation = 0;

    const rotateCarousel = (direction) => {
        if (direction === 'next') {
            currRotation -= theta;
        } else {
            currRotation += theta;
        }
        stage.style.transform = `translateZ(-${radius}px) rotateY(${currRotation}deg)`;
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            rotateCarousel('next');
            resetAutoRotation();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            rotateCarousel('prev');
            resetAutoRotation();
        });
    }

    // Auto Rotation
    let autoRotateInterval;

    const startAutoRotation = () => {
        autoRotateInterval = setInterval(() => {
            rotateCarousel('next');
        }, 4000);
    };

    const resetAutoRotation = () => {
        clearInterval(autoRotateInterval);
        startAutoRotation();
    };

    // Initial setup
    // Push the stage back by radius so the front item is at z=0 (visual sweet spot)
    stage.style.transform = `translateZ(-${radius}px) rotateY(0deg)`;

    startAutoRotation();

    // Pause on hover
    const container = document.querySelector('.carousel-container');
    if (container) {
        container.addEventListener('mouseenter', () => clearInterval(autoRotateInterval));
        container.addEventListener('mouseleave', startAutoRotation);
    }
};

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
});
