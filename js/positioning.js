/**
 * Valentine's Prank App - Positioning Module
 * Handles No button collision detection and evasive movement
 */

const Positioning = (function () {
    'use strict';

    // Safety margins per stage (pixels) - increases with stage
    const SAFETY_MARGINS = [140, 160, 180, 200];

    // Button dimensions per stage (shrinks as attempts increase)
    const BUTTON_WIDTHS = {
        initial: 100,
        stage1: 80,
        stage2: 70,
        stage3: 55
    };

    const BUTTON_HEIGHT = 45;

    /**
     * Get the Yes button's bounding rectangle
     * @returns {DOMRect|null}
     */
    function getYesButtonRect() {
        const yesButton = document.getElementById('yes-button');
        if (!yesButton) return null;
        return yesButton.getBoundingClientRect();
    }

    /**
     * Get current stage based on attempt count
     * @param {number} attempts
     * @returns {number} 1-4
     */
    function getCurrentStage(attempts) {
        if (attempts < 3) return 1;
        if (attempts < 6) return 2;
        if (attempts < 9) return 3;
        return 4;
    }

    /**
     * Get safety margin for current stage
     * @param {number} stage
     * @returns {number}
     */
    function getSafetyMargin(stage) {
        return SAFETY_MARGINS[Math.min(stage - 1, 3)];
    }

    /**
     * Get No button width based on attempts
     * @param {number} attempts
     * @returns {number}
     */
    function getNoButtonWidth(attempts) {
        if (attempts >= 8) return BUTTON_WIDTHS.stage3;
        if (attempts >= 5) return BUTTON_WIDTHS.stage2;
        if (attempts >= 3) return BUTTON_WIDTHS.stage1;
        return BUTTON_WIDTHS.initial;
    }

    /**
     * Check if a position is safe (away from Yes button)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} stage - Current stage (1-4)
     * @param {number} buttonWidth - No button width
     * @returns {boolean}
     */
    function isPositionSafe(x, y, stage, buttonWidth) {
        const yesRect = getYesButtonRect();

        const padding = 15;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const maxX = screenWidth - buttonWidth - padding;
        const topBoundary = screenHeight * 0.10;
        const maxYPosition = screenHeight * 0.55;

        // Rule 1: Must be within screen bounds
        if (x < padding || x > maxX) return false;

        // Rule 2: Must be in top 60% of screen
        if (y < topBoundary) return false;
        if (y > maxYPosition - BUTTON_HEIGHT) return false;

        // Rule 3: Check distance from Yes button if known
        if (!yesRect) return true;

        // Calculate button centers
        const noCenterX = x + buttonWidth / 2;
        const noCenterY = y + BUTTON_HEIGHT / 2;
        const yesCenterX = yesRect.left + yesRect.width / 2;
        const yesCenterY = yesRect.top + yesRect.height / 2;

        // Calculate Euclidean distance
        const distance = Math.sqrt(
            Math.pow(noCenterX - yesCenterX, 2) +
            Math.pow(noCenterY - yesCenterY, 2)
        );

        // Rule 4: Must be outside dynamic safety margin
        const safetyMargin = getSafetyMargin(stage);
        if (distance < safetyMargin) return false;

        // Rule 5: Rectangle-based exclusion
        const horizontalMargin = yesRect.width / 2 + buttonWidth / 2 + 60;
        const verticalMargin = yesRect.height / 2 + BUTTON_HEIGHT / 2 + 60;

        const inHorizontalRange = Math.abs(noCenterX - yesCenterX) < horizontalMargin;
        const inVerticalRange = Math.abs(noCenterY - yesCenterY) < verticalMargin;

        // Must be clear on at least one axis
        if (inHorizontalRange && inVerticalRange) return false;

        return true;
    }

    /**
     * Get a valid random position for the No button
     * @param {number} attempts - Current attempt count
     * @param {number} currentX - Current X position
     * @param {number} currentY - Current Y position
     * @returns {{x: number, y: number}}
     */
    function getValidPosition(attempts, currentX = 0, currentY = 0) {
        const stage = getCurrentStage(attempts);
        const buttonWidth = getNoButtonWidth(attempts);

        const padding = 15;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const maxX = screenWidth - buttonWidth - padding;
        const topBoundary = screenHeight * 0.10;
        const bottomBoundary = screenHeight * 0.55;

        // Try random positions
        for (let attempt = 0; attempt < 25; attempt++) {
            const x = padding + Math.random() * (maxX - padding);
            const y = topBoundary + Math.random() * (bottomBoundary - topBoundary - BUTTON_HEIGHT);

            // Ensure significant movement from current position
            const movedEnough = Math.abs(x - currentX) > 70 || Math.abs(y - currentY) > 50;

            if (isPositionSafe(x, y, stage, buttonWidth) && (currentX === 0 || movedEnough)) {
                return { x, y };
            }
        }

        // Fallback: Top center of screen
        const fallbackX = (screenWidth - buttonWidth) / 2;
        const fallbackY = screenHeight * 0.15;

        return { x: fallbackX, y: fallbackY };
    }

    /**
     * Reposition the No button to a valid location
     * @param {HTMLElement} button - The No button element
     * @param {number} attempts - Current attempt count
     */
    function repositionNoButton(button, attempts) {
        const currentX = parseFloat(button.style.left) || 0;
        const currentY = parseFloat(button.style.top) || 0;

        const newPos = getValidPosition(attempts, currentX, currentY);

        button.style.left = newPos.x + 'px';
        button.style.top = newPos.y + 'px';
    }

    /**
     * Initialize No button at a valid starting position
     * @param {HTMLElement} button - The No button element
     * @param {number} attempts - Current attempt count
     */
    function initializePosition(button, attempts) {
        const pos = getValidPosition(attempts);
        button.style.left = pos.x + 'px';
        button.style.top = pos.y + 'px';
    }

    /**
     * Update No button size class based on attempts
     * @param {HTMLElement} button - The No button element
     * @param {number} attempts - Current attempt count
     */
    function updateButtonSize(button, attempts) {
        button.classList.remove('shrink-1', 'shrink-2', 'shrink-3');

        if (attempts >= 8) {
            button.classList.add('shrink-3');
        } else if (attempts >= 5) {
            button.classList.add('shrink-2');
        } else if (attempts >= 3) {
            button.classList.add('shrink-1');
        }
    }

    // Public API
    return {
        getYesButtonRect,
        getCurrentStage,
        getSafetyMargin,
        getNoButtonWidth,
        isPositionSafe,
        getValidPosition,
        repositionNoButton,
        initializePosition,
        updateButtonSize
    };
})();
