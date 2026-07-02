/**
 * Navigation Module
 */

class NavigationManager {
    constructor() {
        this.header = null;
        this.nav = null;
        this.menuToggle = null;
        this.navLinks = [];
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.header = document.querySelector('.header');
        this.nav = document.querySelector('.nav');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.highlightCurrentPage();
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.nav.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 991 && this.isMenuOpen) {
                this.closeMenu();
            }
        }, 100));
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.menuToggle.classList.toggle('active', this.isMenuOpen);
        this.nav.classList.toggle('active', this.isMenuOpen);
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        
        // Update aria attributes
        this.menuToggle.setAttribute('aria-expanded', this.isMenuOpen);
        this.nav.setAttribute('aria-hidden', !this.isMenuOpen);
    }

    openMenu() {
        if (!this.isMenuOpen) {
            this.toggleMenu();
        }
    }

    closeMenu() {
        if (this.isMenuOpen) {
            this.toggleMenu();
        }
    }

    setupScrollBehavior() {
        let lastScrollTop = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add scrolled class to header
            if (scrollTop > scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                this.header.classList.add('hidden');
            } else {
                this.header.classList.remove('hidden');
            }

            lastScrollTop = scrollTop;
        }, 16));
    }

    highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';

        this.navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            if (linkPath === currentPage || 
                (currentPage === '' && linkPath === 'index.html') ||
                (currentPage === 'index.html' && linkPath === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Utility: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility: Throttle function
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

// Dropdown Menu Handler
class DropdownMenu {
    constructor(trigger, dropdown) {
        this.trigger = trigger;
        this.dropdown = dropdown;
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.trigger || !this.dropdown) return;

        // Mouse events
        this.trigger.addEventListener('mouseenter', () => this.open());
        this.trigger.addEventListener('mouseleave', () => this.close());
        
        // Keyboard accessibility
        this.trigger.addEventListener('focus', () => this.open());
        this.trigger.addEventListener('blur', (e) => {
            if (!this.dropdown.contains(e.relatedTarget)) {
                this.close();
            }
        });

        // Arrow key navigation
        this.dropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
                this.trigger.focus();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.dropdown.classList.add('open');
        this.trigger.setAttribute('aria-expanded', 'true');
    }

    close() {
        this.isOpen = false;
        this.dropdown.classList.remove('open');
        this.trigger.setAttribute('aria-expanded', 'false');
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main navigation
    if (document.querySelector('.header')) {
        window.navigationManager = new NavigationManager();
    }

    // Initialize dropdown menus
    const dropdownTriggers = document.querySelectorAll('[data-dropdown-trigger]');
    dropdownTriggers.forEach(trigger => {
        const dropdownId = trigger.getAttribute('data-dropdown-trigger');
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            new DropdownMenu(trigger, dropdown);
        }
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
});

// Export classes
window.NavigationManager = NavigationManager;
window.DropdownMenu = DropdownMenu;
