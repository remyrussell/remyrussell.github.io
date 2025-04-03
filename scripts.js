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
    document.getElementById('summaryList').innerHTML = data.summary?.split('. ').map(item => `<li>${item.trim()}</li>`).join('') || '<li>Summary Data Not Found</li>';

    let experienceContainer = document.getElementById('professionalExperience');
    console.log('Professional Experience Container:', experienceContainer);
    let experienceHeader = experienceContainer.querySelector('h2');
    if (!experienceHeader) {
        console.warn('Professional Experience h2 header not found!');
        let newHeader = document.createElement('h2');
        newHeader.innerText = 'Professional Experience';
        experienceContainer.prepend(newHeader);
    }
    const existingExperienceItems = experienceContainer.querySelectorAll('.experience-item');
    existingExperienceItems.forEach(item => item.remove());
    if (data.professionalExperience) {
        data.professionalExperience.forEach(experience => {
            let experienceDiv = document.createElement('div');
            experienceDiv.className = 'experience-item';
            let logoImg = document.createElement('img');
            logoImg.className = 'logo-img';
            logoImg.src = experience.logo || '';
            logoImg.alt = experience.company + ' logo' || 'Company Logo';
            logoImg.width = 100;
            experienceDiv.appendChild(logoImg);

            let detailsDiv = document.createElement('div');
            detailsDiv.className = 'details';

            // Sticky header with position and date range
            let stickyHeader = document.createElement('div');
            stickyHeader.className = 'sticky-header';
            let positionHeader = document.createElement('h3');
            positionHeader.innerText = `${experience.position} at ${experience.company || 'Company Not Found'}`;
            let dateRange = document.createElement('span');
            dateRange.className = 'date-range';
            dateRange.innerText = `${experience.duration.start} – ${experience.duration.end || 'Present'}`;
            stickyHeader.appendChild(positionHeader);
            stickyHeader.appendChild(dateRange);
            detailsDiv.appendChild(stickyHeader);

            // Description and highlights
            let descriptionPara = document.createElement('p');
            descriptionPara.className = 'description';
            descriptionPara.innerText = experience.description || 'Description Not Found';
            detailsDiv.appendChild(descriptionPara);

            let highlightsList = document.createElement('ul');
            highlightsList.innerHTML = experience.highlights?.map(highlight => `<li>${highlight}</li>`).join('') || '<li>Highlights Not Found</li>';
            detailsDiv.appendChild(highlightsList);

            // Achievements (if present)
            if (experience.achievements) {
                let achievementsDiv = document.createElement('div');
                achievementsDiv.className = 'achievements';
                let achievementsTitle = document.createElement('strong');
                achievementsTitle.innerText = 'Achievements';
                let achievementsList = document.createElement('ul');
                achievementsList.innerHTML = experience.achievements.map(ach => `<li>${ach}</li>`).join('');
                achievementsDiv.appendChild(achievementsTitle);
                achievementsDiv.appendChild(achievementsList);
                detailsDiv.appendChild(achievementsDiv);
            }

            experienceDiv.appendChild(detailsDiv);
            experienceContainer.appendChild(experienceDiv);
        });
    } else {
        let fallbackDiv = document.createElement('div');
        fallbackDiv.innerHTML = '<p>Professional Experience Data Not Found</p>';
        experienceContainer.appendChild(fallbackDiv);
    }

    let educationContainer = document.getElementById('education');
    console.log('Education Container:', educationContainer);
    let educationHeader = educationContainer.querySelector('h2');
    if (!educationHeader) {
        console.warn('Education h2 header not found!');
        let newHeader = document.createElement('h2');
        newHeader.innerText = 'Education';
        educationContainer.prepend(newHeader);
    }
    const existingEducationItems = educationContainer.querySelectorAll('.education-item');
    existingEducationItems.forEach(item => item.remove());
    if (data.education) {
        let educationDiv = document.createElement('div');
        educationDiv.className = 'education-item';
        let eduLogoImg = document.createElement('img');
        eduLogoImg.className = 'logo-img';
        eduLogoImg.src = data.education.logo || '';
        eduLogoImg.alt = "Education institution logo";
        eduLogoImg.width = 100;
        educationDiv.appendChild(eduLogoImg);

        let eduDetailsDiv = document.createElement('div');
        eduDetailsDiv.className = 'details';
        eduDetailsDiv.innerHTML = `
            <h3>${data.education.degree || 'Degree Not Found'}</h3>
            <p>${data.education.institution || 'Institution Not Found'}</p>
            <p>${data.education.coursework?.join(', ') || ''}</p>
            ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ''}
        `;
        educationDiv.appendChild(eduDetailsDiv);
        educationContainer.appendChild(educationDiv);
    } else {
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
        document.getElementById('professionalExperience').innerHTML = '<p>Error loading experience. Check console for details.</p>';
        document.getElementById('education').innerHTML = '<p>Error loading education. Check console for details.</p>';
    }
});