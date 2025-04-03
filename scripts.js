function formatDate(dateString) {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

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
        // ... (rest of your code remains unchanged until professionalExperience) ...

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

                // ... (rest of your code continues) ...
            });
        } else {
            let fallbackDiv = document.createElement('div');
            fallbackDiv.innerHTML = '<p>Professional Experience Data Not Found</p>';
            experienceContainer.appendChild(fallbackDiv);
        }

        // ... (rest of your code continues) ...
    } catch (err) {
        console.error('Error fetching or processing JSON:', err.message, err.stack);
        document.getElementById('professionalExperience').innerHTML = '<p>Error loading experience: ' + err.message + '</p>';
        document.getElementById('education').innerHTML = '<p>Error loading education: ' + err.message + '</p>';
    }
});function formatDate(dateString) {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

document.addEventListener('DOMContentLoaded', async () => {
    keepThemeSetting();
    attachThemeToggleEvent();

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
        // ... (rest of your code remains unchanged until professionalExperience) ...

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

                // ... (rest of your code continues) ...
            });
        } else {
            let fallbackDiv = document.createElement('div');
            fallbackDiv.innerHTML = '<p>Professional Experience Data Not Found</p>';
            experienceContainer.appendChild(fallbackDiv);
        }

        // ... (rest of your code continues) ...
    } catch (err) {
        console.error('Error fetching or processing JSON:', err.message, err.stack);
        document.getElementById('professionalExperience').innerHTML = '<p>Error loading experience: ' + err.message + '</p>';
        document.getElementById('education').innerHTML = '<p>Error loading education: ' + err.message + '</p>';
    }
});
