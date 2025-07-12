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
    let previousCompany = null;
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
            console.log(`Fetching ${url}, attempt ${i + 1}`);
            const response = await fetch(url, options);
            if (response.ok) {
                console.log(`Successfully fetched ${url}`);
                return response;
            }
            throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
        } catch (err) {
            console.warn(`Fetch attempt ${i + 1} failed for ${url}: ${err.message}`);
            if (i === retries - 1) {
                console.error(`All fetch attempts failed for ${url}: ${err.message}`);
                throw err;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

let lastMouseX = window.innerWidth / 2;
let lastMouseY = window.innerHeight / 2;
let lastScrollY = 0;

function updateBackgroundPosition(scrollY) {
    const mouseX = lastMouseX / window.innerWidth;
    const mouseY = lastMouseY / window.innerHeight;
    const scrollInfluence = scrollY / window.innerHeight;
    const time = Date.now() / 1000;
    const waveX = Math.sin(time + mouseX * Math.PI * 2) * 50;
    const waveY = Math.cos(time + mouseY * Math.PI * 2) * 50;
    const scrollOffset = scrollInfluence * 100;
    const xOffset = (mouseX - 0.5) * 200 + waveX + scrollOffset;
    const yOffset = (mouseY - 0.5) * 200 + waveY + scrollOffset;
    document.body.style.backgroundPosition = `
        ${xOffset}px ${yOffset}px,
        ${xOffset + 50}px ${yOffset + 50}px,
        ${xOffset - 50}px ${yOffset - 50}px
    `;
    lastScrollY = scrollInfluence;
}

const particles = [];
const numParticles = 150;

function createParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1 + 1,
            angle: Math.random() * Math.PI * 2,
            orbitRadiusX: Math.random() * 500 + 100,
            orbitRadiusY: Math.random() * 250 + 50,
            baseSpeed: Math.random() * 0.0015 + 0.0005
        });
    }

    let lastFrameTime = Date.now();
    let frameCount = 0;
    let fps = 60;

    function animateParticles() {
        const currentTime = Date.now();
        frameCount++;
        if (currentTime - lastFrameTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastFrameTime = currentTime;
            console.log('FPS:', fps);
        }

        if (fps < 60 && frameCount % 3 === 0) {
            requestAnimationFrame(animateParticles);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            const dx = particle.x - lastMouseX;
            const dy = particle.y - lastMouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const gravityInfluence = 0.5;
            let speed = particle.baseSpeed;

            if (distance > 800) {
                speed = particle.baseSpeed * 0.01;
            } else {
                speed = particle.baseSpeed * 2;
            }

            particle.angle += speed;

            particle.x = lastMouseX + Math.sin(particle.angle) * particle.orbitRadiusX * gravityInfluence;
            particle.y = lastMouseY + Math.cos(particle.angle) * particle.orbitRadiusY * gravityInfluence;

            particle.x = Math.max(0, Math.min(particle.x, canvas.width));
            particle.y = Math.max(0, Math.min(particle.y, canvas.height));

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(199, 21, 133, 0.5)';
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded event fired');
    keepThemeSetting();
    attachThemeToggleEvent();

    setTimeout(createParticleSystem, 500);

    if (document.body.classList.contains('dogs-page')) {
        const dogPhotosLink = document.querySelector('a[href="/dogs.html"]');
        if (dogPhotosLink) {
            dogPhotosLink.classList.add('disabled');
            dogPhotosLink.addEventListener('click', (e) => e.preventDefault());
            console.log('Dog Photos link disabled on dogs page');
        }
        console.log('Dogs page detected, skipping resume.json fetch');
        return;
    }

    let data;
    try {
        const response = await fetchWithRetry('./resume.json', { cache: 'no-store' });
        data = await response.json();
        console.log('Parsed resume.json data:', data);
    } catch (err) {
        console.error('Failed to load resume.json:', err.message);
        alert('Error: Unable to load resume data. Please check your connection and try again.');
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h1>Error Loading Resume</h1>
                    <p>Unable to load resume data. Please try refreshing the page or check back later.</p>
                    <p>Error details: ${err.message}</p>
                </div>
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
                educationContainer.innerHTML += '<p>No education data available.</p>';
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
});
