// DOM Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const eventList = document.getElementById('event-list');

// Mock logged-in state
let loggedInUser = null;

// Show and Hide Modals
const modals = document.querySelectorAll('.modal');
modals.forEach(modal => {
    modal.querySelector('.close').onclick = () => {
        modal.style.display = 'none';
    };
});

loginBtn.onclick = () => loginModal.style.display = 'flex';
registerBtn.onclick = () => registerModal.style.display = 'flex';

// Fetch Events and Render
async function loadEvents() {
    const response = await fetch('/events'); // API to fetch events
    const events = await response.json();
    eventList.innerHTML = events.map(event => `
        <div class="event-card">
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <button class="register-btn" onclick="registerForEvent('${event._id}')">
                Register
            </button>
        </div>
    `).join('');
}

// Register for an Event
async function registerForEvent(eventId) {
    if (!loggedInUser) {
        alert('You need to login first to register for an event.');
        return;
    }
    const response = await fetch(`/events/${eventId}/register`, {
        method: 'POST',
        credentials: 'include'
    });
    if (response.ok) {
        alert('Registered successfully!');
    } else {
        const error = await response.text();
        alert(error);
    }
}

// Login and Register Logic
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        loggedInUser = await response.json();
        loginModal.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        alert('Logged in successfully!');
    } else {
        alert('Login failed!');
    }
};

document.getElementById('register-form').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        alert('Registered successfully!');
        registerModal.style.display = 'none';
    } else {
        alert('Registration failed!');
    }
};

logoutBtn.onclick = () => {
    loggedInUser = null;
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    alert('Logged out successfully!');
};

// Load Events on Page Load
loadEvents();
