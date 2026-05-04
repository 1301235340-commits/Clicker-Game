console.log("Script started");

let clickCount = 0;
const clickButton = document.getElementById('clickButton');
const statsDiv = document.getElementById('stats');

clickButton.addEventListener('click', function() {
    clickCount++;
    console.log('Clicks: ' + clickCount);
    clickButton.textContent = clickCount;
    statsDiv.textContent = 'Clicks: ' + clickCount;
});

