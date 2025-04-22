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

function toggleDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = menu.style.display === 'block';
            menu.style.display = isVisible ? 'none' : 'block';
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                menu.style.display = 'none';
            }
        });
    });
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
        menuToggleButton.addEventListener('click', () => {
            console.log('Menu toggle clicked');
            menu.classList.toggle('active');
        });
    } else {
        console.error('Darn, menu elements not found:', { menuToggleButton, menu });
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
    toggleDropdown();
}

function generateResumePDF(data) {
    if (!data) {
        alert('Error: Resume data not loaded. Please try again.');
        console.error('generateResumePDF: data is undefined');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
    });

    const margin = 10;
    const pageWidth = 210;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    function addText(text, size, style, x, y, maxWidth) {
        doc.setFontSize(size);
        doc.setFont('Helvetica', style);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * size * 0.4); // Adjusted line spacing to 0.4 * font size
    }

    function addSectionSeparator(y) {
        doc.setLineWidth(0.2);
        doc.line(margin, y - 2, pageWidth - margin, y - 2); // Horizontal line before the section
        return y;
    }

    yPosition = addText(data.name || 'Remy Russell', 14, 'bold', margin, yPosition, contentWidth);
    let contactInfo = [];
    if (data.contact?.email) contactInfo.push(`Email: ${data.contact.email}`);
    if (data.contact?.linkedin) contactInfo.push(`LinkedIn: ${data.contact.linkedin}`);
    if (contactInfo.length) {
        yPosition = addText(contactInfo.join(' | '), 9, 'normal', margin, yPosition + 1, contentWidth);
    }
    yPosition += 3;
    if (data.role) {
        yPosition = addText(data.role, 11, 'italic', margin, yPosition, contentWidth);
    }
    yPosition = addText('Currently seeking remote or hybrid roles in the Salt Lake City area.', 9, 'italic', margin, yPosition, contentWidth);
    yPosition += 3; // Reduced section spacing

    yPosition = addSectionSeparator(yPosition);
    yPosition = addText('Summary', 11, 'bold', margin, yPosition, contentWidth);
    if (data.summary) {
        const summaryItems = data.summary.split('. ').filter(item => item.trim());
        summaryItems.forEach(item => {
            yPosition = addText(`- ${item.trim()}.`, 9, 'normal', margin, yPosition, contentWidth);
        });
    }
    yPosition += 3;

    yPosition = addSectionSeparator(yPosition);
    yPosition = addText('Professional Experience', 11, 'bold', margin, yPosition, contentWidth);
    let previousCompany = null;
    if (data.professionalExperience) {
        data.professionalExperience.forEach(exp => {
            const title = `${exp.position} at ${exp.company}`;
            yPosition = addText(title, 10, 'bold', margin, yPosition, contentWidth);
            const duration = `${formatDate(exp.duration.start)} - ${formatDate(exp.duration.end)}`;
            yPosition = addText(`${duration} | ${exp.location}`, 9, 'italic', margin, yPosition, contentWidth);
            if (exp.description) {
                yPosition = addText(exp.description, 9, 'normal', margin, yPosition, contentWidth);
                yPosition += 1; // Add 1mm space before highlights
            }
            if (exp.highlights) {
                exp.highlights.forEach(highlight => {
                    yPosition = addText(`- ${highlight}`, 9, 'normal', margin, yPosition, contentWidth);
                });
            }
            yPosition += 2;
        });
    }
    yPosition += 3;

    yPosition = addSectionSeparator(yPosition);
    yPosition = addText('Education', 11, 'bold', margin, yPosition, contentWidth);
    if (data.education) {
        yPosition = addText(data.education.degree, 10, 'bold', margin, yPosition, contentWidth);
        yPosition = addText(data.education.institution, 9, 'normal', margin, yPosition, contentWidth);
        if (data.education.coursework) {
            yPosition = addText(`Coursework: ${data.education.coursework.join(', ')}`, 9, 'normal', margin, yPosition, contentWidth);
        }
    }
    yPosition += 3;

    // Skills subsections in two columns
    if (data.skills) {
        yPosition = addSectionSeparator(yPosition);
        const columnWidth = (contentWidth - 2) / 2;
        const leftColumnX = margin;
        const rightColumnX = margin + columnWidth + 2;

        doc.setLineWidth(0.2);
        doc.line(margin + columnWidth + 1, yPosition - 5, margin + columnWidth + 1, yPosition + 60);

        let leftY = yPosition;
        let rightY = yPosition;

        // Left column: Core Skills and Interests & Hobbies (longer content)
        if (data.skills.coreSkills) {
            leftY = addText('Core Skills', 11, 'bold', leftColumnX, leftY, columnWidth);
            data.skills.coreSkills.forEach(skill => {
                leftY = addText(`- ${skill}`, 9, 'normal', leftColumnX, leftY, columnWidth);
            });
        }

        if (data.skills.fun) {
            leftY += 2;
            leftY = addText('Interests & Hobbies', 11, 'bold', leftColumnX, leftY, columnWidth);
            data.skills.fun.forEach(fun => {
                leftY = addText(`- ${fun}`, 9, 'normal', leftColumnX, leftY, columnWidth);
            });
        }

        // Right column: Tools & Frameworks
        if (data.skills.toolsAndFrameworks) {
            rightY = addText('Tools & Frameworks', 11, 'bold', rightColumnX, rightY, columnWidth);
            data.skills.toolsAndFrameworks.forEach(tool => {
                rightY = addText(`- ${tool}`, 9, 'normal', rightColumnX, rightY, columnWidth);
            });
        }

        yPosition = Math.max(leftY, rightY);
    }

    const pdfOutput = doc.output('blob');
    const url = URL.createObjectURL(pdfOutput);
    const newTab = window.open(url, '_blank');
    if (newTab) {
        newTab.document.title = 'Remy_Russell_Resume.pdf';
    } else {
        console.error('Failed to open new tab. Pop-up blocker may be enabled.');
        alert('Unable to open PDF in new tab. Please allow pop-ups and try again.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    let data;
    try {
        console.log('Fetching resume.json...');
        let response = await fetch('/resume.json', { cache: 'no-store' });
        if (!response.ok) {
            console.log('Relative path failed, trying absolute path...');
            response = await fetch('https://remyrussell.github.io/resume.json', { cache: 'no-store' });
        }
        if (!response.ok) {
            throw new Error('Failed to fetch resume.json');
        }
        data = await response.json();
        console.log('Parsed data:', data);
    } catch (err) {
        console.error('Fetch error:', err.message);
        document.getElementById('name').innerText = 'Error: Unable to load resume data';
        document.getElementById('role').innerText = '';
        document.getElementById('email').innerText = '';
        document.getElementById('phone').innerText = '';
        document.getElementById('summaryList').innerHTML = '<li>Error: Unable to load summary</li>';
        document.getElementById('professionalExperience').innerHTML = '<h2>Professional Experience</h2><p>Error: Unable to load experience</p>';
        document.getElementById('education').innerHTML = '<h2>Education</h2><p>Error: Unable to load education</p>';
        document.getElementById('skillList').innerHTML = '<li>Error: Unable to load core skills</li>';
        document.getElementById('toolsAndFrameworks').innerHTML = '<li>Error: Unable to load tools</li>';
        document.getElementById('funSkills').innerHTML = '<li>Error: Unable to load interests</li>';
        return; // Exit early since data is not available
    }

    try {
        document.getElementById('name').innerText = data.name || 'Name Not Found';
        document.getElementById('role').innerText = data.role || 'Role Not Found';
        document.getElementById('email').innerText = data.contact?.email || 'Email Not Found';
        document.getElementById('phone').innerText = data.contact?.phone || '';

        const container = document.querySelector('.container');
        const summarySection = document.getElementById('summary');
        if (!document.querySelector('.location-note')) {
            const locationNote = document.createElement('p');
            locationNote.className = 'location-note';
            locationNote.innerText = 'Currently seeking remote or hybrid roles in the Salt Lake City area.';
            container.insertBefore(locationNote, summarySection);
        }

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
                const combinedHighlights = [...(experience.highlights || []), ...(experience.achievements || [])];
                highlightsList.innerHTML = combinedHighlights.length > 0 ? combinedHighlights.map(item => `<li>${item}</li>`).join('') : '';
                if (combinedHighlights.length > 0) {
                    detailsDiv.appendChild(highlightsList);
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

        const downloadPdfButton = document.getElementById('downloadPdfButton');
        if (downloadPdfButton) {
            downloadPdfButton.addEventListener('click', () => generateResumePDF(data));
        }
    } catch (err) {
        console.error('Error:', err.message);
        document.getElementById('professionalExperience').innerHTML = `<p>Error loading experience: ${err.message}</p>`;
        document.getElementById('education').innerHTML = `<p>Error loading education: ${err.message}</p>`;
    }
});
