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
}

function generateResumePDF(data) {
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
        return y + (lines.length * size * 0.35); // Adjusted line height for smaller text
    }

    // Header
    yPosition = addText(data.name || 'Remy Russell', 12, 'bold', margin, yPosition, contentWidth);
    let contactInfo = [];
    if (data.contact?.email) contactInfo.push(`Email: ${data.contact.email}`);
    if (data.contact?.linkedin) contactInfo.push(`LinkedIn: ${data.contact.linkedin}`);
    if (contactInfo.length) {
        yPosition = addText(contactInfo.join(' | '), 8, 'normal', margin, yPosition, contentWidth);
    }
    if (data.role) {
        yPosition = addText(data.role, 10, 'italic', margin, yPosition, contentWidth);
    }
    yPosition = addText('Currently seeking remote or hybrid roles in the Salt Lake City area.', 8, 'italic', margin, yPosition, contentWidth);
    yPosition += 3;

    // Summary
    yPosition = addText('Summary', 10, 'bold', margin, yPosition, contentWidth);
    if (data.summary) {
        const summaryItems = data.summary.split('. ').filter(item => item.trim());
        summaryItems.forEach(item => {
            yPosition = addText(`- ${item.trim()}.`, 8, 'normal', margin, yPosition, contentWidth);
        });
    }
    yPosition += 3;

    // Professional Experience
    yPosition = addText('Professional Experience', 10, 'bold', margin, yPosition, contentWidth);
    let previousCompany = null;
    if (data.professionalExperience) {
        data.professionalExperience.forEach(exp => {
            // Logo (commented out; uncomment if you can convert logos to base64)
            /*
            if (exp.company !== previousCompany && exp.logo) {
                try {
                    const img = new Image();
                    img.src = exp.logo;
                    img.crossOrigin = 'Anonymous';
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        const imgData = canvas.toDataURL('image/png');
                        doc.addImage(imgData, 'PNG', margin, yPosition, 20, 10);
                    };
                    yPosition += 12;
                } catch (e) {
                    console.error('Failed to load logo:', e);
                }
            }
            previousCompany = exp.company;
            */

            const title = `${exp.position} at ${exp.company}`;
            yPosition = addText(title, 9, 'bold', margin, yPosition, contentWidth);
            const duration = `${formatDate(exp.duration.start)} - ${formatDate(exp.duration.end)}`;
            yPosition = addText(`${duration} | ${exp.location}`, 8, 'normal', margin, yPosition, contentWidth);
            if (exp.description) {
                yPosition = addText(exp.description, 8, 'normal', margin, yPosition, contentWidth);
            }
            if (exp.highlights) {
                exp.highlights.forEach(highlight => {
                    yPosition = addText(`- ${highlight}`, 8, 'normal', margin, yPosition, contentWidth);
                });
            }
            yPosition += 2;
        });
    }
    yPosition += 3;

    // Education
    yPosition = addText('Education', 10, 'bold', margin, yPosition, contentWidth);
    if (data.education) {
        // Logo (commented out; see note above)
        /*
        if (data.education.logo) {
            try {
                const img = new Image();
                img.src = data.education.logo;
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const imgData = canvas.toDataURL('image/png');
                    doc.addImage(imgData, 'PNG', margin, yPosition, 20, 10);
                };
                yPosition += 12;
            } catch (e) {
                console.error('Failed to load logo:', e);
            }
        }
        */
        yPosition = addText(data.education.degree, 9, 'bold', margin, yPosition, contentWidth);
        yPosition = addText(data.education.institution, 8, 'normal', margin, yPosition, contentWidth);
        if (data.education.coursework) {
            yPosition = addText(`Coursework: ${data.education.coursework.join(', ')}`, 8, 'normal', margin, yPosition, contentWidth);
        }
    }
    yPosition += 3;

    // Skills
    yPosition = addText('Skills', 10, 'bold', margin, yPosition, contentWidth);
    if (data.skills) {
        if (data.skills.coreSkills) {
            yPosition = addText('Core Skills', 9, 'bold', margin, yPosition, contentWidth);
            data.skills.coreSkills.forEach(skill => {
                yPosition = addText(`- ${skill}`, 8, 'normal', margin, yPosition, contentWidth);
            });
        }
        if (data.skills.toolsAndFrameworks) {
            yPosition = addText('Tools & Frameworks', 9, 'bold', margin, yPosition, contentWidth);
            data.skills.toolsAndFrameworks.forEach(tool => {
                yPosition = addText(`- ${tool}`, 8, 'normal', margin, yPosition, contentWidth);
            });
        }
        if (data.skills.fun) {
            yPosition = addText('Interests & Hobbies', 9, 'bold', margin, yPosition, contentWidth);
            data.skills.fun.forEach(fun => {
                yPosition = addText(`- ${fun}`, 8, 'normal', margin, yPosition, contentWidth);
            });
        }
    }

    // Save PDF
    doc.save('Remy_Russell_Resume.pdf');
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
                experience AngexContainer.appendChild(experienceDiv);
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
            educationContainer.appendChild(eduDiv);
        }

        document.getElementById('skillList').innerHTML = data.skills?.coreSkills?.map(skill => `<li>${skill}</li>`).join('') || '<li>Core Skills Not Found</li>';
        document.getElementById('toolsAndFrameworks').innerHTML = data.skills?.toolsAndFrameworks?.map(tool => `<li>${tool}</li>`).join('') || '<li>Tools Not Found</li>';
        document.getElementById('funSkills').innerHTML = data.skills?.fun?.map(funItem => `<li>${funItem}</li>`).join('') || '<li>Interests Not Found</li>';

        // Attach PDF download event
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
