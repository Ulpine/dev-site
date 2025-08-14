        // ========================================
        // CONFIGURATION ET VARIABLES GLOBALES
        // ========================================
        const config = {
            animationDelay: 100,
            scrollOffset: 100,
            formEmailEndpoint: '#' // Remplacez par votre endpoint de formulaire
        };

        // ========================================
        // LOADER
        // ========================================
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('loader');
                loader.classList.add('hidden');
            }, 500);
        });

        // ========================================
        // NAVIGATION MOBILE
        // ========================================
        const burger = document.getElementById('burger');
        const navLinks = document.getElementById('navLinks');
        let isMenuOpen = false;

        burger.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            burger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fermer le menu mobile lors du clic sur un lien
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navLinks.classList.remove('active');
                isMenuOpen = false;
            });
        });

        // ========================================
        // HEADER SCROLL EFFECT
        // ========================================
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Ajouter l'ombre au header lors du scroll
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });

        // ========================================
        // NAVIGATION ACTIVE LINK
        // ========================================
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-link');

        function updateActiveNav() {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - config.scrollOffset;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('href') === `#${sectionId}`) {
                            item.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav);

        // ========================================
        // SMOOTH SCROLL
        // ========================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const targetPosition = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // ========================================
        // ANIMATIONS AU SCROLL
        // ========================================
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animation échelonnée pour les cartes du portfolio
                    if (entry.target.classList.contains('portfolio-card')) {
                        const cards = document.querySelectorAll('.portfolio-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('visible');
                            }, index * config.animationDelay);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observer tous les éléments avec animation
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });

        // ========================================
        // FORMULAIRE DE CONTACT
        // ========================================
        const contactForm = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Réinitialiser les erreurs
            document.querySelectorAll('.form-error').forEach(error => {
                error.style.display = 'none';
            });

            // Validation
            let isValid = true;
            const formData = new FormData(contactForm);

            // Valider le nom
            if (!formData.get('name').trim()) {
                showError('name');
                isValid = false;
            }

            // Valider l'email
            const email = formData.get('email');
            if (!isValidEmail(email)) {
                showError('email');
                isValid = false;
            }

            // Valider le message
            if (!formData.get('message').trim()) {
                showError('message');
                isValid = false;
            }

            if (isValid) {
                // Simuler l'envoi du formulaire
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Envoi en cours...';
                submitBtn.disabled = true;

                // Simulation d'envoi (remplacer par votre logique d'envoi réelle)
                setTimeout(() => {
                    formSuccess.style.display = 'block';
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;

                    // Masquer le message de succès après 5 secondes
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                    }, 5000);

                    // Scroll vers le haut du formulaire
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 1500);
            }
        });

        function showError(fieldName) {
            const field = document.getElementById(fieldName);
            const error = field.nextElementSibling;
            if (error && error.classList.contains('form-error')) {
                error.style.display = 'block';
                field.focus();
            }
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // ========================================
        // PARALLAX EFFECT (optionnel)
        // ========================================
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero::before');

            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // ========================================
        // TYPING ANIMATION (Hero)
        // ========================================
        function typeWriter() {
            const texts = [
                "Sites Web Modernes",
                "Design Responsive",
                "Code Optimisé",
                "SEO Friendly"
            ];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            const typingSpeed = 100;
            const deletingSpeed = 50;
            const pauseTime = 2000;

            const heroTitle = document.querySelector('.hero h1');
            if (!heroTitle) return;

            const originalText = "Créateur de ";

            function type() {
                const currentText = texts[textIndex];

                if (isDeleting) {
                    heroTitle.textContent = originalText + currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    heroTitle.textContent = originalText + currentText.substring(0, charIndex + 1);
                    charIndex++;
                }

                if (!isDeleting && charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, pauseTime);
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, typingSpeed);
                } else {
                    setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
                }
            }

            // Démarrer l'animation après le chargement
            setTimeout(type, 2000);
        }

        // Démarrer l'animation de typing
        // typeWriter(); // Décommentez pour activer

        // ========================================
        // CONSOLE MESSAGE
        // ========================================
        console.log('%c🚀 Site Portfolio créé avec passion!',
            'font-size: 20px; color: #667eea; font-weight: bold;');
        console.log('%c👨‍💻 Intéressé par mon travail? Contactez-moi!',
            'font-size: 14px; color: #48bb78;');

        // ========================================
        // THEME TOGGLE (optionnel)
        // ========================================
        function initThemeToggle() {
            const theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }

        // Initialiser le thème
        // initThemeToggle(); // Décommentez pour activer le mode sombre
