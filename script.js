/**
 * @typedef {Object} GameState
 * @property {number} score
 * @property {number} clickValue
 * @property {number} powerUpCost
 * @property {number} totalClicks
 * @property {number} powerUpCount
 * @property {number} nextPowerUpAt
 * @property {number} timesPlayed
 * @property {number} comboCount
 * @property {number} lastClickTime
 */

/** @type {Record<string, string>} */
const STORAGE_KEYS = {
    score: 'score',
    clickValue: 'clickValue',
    powerUpCost: 'powerUpCost',
    totalClicks: 'totalClicks',
    powerUpCount: 'powerUpCount',
    nextPowerUpAt: 'nextPowerUpAt',
    timesPlayed: 'timesPlayed',
    comboCount: 'comboCount',
};

/** @type {GameState} */
const state = {
    score: 0,
    clickValue: 1,
    powerUpCost: 500,
    totalClicks: 0,
    powerUpCount: 0,
    nextPowerUpAt: 500,
    timesPlayed: 0,
    comboCount: 0,
    lastClickTime: 0,
};

/**
 * @template {HTMLElement} T
 * @param {string} selector
 * @returns {T}
 */
function getElement(selector) {
    const element = document.querySelector(selector);

    if (!(element instanceof HTMLElement)) {
        throw new Error(`Missing element for selector: ${selector}`);
    }

    return element;
}

const clickButton = getElement('#clickButton');
const powerUpButton = getElement('#powerUpButton');
const scoreDisplay = getElement('#score');
const clickValueDisplay = getElement('#clickValue');
const nextPowerUpDisplay = getElement('#nextPowerUpAt');
const powerUpCostDisplay = getElement('#powerUpCost');
const totalClicksDisplay = getElement('#totalClicks');
const powerUpCountDisplay = getElement('#powerUpCount');
const timesPlayedDisplay = getElement('#timesPlayed');
const comboDisplay = getElement('#comboDisplay');
const comboValueDisplay = getElement('#comboValue');
const comboMultiplierDisplay = getElement('#comboMultiplier');
const particleContainer = getElement('#particleContainer');

/**
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} text - Text to display
 * @param {boolean} isCombo - Whether this is a combo label
 */
function createParticle(x, y, text, isCombo = false) {
    const floating = document.createElement('span');
    floating.className = `floating-label ${isCombo ? 'combo' : 'normal'}`;
    floating.textContent = text;
    floating.style.left = x + 'px';
    floating.style.top = y + 'px';
    particleContainer.appendChild(floating);

    window.requestAnimationFrame(() => {
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = -150 - Math.random() * 80;
        floating.style.opacity = '0';
        floating.style.transform = `translate(calc(-50% + ${offsetX}px), ${offsetY}px) scale(${isCombo ? 1.3 : 1.1})`;
    });

    setTimeout(() => floating.remove(), 900);
}

/**
 * Create particle effects around the button
 */
function createClickParticles() {
    const rect = clickButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particleCount = Math.min(8, 3 + Math.floor(state.comboCount / 5));
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = `hsl(${20 + Math.random() * 20}, 100%, 50%)`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px currentColor';
        particleContainer.appendChild(particle);
        
        const tx = (Math.random() - 0.5) * 150;
        const ty = -100 - Math.random() * 100;
        
        particle.style.animation = `particleFloat 0.8s ease-out forwards`;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        setTimeout(() => particle.remove(), 800);
    }
}

// Add particle animation
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
        }
    }
`;
document.head.appendChild(animStyle);

/**
 * Handle combo system
 */
function updateCombo() {
    const now = Date.now();
    const timeSinceLastClick = now - state.lastClickTime;
    
    if (timeSinceLastClick > 1500) {
        state.comboCount = 0;
    }
    
    state.lastClickTime = now;
    state.comboCount = Math.min(state.comboCount + 1, 999);
    
    if (state.comboCount > 1) {
        comboDisplay.hidden = false;
        comboValueDisplay.textContent = state.comboCount;
        
        setTimeout(() => {
            if (state.comboCount === 1) {
                comboDisplay.hidden = true;
            }
        }, 1500);
    }
}

/**
 * Get combo multiplier
 */
function getComboMultiplier() {
    if (state.comboCount < 2) return 1;
    if (state.comboCount < 5) return 1.1;
    if (state.comboCount < 10) return 1.25;
    if (state.comboCount < 25) return 1.5;
    if (state.comboCount < 50) return 2;
    return 2.5;
}

/**
 * @param {string} key
 * @param {number} fallback
 * @returns {number}
 */
function loadNumber(key, fallback) {
    const rawValue = localStorage.getItem(key);
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * @param {number} powerUpCount
 * @returns {number}
 */
function calculatePowerUpCost(powerUpCount) {
    return 500 + powerUpCount * 175;
}

function loadState() {
    state.score = loadNumber(STORAGE_KEYS.score, 0);
    state.clickValue = loadNumber(STORAGE_KEYS.clickValue, 1);
    state.powerUpCount = loadNumber(STORAGE_KEYS.powerUpCount, 0);
    state.totalClicks = loadNumber(STORAGE_KEYS.totalClicks, 0);
    state.nextPowerUpAt = loadNumber(STORAGE_KEYS.nextPowerUpAt, 500);
    state.timesPlayed = loadNumber(STORAGE_KEYS.timesPlayed, 0) + 1;
    state.powerUpCost = calculatePowerUpCost(state.powerUpCount);
    state.comboCount = 0;
    state.lastClickTime = 0;
    localStorage.setItem(STORAGE_KEYS.timesPlayed, String(state.timesPlayed));
}

function saveState() {
    localStorage.setItem(STORAGE_KEYS.score, String(state.score));
    localStorage.setItem(STORAGE_KEYS.clickValue, String(state.clickValue));
    localStorage.setItem(STORAGE_KEYS.powerUpCost, String(state.powerUpCost));
    localStorage.setItem(STORAGE_KEYS.totalClicks, String(state.totalClicks));
    localStorage.setItem(STORAGE_KEYS.powerUpCount, String(state.powerUpCount));
    localStorage.setItem(STORAGE_KEYS.nextPowerUpAt, String(state.nextPowerUpAt));
    localStorage.setItem(STORAGE_KEYS.timesPlayed, String(state.timesPlayed));
}

function formatNumber(value) {
    return value.toLocaleString();
}

function updatePowerUpButton() {
    const isUnlocked = state.totalClicks >= state.nextPowerUpAt;
    const canAfford = state.score >= state.powerUpCost;

    powerUpButton.hidden = !isUnlocked;
    powerUpButton.disabled = !canAfford;
    powerUpButton.textContent = isUnlocked
        ? `Buy Power-Up (${formatNumber(state.powerUpCost)} points)`
        : `Power-Up unlocks at ${formatNumber(state.nextPowerUpAt)} clicks`;

    powerUpButton.classList.toggle('glow', isUnlocked && canAfford);
}

function updateDisplays() {
    clickButton.textContent = state.score === 0 ? 'Click!' : formatNumber(state.score);
    scoreDisplay.textContent = formatNumber(state.score);
    clickValueDisplay.textContent = formatNumber(state.clickValue);
    nextPowerUpDisplay.textContent = formatNumber(state.nextPowerUpAt);
    powerUpCostDisplay.textContent = formatNumber(state.powerUpCost);
    totalClicksDisplay.textContent = formatNumber(state.totalClicks);
    powerUpCountDisplay.textContent = formatNumber(state.powerUpCount);
    timesPlayedDisplay.textContent = formatNumber(state.timesPlayed);
    const multiplier = getComboMultiplier();
    comboMultiplierDisplay.textContent = multiplier.toFixed(1) + 'x';
    updatePowerUpButton();
}


function canBuyPowerUp() {
    return state.score >= state.powerUpCost && state.totalClicks >= state.nextPowerUpAt;
}

function handleClick() {
    updateCombo();
    const multiplier = getComboMultiplier();
    const earnedValue = state.clickValue * multiplier;
    
    state.score += earnedValue;
    state.totalClicks += 1;
    
    const rect = clickButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create main floating label
    if (multiplier > 1) {
        createParticle(centerX, centerY, `+${Math.floor(earnedValue)}x${multiplier.toFixed(1)}`, false);
    } else {
        createParticle(centerX, centerY, `+${Math.floor(earnedValue)}`, false);
    }
    
    // Show combo when active
    if (state.comboCount > 1) {
        createParticle(centerX, centerY - 60, `COMBO x${state.comboCount}`, true);
    }
    
    // Create particle effects
    createClickParticles();
    
    updateDisplays();
    saveState();
}

function handleBuyPowerUp() {
    if (!canBuyPowerUp()) {
        return;
    }

    state.score -= state.powerUpCost;
    state.clickValue += 1;
    state.powerUpCount += 1;
    state.nextPowerUpAt += 500;
    state.powerUpCost = calculatePowerUpCost(state.powerUpCount);
    updateDisplays();
    saveState();
}

function initialize() {
    localStorage.clear();
    loadState();
    updateDisplays();
    clickButton.addEventListener('click', handleClick);
    powerUpButton.addEventListener('click', handleBuyPowerUp);
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            clickButton.click();
        }
        if (e.key === 'Enter' && !powerUpButton.hidden && !powerUpButton.disabled) {
            powerUpButton.click();
        }
    });
    
    const resetButton = getElement('#resetButton');
    resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your progress? This cannot be undone!')) {
            localStorage.clear();
            location.reload();
        }
    });
}

window.addEventListener('DOMContentLoaded', initialize);

