console.log("Script started");

let clickCount = 0;
const clickButton = document.getElementById('clickButton');

clickButton.addEventListener('click', function() {
    clickCount++;
    console.log('Clicks: ' + clickCount);
    clickButton.textContent = clickCount;
});

