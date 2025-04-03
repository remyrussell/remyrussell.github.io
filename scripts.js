function formatDate(dateString) {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

function keepThemeSetting() {
    // Load saved theme from localStorage, default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'theme-dark' : '';
    // Sync the checkbox state with the saved theme
    const themeToggle = document.getElementById('themeToggleButton');
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
    }
}

function attachThemeToggleEvent() {
    // Theme toggle checkbox
    const themeToggle = document.getElementById('themeToggleButton');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const isDark = themeToggle.checked;
            document.body.className = isDark ? 'theme-dark' : '';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    } else {
        console.warn('Theme toggle button not found');
    }

    // Menu toggle button
    const menuToggleButton = document.getElementById('menuToggleButton');
    const menu = document.getElementById('menu');
    if (menuToggleButton && menu) {
        menuToggleButton.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    } else {
        console.warn('Menu toggle button or menu not found');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting(); // Apply saved theme on load
    attachThemeToggleEvent(); // Attach theme and menu toggle events

    try {
        console.log('Attempting to fetch resume.json...');
        let response = await fetch('./resume.json', { cache: 'no-store' });
        if (!response.ok) {
            console.log('Relative path failed, trying absolute path...');
            response = await fetch('https://remyrussell.github.io/resume.json', { cache: 'no-store' });
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseErr) {
            console.error('JSON parsing failed:', parseErr.message);
            document.body.innerHTML = '<p>JSON Error: ' + parseErr.message + '</p><pre>' + responseText + '</pre>';
            return;
        }
        console.log('Parsed data:', data);
        console.log('Populating name:', data.name);
        document.getElementById('name').innerText = data.name || 'Name Not Found';
        console.log('Populating role:', data.role);
        document.getElementById('role').innerText = data.role || 'Role Not Found';
        console.log('Populating email:', data.contact?.email);
        document.getElementById('email').innerText = data.contact?.email || 'Email Not Found';
        if (data.contact?.phone) {
            console.log('Populating phone:', data.contact.phone);
            document.getElementById('phone').innerText = data.contact.phone || '';
        }
        console.log('Adding location note');
        const locationNote = document.createElement('p');
        locationNote.className = 'location-note';
        locationNote.innerText = 'Currently seeking remote or hybrid roles in the Salt Lake City area.';
        document.querySelector('header').insertBefore(locationNote, document.getElementById('summary'));
        console.log('Populating summary:', data.summary);
        document.getElementById('summaryList').innerHTML = data.summary?.split('. ').map(item => `<li>${item.trim()}</li>`).join('') || '<li>Summary Data Not Found</li>';

        console.log('Processing professionalExperience:', data.professionalExperience);
        let experienceContainer = document.getElementById('professionalExperience');
        if (data.professionalExperience) {
            data.professionalExperience.forEach((experience, index) => {
                console.log(`Processing experience ${index}:`, experience);
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

                let stickyHeader = document.createElement('div');
                stickyHeader.className = 'sticky-header';
                let positionHeader = document.createElement('h3');
                positionHeader.innerText = `${experience.position} at ${experience.company || 'Company Not Found'}`;
                stickyHeader.appendChild(positionHeader);
                detailsDiv.appendChild(stickyHeader);

                let dateRange = document.createElement('span');
                dateRange.className = 'date-range';
                dateRange.innerText = `${formatDate(experience.duration.start)} through ${formatDate(experience.duration.end) || 'Present'}`;
                detailsDiv.appendChild(dateRange);

                let locationSpan = document.createElement('span');
                locationSpan.className = 'location';
                locationSpan.innerText = experience.location || '';
                detailsDiv.appendChild(locationSpan);

                let descriptionPara = document.createElement('p');
                descriptionPara.className = 'description';
                descriptionPara.innerText = experience.description || 'Description Not Found';
                detailsDiv.appendChild(descriptionPara);

                let highlightsList = document.createElement('ul');
                highlightsList.innerHTML = experience.highlights?.map(highlight => `<li>${highlight}</li>`).join('') || '<li>Highlights Not Found</li>';
                detailsDiv.appendChild(highlightsList);

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

        console.log('Processing education:', data.education);
        let educationContainer = document.getElementById('education');
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

        console.log('Populating skills:', data.skills);
        document.getElementById('skillList').innerHTML = data.skills?.coreSkills?.map(skill => `<li>${skill}</li>`).join('') || '<li>Core Skills Not Found</li>';
        document.getElementById('toolsAndFrameworks').innerHTML = data.skills?.toolsAndFrameworks?.map(tool => `<li>${tool}</li>`).join('') || '<li>Tools Not Found</li>';
        document.getElementById('funSkills').innerHTML = data.skills?.fun?.map(funItem => `<li>${funItem}</li>`).join('') || '<li>Interests Not Found</li>';
    } catch (err) {
        console.error('Error fetching or processing JSON:', err.message, err.stack);
        document.getElementById('professionalExperience').innerHTML = '<p>Error loading experience: ' + err.message + '</p>';
        document.getElementById('education').innerHTML = '<p>Error loading education: ' + err.message + '</p>';
    }
});
