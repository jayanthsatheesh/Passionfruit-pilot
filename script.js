document.addEventListener('DOMContentLoaded', () => {

    // Hero Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-indicators .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(slideIndex) {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (slideIndex + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlideShow() {
        stopSlideShow(); // Ensure no multiple intervals are running
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideShow();
            startSlideShow();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideShow();
            startSlideShow();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopSlideShow();
            startSlideShow();
        });
    });

    if (slides.length > 0) {
        startSlideShow();
    }

    // Dynamic Filtering Logic
    const interestCards = document.querySelectorAll('.category-card[data-interest]');
    const categoryCheckboxes = document.querySelectorAll('.category-filter-item');
    const clearInterestFilterBtn = document.getElementById('clear-interest-filter');
    const levelCheckboxes = document.querySelectorAll('input[name="level"]');
    const techFilterGroups = document.querySelectorAll('.tech-filter-group');
    const productCards = document.querySelectorAll('.product-card');

    function filterProducts() {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
        const selectedLevels = Array.from(document.querySelectorAll('input[name="level"]:checked')).map(cb => cb.value);

        // Tech filters - simple example, can be expanded
        const selectedSensorSize = document.getElementById('sensor-size')?.value;
        const selectedDroneType = document.getElementById('drone-type')?.value;

        productCards.forEach(card => {
            const category = card.dataset.category;
            const level = card.dataset.level;

            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
            const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(level);

            // Tech filter matching
            const sensorSize = card.dataset.sensorSize;
            const droneType = card.dataset.droneType;

            const techMatch = 
                (!selectedSensorSize || sensorSize === selectedSensorSize) &&
                (!selectedDroneType || droneType === selectedDroneType);

            if (categoryMatch && levelMatch && techMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function updateTechFilters() {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
        techFilterGroups.forEach(group => {
            if (selectedCategories.includes(group.dataset.category)) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
        document.getElementById('tech-filters').style.display = selectedCategories.length > 0 ? 'block' : 'none';
    }

    interestCards.forEach(card => {
        card.addEventListener('click', () => {
            const interest = card.dataset.interest;
            categoryCheckboxes.forEach(checkboxItem => {
                if (checkboxItem.dataset.interestArea === interest) {
                    checkboxItem.style.display = 'block';
                } else {
                    checkboxItem.style.display = 'none';
                }
            });
            clearInterestFilterBtn.style.display = 'block';
        });
    });

    if (clearInterestFilterBtn) {
        clearInterestFilterBtn.addEventListener('click', () => {
            categoryCheckboxes.forEach(checkboxItem => {
                checkboxItem.style.display = 'block';
            });
            clearInterestFilterBtn.style.display = 'none';
        });
    }

    document.querySelectorAll('input[name="category"], input[name="level"], .tech-filter-group select').forEach(input => {
        input.addEventListener('change', () => {
            filterProducts();
            if (input.name === 'category') {
                updateTechFilters();
            }
        });
    });

    // Lead Capture Modal Logic
    const modal = document.getElementById('lead-modal');
    const talkToUsBtn = document.getElementById('talk-to-us-btn');
    const closeButton = modal?.querySelector('.close-button');
    const leadForm = document.getElementById('lead-form');

    const openModal = () => modal?.classList.remove('hidden');
    const closeModal = () => modal?.classList.add('hidden');

    if (talkToUsBtn) {
        talkToUsBtn.addEventListener('click', openModal);
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! We will be in touch shortly.');
            closeModal();
            leadForm.reset();
        });
    }

    // Profile Dropdown Logic
    const profileIconLink = document.getElementById('profile-icon-link');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    function updateProfileDropdown() {
        if (!profileDropdown) return;
        const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
        profileDropdown.innerHTML = ''; // Clear existing content
        if (isSignedIn) {
            profileDropdown.innerHTML = `
                <a href="profile.html#rentals">My Rentals</a>
                <a href="profile.html#details">My Details</a>
                <a href="#" id="logout-link">Logout</a>
            `;
            document.getElementById('logout-link').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isUserSignedIn');
                window.location.href = 'index.html';
            });
        } else {
            profileDropdown.innerHTML = '<a href="signin.html">Sign In</a>';
        }
    }

    if (profileIconLink) {
        profileIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            profileDropdown.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', (e) => {
        if (profileIconLink && !profileIconLink.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.add('hidden');
        }
    });

    // PDP Logic: Image Gallery
    const mainImage = document.getElementById('main-pdp-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            if (mainImage) {
                mainImage.src = thumbnail.src;
                document.querySelector('.thumbnail.active')?.classList.remove('active');
                thumbnail.classList.add('active');
            }
        });
    });

    // PDP Logic: Pricing Plan Selection
    const planBtns = document.querySelectorAll('.plan-btn');
    const rentNowBtn = document.getElementById('rent-now-flow-btn');

    planBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.plan-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            if (rentNowBtn) {
                const price = btn.dataset.price;
                rentNowBtn.textContent = `Rent Now (₹${price})`;
            }
        });
    });
    
    // PDP Logic: Tabbed Interface
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.dataset.tab;

            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // PDP Rent Now Flow
    if (rentNowBtn) {
        rentNowBtn.addEventListener('click', () => {
            if (localStorage.getItem('isUserSignedIn') === 'true') {
                window.location.href = 'confirmation.html';
            } else {
                window.location.href = 'signin.html';
            }
        });
    }

    // Sign Up Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorEl = document.getElementById('password-error');

            if (password !== confirmPassword) {
                errorEl.textContent = "Passwords do not match.";
                errorEl.classList.remove('hidden');
            } else {
                errorEl.classList.add('hidden');
                // Simulate successful signup
                localStorage.setItem('isUserSignedIn', 'true');
                window.location.href = 'confirmation.html'; // Or a welcome page
            }
        });
    }

    // Sign In Form
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate successful signin
            localStorage.setItem('isUserSignedIn', 'true');
            window.location.href = 'index.html';
        });
    }
    
    // Profile Page Logout
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
         logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isUserSignedIn');
            window.location.href = 'index.html';
        });
    }
    
    // Initial setup on page load
    updateProfileDropdown();
    filterProducts();
    updateTechFilters();
}); 