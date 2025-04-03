function formatDate(dateString) {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

function keepThemeSetting() {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to 'dark'
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
        backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    const exportPdfButton = document.getElementById('exportPdf');
    if (exportPdfButton) {
        exportPdfButton.addEventListener('click', () => {
            const element = document.querySelector('.container');
            const opt = {
                margin: 0.5,
                filename: 'Remy_Russell_Resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } // 8.5x11 inches
            };
            html2pdf().set(opt).from(element).save();
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
        if (data.contact?.phone) document.getElementById('phone').innerText = data.contact.phone;
        const locationNote = document.createElement('p');
        locationNote.className = 'location-note';
        locationNote.innerText = 'Currently seeking remote or hybrid roles in the Salt Lake City area.';
        document.querySelector('.container').insertBefore(locationNote, document.getElementById('summary'));

        document.getElementById('summaryList').innerHTML = data.summary?.split('. ').map(item => `<li>${item.trim()}</li>`).join('') || '<li>Summary Data Not Found</li>';

        const experienceContainer = document.getElementById('professionalExperience');
        if (data.professionalExperience) {
            data.professionalExperience.forEach(experience => {
                const experienceDiv = document.createElement('div');
                experienceDiv.className = 'experience-item';
                const logoImg = document.createElement('img');
                logoImg.className = 'logo-img';
                logoImg.src = experience.logo || '';
                logoImg.alt = `${experience.company} logo`;
                logoImg.width = 100;
                experienceDiv.appendChild(logoImg);

                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'details';
                const stickyHeader = document.createElement('div');
                stickyHeader.className = 'sticky-header';
                const positionHeader = document.createElement('h3');
                positionHeader.innerText = `${experience.position} at ${experience.company || 'Company Not Found'}`;
                stickyHeader.appendChild(positionHeader);
                detailsDiv.appendChild(stickyHeader);

                const dateRange = document.createElement('span');
                dateRange.className = 'date-range';
                dateRange.innerText = `${formatDate(experience.duration.start)} through ${formatDate(experience.duration.end) || 'Present'}`;
                detailsDiv.appendChild(dateRange);

                const locationSpan = document.createElement('span');
                locationSpan.className = 'location';
                locationSpan.innerText = experience.location || '';
                detailsDiv.appendChild(locationSpan);

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
        if (data.education) {
            const educationDiv = document.createElement('div');
            educationDiv.className = 'education-item';
            const eduLogoImg = document.createElement('img');
            eduLogoImg.className = 'logo-img';
            eduLogoImg.src = data.education.logo || '';
            eduLogoImg.alt = "Education institution logo";
            eduLogoImg.width = 100;
            educationDiv.appendChild(eduLogoImg);

            const eduDetailsDiv = document.createElement('div');
            eduDetailsDiv.className = 'details';
            eduDetailsDiv.innerHTML = `
                <h3>${data.education.degree || 'Degree Not Found'}</h3>
                <p>${data.education.institution || 'Institution Not Found'}</p>
                <p>${data.education.coursework?.join(', ') || ''}</p>
                ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ''}
            `;
            educationDiv.appendChild(eduDetailsDiv);
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
