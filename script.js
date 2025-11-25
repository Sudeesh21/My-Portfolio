document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeToggleBtnMobile = document.getElementById("theme-toggle-btn-mobile");
    const sunIcon = document.getElementById("theme-icon-sun");
    const moonIcon = document.getElementById("theme-icon-moon");
    const sunIconMobile = document.getElementById("theme-icon-sun-mobile");
    const moonIconMobile = document.getElementById("theme-icon-moon-mobile");

    function updateIcons(isDarkMode) {
        if(sunIcon) sunIcon.classList.toggle('hidden', isDarkMode);
        if(moonIcon) moonIcon.classList.toggle('hidden', !isDarkMode);
        if(sunIconMobile) sunIconMobile.classList.toggle('hidden', isDarkMode);
        if(moonIconMobile) moonIconMobile.classList.toggle('hidden', !isDarkMode);
    }

    function applyTheme(isDarkMode) {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        updateIcons(isDarkMode);
    }

    const isSavedDarkMode = localStorage.getItem('theme') === 'dark';
    const isSystemDarkMode = (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const initialDarkMode = isSavedDarkMode || isSystemDarkMode;
    
    applyTheme(initialDarkMode);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => applyTheme(!document.documentElement.classList.contains('dark')));
    }
    if (themeToggleBtnMobile) {
        themeToggleBtnMobile.addEventListener("click", () => applyTheme(!document.documentElement.classList.contains('dark')));
    }

    // --- 2. Initialize EmailJS ---
    emailjs.init("2Rh52yyBQboV6TuSG");

    // --- 3. Mobile Menu ---
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {
        menuBtn.onclick = () => mobileMenu.classList.toggle("hidden");
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // --- 4. Typing Effect ---
    const typingText = document.getElementById("typing-headline");
    if (typingText) {
        const words = ["Software Developer", "Front-End Specialist", "UI/UX Enthusiast"];
        let i = 0, j = 0, isDeleting = false;
        
        function type() {
            const current = words[i];
            let typeSpeed = 150;
            if (isDeleting) {
                typingText.textContent = current.slice(0, j - 1);
                j--;
                typeSpeed = 80;
            } else {
                typingText.textContent = current.slice(0, j + 1);
                j++;
            }
            if (!isDeleting && j === current.length) {
                isDeleting = true;
                typeSpeed = 1500;
            } else if (isDeleting && j === 0) {
                isDeleting = false;
                i = (i + 1) % words.length;
                typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- 5. Contact Form ---
    const form = document.getElementById("contact-form");
    const formSuccess = document.getElementById("form-success");
    const formError = document.getElementById("form-error");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");
    const btnLoading = document.getElementById("btn-loading");

    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            if (submitBtn) submitBtn.disabled = true;
            if (btnText) btnText.classList.add("hidden");
            if (btnLoading) btnLoading.classList.remove("hidden");
            if (formSuccess) formSuccess.classList.add('hidden');
            if (formError) formError.classList.add('hidden');

            const formTime = document.getElementById("form-time");
            if (formTime) formTime.value = new Date().toLocaleString();

            emailjs.sendForm("service_w653grm", "template_kex1yk3", form)
                .then(() => {
                    if (formSuccess) formSuccess.classList.remove("hidden");
                    if (formError) formError.classList.add("hidden");
                    form.reset();
                })
                .catch((err) => {
                    console.error("EmailJS Error:", err); 
                    if (formError) formError.classList.remove("hidden");
                    if (formSuccess) formSuccess.classList.add("hidden");
                })
                .finally(() => {
                    if (submitBtn) submitBtn.disabled = false;
                    if (btnText) btnText.classList.remove("hidden");
                    if (btnLoading) btnLoading.classList.add("hidden");
                });
        });
    }

    // --- 6. Current Year ---
    const currentYearEl = document.getElementById("current-year");
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    
    // --- 7. Fade-in Animations ---
    const animatedSections = document.querySelectorAll('#hero, #about, #projects, #contact');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedSections.forEach(el => {
        if (el) observer.observe(el);
    });

    // --- 8. Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only enable cursor on non-touch devices
    if (matchMedia('(pointer:fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            if (cursorDot && cursorOutline) {
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
                
                // Use Web Animations API for smoother trailing
                cursorOutline.animate({
                    left: `${e.clientX}px`,
                    top: `${e.clientY}px`
                }, { duration: 500, fill: 'forwards' });
            }
        });

        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .skill');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseover', () => {
                if (cursorOutline) cursorOutline.classList.add('hovered');
            });
            el.addEventListener('mouseout', () => {
                if (cursorOutline) cursorOutline.classList.remove('hovered');
            });
        });
    } else {
        // Hide custom cursor on mobile
        if(cursorDot) cursorDot.style.display = 'none';
        if(cursorOutline) cursorOutline.style.display = 'none';
    }

    // --- 9. Back to Top ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }
});
