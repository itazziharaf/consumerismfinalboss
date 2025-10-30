// Results page script
const userName = localStorage.getItem('userName') || 'You';
const itemCount = parseInt(localStorage.getItem('itemCount')) || 0;

// Background music
const backgroundMusic = new Audio('sounds/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

let isMuted = false;

// Start background music
backgroundMusic.play().catch(e => console.log('Background music autoplay blocked:', e));

// Auto-start music on first user interaction (anywhere on page)
document.body.addEventListener('click', function startMusic() {
    if (!isMuted) {
        backgroundMusic.play();
    }
    // Remove listener after first click so it doesn't keep triggering
    document.body.removeEventListener('click', startMusic);
}, { once: true });

// Single volume toggle button
const volumeToggle = document.getElementById('volumeToggle');
const volumeIcon = document.getElementById('volumeIcon');

// Check saved music state from previous page
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
        volumeToggle.classList.remove('muted');
        volumeIcon.src = 'volumeon.png';
        localStorage.setItem('musicMuted', 'false');
    }
});

// Sound effect
const buttonSound = new Audio('sounds/clicking.mp3');

function playSound(sound) {
    if (!isMuted) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
    }
}

document.getElementById('userName').textContent = userName;

// Tier system
const tiers = [
    {
        min: 0,
        max: 4,
        title: '🌱 Minimalist Survivor',
        description: 'You\'re living light! While trends come and go, you stick to what you truly need. Your wallet and the planet thank you. 🌱',
        emoji: '🌱'
    },
    {
        min: 5,
        max: 9,
        title: '🛒 Thoughtful Consumer',
        description: 'You pick your trends carefully. You own some hyped items, but you\'re not drowning in consumerism... yet. Balance is key! ⚖️',
        emoji: '🛒'
    },
    {
        min: 10,
        max: 14,
        title: '⚡ Trend Victim ',
        description: "You\'ve fallen victim to the trend cycle - hard. Every viral product found its way to you, and you couldn\'t resist. The marketing got you, and your overflowing cart proves it. But hey, at least you\'re honest about it? 🛍️",
        emoji: '⚡'
    },
    {
        min: 15,
        max: 18,
        title: '🎯 Algorithm\'s Favorite',
        description: "The algorithm knows you too well. You've clicked 'Add to Cart' on almost every trend that crossed your feed. You're living proof that targeted ads work. Your shopping habits are basically a case study in modern consumerism. Self-awareness incoming? 🤖💸",
        emoji: '🎯'
    },
    {
        min: 19,
        max: 23,
        title: '💀 CONSUMERISM FINAL BOSS',
        description: "CONGRATULATIONS! You\'ve achieved peak consumer consciousness. Every trend has touched your life. Your Amazon wishlist is longer than most novels. You don\'t just buy products—you collect experiences (that require products). Legend",
        emoji: '💀'
    }
];

// Find the appropriate tier
const tier = tiers.find(t => itemCount >= t.min && itemCount <= t.max) || tiers[0];

// Display results
document.getElementById('tierTitle').textContent = tier.title;
document.getElementById('tierDescription').textContent = tier.description;
document.getElementById('itemCount').textContent = `You own ${itemCount} out of 23 trendy items`;

// Screenshot button
document.getElementById('screenshotBtn').addEventListener('click', () => {
    playSound(buttonSound);
    
    // Hide buttons and volume toggle before screenshot
    const restartBtn = document.getElementById('restartBtn');
    const screenshotBtn = document.getElementById('screenshotBtn');
    const volumeBtn = document.getElementById('volumeToggle');
    
    restartBtn.style.display = 'none';
    screenshotBtn.style.display = 'none';
    volumeBtn.style.display = 'none';
    
    // Wait a moment for buttons to hide
    setTimeout(() => {
        html2canvas(document.body, {
            backgroundColor: '#d3d2d2',
            scale: 2
        }).then(canvas => {
            // Convert to image and download
            const link = document.createElement('a');
            link.download = `${userName}-consumerism-result.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Show buttons again
            restartBtn.style.display = 'block';
            screenshotBtn.style.display = 'block';
            volumeBtn.style.display = 'block';
        });
    }, 100);
});

// Restart button
document.getElementById('restartBtn').addEventListener('click', () => {
    // Play button sound
    playSound(buttonSound);
    
    // Small delay to let sound play
    setTimeout(() => {
        localStorage.clear();
        window.location.href = 'index.html';
    }, 400);
});