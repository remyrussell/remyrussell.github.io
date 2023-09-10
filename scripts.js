// Function to inject content from the JSON into the HTML
function populateResume(data) {
    document.getElementById("name").textContent = data.name;
    document.getElementById("phone").textContent = data.phone;
    document.getElementById("email").textContent = data.email;

    const productManagementList = document.getElementById("productManagement");
    data.productManagement.forEach(item => {
        let listItem = document.createElement("li");
        listItem.textContent = item;
        productManagementList.appendChild(listItem);
    });

    const professionalExperienceDiv = document.getElementById("professionalExperience");
    data.professionalExperience.forEach(exp => {
        let jobDiv = document.createElement("div");
        let title = document.createElement("h3");
        title.textContent = `${exp.role} – ${exp.team}, ${exp.company}`;
        let duration = document.createElement("p");
        duration.textContent = `${exp.startDate} – ${exp.endDate}`;
        jobDiv.appendChild(title);
        jobDiv.appendChild(duration);
        if (exp.details) {
            let details = document.createElement("p");
            details.textContent = exp.details;
            jobDiv.appendChild(details);
        }
        exp.bullets.forEach(bullet => {
            let bulletItem = document.createElement("p");
            bulletItem.textContent = `• ${bullet}`;
            jobDiv.appendChild(bulletItem);
        });
        professionalExperienceDiv.appendChild(jobDiv);
    });

    const educationDiv = document.getElementById("education");
    let degree = document.createElement("p");
    degree.textContent = `${data.education.degree}, ${data.education.specialization} ${data.education.year} - ${data.education.institution}`;
    educationDiv.appendChild(degree);

    const skillsDiv = document.getElementById("skills");
    skillsDiv.innerHTML = `
        <strong>Skills:</strong> ${data.skills.join(", ")}<br>
        <strong>Tools/Frameworks:</strong> ${data.tools.join(", ")}<br>
        <strong>Fun:</strong> ${data.fun.join(", ")}
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('resume.json')
        .then(response => response.json())
        .then(data => {
            populateResume(data);

            // Toggle Dark Mode functionality
            const toggleButton = document.getElementById("toggleMode");
            toggleButton.addEventListener("click", function() {
                const currentMode = document.body.className;
                if (currentMode === "light-mode") {
                    document.body.className = "dark-mode";
                    toggleButton.textContent = "Switch to Light Mode";
                } else {
                    document.body.className = "light-mode";
                    toggleButton.textContent = "Switch to Dark Mode";
                }
            });
        });
});
