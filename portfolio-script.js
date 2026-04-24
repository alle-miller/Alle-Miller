// ==================== MENU TOGGLE ==================== 
const menuToggle = document.getElementById('menuToggle');
const menuToggle2 = document.getElementById('menuToggle2');
const menuToggle3 = document.getElementById('menuToggle3');
const menuClose = document.getElementById('menuClose');
const menuModal = document.getElementById('menuModal');
const menuLinks = document.querySelectorAll('.menu-link');

function openMenu() {
    menuModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menuModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

menuToggle.addEventListener('click', openMenu);
menuToggle2.addEventListener('click', openMenu);
menuToggle3.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);

menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (menuModal.classList.contains('active') && 
        !menuModal.contains(e.target) && 
        !menuToggle.contains(e.target) &&
        !menuToggle2.contains(e.target) &&
        !menuToggle3.contains(e.target)) {
        closeMenu();
    }
});

// ==================== CAROUSEL FUNCTIONALITY ==================== 
class Carousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.track = this.carousel.querySelector('.carousel-track');
        this.items = this.carousel.querySelectorAll('.carousel-item');
        this.prevBtn = this.carousel.querySelector('.carousel-btn.prev');
        this.nextBtn = this.carousel.querySelector('.carousel-btn.next');
        this.currentIndex = 0;
        this.itemWidth = 0;
        this.gap = 0;
        
        if (this.prevBtn && this.nextBtn) {
            this.init();
        }
    }

    init() {
        this.calculateDimensions();
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Recalculate on window resize
        window.addEventListener('resize', () => {
            this.calculateDimensions();
            this.updatePosition();
        });

        // Touch support
        this.addTouchSupport();
    }

    calculateDimensions() {
        if (this.items.length > 0) {
            const style = window.getComputedStyle(this.track);
            const gap = style.gap || '0px';
            this.gap = parseInt(gap);
            this.itemWidth = this.items[0].offsetWidth + this.gap;
        }
    }

    updatePosition() {
        if (this.track) {
            const offset = -this.currentIndex * this.itemWidth;
            this.track.style.transform = `translateX(${offset}px)`;
        }
    }

    next() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
            this.updatePosition();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updatePosition();
        }
    }

    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.next();
            }
            if (touchEndX > touchStartX + 50) {
                this.prev();
            }
        };

        this.handleSwipe = handleSwipe;
    }
}

// Initialize all carousels
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        new Carousel(carousel);
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add maximize button functionality
    document.querySelectorAll('.maximize-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const img = this.closest('.carousel-item')?.querySelector('img') || 
                       this.nextElementSibling;
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });
});

// ==================== LIGHTBOX FUNCTIONALITY ==================== 
function openLightbox(imageSrc, imageAlt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imageSrc}" alt="${imageAlt}">
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .lightbox-content {
            position: relative;
            background-color: white;
            padding: 20px;
            border-radius: 20px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
        }

        .lightbox-content img {
            width: 100%;
            height: auto;
            border-radius: 15px;
        }

        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: #aaa;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            line-height: 1;
            z-index: 10;
        }

        .lightbox-close:hover {
            color: #000;
        }
    `;

    if (!document.querySelector('style[data-lightbox]')) {
        style.setAttribute('data-lightbox', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => {
        lightbox.remove();
        document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.remove();
            document.body.style.overflow = 'auto';
        }
    });

    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            lightbox.remove();
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', handleEscape);
        }
    };

    document.addEventListener('keydown', handleEscape);
}

// ==================== KEYBOARD NAVIGATION ==================== 
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuModal.classList.contains('active')) {
        closeMenu();
    }
});
