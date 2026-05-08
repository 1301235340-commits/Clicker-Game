console.log("Script started");

let score = 0;
let clickValue = 1;
let powerUpCost = 500;
let hasPowerUp = false;
let totalClicks = 0;
let powerUpCount = 0;
let timesPlayed = 0;

// DOM elements
const clickButton = document.getElementById('clickButton');
const powerUpButton = document.getElementById('powerUpButton');
const totalClicksDisplay = document.getElementById('totalClicks');
const powerUpCountDisplay = document.getElementById('powerUpCount');
const timesPlayedDisplay = document.getElementById('timesPlayed');

// Function to load data from local storage
function loadData() {
    // Load everything except score
    clickValue = parseInt(localStorage.getItem('clickValue')) || 1;
    hasPowerUp = localStorage.getItem('hasPowerUp') === 'true';
    totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
    powerUpCount = parseInt(localStorage.getItem('powerUpCount')) || 0;
    timesPlayed = parseInt(localStorage.getItem('timesPlayed')) || 0;
    timesPlayed++;
    localStorage.setItem('timesPlayed', timesPlayed);
    
    // Always start score at 0
    score = 0;
}

// Function to save data to local storage
function saveData() {
    localStorage.setItem('score', score);
    localStorage.setItem('clickValue', clickValue);
    localStorage.setItem('hasPowerUp', hasPowerUp);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('powerUpCount', powerUpCount);
    localStorage.setItem('timesPlayed', timesPlayed);
}

// Function to update all displays
function updateDisplays() {
    clickButton.textContent = score;
    totalClicksDisplay.textContent = totalClicks;
    powerUpCountDisplay.textContent = powerUpCount;
    timesPlayedDisplay.textContent = timesPlayed;
    checkPowerUpVisibility();
}

// Function to handle the main button click
function handleClick() {
    score += clickValue;
    totalClicks++;
    updateDisplays();
    saveData();
}

// Function to check if the power-up button should be visible
function checkPowerUpVisibility() {
    if (score >= powerUpCost && !hasPowerUp) {
        powerUpButton.style.display = 'block';
    } else {
        powerUpButton.style.display = 'none';
    }
}

// Function to handle buying the power-up
function handleBuyPowerUp() {
    if (score >= powerUpCost) {
        score -= powerUpCost;
        clickValue = 2;
        hasPowerUp = true;
        powerUpCount++;
        updateDisplays();
        saveData();
    }
}

// Initialize the game
loadData();
updateDisplays();

// Add event listeners
clickButton.addEventListener('click', handleClick);
powerUpButton.addEventListener('click', handleBuyPowerUp);

