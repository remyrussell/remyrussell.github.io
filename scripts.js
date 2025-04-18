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
        return y + (lines.length * size * 0.5);
    }

    yPosition = addText(data.name || 'Remy Russell', 12, 'bold', margin, yPosition, contentWidth);
    let contactInfo = [];
    if (data.contact?.email) contactInfo.push(`Email: ${data.contact.email}`);
    if (data.contact?.linkedin) contactInfo.push(`LinkedIn: ${data.contact.linkedin}`);
    if (contactInfo.length) {
        yPosition = addText(contactInfo.join(' | '), 7.5, 'normal', margin, yPosition + 1, contentWidth); // Reduced spacing after name
    }
    yPosition += 3; // Increased spacing before role
    if (data.role) {
        yPosition = addText(data.role, 10, 'italic', margin, yPosition, contentWidth);
    }
    yPosition = addText('Currently seeking remote or hybrid roles in the Salt Lake City area.', 7.5, 'italic', margin, yPosition, contentWidth);
    yPosition += 4;

    yPosition = addText('Summary', 10, 'bold', margin, yPosition, contentWidth);
    if (data.summary) {
        const summaryItems = data.summary.split('. ').filter(item => item.trim());
        summaryItems.forEach(item => {
            yPosition = addText(`- ${item.trim()}.`, 7.5, 'normal', margin, yPosition, contentWidth);
        });
    }
    yPosition += 4;

    yPosition = addText('Professional Experience', 10, 'bold', margin, yPosition, contentWidth);
    let previousCompany = null;
    if (data.professionalExperience) {
        data.professionalExperience.forEach(exp => {
            const title = `${exp.position} at ${exp.company}`;
            yPosition = addText(title, 9, 'bold', margin, yPosition, contentWidth);
            const duration = `${formatDate(exp.duration.start)} - ${formatDate(exp.duration.end)}`;
            yPosition = addText(`${duration} | ${exp.location}`, 7.5, 'normal', margin, yPosition, contentWidth);
            if (exp.description) {
                yPosition = addText(exp.description, 7.5, 'normal', margin, yPosition, contentWidth);
            }
            if (exp.highlights) {
                exp.highlights.forEach(highlight => {
                    yPosition = addText(`- ${highlight}`, 7.5, 'normal', margin, yPosition, contentWidth);
                });
            }
            yPosition += 2;
        });
    }
    yPosition += 4;

    yPosition = addText('Education', 10, 'bold', margin, yPosition, contentWidth);
    if (data.education) {
        yPosition = addText(data.education.degree, 9, 'bold', margin, yPosition, contentWidth);
        yPosition = addText(data.education.institution, 7.5, 'normal', margin, yPosition, contentWidth);
        if (data.education.coursework) {
            yPosition = addText(`Coursework: ${data.education.coursework.join(', ')}`, 7.5, 'normal', margin, yPosition, contentWidth);
        }
    }
    yPosition += 4;

    yPosition = addText('Skills', 10, 'bold', margin, yPosition, contentWidth);
    if (data.skills) {
        if (data.skills.coreSkills) {
            yPosition = addText('Core Skills', 9, 'bold', margin, yPosition, contentWidth);
            data.skills.coreSkills.forEach(skill => {
                yPosition = addText(`- ${skill}`, 7.5, 'normal', margin, yPosition, contentWidth);
            });
        }
        if (data.skills.toolsAndFrameworks) {
            yPosition = addText('Tools & Frameworks', 9, 'bold', margin, yPosition, contentWidth);
            data.skills.toolsAndFrameworks.forEach(tool => {
                yPosition = addText(`- ${tool}`, 7.5, 'normal', margin, yPosition, contentWidth);
            });
        }
        if (data.skills.fun) {
            yPosition = addText('Interests & Hobbies', 9, 'bold', margin, yPosition, contentWidth);
            data.skills.fun.forEach(fun => {
                yPosition = addText(`- ${fun}`, 7.5, 'normal', margin, yPosition, contentWidth);
            });
        }
    }

    // Generate PDF as Blob and open in new tab with default filename
    const pdfOutput = doc.output('blob');
    const url = URL.createObjectURL(pdfOutput);
    const newTab = window.open(url, '_blank');
    if (newTab) {
        newTab.document.title = 'Remy_Russell_Resume.pdf';
        // Add a hidden link to set the filename for download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Remy_Russell_Resume.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);
        newTab.onload = () => {
            link.click();
            document.body.removeChild(link);
        };
    } else {
        console.error('Failed to open new tab. Pop-up blocker may be enabled.');
        alert('Unable to open PDF in new tab. Please allow pop-ups and try again.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

    const fallbackData = {
        "metadata": {
            "version": "1.1",
            "lastUpdated": "2025-04-02"
        },
        "name": "Remy Russell",
        "role": "Product Manager",
        "contact": {
            "email": "remyrussell@pm.me",
            "phone": null,
            "linkedin": "https://www.linkedin.com/in/remyrussell"
        },
        "summary": "An optimistic product leader with three years of Product Management and seven years of Business Analysis experience evolving health tech platforms through rapid iteration of discovery and delivery. An engineering background, an outcome-oriented mindset, and dedication to understanding the users, buyers, and opportunities to ensure success of the business",
        "professionalExperience": [
            {
                "position": "Associate Product Manager, Engineering",
                "company": "Eccovia",
                "logo": "/assets/images/logos/eccovia.svg",
                "location": "Salt Lake City, UT",
                "duration": {
                    "start": "2022-03-14",
                    "end": "2025-03-31"
                },
                "description": "Product Lead on the Platform and Integrations R&D team for a configurable Case Management platform used by social service providers (Homeless Management, Medically Tailored Meals, Behavioral Health, etc.)",
                "highlights": [
                    "Partnered with Leadership, Engineering, Sales, and other teams to establish and maintain the roadmap, define KPIs, and create mechanisms to measure & communicate priority and progress",
                    "Delivered and scrapped POCs and MVPs for new native features or for third party integrations (e.g., Twilio, Microsoft Power Automate, Onfleet and WorkWave for last-mile delivery operations, Health Information Exchanges, Claims Processing Systems, DocuSeal, etc.)",
                    "Helped drive growth in ARR by over 50% to ~$15M by expanding platform capabilities, ultimately leading to acquisition",
                    "Shipped a new RESTful API from 0 to 1 and onboarded over 10 customer organizations to start using it for their custom integration use cases",
                    "Evolved the platform based on customer requests (e.g., SSO and 2-Step Verification for native users, in-app file previews, scheduled CSV exports, API access to Azure storage accounts, etc.)"
                ]
            },
            {
                "position": "Business Analyst, Solutions Delivery",
                "company": "Eccovia",
                "logo": "/assets/images/logos/eccovia.svg",
                "location": "Salt Lake City, UT",
                "duration": {
                    "start": "2019-04-01",
                    "end": "2022-03-13"
                },
                "description": "Problem discovery, requirements gathering, and solutioning with new customers to implement solutions on the case management platform.",
                "highlights": [
                    "Drove the successful implementation for two of Eccovia's top ten largest customers by ARR, including complex data migration and integration use cases",
                    "Took ownership of all new integration use cases across new customers (over a dozen) and helped transition our technical strategy towards agnostic services to support multiple customers or integration partners"
                ]
            },
            {
                "position": "Business Analyst II, MMIS Implementation Project",
                "company": "CNSI",
                "logo": "/assets/images/logos/CNSI.png",
                "location": "Salt Lake City, UT",
                "duration": {
                    "start": "2017-08-01",
                    "end": "2019-04-01"
                },
                "description": "System migration and gap analysis activities for implementation of a new Medicaid Management Information System for the Utah Department of Health",
                "highlights": [
                    "Collaborated with the State customer stakeholders and internal engineers to define and document comprehensive design details for the Provider Enrollment Subsystem to guide development and testing"
                ]
            },
            {
                "position": "Business Analyst, MMIS Implementation Project",
                "company": "CNSI",
                "logo": "/assets/images/logos/CNSI.png",
                "location": "Lansing, MI",
                "duration": {
                    "start": "2015-06-01",
                    "end": "2017-08-01"
                },
                "description": "Learned the end-to-end functionality of CNSI’s 'Electronic Medicaid Incentive Payment Program' solution and re-authored technical system design documentation to comply with UML standards",
                "highlights": [
                    "Analyzed program mandates published by the Center for Medicaid Services to design and implement compliant functionality"
                ]
            }
        ],
        "education": {
            "degree": "BSE in Industrial & Operations Engineering, Certificate in Entrepreneurship 2015",
            "institution": "University of Michigan, Ann Arbor",
            "logo": "/assets/images/logos/umich-logo.png",
            "coursework": [
                "Relational database design",
                "Computer programming",
                "Process improvement",
                "Modeling",
                "Simulation",
                "Statistical and decision analysis",
                "Lean management",
                "Business development",
                "Accounting"
            ]
        },
        "skills": {
            "coreSkills": [
                "Problem-solving and ownership of complex challenges",
                "Ability to articulate both technical details and high-level strategy to varying types of stakeholders",
                "Quick learner and adopter of new tools, technologies, and methodologies",
                "Proficiency in SQL and basic understanding of programming languages",
                "Healthcare Interoperability experience including HL7 (v2.x and FHIR) and Revenue Cycle Management integrations for Medicaid eligibility checks and claim submission/remittance (X12 EDI Standards)",
                "Daily user of AI tools for professional and personal use cases (Grok 3 is currently my favorite)"
            ],
            "toolsAndFrameworks": [
                "Roadmapping and Sprint Planning (Atlassian Jira Plans, MS Project, ProductBoard)",
                "Insight collection/consolidation (Hubspot, Atlassian Jira Discovery, ProductBoard, Microsoft Forms, Teams, Azure Dashboards, SQL, etc)",
                "Mock-ups and low-fi prototyping (Figma, AI Tools)",
                "Designing, Diagramming, & Brainstorming (Confluence Whiteboards, Lucidchart, Visio, FigJam, AI tools)",
                "No or low-code API Testing (Postman, Microsoft Power Automate, Zapier)",
                "Dual-track Agile, Scrum (Jira Boards for backlog refinement, Kanban, sprint planning, release planning, etc.)"
            ],
            "fun": [
                "Outdoor activities (skiing, mountain biking, hiking, camping, overlanding)",
                "Music creation/consumption (electronic, guitar, piano)",
                "Podcasts/audiobooks on anything related to tech, health, or science"
            ]
        },
        "certifications": [
            {
                "name": "HL7 Fundamentals",
                "issuer": "HL7 International",
                "date": "2020"
            }
        ]
    };

    let data;
    try {
        console.log('Fetching resume.json...');
        let response = await fetch('/resume.json', { cache: 'no-store' });
        if (!response.ok) {
            console.log('Relative path failed, trying absolute path...');
            response = await fetch('https://remyrussell.github.io/resume.json', { cache: 'no-store' });
        }
        if (!response.ok) {
            console.warn('Fetch failed, using embedded data');
            data = fallbackData;
        } else {
            data = await response.json();
            console.log('Parsed data:', data);
        }
    } catch (err) {
        console.error('Fetch error:', err.message);
        console.warn('Using embedded data due to fetch failure');
        data = fallbackData;
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
