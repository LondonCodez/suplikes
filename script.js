// DOM Elements
const hababiGate = document.getElementById('hababiGate');
const mainContent = document.getElementById('mainContent');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

const modeScreen = document.getElementById('modeScreen');
const passwordScreen = document.getElementById('passwordScreen');
const loginScreen = document.getElementById('loginScreen');
const inputScreen = document.getElementById('inputScreen');
const freeResultsScreen = document.getElementById('freeResultsScreen');
const paymentResultsScreen = document.getElementById('paymentResultsScreen');

const freeModeBtn = document.getElementById('freeModeBtn');
const paymentModeBtn = document.getElementById('paymentModeBtn');
const passwordInput = document.getElementById('passwordInput');
const passwordBtn = document.getElementById('passwordBtn');
const backToModeBtn = document.getElementById('backToModeBtn');

const nameInput = document.getElementById('nameInput');
const loginBtn = document.getElementById('loginBtn');
const userName = document.getElementById('userName');

const freeUserNameResult = document.getElementById('freeUserNameResult');
const paymentUserNameResult = document.getElementById('paymentUserNameResult');
const supLikesInput = document.getElementById('supLikesInput');
const setLikesBtn = document.getElementById('setLikesBtn');
const freeLikesAmount = document.getElementById('freeLikesAmount');
const paymentLikesAmount = document.getElementById('paymentLikesAmount');
const freeResetBtn = document.getElementById('freeResetBtn');
const paymentResetBtn = document.getElementById('paymentResetBtn');

// Global variables
let currentUser = '';
let currentLikes = 0;
let currentMode = ''; // 'free' or 'payment'

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    // Gate is shown by default, main content is blurred
});

// Event Listeners
function setupEventListeners() {
    // Hababi Nation Gate listeners
    yesBtn.addEventListener('click', handleYesButton);
    noBtn.addEventListener('click', handleNoButton);
    
    freeModeBtn.addEventListener('click', handleFreeMode);
    paymentModeBtn.addEventListener('click', handlePaymentMode);
    passwordBtn.addEventListener('click', handlePasswordValidation);
    backToModeBtn.addEventListener('click', handleBackToMode);
    loginBtn.addEventListener('click', handleLogin);
    setLikesBtn.addEventListener('click', handleSetLikes);
    freeResetBtn.addEventListener('click', handleReset);
    paymentResetBtn.addEventListener('click', handleReset);
    
    // Enter key support
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    supLikesInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSetLikes();
        }
    });
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handlePasswordValidation();
        }
    });
}

// Screen Management
function showScreen(screenName) {
    // Hide all screens
    modeScreen.classList.remove('active');
    passwordScreen.classList.remove('active');
    loginScreen.classList.remove('active');
    inputScreen.classList.remove('active');
    freeResultsScreen.classList.remove('active');
    paymentResultsScreen.classList.remove('active');
    
    // Show requested screen
    switch(screenName) {
        case 'mode':
            modeScreen.classList.add('active');
            break;
        case 'password':
            passwordScreen.classList.add('active');
            passwordInput.focus();
            break;
        case 'login':
            loginScreen.classList.add('active');
            nameInput.focus();
            break;
        case 'input':
            inputScreen.classList.add('active');
            supLikesInput.focus();
            break;
        case 'freeResults':
            freeResultsScreen.classList.add('active');
            break;
        case 'paymentResults':
            paymentResultsScreen.classList.add('active');
            break;
    }
}

// Mode Handlers
function handleFreeMode() {
    currentMode = 'free';
    showScreen('login');
}

function handlePaymentMode() {
    showScreen('password');
}

function handlePasswordValidation() {
    const password = passwordInput.value.trim();
    
    if (password === '2626') {
        currentMode = 'payment';
        passwordInput.value = '';
        
        // Add loading effect with "Correct!" message
        passwordBtn.innerHTML = 'Correct! <span class="loading"></span>';
        passwordBtn.disabled = true;
        
        setTimeout(() => {
            showScreen('login');
            passwordBtn.innerHTML = 'Access Payment Mode';
            passwordBtn.disabled = false;
        }, 1000);
    } else {
        alert('Incorrect password! Please try again.');
        passwordInput.focus();
    }
}

function handleBackToMode() {
    passwordInput.value = '';
    showScreen('mode');
}

// Login Handler
function handleLogin() {
    const name = nameInput.value.trim();
    
    if (name === '') {
        alert('Please enter your name to continue!');
        nameInput.focus();
        return;
    }
    
    if (name.length < 2) {
        alert('Please enter a valid name (at least 2 characters)!');
        nameInput.focus();
        return;
    }
    
    currentUser = name;
    userName.textContent = name;
    
    // Add loading effect
    loginBtn.innerHTML = 'Entering Republic... <span class="loading"></span>';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        showScreen('input');
        
        // Update the input screen text based on mode
        const inputPrompt = document.querySelector('#inputScreen p');
        if (currentMode === 'payment') {
            inputPrompt.textContent = 'How many Sup Likes would you like to gift?';
        } else {
            inputPrompt.textContent = 'How many Sup Likes do you want to get?';
        }
        
        loginBtn.innerHTML = 'Enter Republic';
        loginBtn.disabled = false;
    }, 1000);
}

// Set Likes Handler
function handleSetLikes() {
    const likes = parseInt(supLikesInput.value);
    
    if (isNaN(likes) || likes <= 0) {
        alert('Please enter a valid number of Sup Likes (greater than 0)!');
        supLikesInput.focus();
        return;
    }
    
    if (likes > 999999) {
        alert('Whoa there! The Republic of Sup has a maximum of 999,999 Sup Likes!');
        supLikesInput.focus();
        return;
    }
    
    currentLikes = likes;
    
    // Add loading effect
    setLikesBtn.innerHTML = 'Setting Your Sup Likes... <span class="loading"></span>';
    setLikesBtn.disabled = true;
    
    setTimeout(() => {
        if (currentMode === 'free') {
            freeUserNameResult.textContent = currentUser;
            freeLikesAmount.textContent = formatNumber(likes);
            showScreen('freeResults');
        } else if (currentMode === 'payment') {
            paymentUserNameResult.textContent = currentUser;
            paymentLikesAmount.textContent = formatNumber(likes);
            showScreen('paymentResults');
        }
        
        setLikesBtn.innerHTML = 'Set My Sup Likes';
        setLikesBtn.disabled = false;
        
        // Celebrate with confetti effect (visual feedback)
        celebrateSupLikes();
    }, 1500);
}

// Reset Handler
function handleReset() {
    currentUser = '';
    currentLikes = 0;
    currentMode = '';
    nameInput.value = '';
    supLikesInput.value = '';
    passwordInput.value = '';
    
    // Add loading effect for whichever button was clicked
    const resetButton = event.target;
    const originalText = resetButton.innerHTML;
    resetButton.innerHTML = 'Resetting... <span class="loading"></span>';
    resetButton.disabled = true;
    
    setTimeout(() => {
        showScreen('mode');
        resetButton.innerHTML = originalText;
        resetButton.disabled = false;
    }, 800);
}

// Utility Functions
function formatNumber(num) {
    return num.toLocaleString();
}

function celebrateSupLikes() {
    // Add a temporary celebration class for animation
    const likesDisplay = document.querySelector('.likes-display');
    likesDisplay.style.animation = 'none';
    
    setTimeout(() => {
        likesDisplay.style.animation = 'pulse 2s infinite';
    }, 100);
    
    // Create floating sup likes animation
    createFloatingSupLikes();
}

function createFloatingSupLikes() {
    const container = document.querySelector('.results-box');
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const supElement = document.createElement('div');
            supElement.textContent = '⭐ SUP ⭐';
            supElement.style.cssText = `
                position: absolute;
                color: #FFD700;
                font-weight: bold;
                font-size: 1.2rem;
                pointer-events: none;
                left: ${Math.random() * 80 + 10}%;
                top: 50%;
                animation: floatUp 3s ease-out forwards;
                z-index: 1000;
            `;
            
            container.style.position = 'relative';
            container.appendChild(supElement);
            
            setTimeout(() => {
                if (supElement.parentNode) {
                    supElement.parentNode.removeChild(supElement);
                }
            }, 3000);
        }, i * 200);
    }
}

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
        }
    }
`;
document.head.appendChild(style);

// Hababi Nation Gate Functions
function handleYesButton() {
    // Redirect to the YouTube link
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
}

function handleNoButton() {
    // Hide the gate and remove blur from main content
    hababiGate.classList.add('gate-hidden');
    mainContent.classList.remove('blurred');
    
    // Show the mode selection screen
    showScreen('mode');
}

// Easter egg: Konami code for bonus sup likes
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        if (currentLikes > 0) {
            currentLikes += 1000;
            likesAmount.textContent = formatNumber(currentLikes);
            alert('🎉 BONUS! You found the secret Konami code! +1000 Sup Likes! 🎉');
            celebrateSupLikes();
        }
        konamiCode = [];
    }
});
