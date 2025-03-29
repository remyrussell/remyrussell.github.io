// Functions related to theme toggling
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;

    // Update button appearance
    const themeToggleButton = document.getElementById('themeToggleButton');
    const toggleIcons = themeToggleButton.querySelectorAll('.toggle-icon');
    const toggleText = themeToggleButton.querySelector('.toggle-text');

    if (themeName === 'theme-dark') {
        toggleIcons[0].style.transform = 'translateX(-20px)'; // Move sun left
        toggleIcons[1].style.transform = 'translateX(0)'; // Move moon to center
        toggleText.style.opacity = '0'; // Fade out text in dark mode
    } else {
        toggleIcons[0].style.transform = 'translateX(0)'; // Move sun to center
        toggleIcons[1].style.transform = 'translateX(20px)'; // Move moon right
        toggleText.style.opacity = '1'; // Show text in light mode
    }
}

function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}

function keepThemeSetting() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
    } else {
        setTheme('theme-light');
    }
}

// Event attachment for theme toggling
function attachThemeToggleEvent() {
    let themeToggleButton = document.getElementById('themeToggleButton');
    themeToggleButton.addEventListener('click', toggleTheme);
}

// Rest of the JavaScript (populateResume, DOMContentLoaded) remains unchanged