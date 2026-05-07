console.log("Script started");

let score = 0;
let clickValue = 1;
let powerUpCost = 500;
let hasPowerUp = false;

const clickButton = document.getElementById('clickButton');
const powerUpButton = document.getElementById('powerUpButton');

// Function to handle the main button click
function handleClick() {
    score += clickValue;
    updateScoreDisplay();
    checkPowerUpVisibility();
}

// Function to update the score display
function updateScoreDisplay() {
    clickButton.textContent = score;
}

// Function to check if the power-up button should be visible
function checkPowerUpVisibility() {
    if (score >= powerUpCost && !hasPowerUp) {
        powerUpButton.style.display = 'block';
    }
}

// Function to handle buying the power-up
function handleBuyPowerUp() {
    if (score >= powerUpCost) {
        score -= powerUpCost;
        clickValue = 2;
        hasPowerUp = true;
        powerUpButton.style.display = 'none';
        updateScoreDisplay();
    }
}

// Load saved data or start fresh
let totalClicks = 0;
let powerUpCount = 0;
let timesPlayed = 0;

// Function to load data from local storage
function loadData() {
    // Get data from local storage
    // If no data exists, use 0 as default
}

// Function to save data to local storage
function saveData() {
    // Save totalClicks, powerUpCount, timesPlayed
}


// Add event listeners
clickButton.addEventListener('click', handleClick);
powerUpButton.addEventListener('click', handleBuyPowerUp);

