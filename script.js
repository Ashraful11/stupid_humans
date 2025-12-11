// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth Video Scrubbing Animation with Text Overlays
function initScrollAnimation() {
    const container = document.querySelector('.scroll-animation-container');
    const video = document.getElementById('scroll-video');
    const textOverlays = document.querySelectorAll('.text-overlay');

    if (!container || !video) return;

    // Smooth scrolling variables
    let targetProgress = 0;
    let currentProgress = 0;
    let currentTime = 0;
    const smoothness = 0.1; // Lower = smoother but slower (0.05-0.15 is good range)

    // Wait for video metadata to load
    video.addEventListener('loadedmetadata', () => {
        const videoDuration = video.duration;

        function calculateScrollProgress() {
            const containerTop = container.offsetTop;
            const containerHeight = container.offsetHeight;
            const scrollPosition = window.pageYOffset;

            // Calculate scroll progress through the container (0 to 1)
            targetProgress = Math.max(0, Math.min(1,
                (scrollPosition - containerTop) / (containerHeight - window.innerHeight)
            ));
        }

        function smoothUpdate() {
            // Linear interpolation (lerp) for smooth transitions
            currentProgress += (targetProgress - currentProgress) * smoothness;

            // Update video currentTime with smooth progress
            const targetTime = currentProgress * videoDuration;
            currentTime += (targetTime - currentTime) * smoothness;

            // Set video time (prevent setting if difference is too small for performance)
            if (Math.abs(video.currentTime - currentTime) > 0.01) {
                video.currentTime = currentTime;
            }

            // Update active text overlay based on progress thresholds
            let activeOverlay = null;
            textOverlays.forEach((text) => {
                const threshold = parseFloat(text.getAttribute('data-progress'));
                if (currentProgress >= threshold) {
                    activeOverlay = text;
                }
            });

            // Apply active class to the current overlay with smooth transitions
            textOverlays.forEach((text) => {
                if (text === activeOverlay) {
                    text.classList.add('active');
                } else {
                    text.classList.remove('active');
                }
            });

            // Continue the animation loop
            requestAnimationFrame(smoothUpdate);
        }

        // Start the smooth animation loop
        smoothUpdate();

        // Update target progress on scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    calculateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            calculateScrollProgress();
        });

        // Initial calculation
        calculateScrollProgress();
    });

    // Load the video
    video.load();
}

// Blog Filter Functionality
function initBlogFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post-card');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            blogPosts.forEach(post => {
                if (filter === 'all') {
                    post.style.display = 'grid';
                    setTimeout(() => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateX(0)';
                    }, 10);
                } else {
                    const category = post.getAttribute('data-category');
                    if (category === filter) {
                        post.style.display = 'grid';
                        setTimeout(() => {
                            post.style.opacity = '1';
                            post.style.transform = 'translateX(0)';
                        }, 10);
                    } else {
                        post.style.opacity = '0';
                        post.style.transform = 'translateX(-20px)';
                        setTimeout(() => {
                            post.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Simulate form submission (replace with actual API call)
        try {
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            formMessage.textContent = 'Thank you for your message! I will get back to you within 24-48 hours.';
            formMessage.className = 'form-message success';

            // Reset form
            contactForm.reset();

            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            // Show error message
            formMessage.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
            formMessage.className = 'form-message error';

            // Reset button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        }
    });
}

// Newsletter Form Handling
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitButton = newsletterForm.querySelector('button');
        const originalText = submitButton.textContent;

        try {
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success
            submitButton.textContent = 'Subscribed!';
            submitButton.style.background = '#10b981';
            emailInput.value = '';

            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);

        } catch (error) {
            submitButton.textContent = 'Error. Try again';
            submitButton.disabled = false;

            setTimeout(() => {
                submitButton.textContent = originalText;
            }, 3000);
        }
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

// Animate Elements on Scroll
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.feature-card, .post-card, .info-card, .faq-item');

    if (animateElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Split Screen Progressive Text Animation
function initSplitScreenAnimation() {
    const container = document.querySelector('.split-scroll-container');
    const video = document.getElementById('scroll-video-split');
    const textBlocks = document.querySelectorAll('.text-block');

    if (!container || !video) return;

    // Smooth scrolling variables
    let targetProgress = 0;
    let currentProgress = 0;
    let currentTime = 0;
    const smoothness = 0.1;

    // Wait for video metadata to load
    video.addEventListener('loadedmetadata', () => {
        const videoDuration = video.duration;

        function calculateScrollProgress() {
            const containerTop = container.offsetTop;
            const containerHeight = container.offsetHeight;
            const scrollPosition = window.pageYOffset;

            targetProgress = Math.max(0, Math.min(1,
                (scrollPosition - containerTop) / (containerHeight - window.innerHeight)
            ));
        }

        function smoothUpdate() {
            // Linear interpolation for smooth transitions
            currentProgress += (targetProgress - currentProgress) * smoothness;

            // Update video currentTime with smooth progress
            const targetTime = currentProgress * videoDuration;
            currentTime += (targetTime - currentTime) * smoothness;

            if (Math.abs(video.currentTime - currentTime) > 0.01) {
                video.currentTime = currentTime;
            }

            // Progressive text reveal
            textBlocks.forEach((block) => {
                const threshold = parseFloat(block.getAttribute('data-progress'));
                if (currentProgress >= threshold) {
                    block.classList.add('visible');
                } else {
                    block.classList.remove('visible');
                }
            });

            requestAnimationFrame(smoothUpdate);
        }

        // Start the smooth animation loop
        smoothUpdate();

        // Update target progress on scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    calculateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            calculateScrollProgress();
        });

        // Initial calculation
        calculateScrollProgress();
    });

    // Load the video
    video.load();
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimation();
    initSplitScreenAnimation();
    initBlogFilters();
    initContactForm();
    initNewsletterForm();
    initNavbarScroll();
    initScrollAnimations();
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initScrollAnimation();
    }, 250);
});
