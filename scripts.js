// When the document is fully loaded, execute the provided functions
document.addEventListener('DOMContentLoaded', function () {
    
    // Fetch and populate the resume details from JSON
    fetchResumeDetails();
    
    // Add event listener for theme toggle button
    attachThemeToggleEvent();
});

/**
 * Function to fetch and populate the resume details from JSON
 */
function fetchResumeDetails() {
    fetch('resume.json')
        .then(response => response.json())
        .then(data => populateResume(data))
        .catch(error => console.error('Error fetching JSON:', error));
}

/**
 * Function to attach the event listener for theme toggle button
 */
function attachThemeToggleEvent() {
    document.getElementById("themeToggle").addEventListener("click", function() {
        let currentTheme = document.documentElement.getAttribute("data-theme");
        if(currentTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
        }
    });
}

/**
 * Function to dynamically populate the resume based on the provided JSON data
 * @param {Object} data - The resume details in JSON format
 */
function populateResume(data) {
    // Personal Info
    document.getElementById('name').innerText = data.name;
    document.getElementById('phone').innerText = data.phone;
    document.getElementById('email').innerText = data.email;
    document.getElementById('role').innerText = data.role;

    // Product Management
    let pmList = document.getElementById('productManagement');
    data.productManagement.forEach(item => {
        let li = document.createElement('li');
        li.innerText = item;
        pmList.appendChild(li);
    });

    // Professional Experience
    let peContainer = document.getElementById('professionalExperience');
    data.professionalExperience.forEach(exp => {
        let div = document.createElement('div');
        div.classList.add('experience-item');

        let position = document.createElement('h4');
        position.innerText = `${exp.position} at ${exp.company}, ${exp.location} (${exp.duration})`;
        div.appendChild(position);

        let description = document.createElement('p');
        description.innerText = exp.description;
        div.appendChild(description);

        let ul = document.createElement('ul');
        exp.highlights.forEach(highlight => {
            let li = document.createElement('li');
            li.innerText = highlight;
            ul.appendChild(li);
        });
        div.appendChild(ul);

        peContainer.appendChild(div);
    });

    // Education
    document.getElementById('educationDegree').innerText = data.education.degree;
    document.getElementById('educationInstitution').innerText = data.education.institution;
    document.getElementById('educationCoursework').innerText = data.education.coursework;

    // Skills
    let skillsList = document.getElementById('skillsList');
    data.skills.skills.forEach(skill => {
        let li = document.createElement('li');
        li.innerText = skill;
        skillsList.appendChild(li);
    });

    let toolsList = document.getElementById('toolsAndFrameworks');
    data.skills.toolsAndFrameworks.forEach(tool => {
        let li = document.createElement('li');
        li.innerText = tool;
        toolsList.appendChild(li);
    });

    let funList = document.getElementById('funActivities');
    data.skills.fun.forEach(activity => {
        let li = document.createElement('li');
        li.innerText = activity;
        funList.appendChild(li);
    });
}
