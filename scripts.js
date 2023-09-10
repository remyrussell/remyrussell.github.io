// Wait for the DOM to completely load before executing
document.addEventListener("DOMContentLoaded", function() {
    populateResumeData();
    attachThemeToggleEvent();
});

// Attach theme toggle event
function attachThemeToggleEvent() {
    const themeToggleButton = document.getElementById("themeToggle");
    
    // Check if themeToggleButton exists before adding event listener
    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", toggleTheme);
    }
}

// Toggle between light and dark mode
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
    } else {
        body.classList.add("dark-mode");
    }
}

// Populate resume data from JSON
function populateResumeData() {
    fetch('./resume.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("name").textContent = data.name;
            document.getElementById("phone").textContent = data.phone;
            document.getElementById("email").textContent = data.email;
            document.getElementById("role").textContent = data.role;
            
            // Populate Product Management points
            const pmList = document.getElementById("productManagement");
            data.productManagement.forEach(item => {
                let li = document.createElement("li");
                li.textContent = item;
                pmList.appendChild(li);
            });

            // Populate Professional Experience
            const experienceContainer = document.getElementById("professionalExperience");
            data.professionalExperience.forEach(exp => {
                let div = document.createElement("div");
                div.innerHTML = `
                    <h3>${exp.position}</h3>
                    <p><strong>${exp.company}, ${exp.location}</strong></p>
                    <p>${exp.duration}</p>
                    <p>${exp.description}</p>
                    <ul>
                        ${exp.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                `;
                experienceContainer.appendChild(div);
            });

            // Populate Education
            document.getElementById("degree").textContent = data.education.degree;
            document.getElementById("institution").textContent = data.education.institution;
            document.getElementById("coursework").textContent = data.education.coursework;

            // Populate Skills
            const skillsList = document.getElementById("skills");
            data.skills.skills.forEach(skill => {
                let li = document.createElement("li");
                li.textContent = skill;
                skillsList.appendChild(li);
            });

            // Populate Tools & Frameworks
            const toolsList = document.getElementById("toolsAndFrameworks");
            data.skills.toolsAndFrameworks.forEach(tool => {
                let li = document.createElement("li");
                li.textContent = tool;
                toolsList.appendChild(li);
            });

            // Populate Fun
            const funList = document.getElementById("fun");
            data.skills.fun.forEach(fun => {
                let li = document.createElement("li");
                li.textContent = fun;
                funList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('There was an error fetching or processing the JSON data:', error);
        });
}
