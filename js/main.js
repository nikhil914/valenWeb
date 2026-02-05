/**
 * Valentine's Prank App - Main Application
 * Core logic for stage progression and user interactions
 */

(function () {
    'use strict';

    // ========================================
    // Constants
    // ========================================
    const NO_BUTTON_TEXTS = [
        'No',
        'Are you sure?',
        'Really?',
        'Think again!',
        'Please? 🥺',
        'Pretty please?',
        "I'll cry 😢",
        'Last chance!',
        'FINE! 😤'
    ];

    const SPLASH_DURATION = 2500;
    const YES_BUTTON_GROWTH_FACTOR = 0.15;

    // ========================================
    // State
    // ========================================
    let currentScreen = 'splash';
    let noAttempts = 0;
    let floatingHeartsCreated = false;

    // ========================================
    // DOM Elements
    // ========================================
    const screens = {
        splash: document.getElementById('splash-screen'),
        question: document.getElementById('question-screen'),
        success: document.getElementById('success-screen')
    };

    const elements = {
        yesButton: document.getElementById('yes-button'),
        noButtonStatic: document.getElementById('no-button-static'),
        noButton: document.getElementById('no-button'),
        buttonsContainer: document.getElementById('buttons-container'),
        attemptCounter: document.getElementById('attempt-counter'),
        hintText: document.getElementById('hint-text'),
        shareButton: document.getElementById('share-button'),
        replayButton: document.getElementById('replay-button'),
        coupleImage: document.getElementById('couple-image'),
        floatingHeartsContainer: document.getElementById('floating-hearts')
    };

    // ========================================
    // Screen Management
    // ========================================
    function showScreen(screenName) {
        // Hide all screens
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active', 'fade-in', 'scale-fade-in');
        });

        // Show target screen with animation
        const targetScreen = screens[screenName];
        if (targetScreen) {
            targetScreen.classList.add('active');

            if (screenName === 'success') {
                targetScreen.classList.add('scale-fade-in');
            } else {
                targetScreen.classList.add('fade-in');
            }

            currentScreen = screenName;
        }
    }

    // ========================================
    // Floating Hearts Background
    // ========================================
    function createFloatingHearts(count = 25) {
        if (floatingHeartsCreated) return;
        floatingHeartsCreated = true;

        const container = elements.floatingHeartsContainer;
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '❤️';

            // Random properties
            const startX = Math.random() * 100;
            const size = 20 + Math.random() * 30;
            const duration = 4 + Math.random() * 4;
            const delay = Math.random() * 4;
            const opacity = 0.3 + Math.random() * 0.4;

            heart.style.left = startX + '%';
            heart.style.fontSize = size + 'px';
            heart.style.animationDuration = duration + 's';
            heart.style.animationDelay = delay + 's';
            heart.style.setProperty('--heart-opacity', opacity);

            container.appendChild(heart);
        }
    }

    // ========================================
    // Yes Button Growth
    // ========================================
    function updateYesButton() {
        const scale = 1 + (noAttempts * YES_BUTTON_GROWTH_FACTOR);
        elements.yesButton.style.setProperty('--scale', scale);
        elements.yesButton.style.transform = `scale(${scale})`;

        if (noAttempts > 0) {
            elements.yesButton.classList.add('growing');
        }
    }

    // ========================================
    // No Button Management
    // ========================================
    function getNoButtonText() {
        if (noAttempts < NO_BUTTON_TEXTS.length) {
            return NO_BUTTON_TEXTS[noAttempts];
        }
        return NO_BUTTON_TEXTS[NO_BUTTON_TEXTS.length - 1];
    }

    function updateAttemptCounter() {
        if (noAttempts === 0) {
            elements.attemptCounter.textContent = '';
        } else if (noAttempts >= 5) {
            elements.attemptCounter.textContent = 'The "No" button is getting tired! 😅';
        } else {
            elements.attemptCounter.textContent = `Attempts to say no: ${noAttempts}`;
        }
    }

    function updateHintText() {
        if (noAttempts === 0) {
            elements.hintText.textContent = '💕 Make your choice! 💕';
        } else {
            elements.hintText.textContent = '(Hint: Try clicking the other button 😉)';
        }
    }

    function switchToEvasiveNoButton() {
        // Hide static button
        elements.noButtonStatic.style.display = 'none';

        // Show evasive button
        elements.noButton.style.display = 'block';
        elements.noButton.textContent = getNoButtonText();

        // Initialize position
        Positioning.initializePosition(elements.noButton, noAttempts);
    }

    function handleNoEvade() {
        noAttempts++;

        // Update UI
        elements.noButton.textContent = getNoButtonText();
        updateAttemptCounter();
        updateHintText();
        updateYesButton();

        // Update No button size
        Positioning.updateButtonSize(elements.noButton, noAttempts);

        // Reposition No button
        Positioning.repositionNoButton(elements.noButton, noAttempts);

        // Switch to evasive mode after first attempt
        if (noAttempts === 1) {
            switchToEvasiveNoButton();
        }
    }

    // ========================================
    // Event Handlers
    // ========================================
    function handleYesClick() {
        showScreen('success');

        // Start confetti after short delay
        setTimeout(() => {
            Confetti.start();
        }, 300);
    }

    function handleShareClick() {
        // Show snackbar-style message
        const message = document.createElement('div');
        message.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #FF1493;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
      animation: fadeSlideUp 0.3s ease-out;
    `;
        message.textContent = '📸 Take a screenshot and share! 💕';
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    function handleReplayClick() {
        // Reset state
        noAttempts = 0;

        // Reset UI
        elements.yesButton.style.transform = 'scale(1)';
        elements.yesButton.classList.remove('growing');
        elements.noButton.style.display = 'none';
        elements.noButtonStatic.style.display = 'block';
        elements.noButtonStatic.textContent = 'No';
        elements.noButton.textContent = 'No';
        elements.noButton.classList.remove('shrink-1', 'shrink-2', 'shrink-3');
        updateAttemptCounter();
        updateHintText();

        // Clear confetti
        Confetti.clear();

        // Show question screen
        showScreen('question');
    }

    function handleImageError() {
        elements.coupleImage.classList.add('error');
    }

    // ========================================
    // Touch/Mouse Event Handlers for No Button
    // ========================================
    function setupNoButtonEvents() {
        // Static No button
        elements.noButtonStatic.addEventListener('mouseenter', handleNoEvade);
        elements.noButtonStatic.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleNoEvade();
        }, { passive: false });
        elements.noButtonStatic.addEventListener('click', handleNoEvade);

        // Evasive No button
        elements.noButton.addEventListener('mouseenter', handleNoEvade);
        elements.noButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleNoEvade();
        }, { passive: false });
        elements.noButton.addEventListener('click', handleNoEvade);

        // Detect touch proximity for mobile
        document.addEventListener('touchmove', (e) => {
            if (currentScreen !== 'question' || noAttempts === 0) return;
            if (elements.noButton.style.display === 'none') return;

            const touch = e.touches[0];
            const buttonRect = elements.noButton.getBoundingClientRect();

            // Check if touch is within 60px of button
            const proximity = 60;
            const inProximity =
                touch.clientX >= buttonRect.left - proximity &&
                touch.clientX <= buttonRect.right + proximity &&
                touch.clientY >= buttonRect.top - proximity &&
                touch.clientY <= buttonRect.bottom + proximity;

            if (inProximity) {
                handleNoEvade();
            }
        }, { passive: true });
    }

    // ========================================
    // Initialization
    // ========================================
    function init() {
        // Set up event listeners
        elements.yesButton.addEventListener('click', handleYesClick);
        elements.shareButton.addEventListener('click', handleShareClick);
        elements.replayButton.addEventListener('click', handleReplayClick);
        elements.coupleImage.addEventListener('error', handleImageError);

        setupNoButtonEvents();

        // Create floating hearts
        createFloatingHearts(25);

        // Auto-advance from splash to question
        setTimeout(() => {
            showScreen('question');
        }, SPLASH_DURATION);
    }

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
