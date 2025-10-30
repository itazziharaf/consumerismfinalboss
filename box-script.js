// Box page script
const userName = localStorage.getItem('userName') || 'Your';
document.getElementById('boxTitle').textContent = `${userName}'s Box`;

// Sound effects
const backgroundMusic = new Audio('sounds/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

const clickSound = new Audio('sounds/clicking.mp3');
const dropSound = new Audio('sounds/drop.mp3');
const buttonSound = new Audio('sounds/clicking.mp3');

let isMuted = false;

// Start background music
backgroundMusic.play().catch(e => console.log('Background music autoplay blocked:', e));

// Auto-start music on first user interaction (anywhere on page)
document.body.addEventListener('click', function startMusic() {
    if (!isMuted) {
        backgroundMusic.play();
    }
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

// Helper function to play sound
function playSound(sound) {
    if (!isMuted) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
    }
}

// Mouse tracking - CRITICAL for hover effect!
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let itemsInBox = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Trendy items
const trendyItems = [
    { id: 1, name: 'Stanley Cup', image: 'stanleycup.png' },
    { id: 2, name: 'AirPods', image: 'airpods.png' },
    { id: 3, name: 'Lululemon', image: 'lululemon.png' },
    { id: 4, name: 'Dyson Airwrap', image: 'dyson airwrap.png' },
    { id: 5, name: 'Arcteryx', image: 'arcteryx.png' },
    { id: 6, name: 'Owala', image: 'owala.png' },
    { id: 7, name: 'Nintendo Switch', image: 'nintendoswitch.png' },
    { id: 8, name: 'Labubu', image: 'labubu.png' },
    { id: 9, name: 'Smiski', image: 'smiski.png' },
    { id: 10, name: 'Apple Watch', image: 'applewatch.png' },
    { id: 11, name: 'Kindle', image: 'kindle.png' },
    { id: 12, name: 'Sonnyangel', image: 'sonnyangel.png' },
    { id: 13, name: 'Rimowa', image: 'rimowa.png' },
    { id: 14, name: 'Louiscarmen', image: 'louiscarmen.png' },
    { id: 15, name: 'Tabis', image: 'tabis.png' },
    { id: 16, name: 'samba', image: 'samba.png' },
    { id: 17, name: 'jellycat', image: 'jellycat.png' },
    { id: 18, name: 'matcha', image: 'matcha.png' },
    { id: 19, name: 'airpodsmax', image: 'airpodsmax.png' },
    { id: 20, name: 'rhode', image: 'rhode.png' },
    { id: 21, name: 'rhodeblush', image: 'rhodeblush.png' },
    { id: 22, name: 'santal33', image: 'santal33.png' },
    { id: 23, name: 'iphone17', image: 'iphone17.png' },

];

// Create floating items scattered around the box
const floatingItemsContainer = document.getElementById('floatingItems');
const items = [];

// Get box position (center of screen)
const boxCenterX = window.innerWidth / 2;
const boxCenterY = window.innerHeight / 2;

trendyItems.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'floating-item';
    itemDiv.dataset.itemId = item.id;
    itemDiv.innerHTML = `<img src="${item.image}" alt="${item.name}" draggable="false">`;
    
    // Distribute items in a circle around the box
    const angle = (index / trendyItems.length) * Math.PI * 2;
    const distance = 350; // Fixed distance from center
    
    const startX = boxCenterX + Math.cos(angle) * distance - 100;
    const startY = boxCenterY + Math.sin(angle) * distance - 100;
    
    itemDiv.style.left = startX + 'px';
    itemDiv.style.top = startY + 'px';
    
    floatingItemsContainer.appendChild(itemDiv);
    
    items.push({
        element: itemDiv,
        x: startX,
        y: startY,
        vx: 0,
        vy: 0,
        item: item
    });
    
    // Make item draggable
    makeItemDraggable(itemDiv, item);
});

// Animate items to move away from cursor when hovering
function animateItems() {
    items.forEach(itemObj => {
        if (!itemObj.element.classList.contains('dragging')) {
            // Calculate distance from cursor to item center
            const itemCenterX = itemObj.x + 100;
            const itemCenterY = itemObj.y + 100;
            const dx = itemCenterX - mouseX;
            const dy = itemCenterY - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Push items away from cursor when it gets close
            const hoverRadius = 150;
            if (distance < hoverRadius && distance > 0) {
                const force = (hoverRadius - distance) / hoverRadius;
                const pushStrength = 3;
                itemObj.vx += (dx / distance) * force * pushStrength;
                itemObj.vy += (dy / distance) * force * pushStrength;
            }
            
            // Apply velocity with damping
            itemObj.vx *= 0.92;
            itemObj.vy *= 0.92;
            
            itemObj.x += itemObj.vx;
            itemObj.y += itemObj.vy;
            
            // Keep items within bounds with bounce
            const margin = 50;
            if (itemObj.x < margin) {
                itemObj.x = margin;
                itemObj.vx *= -0.5;
            }
            if (itemObj.x > window.innerWidth - margin - 200) {
                itemObj.x = window.innerWidth - margin - 200;
                itemObj.vx *= -0.5;
            }
            if (itemObj.y < margin) {
                itemObj.y = margin;
                itemObj.vy *= -0.5;
            }
            if (itemObj.y > window.innerHeight - margin - 200) {
                itemObj.y = window.innerHeight - margin - 200;
                itemObj.vy *= -0.5;
            }
            
            // Update position
            itemObj.element.style.left = itemObj.x + 'px';
            itemObj.element.style.top = itemObj.y + 'px';
        }
    });
    
    requestAnimationFrame(animateItems);
}

animateItems();

// Drag and drop functionality
function makeItemDraggable(element, item) {
    let isDragging = false;
    let offsetX, offsetY;
    
    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        element.classList.add('dragging');
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.zIndex = 1000;
        
        // Play click sound when grabbing item
        playSound(clickSound);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            element.classList.remove('dragging');
            element.style.zIndex = 1;
            
            // Check if dropped in box
            const box = document.getElementById('box');
            const boxRect = box.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            
            if (
                elementRect.left < boxRect.right &&
                elementRect.right > boxRect.left &&
                elementRect.top < boxRect.bottom &&
                elementRect.bottom > boxRect.top
            ) {
                // Add to box
                addItemToBox(item);
                element.style.display = 'none';
                
                // Play drop sound
                playSound(dropSound);
            } else {
                // Update position in items array
                const itemObj = items.find(i => i.element === element);
                if (itemObj) {
                    itemObj.x = parseFloat(element.style.left);
                    itemObj.y = parseFloat(element.style.top);
                }
            }
        }
    });
}

function addItemToBox(item) {
    // Check if already in box
    if (itemsInBox.find(i => i.id === item.id)) {
        return;
    }
    
    itemsInBox.push(item);
    updateBoxDisplay();
}

function removeItemFromBox(itemId) {
    itemsInBox = itemsInBox.filter(i => i.id !== itemId);
    
    // Show the floating item again
    const floatingItem = items.find(i => i.item.id === itemId);
    if (floatingItem) {
        floatingItem.element.style.display = 'block';
    }
    
    // Play click sound when removing
    playSound(clickSound);
    
    updateBoxDisplay();
}

function updateBoxDisplay() {
    const itemsInBoxContainer = document.getElementById('itemsInBox');
    const boxHint = document.querySelector('.box-hint');
    
    if (itemsInBox.length > 0) {
        boxHint.style.display = 'none';
    } else {
        boxHint.style.display = 'block';
    }
    
    itemsInBoxContainer.innerHTML = '';
    
    itemsInBox.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-in-box';
        itemDiv.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
        itemDiv.addEventListener('click', () => removeItemFromBox(item.id));
        itemsInBoxContainer.appendChild(itemDiv);
    });
}

// Done button
document.getElementById('doneBtn').addEventListener('click', () => {
    // Play button sound
    playSound(buttonSound);
    
    // Small delay to let sound play before page change
    setTimeout(() => {
        localStorage.setItem('itemCount', itemsInBox.length);
        window.location.href = 'results.html';
    }, 400);
});