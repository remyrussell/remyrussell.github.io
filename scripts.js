function formatDate(dateString) {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

function keepThemeSetting() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme === 'dark' ? 'theme-dark' : '';
    const themeToggle = document.getElementById('themeToggleButton');
    if (themeToggle) themeToggle.checked = savedTheme === 'dark';
}

function attachThemeToggleEvent() {
    const themeToggle = document.getElementById('themeToggleButton');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const isDark = themeToggle.checked;
            document.body.className = isDark ? 'theme-dark' : '';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    const menuToggleButton = document.getElementById('menuToggleButton');
    const menu = document.getElementById('menu');
    if (menuToggleButton && menu) {
        menuToggleButton.addEventListener('click', () => menu.classList.toggle('active'));
    }
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            try {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (e) {
                console.error('Scroll failed:', e);
                window.scrollTo(0, 0);
            }
        });
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const viewportHeight = window.innerHeight;
            backToTopButton.style.display = scrollPosition > viewportHeight ? 'block' : 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    try {
        console.log('Fetching resume.json...');
        let response = await fetch('./resume.json', { cache: 'no-store' });
        if (!response.ok) {
            console.log('Relative path failed, trying absolute path...');
            response = await fetch('https://remyrussell.github.io/resume.json', { cache: 'no-store' });
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Parsed data:', data);

        document.getElementById('name').innerText = data.name || 'Name Not Found';
        document.getElementById('role').innerText = data.role || 'Role Not Found';
        document.getElementById('email').innerText = data.contact?.email || 'Email Not Found';
        document.getElementById('phone').innerText = data.contact?.phone || '';
        const locationNote = document.createElement('p');
        locationNote.className = 'location-note';
        locationNote.innerText = 'Currently seeking remote or hybrid roles in the Salt Lake City area.';
        const container = document.querySelector('.container');
        const summarySection = document.getElementById('summary');
        container.insertBefore(locationNote, summarySection);

        document.getElementById('summaryList').innerHTML = data.summary?.split('. ').map(item => `<li>${item.trim()}</li>`).join('') || '<li>Summary Data Not Found</li>';

        const experienceContainer = document.getElementById('professionalExperience');
        experienceContainer.innerHTML = '<h2>Professional Experience</h2>';
        let previousCompany = null;
        if (data.professionalExperience) {
            data.professionalExperience.forEach((experience) => {
                const experienceDiv = document.createElement('div');
                experienceDiv.className = 'experience-item';

                if (experience.company !== previousCompany) {
                    const logoImg = document.createElement('img');
                    logoImg.className = 'logo-img';
                    logoImg.src = experience.logo || '';
                    logoImg.alt = `${experience.company} logo`;
                    logoImg.width = 100;
                    experienceDiv.appendChild(logoImg);
                }
                previousCompany = experience.company;

                const headerContent = document.createElement('div');
                headerContent.className = 'header-content';

                const stickyHeader = document.createElement('div');
                stickyHeader.className = 'sticky-header';
                const positionHeader = document.createElement('h3');
                positionHeader.innerText = `${experience.position} at ${experience.company || 'Company Not Found'}`;
                stickyHeader.appendChild(positionHeader);
                headerContent.appendChild(stickyHeader);

                const dateRange = document.createElement('span');
                dateRange.className = 'date-range';
                dateRange.innerText = `${formatDate(experience.duration.start)} through ${formatDate(experience.duration.end) || 'Present'}`;
                headerContent.appendChild(dateRange);

                const locationSpan = document.createElement('span');
                locationSpan.className = 'location';
                locationSpan.innerText = experience.location || '';
                headerContent.appendChild(locationSpan);

                experienceDiv.appendChild(headerContent);

                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'details';

                const descriptionPara = document.createElement('p');
                descriptionPara.className = 'description';
                descriptionPara.innerText = experience.description || 'Description Not Found';
                detailsDiv.appendChild(descriptionPara);

                const highlightsList = document.createElement('ul');
                highlightsList.innerHTML = experience.highlights?.map(highlight => `<li>${highlight}</li>`).join('') || '<li>Highlights Not Found</li>';
                detailsDiv.appendChild(highlightsList);

                if (experience.achievements) {
                    const achievementsDiv = document.createElement('div');
                    achievementsDiv.className = 'achievements';
                    const achievementsTitle = document.createElement('strong');
                    achievementsTitle.innerText = 'Achievements';
                    const achievementsList = document.createElement('ul');
                    achievementsList.innerHTML = experience.achievements.map(ach => `<li>${ach}</li>`).join('');
                    achievementsDiv.appendChild(achievementsTitle);
                    achievementsDiv.appendChild(achievementsList);
                    detailsDiv.appendChild(achievementsDiv);
                }

                experienceDiv.appendChild(detailsDiv);
                experienceContainer.appendChild(experienceDiv);
            });
        }

        const educationContainer = document.getElementById('education');
        educationContainer.innerHTML = '<h2>Education</h2>';
        if (data.education) {
            const educationDiv = document.createElement('div');
            educationDiv.className = 'education-item';

            const eduLogoImg = document.createElement('img');
            eduLogoImg.className = 'logo-img';
            eduLogoImg.src = data.education.logo || '';
            eduLogoImg.alt = "Education institution logo";
            eduLogoImg.width = 100;
            educationDiv.appendChild(eduLogoImg);

            const headerContent = document.createElement('div');
            headerContent.className = 'header-content';

            const stickyHeader = document.createElement('div');
            stickyHeader.className = 'sticky-header';
            const degreeHeader = document.createElement('h3');
            degreeHeader.innerText = data.education.degree || 'Degree Not Found';
            stickyHeader.appendChild(degreeHeader);
            headerContent.appendChild(stickyHeader);

            const eduDetailsSpan = document.createElement('span');
            eduDetailsSpan.innerText = data.education.institution || 'Institution Not Found';
            headerContent.appendChild(eduDetailsSpan);

            educationDiv.appendChild(headerContent);

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'details';
            detailsDiv.innerHTML = `
                <p>${data.education.coursework?.join(', ') || ''}</p>
                ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ''}
            `;
            educationDiv.appendChild(detailsDiv);
            educationContainer.appendChild(educationDiv);
        }

        document.getElementById('skillList').innerHTML = data.skills?.coreSkills?.map(skill => `<li>${skill}</li>`).join('') || '<li>Core Skills Not Found</li>';
        document.getElementById('toolsAndFrameworks').innerHTML = data.skills?.toolsAndFrameworks?.map(tool => `<li>${tool}</li>`).join('') || '<li>Tools Not Found</li>';
        document.getElementById('funSkills').innerHTML = data.skills?.fun?.map(funItem => `<li>${funItem}</li>`).join('') || '<li>Interests Not Found</li>';
    } catch (err) {
        console.error('Error:', err.message);
        document.getElementById('professionalExperience').innerHTML = `<p>Error loading experience: ${err.message}</p>`;
        document.getElementById('education').innerHTML = `<p>Error loading education: ${err.message}</p>`;
    }
});function formatDate(dateString) {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

function keepThemeSetting() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme === 'dark' ? 'theme-dark' : '';
    const themeToggle = document.getElementById('themeToggleButton');
    if (themeToggle) themeToggle.checked = savedTheme === 'dark';
}

function attachThemeToggleEvent() {
    const themeToggle = document.getElementById('themeToggleButton');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const isDark = themeToggle.checked;
            document.body.className = isDark ? 'theme-dark' : '';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    const menuToggleButton = document.getElementById('menuToggleButton');
    const menu = document.getElementById('menu');
    if (menuToggleButton && menu) {
        menuToggleButton.addEventListener('click', () => menu.classList.toggle('active'));
    }
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            try {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (e) {
                console.error('Scroll failed:', e);
                window.scrollTo(0, 0);
            }
        });
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const viewportHeight = window.innerHeight;
            backToTopButton.style.display = scrollPosition > viewportHeight ? 'block' : 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    try {
        console.log('Fetching resume.json...');
        let response = await fetch('./resume.json', { cache: 'no-store' });
        if (!response.ok) {
            console.log('Relative path failed, trying absolute path...');
            response = await fetch('https://remyrussell.github.io/resume.json', { cache: 'no-store' });
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Parsed data:', data);

        document.getElementById('name').innerText = data.name || 'Name Not Found';
        document.getElementById('role').innerText = data.role || 'Role Not Found';
        document.getElementById('email').innerText = data.contact?.email || 'Email Not Found';
        document.getElementById('phone').innerText = data.contact?.phone || '';
        const locationNote = document.createElement('p');
        locationNote.className = 'location-note';
        locationNote.innerText = 'Currently seeking remote or hybrid roles in the Salt Lake City area.';
        const container = document.querySelector('.container');
        const summarySection = document.getElementById('summary');
        container.insertBefore(locationNote, summarySection);

        document.getElementById('summaryList').innerHTML = data.summary?.split('. ').map(item => `<li>${item.trim()}</li>`).join('') || '<li>Summary Data Not Found</li>';

        const experienceContainer = document.getElementById('professionalExperience');
        experienceContainer.innerHTML = '<h2>Professional Experience</h2>';
        let previousCompany = null;
        if (data.professionalExperience) {
            data.professionalExperience.forEach((experience) => {
                const experienceDiv = document.createElement('div');
                experienceDiv.className = 'experience-item';

                if (experience.company !== previousCompany) {
                    const logoImg = document.createElement('img');
                    logoImg.className = 'logo-img';
                    logoImg.src = experience.logo || '';
                    logoImg.alt = `${experience.company} logo`;
                    logoImg.width = 100;
                    experienceDiv.appendChild(logoImg);
                }
                previousCompany = experience.company;

                const headerContent = document.createElement('div');
                headerContent.className = 'header-content';

                const stickyHeader = document.createElement('div');
                stickyHeader.className = 'sticky-header';
                const positionHeader = document.createElement('h3');
                positionHeader.innerText = `${experience.position} at ${experience.company || 'Company Not Found'}`;
                stickyHeader.appendChild(positionHeader);
                headerContent.appendChild(stickyHeader);

                const dateRange = document.createElement('span');
                dateRange.className = 'date-range';
                dateRange.innerText = `${formatDate(experience.duration.start)} through ${formatDate(experience.duration.end) || 'Present'}`;
                headerContent.appendChild(dateRange);

                const locationSpan = document.createElement('span');
                locationSpan.className = 'location';
                locationSpan.innerText = experience.location || '';
                headerContent.appendChild(locationSpan);

                experienceDiv.appendChild(headerContent);

                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'details';

                const descriptionPara = document.createElement('p');
                descriptionPara.className = 'description';
                descriptionPara.innerText = experience.description || 'Description Not Found';
                detailsDiv.appendChild(descriptionPara);

                const highlightsList = document.createElement('ul');
                highlightsList.innerHTML = experience.highlights?.map(highlight => `<li>${highlight}</li>`).join('') || '<li>Highlights Not Found</li>';
                detailsDiv.appendChild(highlightsList);

                if (experience.achievements) {
                    const achievementsDiv = document.createElement('div');
                    achievementsDiv.className = 'achievements';
                    const achievementsTitle = document.createElement('strong');
                    achievementsTitle.innerText = 'Achievements';
                    const achievementsList = document.createElement('ul');
                    achievementsList.innerHTML = experience.achievements.map(ach => `<li>${ach}</li>`).join('');
                    achievementsDiv.appendChild(achievementsTitle);
                    achievementsDiv.appendChild(achievementsList);
                    detailsDiv.appendChild(achievementsDiv);
                }

                experienceDiv.appendChild(detailsDiv);
                experienceContainer.appendChild(experienceDiv);
            });
        }

        const educationContainer = document.getElementById('education');
        educationContainer.innerHTML = '<h2>Education</h2>';
        if (data.education) {
            const educationDiv = document.createElement('div');
            educationDiv.className = 'education-item';

            const eduLogoImg = document.createElement('img');
            eduLogoImg.className = 'logo-img';
            eduLogoImg.src = data.education.logo || '';
            eduLogoImg.alt = "Education institution logo";
            eduLogoImg.width = 100;
            educationDiv.appendChild(eduLogoImg);

            const headerContent = document.createElement('div');
            headerContent.className = 'header-content';

            const stickyHeader = document.createElement('div');
            stickyHeader.className = 'sticky-header';
            const degreeHeader = document.createElement('h3');
            degreeHeader.innerText = data.education.degree || 'Degree Not Found';
            stickyHeader.appendChild(degreeHeader);
            headerContent.appendChild(stickyHeader);

            const eduDetailsSpan = document.createElement('span');
            eduDetailsSpan.innerText = data.education.institution || 'Institution Not Found';
            headerContent.appendChild(eduDetailsSpan);

            educationDiv.appendChild(headerContent);

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'details';
            detailsDiv.innerHTML = `
                <p>${data.education.coursework?.join(', ') || ''}</p>
                ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ''}
            `;
            educationDiv.appendChild(detailsDiv);
            educationContainer.appendChild(educationDiv);
        }

        document.getElementById('skillList').innerHTML = data.skills?.coreSkills?.map(skill => `<li>${skill}</li>`).join('') || '<li>Core Skills Not Found</li>';
        document.getElementById('toolsAndFrameworks').innerHTML = data.skills?.toolsAndFrameworks?.map(tool => `<li>${tool}</li>`).join('') || '<li>Tools Not Found</li>';
        document.getElementById('funSkills').innerHTML = data.skills?.fun?.map(funItem => `<li>${funItem}</li>`).join('') || '<li>Interests Not Found</li>';
    } catch (err) {
        console.error('Error:', err.message);
        document.getElementById('professionalExperience').innerHTML = `<p>Error loading experience: ${err.message}</p>`;
        document.getElementById('education').innerHTML = `<p>Error loading education: ${err.message}</p>`;
    }
});
