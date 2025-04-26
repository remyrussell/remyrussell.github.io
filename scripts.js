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
        if (!toggle || !menu) {
            console.error('Dropdown elements not found:', { toggle, menu });
            return;
        }
        menu.style.display = 'none';
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Dropdown toggle clicked, current display:', menu.style.display);
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
        if (window.innerWidth < 768) {
            menu.classList.remove('active');
        }
        menuToggleButton.addEventListener('click', () => {
            console.log('Menu toggle clicked, current classList:', menu.classList);
            menu.classList.toggle('active');
            console.log('Menu classList after toggle:', menu.classList);
        });
    } else {
        console.error('Menu elements not found:', { menuToggleButton, menu });
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
        return y + (lines.length * size * 0.45);
    }

    yPosition = addText(data.name || 'Remy Russell', 14, 'bold', margin, yPosition, contentWidth);
    let contactInfo = [];
    if (data.contact?.email) contactInfo.push(`Email: ${data.contact.email}`);
    if (data.contact?.linkedin) contactInfo.push(`LinkedIn: ${data.contact.linkedin}`);
    if (contactInfo.length) {
        yPosition = addText(contactInfo.join(' | '), 9, 'normal', margin, yPosition + 1, contentWidth);
    }
    yPosition += 2;
    if (data.role || data.seeking) {
        const roleText = data.role || '';
        const seekingText = data.seeking || '';
        const combinedText = roleText && seekingText ? `${roleText} | ${seekingText}` : roleText || seekingText;
        yPosition = addText(combinedText, 9.5, 'italic', margin, yPosition, contentWidth);
    }
    yPosition += 3;

    yPosition = addText('Summary', 11.5, 'bold', margin, yPosition, contentWidth);
    if (data.summary) {
        yPosition = addText(data.summary, 9, 'normal', margin, yPosition, contentWidth);
    }
    yPosition += 3;

    yPosition = addText('Professional Experience', 11.5, 'bold', margin, yPosition, contentWidth);
    let previousCompany = null;
    if (data.professionalExperience) {
        data.professionalExperience.forEach(exp => {
            const title = `${exp.position} at ${exp.company}`;
            yPosition = addText(title, 10.5, 'bold', margin, yPosition, contentWidth);
            const duration = `${formatDate(exp.duration.start)} - ${formatDate(exp.duration.end)}`;
            yPosition = addText(`${duration} | ${exp.location}`, 9, 'italic', margin, yPosition, contentWidth);
            if (exp.description) {
                yPosition = addText(exp.description, 9, 'normal', margin, yPosition, contentWidth);
                yPosition += 1;
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

    yPosition = addText('Education', 11.5, 'bold', margin, yPosition, contentWidth);
    if (data.education) {
        yPosition = addText(data.education.degree, 10.5, 'bold', margin, yPosition, contentWidth);
        yPosition = addText(data.education.institution, 9, 'italic', margin, yPosition, contentWidth);
        if (data.education.coursework) {
            yPosition = addText(`Coursework: ${data.education.coursework.join(', ')}`, 9, 'normal', margin, yPosition, contentWidth);
        }
    }
    yPosition += 3;

    // Two-column section for Skills and Certifications
    if (data.skills || data.certifications) {
        const columnWidth = (contentWidth - 2) / 2;
        const leftColumnX = margin;
        const rightColumnX = margin + columnWidth + 2;

        doc.setLineWidth(0.2);
        doc.line(margin + columnWidth + 1, yPosition - 5, margin + columnWidth + 1, yPosition + 60);

        let leftY = yPosition;
        let rightY = yPosition;

        // Left column: Core Skills and Interests & Hobbies
        if (data.skills?.coreSkills) {
            leftY = addText('Core Skills', 11.5, 'bold', leftColumnX, leftY, columnWidth);
            data.skills.coreSkills.forEach(skill => {
                leftY = addText(`- ${skill}`, 9, 'normal', leftColumnX, leftY, columnWidth);
            });
        }

        if (data.skills?.fun) {
            leftY += 2;
            leftY = addText('Interests & Hobbies', 11.5, 'bold', leftColumnX, leftY, columnWidth);
            data.skills.fun.forEach(fun => {
                leftY = addText(`- ${fun}`, 9, 'normal', leftColumnX, leftY, columnWidth);
            });
        }

        // Right column: Tools & Frameworks and Certifications
        if (data.skills?.toolsAndFrameworks) {
            rightY = addText('Tools & Frameworks', 11.5, 'bold', rightColumnX, rightY, columnWidth);
            data.skills.toolsAndFrameworks.forEach(tool => {
                rightY = addText(`- ${tool}`, 9, 'normal', rightColumnX, rightY, columnWidth);
            });
        }

        // To remove Certifications entirely from the PDF, comment out or delete this block
        if (data.certifications) {
            rightY += 2;
            rightY = addText('Certifications', 11.5, 'bold', rightColumnX, rightY, columnWidth);
            data.certifications.forEach(cert => {
                const certText = `${cert.name}, ${cert.issuer} (${cert.date})`;
                rightY = addText(`- ${certText}`, 9, 'normal', rightColumnX, rightY, columnWidth);
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

async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;
            throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
        } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`Fetch attempt ${i + 1} failed for ${url}. Retrying in ${delay}ms...`, err);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    let data;
    try {
        console.log('Fetching resume.json...');
        let response = await fetchWithRetry('/resume.json', { cache: 'no-store' });
        if (!response.ok) {
            console.log('Relative path failed, trying absolute path...');
            response = await fetchWithRetry('https://remyrussell.github.io/resume.json', { cache: 'no-store' });
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch resume.json: ${response.status} ${response.statusText}`);
        }
        data = await response.json();
        console.log('Parsed data:', data);
    } catch (err) {
        console.error('Fetch error:', err.message);
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <h1>Error Loading Resume</h1>
                <p>Unable to load resume data. Please try refreshing the page or check back later.</p>
                <p>Error details: ${err.message}</p>
            `;
        } else {
            console.error('Container element not found in DOM');
        }
        return;
    }

    try {
        const nameElement = document.getElementById('name');
        if (nameElement) {
            nameElement.innerText = data.name || 'Name Not Found';
        } else {
            console.error('Name element not found in DOM');
        }

        const roleElement = document.getElementById('role');
        if (roleElement) {
            roleElement.innerText = data.role || 'Role Not Found';
        } else {
            console.error('Role element not found in DOM');
        }

        const emailElement = document.getElementById('email');
        if (emailElement) {
            emailElement.innerText = data.contact?.email || 'Email Not Found';
        } else {
            console.error('Email element not found in DOM');
        }

        const phoneElement = document.getElementById('phone');
        if (phoneElement) {
            phoneElement.innerText = data.contact?.phone || '';
        } else {
            console.error('Phone element not found in DOM');
        }

        const container = document.querySelector('.container');
        const summarySection = document.getElementById('summary');
        if (container && summarySection && !document.querySelector('.location-note')) {
            const locationNote = document.createElement('p');
            locationNote.className = 'location-note';
            locationNote.innerText = data.seeking || 'Currently seeking remote or hybrid roles in the Salt Lake City area.';
            container.insertBefore(locationNote, summarySection);
        } else {
            console.error('Container or summary section not found for location note');
        }

        const summaryTextElement = document.getElementById('summaryText');
        if (summaryTextElement) {
            summaryTextElement.innerText = data.summary || 'Summary Data Not Found';
        } else {
            console.error('Summary text element not found in DOM');
        }

        const experienceContainer = document.getElementById('professionalExperience');
        if (experienceContainer) {
            experienceContainer.innerHTML = '<h2>Professional Experience</h2>';
            let previousCompany = null;
            if (data.professionalExperience) {
                data.professionalExperience.forEach((experience, index) => {
                    try {
                        const experienceDiv = document.createElement('div');
                        experienceDiv.className = 'experience-item';

                        if (experience.company !== previousCompany) {
                            const logoImg = document.createElement('img');
                            logoImg.className = 'logo-img';
                            logoImg.src = experience.logo || '';
                            logoImg.alt = `${experience.company} logo`;
                            logoImg.width = 100;
                            logoImg.onerror = () => {
                                console.warn(`Failed to load logo for ${experience.company} at ${experience.logo}`);
                                logoImg.style.display = 'none';
                            };
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
                        const highlightsArray = Array.isArray(experience.highlights) ? experience.highlights : [];
                        const achievementsArray = Array.isArray(experience.achievements) ? experience.achievements : [];
                        const combinedHighlights = [...highlightsArray, ...achievementsArray];
                        highlightsList.innerHTML = combinedHighlights.length > 0 ? combinedHighlights.map(item => `<li>${item}</li>`).join('') : '';
                        if (combinedHighlights.length > 0) {
                            detailsDiv.appendChild(highlightsList);
                        }

                        experienceDiv.appendChild(detailsDiv);
                        experienceContainer.appendChild(experienceDiv);
                    } catch (err) {
                        console.error(`Error rendering experience item ${index}:`, err.message);
                        experienceContainer.innerHTML += `<p>Error rendering experience item: ${err.message}</p>`;
                    }
                });
            } else {
                experienceContainer.innerHTML += '<p>No professional experience data available.</p>';
            }
        } else {
            console.error('Professional experience container not found in DOM');
        }

        const educationContainer = document.getElementById('education');
        if (educationContainer) {
            educationContainer.innerHTML = '<h2>Education</h2>';
            if (data.education) {
                try {
                    const educationDiv = document.createElement('div');
                    educationDiv.className = 'education-item';

                    const eduLogoImg = document.createElement('img');
                    eduLogoImg.className = 'logo-img';
                    eduLogoImg.src = data.education.logo || '';
                    eduLogoImg.alt = "Education institution logo";
                    eduLogoImg.width = 100;
                    eduLogoImg.onerror = () => {
                        console.warn(`Failed to load education logo at ${data.education.logo}`);
                        eduLogoImg.style.display = 'none';
                    };
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
                } catch (err) {
                    console.error('Error rendering education:', err.message);
                    educationContainer.innerHTML += `<p>Error rendering education: ${err.message}</p>`;
                }
            } else {
                educationContainer.innerHTML += '<p>No education data available.</p>';
            }
        } else {
            console.error('Education container not found in DOM');
        }

        // To remove Certifications entirely from the website, comment out or delete this block
        const certificationList = document.getElementById('certificationList');
        if (certificationList) {
            if (data.certifications) {
                try {
                    certificationList.innerHTML = data.certifications.map(cert => 
                        `<li>${cert.name}, ${cert.issuer} (${cert.date})</li>`
                    ).join('') || '<li>Certifications Not Found</li>';
                } catch (err) {
                    console.error('Error rendering certifications:', err.message);
                    certificationList.innerHTML = `<li>Error rendering certifications: ${err.message}</li>`;
                }
            } else {
                certificationList.innerHTML = '<li>No certifications data available.</li>';
            }
        } else {
            console.error('Certification list element not found in DOM');
        }

        const skillList = document.getElementById('skillList');
        if (skillList) {
            skillList.innerHTML = data.skills?.coreSkills?.map(skill => `<li>${skill}</li>`).join('') || '<li>Core Skills Not Found</li>';
        } else {
            console.error('Skill list element not found in DOM');
        }

        const toolsAndFrameworks = document.getElementById('toolsAndFrameworks');
        if (toolsAndFrameworks) {
            toolsAndFrameworks.innerHTML = data.skills?.toolsAndFrameworks?.map(tool => `<li>${tool}</li>`).join('') || '<li>Tools Not Found</li>';
        } else {
            console.error('Tools and frameworks element not found in DOM');
        }

        const funSkills = document.getElementById('funSkills');
        if (funSkills) {
            funSkills.innerHTML = data.skills?.fun?.map(funItem => `<li>${funItem}</li>`).join('') || '<li>Interests Not Found</li>';
        } else {
            console.error('Fun skills element not found in DOM');
        }

        const downloadPdfButton = document.getElementById('downloadPdfButton');
        if (downloadPdfButton) {
            downloadPdfButton.addEventListener('click', () => generateResumePDF(data));
        } else {
            console.error('Download PDF button not found in DOM');
        }
    } catch (err) {
        console.error('Error in rendering:', err.message);
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML += `<p>Unexpected error: ${err.message}</p>`;
        }
    }
});
