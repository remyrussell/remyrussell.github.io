// Functions related to theme toggling
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;

    // Update button appearance
    const themeToggleButton = document.getElementById('themeToggleButton');
    const toggleIcons = themeToggleButton.querySelectorAll('.toggle-icon');
    const toggleText = themeToggleButton.querySelector('.toggle-text');

    if (themeName === 'theme-dark') {
        toggleIcons[0].style.transform = 'translateX(-20px)';
        toggleIcons[1].style.transform = 'translateX(0)';
        toggleText.style.opacity = '0';
    } else {
        toggleIcons[0].style.transform = 'translateX(0)';
        toggleIcons[1].style.transform = 'translateX(20px)';
        toggleText.style.opacity = '1';
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

// Function to toggle menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Event attachment for theme toggling and menu toggling
function attachThemeToggleEvent() {
    let themeToggleButton = document.getElementById('themeToggleButton');
    themeToggleButton.addEventListener('click', toggleTheme);

    let menuToggleButton = document.getElementById('menuToggleButton');
    menuToggleButton.addEventListener('click', toggleMenu);
}

// Function to populate the resume content
function populateResume(data) {
    document.getElementById('name').innerText = data.name;
    document.getElementById('role').innerText = data.role;
    document.getElementById('email').innerText = data.email;
    document.getElementById('phone').innerText = data.phone;
    document.getElementById('productManagementList').innerHTML = data.productManagement.map(item => `<li>${item}</li>`).join('');

    let experienceContainer = document.getElementById('professionalExperience');
    for (let experience of data.professionalExperience) {
        let experienceDiv = document.createElement('div');
        experienceDiv.className = 'experience-item';

        let logoImg = document.createElement('img');
        logoImg.src = experience.logo;
        logoImg.alt = experience.company + ' logo';
        logoImg.width = 100;
        experienceDiv.appendChild(logoImg);

        let detailsDiv = document.createElement('div');
        detailsDiv.innerHTML = `
            <h3>${experience.position} at ${experience.company}</h3>
            <p>${experience.location} | ${experience.duration}</p>
            <p>${experience.description}</p>
            <ul>
                ${experience.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
        `;
        experienceDiv.appendChild(detailsDiv);
        experienceContainer.appendChild(experienceDiv);
    }

    let educationContainer = document.getElementById('education');
    
    let eduLogoImg = document.createElement('img');
    eduLogoImg.src = data.education.logo;
    eduLogoImg.alt = "Education institution logo";
    eduLogoImg.width = 100;
    educationContainer.appendChild(eduLogoImg);

    let eduDetailsDiv = document.createElement('div');
    eduDetailsDiv.innerHTML = `
        <h3>${data.education.degree}</h3>
        <p>${data.education.institution}</p>
        <p>${data.education.coursework}</p>
    `;
    educationContainer.appendChild(eduDetailsDiv);

    document.getElementById('skillList').innerHTML = data.skills.skills.map(skill => `<li>${skill}</li>`).join('');
    document.getElementById('toolsAndFrameworks').innerHTML = data.skills.toolsAndFrameworks.map(tool => `<li>${tool}</li>`).join('');
    document.getElementById('funSkills').innerHTML = data.skills.fun.map(funItem => `<li>${funItem}</li>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    try {
        let response = await fetch('/resume.json');
        let data = await response.json();
        populateResume(data);
    } catch (err) {
        console.error('Error fetching or parsing JSON:', err);
    }
});