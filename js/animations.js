/**
 * Advanced Animations Module
 */

class AnimationController {
    constructor() {
        this.animations = [];
        this.init();
    }

    init() {
        this.observeElements();
        this.initParallax();
        this.initMagneticButtons();
        this.initTextAnimations();
    }

    observeElements() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => observer.observe(el));
    }

    triggerAnimation(element) {
        const animationType = element.getAttribute('data-animate');
        const duration = parseInt(element.getAttribute('data-duration')) || 600;
        const delay = parseInt(element.getAttribute('data-delay')) || 0;

        setTimeout(() => {
            element.classList.add('animate-' + animationType);
        }, delay);
    }

    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }, 16));
    }

    initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-button');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    initTextAnimations() {
        const textRevealElements = document.querySelectorAll('.text-reveal');
        
        textRevealElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.05}s`;
                element.appendChild(span);
            });
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Particle System
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            numberOfParticles: options.numberOfParticles || 50,
            speed: options.speed || 1,
            color: options.color || '#c9a961',
            size: options.size || 4,
            ...options
        };
        this.particles = [];
        this.init();
    }

    init() {
        for (let i = 0; i < this.options.numberOfParticles; i++) {
            this.createParticle();
        }
        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * this.options.size + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.background = this.options.color;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.6 + 0.2;
        
        this.container.appendChild(particle);
        
        this.particles.push({
            element: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * this.options.speed,
            vy: (Math.random() - 0.5) * this.options.speed
        });
    }

    animate() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = 100;
            if (p.x > 100) p.x = 0;
            if (p.y < 0) p.y = 100;
            if (p.y > 100) p.y = 0;

            p.element.style.left = `${p.x}%`;
            p.element.style.top = `${p.y}%`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Text Typing Effect
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait);
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = this.txt;

        let typeSpeed = 50;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Card Flip Effect
class CardFlip {
    constructor(card) {
        this.card = card;
        this.init();
    }

    init() {
        this.card.addEventListener('click', () => {
            this.card.classList.toggle('flipped');
        });

        // Add touch support
        this.card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.card.classList.toggle('flipped');
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animation controller
    new AnimationController();

    // Initialize particle system if container exists
    const particleContainer = document.querySelector('.particle-container');
    if (particleContainer) {
        new ParticleSystem(particleContainer);
    }

    // Initialize type writers
    const typeWriterElements = document.querySelectorAll('.typewriter');
    typeWriterElements.forEach(el => {
        const words = el.getAttribute('data-words').split(',');
        const wait = el.getAttribute('data-wait') || 3000;
        new TypeWriter(el, words, wait);
    });

    // Initialize flip cards
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => new CardFlip(card));

    // Add hover sound effects (optional)
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .service-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.classList.add('hover-sound');
        });
    });
});

// Export classes
window.AnimationController = AnimationController;
window.ParticleSystem = ParticleSystem;
window.TypeWriter = TypeWriter;
window.CardFlip = CardFlip;
