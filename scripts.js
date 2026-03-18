function formatDate(dateString) {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    const options = { year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Convert explicit URLs (http/https/www) in text to clickable <a> links.
// Only matches URLs that clearly start with a protocol or www — never guesses bare domains
// to avoid false positives on things like file extensions or email domains.
function linkifyText(text) {
    if (!text) return text;
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    // Only match http://, https://, or www. prefixed URLs
    return escaped.replace(
        /((https?:\/\/|www\.)[^\s,;)<>"]+)/g,
        (match) => {
            const href = match.startsWith('www.') ? `https://${match}` : match;
            return `<a href="${href}" target="_blank" rel="noopener">${match}</a>`;
        }
    );
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

    // Vibecoded Tools accordion
    const vibecodeToggle = document.getElementById('vibecodeToggle');
    const vibecodeContent = document.getElementById('vibecodeContent');
    const vibecodeChevron = document.getElementById('vibecodeChevron');
    if (vibecodeToggle && vibecodeContent) {
        vibecodeToggle.addEventListener('click', () => {
            const isOpen = vibecodeContent.classList.toggle('open');
            vibecodeToggle.setAttribute('aria-expanded', isOpen);
            if (vibecodeChevron) vibecodeChevron.classList.toggle('rotated', isOpen);
        });
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
        format: 'letter',
        compress: true
    });

    const margin = 15;
    const pageWidth = 215.9; // letter width in mm
    const contentWidth = pageWidth - 2 * margin;
    let y = margin;

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // ── Helpers ──────────────────────────────────────────────────────────────
    function addText(text, size, style, x, yPos, maxWidth) {
        doc.setFontSize(size);
        doc.setFont('Helvetica', style);
        const lines = doc.splitTextToSize(String(text), maxWidth);
        doc.text(lines, x, yPos);
        return yPos + lines.length * size * 0.45;
    }

    function addTextWithLinks(text, size, style, x, yPos, maxWidth) {
        doc.setFontSize(size);
        doc.setFont('Helvetica', style);
        const lines = doc.splitTextToSize(String(text), maxWidth);
        const lh = size * 0.45;
        const urlRe = /((https?:\/\/|www\.)[^\s,;)<>"]+)/g;
        lines.forEach((line, i) => {
            const lineY = yPos + i * lh;
            let cursor = 0, drawX = x, match;
            urlRe.lastIndex = 0;
            while ((match = urlRe.exec(line)) !== null) {
                if (match.index > cursor) {
                    const plain = line.substring(cursor, match.index);
                    doc.setTextColor(0, 0, 0);
                    doc.text(plain, drawX, lineY);
                    drawX += doc.getStringUnitWidth(plain) * size * 0.352778;
                }
                const urlText = match[0];
                const href = urlText.startsWith('www.') ? `https://${urlText}` : urlText;
                const urlW = doc.getStringUnitWidth(urlText) * size * 0.352778;
                doc.setTextColor(0, 0, 180);
                doc.text(urlText, drawX, lineY);
                doc.link(drawX, lineY - lh * 0.75, urlW, lh, { url: href });
                doc.setTextColor(0, 0, 0);
                drawX += urlW;
                cursor = match.index + urlText.length;
            }
            if (cursor < line.length) {
                doc.setTextColor(0, 0, 0);
                doc.text(line.substring(cursor), drawX, lineY);
            }
        });
        return yPos + lines.length * lh;
    }

    function rule(yPos) {
        const lineY = yPos + 3;
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.15);
        doc.line(margin, lineY, margin + contentWidth, lineY);
        doc.setDrawColor(0, 0, 0);
        return lineY + 3;
    }

    // ── Pre-process: combine the two Acentra roles into one entry ────────────
    // Keeps JSON with two separate entries but renders them as one block in the PDF.
    // Only merges consecutive entries where BOTH companies include "Acentra".
    const rawExp = data.professionalExperience || [];
    const combinedExp = [];
    let i = 0;
    while (i < rawExp.length) {
        const curr = rawExp[i];
        const next = rawExp[i + 1];
        const bothAcentra = next &&
            curr.company.toLowerCase().includes('acentra') &&
            next.company.toLowerCase().includes('acentra');

        if (bothAcentra) {
            // next is the earlier role (MI), curr is the later role (UT/BA II)
            // Determine which is earlier by start date
            const earlier = new Date(next.duration.start) < new Date(curr.duration.start) ? next : curr;
            const later   = new Date(next.duration.start) < new Date(curr.duration.start) ? curr : next;
            const merged = {
                position: `Business Analyst / Business Analyst II`,
                company:  later.company,
                location: `${earlier.location} to ${later.location}`,
                duration: { start: earlier.duration.start, end: later.duration.end },
                description: '',
                highlights: [
                    `${earlier.location} (${formatDate(earlier.duration.start)}-${formatDate(earlier.duration.end)}): ${earlier.description}`,
                    `${later.location} (${formatDate(later.duration.start)}-${formatDate(later.duration.end)}): ${later.description}`,
                    ...(later.highlights || [])
                ].filter(Boolean)
            };
            combinedExp.push(merged);
            i += 2;
        } else {
            combinedExp.push(curr);
            i++;
        }
    }

    // Renders a bulleted line with hanging indent so wrapped lines align under text not bullet
    function addBullet(text, size, x, yPos, maxWidth) {
        const bulletChar = '-';
        const indent = size * 0.25; // tighter indent — bullet sits closer to text
        doc.setFontSize(size);
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(bulletChar, x, yPos);
        return addTextWithLinks(safe(text), size, 'normal', x + indent, yPos, maxWidth - indent);
    }
    function safe(str) {
        return String(str)
            .replace(/–/g, '-').replace(/—/g, '-')
            .replace(/→|»/g, '>').replace(/←|«/g, '<')
            .replace(/['']/g, "'").replace(/[""]/g, '"')
            .replace(/…/g, '...').replace(/·/g, '|')
            .replace(/[^\x00-\xFF]/g, '');
    }

    // ── Header ────────────────────────────────────────────────────────────────
    y = addText(safe(data.name || 'Remy Russell'), 18, 'bold', margin, y, contentWidth);
    const contactParts = [];
    if (data.contact?.email)    contactParts.push(data.contact.email);
    if (data.contact?.website)  contactParts.push(data.contact.website || 'https://remyrussell.com');
    if (data.contact?.linkedin) contactParts.push(data.contact.linkedin);
    if (data.seeking)           contactParts.push(data.seeking);
    if (contactParts.length) {
        y = addTextWithLinks(safe(contactParts.join('  |  ')), 9.5, 'normal', margin, y + 0.5, contentWidth);
    }
    if (data.role) {
        y = addText(safe(data.role), 10.5, 'italic', margin, y + 0.5, contentWidth);
    }
    y = rule(y);

    // ── Summary ───────────────────────────────────────────────────────────────
    y = addText('Summary', 11, 'bold', margin, y, contentWidth);
    if (data.summary) {
        y = addText(safe(data.summary.trim()), 10, 'normal', margin, y + 0.3, contentWidth);
    }
    y = rule(y);

    // ── Experience ────────────────────────────────────────────────────────────
    y = addText('Professional Experience', 11, 'bold', margin, y, contentWidth);
    y += 0.3;
    // Track which companies have already appeared to control "formerly X" display
    const seenCompanies = new Set();
    combinedExp.forEach(exp => {
        const startY = formatDate(exp.duration.start);
        const endY   = formatDate(exp.duration.end);
        // Only show "(formerly Eccovia)" on first CaseWorthy appearance
        let companyDisplay = exp.company;
        const companyKey = exp.company.split(' ')[0].toLowerCase();
        if (seenCompanies.has(companyKey)) {
            companyDisplay = companyDisplay.replace(/\s*\(formerly[^)]+\)/i, '').trim();
        }
        seenCompanies.add(companyKey);
        const title = safe(`${exp.position}  |  ${companyDisplay}`);
        const meta  = safe(`${startY} - ${endY}  |  ${exp.location}`);
        y = addText(title, 10.5, 'bold', margin, y, contentWidth);
        y = addText(meta, 9.5, 'italic', margin, y + 0.2, contentWidth);
        if (exp.description) {
            y = addText(safe(exp.description), 10, 'normal', margin, y + 0.2, contentWidth);
        }
        if (exp.highlights?.length) {
            exp.highlights.forEach(h => {
                y = addBullet(h, 10, margin, y + 0.2, contentWidth);
            });
        }
        y += 0.5;
    });
    y = rule(y);

    // ── Education ─────────────────────────────────────────────────────────────
    y = addText('Education', 11, 'bold', margin, y, contentWidth);
    if (data.education) {
        y = addText(safe(data.education.degree), 10.5, 'bold', margin, y + 0.3, contentWidth);
        y = addText(safe(data.education.institution), 10, 'italic', margin, y + 0.2, contentWidth);
    }
    y = rule(y);
    y = addText('Core Skills', 11, 'bold', margin, y, contentWidth);
    data.skills?.coreSkills?.forEach(s => {
        y = addBullet(s, 10, margin, y + 0.2, contentWidth);
    });
    y += 0.4;
    y = addText('Tools & Frameworks', 11, 'bold', margin, y, contentWidth);
    data.skills?.toolsAndFrameworks?.forEach(t => {
        y = addBullet(t, 10, margin, y + 0.2, contentWidth);
    });

    // ── Save ──────────────────────────────────────────────────────────────────
    const blob = doc.output('blob');
    const url  = URL.createObjectURL(blob);
    const tab  = window.open(url, '_blank');
    if (!tab) {
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
        console.log('Fetching ./resume.json...');
        let response = await fetchWithRetry('./resume.json', { cache: 'no-store' });
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
            const email = data.contact?.email;
            if (email) {
                emailElement.innerHTML = `<a href="mailto:${email}">${email}</a>`;
            } else {
                emailElement.innerText = 'Email Not Found';
            }
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
            summaryTextElement.innerHTML = linkifyText(data.summary) || 'Summary Data Not Found';
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
                        descriptionPara.innerHTML = linkifyText(experience.description) || 'Description Not Found';
                        detailsDiv.appendChild(descriptionPara);

                        const highlightsList = document.createElement('ul');
                        const highlightsArray = Array.isArray(experience.highlights) ? experience.highlights : [];
                        const achievementsArray = Array.isArray(experience.achievements) ? experience.achievements : [];
                        const combinedHighlights = [...highlightsArray, ...achievementsArray];
                        highlightsList.innerHTML = combinedHighlights.length > 0 ? combinedHighlights.map(item => `<li>${linkifyText(item)}</li>`).join('') : '';
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
            container.innerHTML += `<p>Unexpected error: ${err.message}</p>`;
        }
    }
});
