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
    document.getElementById('name').innerText = data.name || 'Name Not Found';
    document.getElementById('role').innerText = data.role || 'Role Not Found';
    document.getElementById('email').innerText = data.contact?.email || 'Email Not Found';
    document.getElementById('phone').innerText = data.contact?.phone || 'Phone Not Found';
    document.getElementById('productManagementList').innerHTML = data.productManagement?.map(item => `<li>${item}</li>`).join('') || '<li>Product Management Data Not Found</li>';

    let experienceContainer = document.getElementById('professionalExperience');
    experienceContainer.innerHTML = ''; // Clear existing content
    if (data.professionalExperience) {
        data.professionalExperience.forEach(experience => {
            let experienceDiv = document.createElement('div');
            experienceDiv.className = 'experience-item';
            let logoImg = document.createElement('img');
            logoImg.src = experience.logo || '';
            logoImg.alt = experience.company + ' logo' || 'Company Logo';
            logoImg.width = 100;
            experienceDiv.appendChild(logoImg);

            let detailsDiv = document.createElement('div');
            detailsDiv.innerHTML = `
                <h3>${experience.position} at ${experience.company || 'Company Not Found'}</h3>
                <p>${experience.location} | ${experience.duration}</p>
                <p>${experience.description || 'Description Not Found'}</p>
                <ul>
                    ${experience.highlights?.map(highlight => `<li>${highlight}</li>`).join('') || '<li>Highlights Not Found</li>'}
                    ${experience.achievements ? experience.achievements.map(ach => `<li><strong>Achievement:</strong> ${ach}</li>`).join('') : ''}
                </ul>
            `;
            experienceDiv.appendChild(detailsDiv);
            experienceContainer.appendChild(experienceDiv);
        });
    } else {
        experienceContainer.innerHTML = '<p>Professional Experience Data Not Found</p>';
    }

    let educationContainer = document.getElementById('education');
    educationContainer.innerHTML = ''; // Clear existing content
    if (data.education) {
        let eduLogoImg = document.createElement('img');
        eduLogoImg.src = data.education.logo || '';
        eduLogoImg.alt = "Education institution logo";
        eduLogoImg.width = 100;
        educationContainer.appendChild(eduLogoImg);

        let eduDetailsDiv = document.createElement('div');
        eduDetailsDiv.innerHTML = `
            <h3>${data.education.degree || 'Degree Not Found'}</h3>
            <p>${data.education.institution || 'Institution Not Found'}</p>
            <p>${data.education.coursework || ''}</p>
            ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ''}
        `;
        educationContainer.appendChild(eduDetailsDiv);
    } else {
        educationContainer.innerHTML = '<p>Education Data Not Found</p>';
    }

    document.getElementById('skillList').innerHTML = data.skills?.coreSkills?.map(skill => `<li>${skill}</li>`).join('') || '<li>Core Skills Not Found</li>';
    document.getElementById('toolsAndFrameworks').innerHTML = data.skills?.toolsAndFrameworks?.map(tool => `<li>${tool}</li>`).join('') || '<li>Tools Not Found</li>';
    document.getElementById('funSkills').innerHTML = data.skills?.fun?.map(funItem => `<li>${funItem}</li>`).join('') || '<li>Interests Not Found</li>';

    // Populate certifications if they exist
    let certificationContainer = document.getElementById('certificationList');
    if (data.certifications && certificationContainer) {
        certificationContainer.innerHTML = data.certifications.map(cert => `<li>${cert.name} - ${cert.issuer}, ${cert.date}</li>`).join('');
        document.getElementById('certifications').style.display = 'block';
    } else if (certificationContainer) {
        certificationContainer.innerHTML = '<li>Certifications Not Found</li>';
    }

    // Populate languages if they exist
    let languageContainer = document.getElementById('languageList');
    if (data.languages && languageContainer) {
        languageContainer.innerHTML = data.languages.map(lang => `<li>${lang}</li>`).join('');
        document.getElementById('languages').style.display = 'block';
    } else if (languageContainer) {
        languageContainer.innerHTML = '<li>Languages Not Found</li>';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    try {
        console.log('Attempting to fetch resume.json...');
        let response = await fetch('/resume.json', {
            headers: {
                'Accept': 'application/json'
            }
        });
        console.log('Fetch response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json(); ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​