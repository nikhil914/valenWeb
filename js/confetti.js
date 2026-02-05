/**
 * Valentine's Prank App - Confetti Module
 * Lightweight confetti effect using pure CSS animations
 */

const Confetti = (function () {
    'use strict';

    const COLORS = ['#FF69B4', '#FF1493', '#FFD700', '#FFFFFF', '#9C27B0'];
    const SHAPES = ['heart', 'circle', 'square'];
    const CONFETTI_COUNT = 50;
    const DURATION_RANGE = { min: 2, max: 5 };

    let isActive = false;
    let confettiElements = [];
    let intervalId = null;

    /**
     * Create a single confetti particle
     * @returns {HTMLElement}
     */
    function createParticle() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Random properties
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = DURATION_RANGE.min + Math.random() * (DURATION_RANGE.max - DURATION_RANGE.min);
        const size = 8 + Math.random() * 8;

        // Apply styles
        confetti.style.left = left + '%';
        confetti.style.animationDelay = delay + 's';
        confetti.style.animationDuration = duration + 's';
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';

        // Shape styling
        if (shape === 'heart') {
            confetti.classList.add('heart');
            confetti.style.background = 'transparent';
        } else if (shape === 'circle') {
            confetti.style.backgroundColor = color;
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.backgroundColor = color;
            confetti.style.borderRadius = '2px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        }

        return confetti;
    }

    /**
     * Start the confetti effect
     */
    function start() {
        if (isActive) return;
        isActive = true;

        const container = document.getElementById('confetti-container');
        if (!container) return;

        // Initial burst
        for (let i = 0; i < CONFETTI_COUNT; i++) {
            const particle = createParticle();
            container.appendChild(particle);
            confettiElements.push(particle);

            // Remove particle after animation
            const duration = parseFloat(particle.style.animationDuration) * 1000;
            const delay = parseFloat(particle.style.animationDelay) * 1000;

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
                const index = confettiElements.indexOf(particle);
                if (index > -1) {
                    confettiElements.splice(index, 1);
                }
            }, duration + delay + 100);
        }

        // Continuous confetti for celebration
        intervalId = setInterval(() => {
            if (!isActive) {
                clearInterval(intervalId);
                return;
            }

            // Add a few particles every interval
            for (let i = 0; i < 5; i++) {
                const particle = createParticle();
                container.appendChild(particle);
                confettiElements.push(particle);

                const duration = parseFloat(particle.style.animationDuration) * 1000;
                const delay = parseFloat(particle.style.animationDelay) * 1000;

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                    const index = confettiElements.indexOf(particle);
                    if (index > -1) {
                        confettiElements.splice(index, 1);
                    }
                }, duration + delay + 100);
            }
        }, 500);

        // Auto-stop after 8 seconds
        setTimeout(() => {
            stop();
        }, 8000);
    }

    /**
     * Stop the confetti effect
     */
    function stop() {
        isActive = false;

        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    /**
     * Clear all confetti immediately
     */
    function clear() {
        stop();

        confettiElements.forEach(el => {
            if (el.parentNode) {
                el.remove();
            }
        });
        confettiElements = [];
    }

    // Public API
    return {
        start,
        stop,
        clear
    };
})();
