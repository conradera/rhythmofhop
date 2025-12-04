// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    initMobileMenu();
    initHeroSlider();
    
    // Debug: Check image loading
    checkImageLoading();
});

// Check image loading and handle errors
function checkImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Silently handle image errors
            const parent = this.closest('.gallery-image, .gallery-item');
            if (parent) {
                this.style.display = 'none';
            }
        });
    });
}

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = 'auto';
        }
        
        // Recalculate slider dimensions on resize
        if (typeof initHeroSlider === 'function') {
            // Trigger a resize event for the slider
            window.dispatchEvent(new Event('sliderResize'));
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.value-card, .program-card, .stat-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Counter animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / speed;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current) + '+';
                        setTimeout(updateCounter, 1);
                    } else {
                        counter.textContent = target + '+';
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Donate modal functionality
function openDonateModal() {
    const modal = document.getElementById('donateModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('donateModal');
    if (event.target === modal) {
        closeDonateModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDonateModal();
    }
});

// Form validation for contact and admissions forms
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const fieldName = input.getAttribute('name') || input.getAttribute('id');
        
        // Remove existing error styling
        input.classList.remove('error');
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!value) {
            showFieldError(input, `${fieldName} is required`);
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    return isValid;
}

// Contact form validation
function validateContactForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    // Clear previous errors
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const fieldName = input.getAttribute('name') || input.getAttribute('id');
        
        if (!value) {
            showFieldError(input, `${fieldName} is required`);
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(value)) {
            showFieldError(input, 'Please enter a valid phone number');
            isValid = false;
        }
    });
    
    if (isValid) {
        // Simulate form submission
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        form.reset();
    } else {
        showNotification('Please correct the errors and try again.', 'error');
    }
    
    return false; // Prevent actual form submission
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#D32F2F';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.25rem';
    input.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// News search functionality
function initNewsSearch() {
    const searchInput = document.getElementById('newsSearch');
    const newsCards = document.querySelectorAll('.news-card');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        newsCards.forEach(card => {
            const title = card.querySelector('.news-title').textContent.toLowerCase();
            const content = card.querySelector('.news-preview').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Gallery filter functionality
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
        });
    });
}

// Initialize gallery filter if on gallery page
if (window.location.pathname.includes('gallery.html')) {
    initGalleryFilter();
    initGalleryLightbox();
}

// Gallery Lightbox functionality
let currentImageIndex = 0;
let galleryImages = [];

function initGalleryLightbox() {
    // Get all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryImages = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            alt: img.alt
        };
    });
    
    // Add error handling for images
    const images = document.querySelectorAll('.gallery-image img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const parent = this.closest('.gallery-image');
            if (parent) {
                parent.innerHTML = '<div class="placeholder-image"><i class="fas fa-image"></i><p>Image not available</p></div>';
            }
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeImage(1);
            }
        }
    });
}

function openLightbox(imageSrc, imageAlt) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (!lightbox || !lightboxImage) return;
    
    // Find the index of the clicked image
    currentImageIndex = galleryImages.findIndex(img => img.src.includes(imageSrc.split('/').pop()));
    if (currentImageIndex === -1) {
        currentImageIndex = 0;
    }
    
    // Set image and caption
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightboxCaption.textContent = imageAlt;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event) {
        event.stopPropagation();
        // Only close if clicking on the backdrop or close button
        if (event.target.classList.contains('lightbox-close') || event.target.id === 'lightbox') {
            const lightbox = document.getElementById('lightbox');
            if (lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    } else {
        // Called without event (e.g., from keyboard)
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

function changeImage(direction, event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (galleryImages.length === 0) return;
    
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightboxImage && lightboxCaption && galleryImages[currentImageIndex]) {
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxImage.alt = galleryImages[currentImageIndex].alt;
        lightboxCaption.textContent = galleryImages[currentImageIndex].alt;
    }
}

// Team description toggle functionality
function toggleDescription(button) {
    const memberDescription = button.parentElement;
    const shortDescription = memberDescription.querySelector('.short-description');
    const fullDescription = memberDescription.querySelector('.full-description');
    
    if (fullDescription.classList.contains('show')) {
        // Hide full description
        fullDescription.classList.remove('show');
        shortDescription.style.display = 'block';
        button.textContent = 'Read More';
        button.classList.remove('expanded');
    } else {
        // Show full description
        fullDescription.classList.add('show');
        shortDescription.style.display = 'none';
        button.textContent = 'Read Less';
        button.classList.add('expanded');
    }
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
}

// Initialize parallax if on home page
if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
    initParallax();
}

// Loading animation
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.innerHTML = `
        <div class="loader">
            <div class="loader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
    `;
    
    document.body.appendChild(loader);
    
    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 300);
        }, 500);
    });
}

// Hero Slider functionality
let currentSlideIndex = 0;
let slideInterval;
let touchStartX = 0;
let touchEndX = 0;

function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Function to ensure proper image sizing on mobile
    function adjustImagesForMobile() {
        const isMobile = window.innerWidth <= 768;
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                if (isMobile) {
                    img.style.height = '100vh';
                    img.style.width = '100%';
                    img.style.objectFit = 'cover';
                    img.style.objectPosition = 'center center';
                } else {
                    img.style.height = '100%';
                    img.style.width = '100%';
                    img.style.objectFit = 'cover';
                    img.style.objectPosition = 'center';
                }
            }
        });
    }
    
    // Enhanced slide transition with fade effect
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active');
        });
        
        if (slides[index]) {
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
        }
    }
    
    // Auto-advance slides every 4 seconds
    slideInterval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }, 4000);
    
    // Pause slider on hover (desktop only)
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', pauseSlider);
        heroSection.addEventListener('mouseleave', resumeSlider);
        
        // Touch events for mobile swipe
        heroSection.addEventListener('touchstart', handleTouchStart, { passive: true });
        heroSection.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Pause slider when menu is open on mobile
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (navMenu.classList.contains('active')) {
                        pauseSlider();
                    } else {
                        resumeSlider();
                    }
                }
            });
        });
        observer.observe(navMenu, { attributes: true });
    }
    
    // Initialize first slide
    showSlide(0);
    
    // Listen for resize events to adjust images
    window.addEventListener('resize', adjustImagesForMobile);
    window.addEventListener('sliderResize', adjustImagesForMobile);
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            previousSlide();
        }
    }
}

function previousSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Remove active class from current slide and dot
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Move to previous slide
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    
    // Add active class to new slide and dot
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Reset the auto-advance timer
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
}

function currentSlide(n) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    currentSlideIndex = n - 1;
    showSlide(currentSlideIndex);
    
    // Reset the auto-advance timer
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4000);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });
    
    if (slides[index]) {
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
    }
}

function pauseSlider() {
    clearInterval(slideInterval);
}

function resumeSlider() {
    slideInterval = setInterval(nextSlide, 5000);
}

// Copy bank details to clipboard
function copyBankDetails() {
    const bankDetails = `Bank: [Bank Name]
Account Name: Rythm of Hope
Account Number: [Account Number]
Swift Code: [Swift Code]`;
    
    navigator.clipboard.writeText(bankDetails).then(() => {
        showNotification('Bank details copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Unable to copy. Please copy manually.', 'error');
    });
}

// Copy mobile money details to clipboard
function copyMobileMoney(provider) {
    const mobileDetails = `${provider} Mobile Money:
Number: +256 702 584274
Name: Rythm of Hope`;
    
    navigator.clipboard.writeText(mobileDetails).then(() => {
        showNotification(`${provider} details copied to clipboard!`, 'success');
    }).catch(() => {
        showNotification('Unable to copy. Please copy manually.', 'error');
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show loading animation
showLoading();

// Utility function to debounce events
function debounce(func, wait) {
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Add any scroll-based functionality here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Add CSS for form errors
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #D32F2F !important;
        box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.2) !important;
    }
    
    .loader-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #D32F2F;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
