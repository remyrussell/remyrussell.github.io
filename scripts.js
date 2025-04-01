// Functions related to theme toggling
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;

    const themeToggleCheckbox = document.getElementById('themeToggleButton');
    if (themeToggleCheckbox) {
        themeToggleCheckbox.checked = (themeName === 'theme-dark');
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
    // Default to dark theme if no theme is set in localStorage
    if (!localStorage.getItem('theme')) {
        setTheme('theme-dark');
    } else if (localStorage.getItem('theme') === 'theme-dark') {
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
    let themeToggleCheckbox = document.getElementById('themeToggleButton');
    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', toggleTheme);
    }

    let menuToggleButton = document.getElementById('menuToggleButton');
    menuToggleButton.addEventListener('click', toggleMenu);
}

// Function to populate the resume content
function populateResume(data) {
    document.getElementById('name').innerText = data.name;
    document.getElementById('role').innerText = data.role;
    document.getElementById('email').innerText = data.contact.email;
    document.getElementById('phone').innerText = data.contact.phone;
    document.getElementById('productManagementList').innerHTML = data.productManagement.map(item => `<li>${item}</li>`).join('');

    let experienceContainer = document.getElementById('professionalExperience');
    experienceContainer.innerHTML = ''; // Clear existing content
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
                ${experience.achievements ? experience.achievements.map(ach => `<li><strong>Achievement:</strong> ${ach}</li>`).join('') : ''}
            </ul>
        `;
        experienceDiv.appendChild(detailsDiv);
        experienceContainer.appendChild(experienceDiv);
    }

    let educationContainer = document.getElementById('education');
    educationContainer.innerHTML = ''; // Clear existing content
    let eduLogoImg = document.createElement('img');
    eduLogoImg.src = data.education.logo;
    eduLogoImg.alt = "Education institution logo";
    eduLogoImg.width = 100;
    educationContainer.appendChild(eduLogoImg);

    let eduDetailsDiv = document.createElement('div');
    eduDetailsDiv.innerHTML = `
        <h3>${data.education.degree}</h3>
        <p>${data.education.institution}</p>
        <p>${data.education.coursework || ''}</p>
        ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ''}
    `;
    educationContainer.appendChild(eduDetailsDiv);

    document.getElementById('skillList').innerHTML = data.skills.coreSkills.map(skill => `<li>${skill}</li>`).join('');
    document.getElementById('toolsAndFrameworks').innerHTML = data.skills.toolsAndFrameworks.map(tool => `<li>${tool}</li>`).join('');
    document.getElementById('funSkills').innerHTML = data.skills.fun.map(funItem => `<li>${funItem}</li>`).join('');

    // Populate certifications if they exist
    let certificationContainer = document.getElementById('certificationList');
    if (data.certifications && certificationContainer) {
        certificationContainer.innerHTML = data.certifications.map(cert => `<li>${cert.name} - ${cert.issuer}, ${cert.date}</li>`).join('');
        document.getElementById('certifications').style.display = 'block';
    }

    // Populate languages if they exist
    let languageContainer = document.getElementById('languageList');
    if (data.languages && languageContainer) {
        languageContainer.innerHTML = data.languages.map(lang => `<li>${lang}</li>`).join('');
        document.getElementById('languages').style.display = 'block';
    }
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