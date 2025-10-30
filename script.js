// Landing page script

// Background music - starts immediately
const backgroundMusic = new Audio('sounds/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

let isMuted = false;
let musicStarted = false;

// Function to start music on first interaction
function startMusicOnInteraction() {
    if (!musicStarted && !isMuted) {
        backgroundMusic.play().catch(e => console.log('Music play failed:', e));
        musicStarted = true;
    }
}

// Try to auto-start (may be blocked)
backgroundMusic.play().then(() => {
    musicStarted = true;
}).catch(e => {
    console.log('Autoplay blocked. Music will start on first interaction.');
    // Start music on any user interaction
    document.addEventListener('click', startMusicOnInteraction, { once: true });
    document.addEventListener('keydown', startMusicOnInteraction, { once: true });
});

// Single volume toggle button
const volumeToggle = document.getElementById('volumeToggle');
const volumeIcon = document.getElementById('volumeIcon');

// Check saved music state
if (localStorage.getItem('musicMuted') === 'true') {
    isMuted = true;
    backgroundMusic.pause();
    volumeToggle.classList.add('muted');
    volumeIcon.src = 'volumeoff.png';
}

// Toggle volume on click
volumeToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    
    if (isMuted) {
        backgroundMusic.pause();
        volumeToggle.classList.add('muted');
        volumeIcon.src = 'volumeoff.png';
        localStorage.setItem('musicMuted', 'true');
    } else {
        backgroundMusic.play();
        musicStarted = true;
        volumeToggle.classList.remove('muted');
        volumeIcon.src = 'volumeon.png';
        localStorage.setItem('musicMuted', 'false');
    }
});

// Sound effects - Define at the top
const buttonSound = new Audio('sounds/clicking.mp3');

// Helper function to play sound
function playSound(sound) {
    if (!isMuted) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
    }
}

// Enter button functionality
document.getElementById('enterBtn').addEventListener('click', function() {
    const name = document.getElementById('nameInput').value.trim();
    
    if (name === '') {
        alert('Please enter your name!');
        return;
    }
    
    /// Play button sound
if (!isMuted) {
    buttonSound.currentTime = 0;
    buttonSound.play();
}

// Save name to localStorage
localStorage.setItem('userName', name);

// Small delay to let sound play before navigating
setTimeout(() => {
    window.location.href = 'box.html';
}, 500);  // ← Increase to 500ms
});

// Allow enter key to submit
document.getElementById('nameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('enterBtn').click();
    }
});