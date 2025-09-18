// Global state
let currentUser = null;
let currentLocation = null;
let selectedImage = null;
let isLogin = true;

// API Configuration
const API_BASE = 'http://localhost:3001/api';

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const authForm = document.getElementById('auth-form');
const loginToggle = document.getElementById('login-toggle');
const signupToggle = document.getElementById('signup-toggle');
const authSwitch = document.getElementById('auth-switch');
const authSwitchText = document.getElementById('auth-switch-text');
const authSubmit = document.getElementById('auth-submit');
const passwordToggle = document.getElementById('password-toggle');
const errorMessage = document.getElementById('error-message');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    registerServiceWorker();
});

function initializeApp() {
    // Check if user is logged in
    const token = localStorage.getItem('ikimera_token');
    const savedUser = localStorage.getItem('ikimera_user');
    
    if (token && savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showMainApp();
        } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('ikimera_token');
            localStorage.removeItem('ikimera_user');
        }
    }
}

function setupEventListeners() {
    // Auth toggle
    loginToggle.addEventListener('click', () => switchToLogin());
    signupToggle.addEventListener('click', () => switchToSignup());
    authSwitch.addEventListener('click', () => {
        if (isLogin) switchToSignup();
        else switchToLogin();
    });

    // Password toggle
    passwordToggle.addEventListener('click', togglePassword);

    // Auth form
    authForm.addEventListener('submit', handleAuth);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = e.currentTarget.dataset.tab;
            switchTab(tab);
        });
    });

    // Diagnose tab
    setupDiagnoseTab();

    // Profile tab
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Weather tab
    setupWeatherTab();
}

function switchToLogin() {
    isLogin = true;
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
    document.getElementById('name-group').style.display = 'none';
    document.getElementById('phone-group').style.display = 'none';
    authSubmit.innerHTML = '<span class="icon">📝</span>Login';
    authSwitchText.textContent = "Don't have an account? ";
    authSwitch.textContent = 'Sign Up';
    document.getElementById('name').required = false;
    document.getElementById('phone').required = false;
}

function switchToSignup() {
    isLogin = false;
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
    document.getElementById('name-group').style.display = 'block';
    document.getElementById('phone-group').style.display = 'block';
    authSubmit.innerHTML = '<span class="icon">👤</span>Sign Up';
    authSwitchText.textContent = "Already have an account? ";
    authSwitch.textContent = 'Login';
    document.getElementById('name').required = true;
    document.getElementById('phone').required = true;
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = passwordToggle.querySelector('.icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        icon.textContent = '👁️';
    }
}

async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    const submitBtn = document.getElementById('auth-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner"></div>';

    try {
        const endpoint = isLogin ? '/auth/login' : '/auth/signup';
        const body = isLogin 
            ? { email, password }
            : { name, email, phone, password };

        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Authentication failed');
        }

        const data = await response.json();
        
        localStorage.setItem('ikimera_token', data.token);
        localStorage.setItem('ikimera_user', JSON.stringify(data.user));
        currentUser = data.user;
        
        showMainApp();
        hideError();
    } catch (error) {
        showError(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = isLogin 
            ? '<span class="icon">📝</span>Login'
            : '<span class="icon">👤</span>Sign Up';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showMainApp() {
    authScreen.style.display = 'none';
    mainApp.style.display = 'flex';
    
    // Update user info
    document.getElementById('user-name').textContent = `Hello, ${currentUser.name}`;
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-phone').textContent = currentUser.phone;
    document.getElementById('profile-role').textContent = currentUser.role;
    document.getElementById('profile-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    
    // Load initial data
    loadHistory();
    loadWeather();
}

function logout() {
    localStorage.removeItem('ikimera_token');
    localStorage.removeItem('ikimera_user');
    currentUser = null;
    authScreen.style.display = 'flex';
    mainApp.style.display = 'none';
    
    // Reset form
    authForm.reset();
    hideError();
}

function switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load tab-specific data
    if (tabName === 'history') {
        loadHistory();
    } else if (tabName === 'weather') {
        loadWeather();
    }
}

// Diagnose Tab Functions
function setupDiagnoseTab() {
    const uploadArea = document.getElementById('upload-area');
    const cropImageInput = document.getElementById('crop-image');
    const imageForm = document.getElementById('image-form');
    const previewImage = document.getElementById('preview-image');
    const getLocationBtn = document.getElementById('get-location');
    const analyzeCropBtn = document.getElementById('analyze-crop');
    const resetFormBtn = document.getElementById('reset-form');
    const diagnoseAnotherBtn = document.getElementById('diagnose-another');

    // Upload area click
    uploadArea.addEventListener('click', () => {
        cropImageInput.click();
    });

    // File input change
    cropImageInput.addEventListener('change', handleImageSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Buttons
    getLocationBtn.addEventListener('click', getCurrentLocation);
    analyzeCropBtn.addEventListener('click', analyzeCrop);
    resetFormBtn.addEventListener('click', resetDiagnoseForm);
    diagnoseAnotherBtn.addEventListener('click', resetDiagnoseForm);
}

function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        selectedImage = file;
        const url = URL.createObjectURL(file);
        previewImage.src = url;
        previewImage.style.display = 'block';
        
        document.getElementById('upload-area').style.display = 'none';
        document.getElementById('image-form').style.display = 'block';
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        selectedImage = files[0];
        const url = URL.createObjectURL(files[0]);
        previewImage.src = url;
        previewImage.style.display = 'block';
        
        document.getElementById('upload-area').style.display = 'none';
        document.getElementById('image-form').style.display = 'block';
    }
}

function getCurrentLocation() {
    const btn = document.getElementById('get-location');
    const display = document.getElementById('location-display');
    
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>Getting Location...';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
                };
                
                display.textContent = `📍 ${currentLocation.address}`;
                display.style.display = 'block';
                
                btn.disabled = false;
                btn.innerHTML = '<span class="icon">📍</span>Location Updated';
            },
            (error) => {
                console.error('Error getting location:', error);
                btn.disabled = false;
                btn.innerHTML = '<span class="icon">📍</span>Get Current Location';
                showError('Unable to get location');
            }
        );
    } else {
        btn.disabled = false;
        btn.innerHTML = '<span class="icon">📍</span>Get Current Location';
        showError('Geolocation not supported');
    }
}

async function analyzeCrop() {
    if (!selectedImage) return;

    const btn = document.getElementById('analyze-crop');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>Analyzing...';

    try {
        const token = localStorage.getItem('ikimera_token');
        const formData = new FormData();
        
        formData.append('cropImage', selectedImage);
        formData.append('notes', document.getElementById('crop-notes').value);
        formData.append('cropType', document.getElementById('crop-type').value);
        
        if (currentLocation) {
            formData.append('latitude', currentLocation.latitude.toString());
            formData.append('longitude', currentLocation.longitude.toString());
            formData.append('address', currentLocation.address);
        }

        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        showDiagnosisResult(data);
    } catch (error) {
        console.error('Upload error:', error);
        showError('Failed to analyze crop. Please try again.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span class="icon">📷</span>Analyze Crop';
    }
}

function showDiagnosisResult(data) {
    document.getElementById('image-form').style.display = 'none';
    
    const resultDiv = document.getElementById('diagnosis-result');
    const resultImage = document.getElementById('result-image');
    const diagnosisBadge = document.getElementById('diagnosis-badge');
    const diseaseName = document.getElementById('disease-name');
    const confidenceLevel = document.getElementById('confidence-level');
    const recommendationsDiv = document.getElementById('recommendations');
    const recommendationsList = document.getElementById('recommendations-list');

    resultImage.src = previewImage.src;
    diseaseName.textContent = data.diagnosis.disease;
    confidenceLevel.textContent = ` (${data.diagnosis.confidence}% confidence)`;
    
    // Set severity class
    diagnosisBadge.className = `status-badge status-${data.diagnosis.severity}`;
    
    // Show recommendations
    if (data.diagnosis.recommendations && data.diagnosis.recommendations.length > 0) {
        recommendationsList.innerHTML = '';
        data.diagnosis.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            li.style.marginBottom = '4px';
            recommendationsList.appendChild(li);
        });
        recommendationsDiv.style.display = 'block';
    }
    
    resultDiv.style.display = 'block';
}

function resetDiagnoseForm() {
    selectedImage = null;
    currentLocation = null;
    
    document.getElementById('upload-area').style.display = 'block';
    document.getElementById('image-form').style.display = 'none';
    document.getElementById('diagnosis-result').style.display = 'none';
    document.getElementById('crop-image').value = '';
    document.getElementById('crop-type').value = '';
    document.getElementById('crop-notes').value = '';
    document.getElementById('location-display').style.display = 'none';
    document.getElementById('get-location').innerHTML = '<span class="icon">📍</span>Get Current Location';
}

// History Tab Functions
async function loadHistory() {
    const historyLoading = document.getElementById('history-loading');
    const historyEmpty = document.getElementById('history-empty');
    const historyList = document.getElementById('history-list');

    historyLoading.style.display = 'flex';
    historyEmpty.style.display = 'none';
    historyList.innerHTML = '';

    try {
        const token = localStorage.getItem('ikimera_token');
        const response = await fetch(`${API_BASE}/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const uploads = data.uploads || [];
            
            if (uploads.length === 0) {
                historyEmpty.style.display = 'block';
            } else {
                displayHistory(uploads);
            }
        }
    } catch (error) {
        console.error('Error fetching history:', error);
        historyEmpty.style.display = 'block';
    } finally {
        historyLoading.style.display = 'none';
    }
}

function displayHistory(uploads) {
    const historyList = document.getElementById('history-list');
    
    uploads.forEach(upload => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const date = new Date(upload.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        item.innerHTML = `
            <img src="${API_BASE.replace('/api', '')}${upload.imageUrl}" alt="Crop diagnosis" class="history-image">
            <div class="history-content">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h4>${upload.diagnosis.disease}</h4>
                        <div class="status-badge status-${upload.diagnosis.severity}" style="font-size: 0.75rem; padding: 2px 8px;">
                            ${upload.diagnosis.confidence}% confidence
                        </div>
                    </div>
                    <span class="icon" style="color: var(--neutral-400);">👁️</span>
                </div>
                ${upload.cropType ? `<p style="font-size: 0.875rem; color: var(--neutral-600); margin-top: 4px;">${upload.cropType}</p>` : ''}
                <div class="history-meta">
                    <span class="icon">📅</span>
                    ${formattedDate}
                </div>
            </div>
        `;
        
        historyList.appendChild(item);
    });
}

// Weather Tab Functions
function setupWeatherTab() {
    document.getElementById('weather-retry').addEventListener('click', loadWeather);
}

async function loadWeather() {
    const weatherLoading = document.getElementById('weather-loading');
    const weatherError = document.getElementById('weather-error');
    const weatherData = document.getElementById('weather-data');

    weatherLoading.style.display = 'flex';
    weatherError.style.display = 'none';
    weatherData.style.display = 'none';

    try {
        // Get current location for weather
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;

        const response = await fetch(`${API_BASE}/weather?lat=${latitude}&lon=${longitude}`);

        if (response.ok) {
            const data = await response.json();
            displayWeather(data);
        } else {
            throw new Error('Failed to fetch weather data');
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        document.getElementById('weather-error-message').textContent = error.message || 'Unable to get weather information';
        weatherError.style.display = 'block';
    } finally {
        weatherLoading.style.display = 'none';
    }
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function displayWeather(weather) {
    const weatherData = document.getElementById('weather-data');
    
    // Update location
    document.getElementById('weather-location').textContent = `📍 ${weather.location}`;
    
    // Update current weather
    document.getElementById('current-icon').textContent = getWeatherIcon(weather.current.conditions);
    document.getElementById('current-temp').textContent = `${weather.current.temperature}°C`;
    document.getElementById('current-condition').textContent = weather.current.conditions;
    document.getElementById('current-humidity').textContent = `${weather.current.humidity}%`;
    document.getElementById('current-wind').textContent = `${weather.current.windSpeed} m/s`;
    
    // Update tomorrow's weather
    document.getElementById('tomorrow-icon').textContent = getWeatherIcon(weather.tomorrow.conditions);
    document.getElementById('tomorrow-temp').textContent = `${weather.tomorrow.temperature}°C`;
    document.getElementById('tomorrow-condition').textContent = weather.tomorrow.conditions;
    
    // Generate farming tips
    const tips = generateFarmingTips(weather.current);
    const tipsList = document.getElementById('tips-list');
    tipsList.innerHTML = '';
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
    
    weatherData.style.display = 'block';
}

function getWeatherIcon(conditions) {
    const conditionsLower = conditions.toLowerCase();
    
    if (conditionsLower.includes('rain') || conditionsLower.includes('shower')) {
        return '🌧️';
    } else if (conditionsLower.includes('cloud')) {
        return '☁️';
    } else if (conditionsLower.includes('sun') || conditionsLower.includes('clear')) {
        return '☀️';
    } else {
        return '🌤️';
    }
}

function generateFarmingTips(currentWeather) {
    const tips = [];
    
    if (currentWeather.humidity > 80) {
        tips.push('High humidity - watch for fungal diseases');
    } else if (currentWeather.humidity < 40) {
        tips.push('Low humidity - consider additional watering');
    } else {
        tips.push('Good humidity levels for most crops');
    }
    
    if (currentWeather.conditions.toLowerCase().includes('rain')) {
        tips.push('Rain expected - delay pesticide applications');
    } else {
        tips.push('Good weather for field activities');
    }
    
    if (currentWeather.windSpeed > 10) {
        tips.push('Strong winds - secure loose materials');
    } else {
        tips.push('Calm conditions suitable for spraying');
    }
    
    return tips;
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}