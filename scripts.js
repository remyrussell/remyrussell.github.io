function formatDate(dateString) {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

function keepThemeSetting() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme === 'dark' ? 'theme-dark' : '';
    if (document.body.classList.contains('dogs-page')) {
        document.body.className = savedTheme === 'dark' ? 'theme-dark dogs-page' : 'dogs-page';
    }
    const themeToggle = document.getElementById('themeToggleButton');
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
    } else {
        console.error('Theme toggle button not found in DOM');
    }
}

function attachThemeToggleEvent() {
    const themeToggle = document.getElementById('themeToggleButton');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const isDark = themeToggle.checked;
            document.body.className = isDark ? 'theme-dark' : '';
            if (document.body.classList.contains('dogs-page')) {
                document.body.className = isDark ? 'theme-dark dogs-page' : 'dogs-page';
            }
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            console.log('Theme toggled to:', isDark ? 'dark' : 'light');
        });
    } else {
        console.error('Theme toggle button not found in DOM');
    }
    const menuToggleButton = document.getElementById('menuToggleButton');
    const menu = document.getElementById('menu');
    if (menuToggleButton && menu) {
        if (window.innerWidth < 768) {
            menu.classList.remove('active');
        }
        menuToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Menu toggle clicked, current classList:', menu.classList);
            menu.classList.toggle('active');
            console.log('Menu classList after toggle:', menu.classList);
        });
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Menu clicked, preventing closure');
        });
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuToggleButton.contains(e.target)) {
                menu.classList.remove('active');
                console.log('Clicked outside menu, closing:', menu.classList);
            }
        });
        window.addEventListener('scroll', () => {
            menuToggleButton.style.display = 'flex';
            if (menu.classList.contains('active')) {
                menu.style.display = 'block';
            }
            console.log('Scroll event, menu visibility:', menu.style.display);
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
            updateBackgroundPosition(scrollPosition);
        });
    } else {
        console.error('Back to top button not found in DOM');
    }
}

function generateResumePDF(data) {
    if (!data) {
        alert('Error: Resume data not loaded. Please try again.');
        console.error('generateResumePDF: data is undefined');
        return;
    }
    try {
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
        let yPosition = margin + 2;

        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        function addText(text, size, style, x, y, maxWidth) {
            doc.setFontSize(size);
            doc.setFont('Helvetica', style);
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
            return y + (lines.length * size * 0.45);
        }

        function addHorizontalLine(y, offset) {
            doc.setLineWidth(0.2);
            doc.line(margin, y - offset, margin + contentWidth, y - offset);
        }

        yPosition = addText(data.name || 'Remy Russell', 16, 'bold', margin, yPosition, contentWidth);
        let contactInfo = [];
        if (data.contact?.email) contactInfo.push(`Email: ${data.contact.email}`);
        if (data.contact?.linkedin) contactInfo.push(`LinkedIn: ${data.contact.linkedin}`);
        if (data.contact?.website) contactInfo.push(`Website: ${data.contact.website}`);
        if (contactInfo.length) {
            yPosition = addText(contactInfo.join(' | '), 10.5, 'normal', margin, yPosition + 0.5, contentWidth);
        }
        yPosition += 0.5;
        if (data.role || data.seeking) {
            const roleText = data.role || '';
            const seekingText = data.seeking || '';
            const combinedText = roleText && seekingText ? `${roleText} | ${seekingText}` : roleText || seekingText;
            yPosition = addText(combinedText, 10.5, 'italic', margin, yPosition, contentWidth);
        }
        yPosition += 1.2;

        addHorizontalLine(yPosition, 2.5);
        yPosition += 2;
        yPosition = addText('Summary', 12.25, 'bold', margin, yPosition, contentWidth);
        if (data.summary) {
            yPosition = addText(data.summary, 10.5, 'normal', margin, yPosition, contentWidth);
        }
        yPosition += 1.5;

        addHorizontalLine(yPosition, 2.5);
        yPosition += 2;
        yPosition = addText('Professional Experience', 12.25, 'bold', margin, yPosition, contentWidth);
        if (data.professionalExperience) {
            data.professionalExperience.forEach(exp => {
                const title = `${exp.position} at ${exp.company}`;
                yPosition = addText(title, 11.5, 'bold', margin, yPosition, contentWidth);
                const duration = `${formatDate(exp.duration.start)} - ${formatDate(exp.duration.end)}`;
                yPosition = addText(`${duration} | ${exp.location}`, 10.5, 'italic', margin, yPosition, contentWidth);
                if (exp.description) {
                    yPosition = addText(exp.description, 10.5, 'normal', margin, yPosition, contentWidth);
                    yPosition += 0.3;
                }
                if (exp.highlights) {
                    exp.highlights.forEach(highlight => {
                        yPosition = addText(`- ${highlight}`, 10.5, 'normal', margin, yPosition, contentWidth);
                    });
                }
                yPosition += 1;
            });
        }
        yPosition += 1.2;

        addHorizontalLine(yPosition, 2.5);
        yPosition += 2;
        yPosition = addText('Education', 12.25, 'bold', margin, yPosition, contentWidth);
        if (data.education) {
            yPosition = addText(data.education.degree, 11.5, 'bold', margin, yPosition, contentWidth);
            yPosition = addText(data.education.institution, 10.5, 'italic', margin, yPosition, contentWidth);
            if (data.education.coursework) {
                yPosition = addText(`Coursework: ${data.education.coursework.join(', ')}`, 10.5, 'normal', margin, yPosition, contentWidth);
            }
        }
        yPosition += 2;

        addHorizontalLine(yPosition, 4);
        yPosition += 2;
        if (data.skills || data.certifications) {
            const columnWidth = (contentWidth - 2) / 2;
            const leftColumnX = margin;
            const rightColumnX = margin + columnWidth + 3;

            let leftY = yPosition;
            let rightY = yPosition;

            if (data.skills?.coreSkills) {
                leftY = addText('Core Skills', 12.25, 'bold', leftColumnX, leftY, columnWidth);
                data.skills.coreSkills.forEach(skill => {
                    leftY = addText(`- ${skill}`, 10.5, 'normal', leftColumnX, leftY, columnWidth);
                });
            }

            if (data.skills?.fun) {
                leftY += 0.8;
                leftY = addText('Interests & Hobbies', 12.25, 'bold', leftColumnX, leftY, columnWidth);
                data.skills.fun.forEach(fun => {
                    leftY = addText(`- ${fun}`, 10.5, 'normal', leftColumnX, leftY, columnWidth);
                });
            }

            if (data.skills?.toolsAndFrameworks) {
                rightY = addText('Tools & Frameworks', 12.25, 'bold', rightColumnX, rightY, columnWidth);
                data.skills.toolsAndFrameworks.forEach(tool => {
                    rightY = addText(`- ${tool}`, 10.5, 'normal', rightColumnX, rightY, columnWidth);
                });
            }

            if (data.certifications) {
                rightY += 0.8;
                rightY = addText('Certifications', 12.25, 'bold', rightColumnX, rightY, columnWidth);
                data.certifications.forEach(cert => {
                    const certText = `${cert.name}, ${cert.issuer} (${cert.date})`;
                    rightY = addText(`- ${certText}`, 10.5, 'normal', rightColumnX, rightY, columnWidth);
                });
            }

            const maxY = Math.max(leftY, rightY);
            doc.setLineWidth(0.2);
            doc.line(margin + columnWidth + 1, yPosition - 4, margin + columnWidth + 1, maxY);

            yPosition = maxY;
        }

        const pdfOutput = doc.output('blob');
        const url = URL.createObjectURL(pdfOutput);
        const fileName = 'Remy_Russell_Resume.pdf';

        // Try to open in a new tab
        const newTab = window.open(url, '_blank');
        if (!newTab) {
            console.warn('Failed to open new tab. Pop-up blocker may be enabled.');
            // Fallback: Create a download link
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('Unable to open PDF in new tab. The PDF is being downloaded instead. Please check your pop-up blocker settings if you prefer to view it in a new tab.');
        } else {
            newTab.document.title = fileName;
        }
        // Clean up the URL objeect
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
        console.error('Error generating PDF:', err.message);
        alert('Error generating PDF: ' + err.message + '. Please try again.');
    }
}

async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Fetching ${url}, attempt ${i + 1}`);
            const response = await fetch(url, options);
            if (response.ok) {
                console.log(`Successfully fetched ${url}`);
                return response;
            }
            console.warn(`Failed to fetch ${url}, status: ${response.status}`);
        } catch (err) {
            console.error(`Error fetching ${url}:`, err.message);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

function linkify(text) {
    const urlRegex = /(\b(https?|ftp|file|http):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]*[-A-Za-z0-9+&@#/%=~_|])/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}

function renderData(data) {
    try {
        const nameElement = document.getElementById('name');
        if (nameElement) {
            nameElement.innerText = data.name || 'Remy Russell';
        } else {
            console.error('Name element not found in DOM');
        }

        const roleElement = document.getElementById('role');
        if (roleElement) {
            roleElement.innerText = `${data.role || 'Role Not Found'} | ${data.seeking || 'Seeking Not Found'}`;
        } else {
            console.error('Role element not found in DOM');
        }

        const contactContainer = document.getElementById('contact');
        if (contactContainer) {
            const emailPara = document.getElementById('email');
            if (emailPara) emailPara.style.display = data.contact?.email ? 'block' : 'none';
            const emailText = document.getElementById('emailText');
            if (emailText) {
                emailText.innerHTML = data.contact?.email ? `<a href="mailto:${data.contact.email}">${data.contact.email}</a>` : 'Email Not Found';
            }

            const phonePara = document.getElementById('phone');
            if (phonePara) phonePara.style.display = data.contact?.phone ? 'block' : 'none';
            const phoneText = document.getElementById('phoneText');
            if (phoneText) phoneText.innerText = data.contact?.phone || '';

            const linkedinPara = document.getElementById('linkedin');
            if (linkedinPara) linkedinPara.style.display = data.contact?.linkedin ? 'block' : 'none';
            const linkedinText = document.getElementById('linkedinText');
            if (linkedinText) {
                linkedinText.innerHTML = data.contact?.linkedin ? `<a href="${data.contact.linkedin}" target="_blank">${data.contact.linkedin}</a>` : 'LinkedIn Not Found';
            }

            const websitePara = document.getElementById('website');
            if (websitePara) websitePara.style.display = data.contact?.website ? 'block' : 'none';
            const websiteText = document.getElementById('websiteText');
            if (websiteText) {
                websiteText.innerHTML = data.contact?.website ? `<a href="${data.contact.website}" target="_blank">${data.contact.website}</a>` : 'Website Not Found';
            }
        } else {
            console.error('Contact container not found in DOM');
        }

        const container = document.querySelector('.container');
        const summarySection = document.getElementById('summary');
        if (container && !document.querySelector('.location-note')) {
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
                            if (experience.company.includes('CaseWorthy')) {
                                logoImg.classList.add('caseworthy-logo');
                            } else if (experience.company.includes('Eccovia')) {
                                logoImg.classList.add('eccovia-logo');
                            }
                            logoImg.src = experience.logo || '';
                            logoImg.alt = `${experience.company} logo`;
                            logoImg.width = 150;
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
                        descriptionPara.innerHTML = linkify(experience.description || 'Description Not Found');
                        detailsDiv.appendChild(descriptionPara);

                        const highlightsList = document.createElement('ul');
                        const highlightsArray = Array.isArray(experience.highlights) ? experience.highlights : [];
                        const achievementsArray = Array.isArray(experience.achievements) ? experience.achievements : [];
                        const combinedHighlights = [...highlightsArray, ...achievementsArray];
                        highlightsList.innerHTML = combinedHighlights.length > 0 ? combinedHighlights.map(item => `<li>${linkify(item)}</li>`).join('') : '';
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
                experienceContainer.innerHTML += `<p>No professional experience data available.</p>`;
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
                    eduLogoImg.width = 150;
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
                educationContainer.innerHTML += `<p>No education data available.</p>`;
            }
        } else {
            console.error('Education container not found in DOM');
        }

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
            container.innerHTML += `<p class="error-message">Unexpected error: ${err.message}</p>`;
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth >= 768) {
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            updateBackgroundPosition(scrollY);
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (window.innerWidth < 768) {
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            updateBackgroundPosition(scrollY);
        }
    });

    updateBackgroundPosition(0);
}

let lastMouseX = window.innerWidth / 2;
let lastMouseY = window.innerHeight / 2;

function updateBackgroundPosition(scrollY) {
    const body = document.body;
    const xPercent = (lastMouseX / window.innerWidth) * 100;
    const yPercent = ((lastMouseY + scrollY) / (window.innerHeight + scrollY)) * 100;
    body.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    try {
        const response = await fetchWithRetry('resume.json', { method: 'GET' });
        const data = await response.json();
        console.log('Resume data loaded:', data);
        renderData(data);
    } catch (err) {
        console.error('Failed to load resume data:', err.message);
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `<p class="error-message">Failed to load resume data: ${err.message}. Please try refreshing the page.</p>`;
        }
    }
});
