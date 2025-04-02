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
    document.getElementById('summaryList').innerHTML = data.Summary?.map(item => `<li>${item}</li>`).join('') || '<li>Summary Data Not Found</li>';

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
    // Do not clear the entire container to preserve the <h2>Education</h2> header
    // Instead, append the content after the existing header
    if (data.education) {
        let educationDiv = document.createElement('div');
        educationDiv.className = 'education-item'; // Add education-item class
        let eduLogoImg = document.createElement('img');
        eduLogoImg.src = data.education.logo || '';
        eduLogoImg.alt = "Education institution logo";
        eduLogoImg.width = 100;
        educationDiv.appendChild(eduLogoImg);

        let eduDetailsDiv = document.createElement('div');
        eduDetailsDiv.innerHTML = `
            <h3>${data.education.degree || 'Degree Not Found'}</h3>
            <p>${data.education.institution || 'Institution Not Found'}</p>
            <p>${data.education.coursework || ''}</p>
            ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ''}
        `;
        educationDiv.appendChild(eduDetailsDiv);
        educationContainer.appendChild(educationDiv);
    } else {
        // If no education data, append a fallback message after the header
        let fallbackDiv = document.createElement('div');
        fallbackDiv.innerHTML = '<p>Education Data Not Found</p>';
        educationContainer.appendChild(fallbackDiv);
    }

    document.getElementById('skillList').innerHTML = data.skills?.coreSkills?.map(skill => `<li>${skill}</li>`).join('') || '<li>Core Skills Not Found</li>';
    document.getElementById('toolsAndFrameworks').innerHTML = data.skills?.toolsAndFrameworks?.map(tool => `<li>${tool}</li>`).join('') || '<li>Tools Not Found</li>';
    document.getElementById('funSkills').innerHTML = data.skills?.fun?.map(funItem => `<li>${funItem}</li>`).join('') || '<li>Interests Not Found</li>';
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    try {
        console.log('Attempting to fetch resume.json...');
        let response = await fetch('/resume.json');
        console.log('Fetch response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log('Fetched data:', data);
        populateResume(data);
    } catch (err) {
        console.error('Error fetching or parsing JSON:', err);
        // Fallback: Display a message if data fails to load
        document.getElementById('professionalExperience').innerHTML = '<p>Error loading experience. Check console for details.</p>';
        document.getElementById('education').innerHTML = '<p>Error loading education. Check console for details.</p>';
    }
});// Functions related to theme toggling
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
    document.getElementById('summaryList').innerHTML = data.Summary?.map(item => `<li>${item}</li>`).join('') || '<li>Summary Data Not Found</li>';

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
    // Do not clear the entire container to preserve the <h2>Education</h2> header
    // Instead, append the content after the existing header
    if (data.education) {
        let educationDiv = document.createElement('div');
        educationDiv.className = 'education-item'; // Add education-item class
        let eduLogoImg = document.createElement('img');
        eduLogoImg.src = data.education.logo || '';
        eduLogoImg.alt = "Education institution logo";
        eduLogoImg.width = 100;
        educationDiv.appendChild(eduLogoImg);

        let eduDetailsDiv = document.createElement('div');
        eduDetailsDiv.innerHTML = `
            <h3>${data.education.degree || 'Degree Not Found'}</h3>
            <p>${data.education.institution || 'Institution Not Found'}</p>
            <p>${data.education.coursework || ''}</p>
            ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ''}
        `;
        educationDiv.appendChild(eduDetailsDiv);
        educationContainer.appendChild(educationDiv);
    } else {
        // If no education data, append a fallback message after the header
        let fallbackDiv = document.createElement('div');
        fallbackDiv.innerHTML = '<p>Education Data Not Found</p>';
        educationContainer.appendChild(fallbackDiv);
    }

    document.getElementById('skillList').innerHTML = data.skills?.coreSkills?.map(skill => `<li>${skill}</li>`).join('') || '<li>Core Skills Not Found</li>';
    document.getElementById('toolsAndFrameworks').innerHTML = data.skills?.toolsAndFrameworks?.map(tool => `<li>${tool}</li>`).join('') || '<li>Tools Not Found</li>';
    document.getElementById('funSkills').innerHTML = data.skills?.fun?.map(funItem => `<li>${funItem}</li>`).join('') || '<li>Interests Not Found</li>';
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    try {
        console.log('Attempting to fetch resume.json...');
        let response = await fetch('/resume.json');
        console.log('Fetch response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log('Fetched data:', data);
        populateResume(data);
    } catch (err) {
        console.error('Error fetching or parsing JSON:', err);
        // Fallback: Display a message if data fails to load
        document.getElementById('professionalExperience').innerHTML = '<p>Error loading experience. Check console for details.</p>';
        document.getElementById('education').innerHTML = '<p>Error loading education. Check console for details.</p>';
    }
});
