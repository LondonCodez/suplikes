// DOM Elements
const hababiGate = document.getElementById('hababiGate');
const mainContent = document.getElementById('mainContent');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

const modeScreen = document.getElementById('modeScreen');
const passcodeScreen = document.getElementById('passwordScreen');
const loginScreen = document.getElementById('loginScreen');
const inputScreen = document.getElementById('inputScreen');
const freeResultsScreen = document.getElementById('freeResultsScreen');
const paymentResultsScreen = document.getElementById('paymentResultsScreen');

const freeModeBtn = document.getElementById('freeModeBtn');
const paymentModeBtn = document.getElementById('paymentModeBtn');
const passcodeInput = document.getElementById('passwordInput');
const passcodeBtn = document.getElementById('passwordBtn');
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
const freeLeaderboardBtn = document.getElementById('freeLeaderboardBtn');
const paymentLeaderboardBtn = document.getElementById('paymentLeaderboardBtn');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const leaderboardList = document.getElementById('leaderboardList');
const addToLeaderboardBtn = document.getElementById('addToLeaderboardBtn');
const backFromLeaderboardBtn = document.getElementById('backFromLeaderboardBtn');
const subModeScreen = document.getElementById('subModeScreen');
const subModeTitle = document.getElementById('subModeTitle');
const userModeBtn = document.getElementById('userModeBtn');
const adminModeBtn = document.getElementById('adminModeBtn');
const backFromSubModeBtn = document.getElementById('backFromSubModeBtn');
const adminPasswordScreen = document.getElementById('adminPasswordScreen');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const adminPasswordBtn = document.getElementById('adminPasswordBtn');
const backFromAdminBtn = document.getElementById('backFromAdminBtn');
const mainLeaderboardBtn = document.getElementById('mainLeaderboardBtn');

// Global variables
let currentUser = '';
let currentLikes = 0;
let currentMode = ''; // 'free' or 'payment'
let isAdminMode = false;
let lastScreen = ''; // Track where we came from for back navigation

// Leaderboard data
let leaderboardData = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadLeaderboardData();
    // Gate is shown by default, main content is blurred
});

// Leaderboard persistence functions
function saveLeaderboardData() {
    localStorage.setItem('supLikesLeaderboard', JSON.stringify(leaderboardData));
}

function loadLeaderboardData() {
    const savedData = localStorage.getItem('supLikesLeaderboard');
    if (savedData) {
        try {
            leaderboardData = JSON.parse(savedData);
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            leaderboardData = [];
        }
    }
}

// Event Listeners
function setupEventListeners() {
    // Hababi Nation Gate listeners
    yesBtn.addEventListener('click', handleYesButton);
    noBtn.addEventListener('click', handleNoButton);
    
    freeModeBtn.addEventListener('click', handleFreeMode);
    paymentModeBtn.addEventListener('click', handlePaymentMode);
    passcodeBtn.addEventListener('click', handlePasscodeValidation);
    backToModeBtn.addEventListener('click', handleBackToMode);
    loginBtn.addEventListener('click', handleLogin);
    setLikesBtn.addEventListener('click', handleSetLikes);
    freeResetBtn.addEventListener('click', handleReset);
    paymentResetBtn.addEventListener('click', handleReset);
    freeLeaderboardBtn.addEventListener('click', () => handleLeaderboard('freeResults'));
    paymentLeaderboardBtn.addEventListener('click', () => handleLeaderboard('paymentResults'));
    addToLeaderboardBtn.addEventListener('click', handleAddToLeaderboard);
    backFromLeaderboardBtn.addEventListener('click', handleBackFromLeaderboard);
    userModeBtn.addEventListener('click', handleUserMode);
    adminModeBtn.addEventListener('click', handleAdminMode);
    backFromSubModeBtn.addEventListener('click', handleBackFromSubMode);
    adminPasswordBtn.addEventListener('click', handleAdminPasswordValidation);
    backFromAdminBtn.addEventListener('click', handleBackFromAdmin);
    mainLeaderboardBtn.addEventListener('click', () => handleLeaderboard('mode'));
    
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
    
    passcodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handlePasscodeValidation();
        }
    });
    
    adminPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleAdminPasswordValidation();
        }
    });
}

// Screen Management
function showScreen(screenName) {
    // Hide all screens
    modeScreen.classList.remove('active');
    subModeScreen.classList.remove('active');
    adminPasswordScreen.classList.remove('active');
    passcodeScreen.classList.remove('active');
    loginScreen.classList.remove('active');
    inputScreen.classList.remove('active');
    freeResultsScreen.classList.remove('active');
    paymentResultsScreen.classList.remove('active');
    leaderboardScreen.classList.remove('active');
    
    // Show requested screen
    switch(screenName) {
        case 'mode':
            modeScreen.classList.add('active');
            break;
        case 'subMode':
            subModeScreen.classList.add('active');
            break;
        case 'adminPassword':
            adminPasswordScreen.classList.add('active');
            adminPasswordInput.focus();
            break;
        case 'passcode':
            passcodeScreen.classList.add('active');
            passcodeInput.focus();
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
        case 'leaderboard':
            leaderboardScreen.classList.add('active');
            displayLeaderboard();
            break;
    }
}

// Mode Handlers
function handleFreeMode() {
    currentMode = 'free';
    subModeTitle.textContent = 'Free Mode - Choose Access Level';
    showScreen('subMode');
}

function handlePaymentMode() {
    currentMode = 'payment';
    subModeTitle.textContent = 'Gift Mode - Choose Access Level';
    showScreen('subMode');
}

function handleUserMode() {
    isAdminMode = false;
    showScreen('login');
}

function handleAdminMode() {
    showScreen('adminPassword');
}

function handleBackFromSubMode() {
    showScreen('mode');
}

function handleAdminPasswordValidation() {
    const password = adminPasswordInput.value.trim();
    
    if (password === '1234') {
        isAdminMode = true;
        adminPasswordInput.value = '';
        
        adminPasswordBtn.innerHTML = 'Correct! <span class="loading"></span>';
        adminPasswordBtn.disabled = true;
        
        setTimeout(() => {
            showScreen('login');
            adminPasswordBtn.innerHTML = 'Enter Admin Mode';
            adminPasswordBtn.disabled = false;
        }, 1000);
    } else {
        alert('Incorrect admin passcode! Please try again.');
        adminPasswordInput.focus();
    }
}

function handleBackFromAdmin() {
    adminPasswordInput.value = '';
    showScreen('subMode');
}

function handlePasscodeValidation() {
    const passcode = passcodeInput.value.trim();
    
    if (passcode === '2626') {
        passcodeInput.value = '';
        
        // Add loading effect with "Correct!" message
        passcodeBtn.innerHTML = 'Correct! <span class="loading"></span>';
        passcodeBtn.disabled = true;
        
        setTimeout(() => {
            showScreen('mode');
            passcodeBtn.innerHTML = 'Enter Passcode';
            passcodeBtn.disabled = false;
        }, 1000);
    } else {
        alert('Incorrect passcode! Please try again.');
        passcodeInput.focus();
    }
}

function handleBackToMode() {
    passcodeInput.value = '';
    showScreen('passcode');
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
    
    if (!isAdminMode && likes > 999999) {
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
    isAdminMode = false;
    nameInput.value = '';
    supLikesInput.value = '';
    passcodeInput.value = '';
    adminPasswordInput.value = '';
    
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

// Leaderboard Functions
function handleLeaderboard(fromScreen) {
    lastScreen = fromScreen;
    showScreen('leaderboard');
}

function displayLeaderboard() {
    // Sort leaderboard by likes (descending)
    const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.likes - a.likes);
    
    leaderboardList.innerHTML = '';
    
    sortedLeaderboard.forEach((entry, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'leaderboard-item';
        
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
        const modeIcon = entry.mode === 'payment' ? '🎁' : '⭐';
        
        listItem.innerHTML = `
            <span class="rank">${medal}</span>
            <span class="name">${entry.name}</span>
            <span class="likes">${formatNumber(entry.likes)} ${modeIcon}</span>
        `;
        
        // Highlight current user if they're on the leaderboard
        if (entry.name === currentUser) {
            listItem.classList.add('current-user');
        }
        
        leaderboardList.appendChild(listItem);
    });
}

function handleAddToLeaderboard() {
    if (!currentUser || currentLikes === 0) {
        alert('You need to set your Sup Likes first!');
        return;
    }
    
    // Check if user already exists on leaderboard
    const existingIndex = leaderboardData.findIndex(entry => entry.name === currentUser);
    
    if (existingIndex !== -1) {
        // Update existing entry if new score is higher
        if (currentLikes > leaderboardData[existingIndex].likes) {
            leaderboardData[existingIndex].likes = currentLikes;
            leaderboardData[existingIndex].mode = currentMode;
            saveLeaderboardData();
            alert('🎉 New personal best! Leaderboard updated!');
        } else {
            alert('Your current score is not higher than your leaderboard entry.');
        }
    } else {
        // Add new entry
        leaderboardData.push({
            name: currentUser,
            likes: currentLikes,
            mode: currentMode
        });
        saveLeaderboardData();
        alert('🎉 Added to leaderboard!');
    }
    
    // Refresh the display
    displayLeaderboard();
    
    // Add celebration effect
    celebrateSupLikes();
}

function handleBackFromLeaderboard() {
    if (lastScreen === 'freeResults') {
        showScreen('freeResults');
    } else if (lastScreen === 'paymentResults') {
        showScreen('paymentResults');
    } else if (lastScreen === 'mode') {
        showScreen('mode');
    } else {
        showScreen('mode');
    }
}

// Hababi Nation Gate Functions
function handleYesButton() {
    // Redirect to the YouTube link
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
}

function handleNoButton() {
    // Hide the gate and remove blur from main content
    hababiGate.classList.add('gate-hidden');
    mainContent.classList.remove('blurred');
    
    // Show the passcode screen for non-hababi nation users
    showScreen('passcode');
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
