document.addEventListener("DOMContentLoaded", function() {
    fetch('resume.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("name").textContent = data.name;
            document.getElementById("contact").textContent = `${data.phone} | ${data.email}`;
            document.getElementById("role").textContent = data.role;

            const productManagementList = document.getElementById("productManagementList");
            data.productManagement.forEach(item => {
                let li = document.createElement("li");
                li.textContent = item;
                productManagementList.appendChild(li);
            });

            const professionalExperienceList = document.getElementById("professionalExperienceList");
            data.professionalExperience.forEach(exp => {
                let expDiv = document.createElement("div");
                expDiv.innerHTML = `
                    <h3>${exp.position}, ${exp.company}</h3>
                    <p>${exp.location}</p>
                    <p>${exp.duration}</p>
                    <p>${exp.description}</p>
                    <ul>
                        ${exp.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                `;
                professionalExperienceList.appendChild(expDiv);
            });

            document.getElementById("education").innerHTML = `
                <h3>${data.education.degree}</h3>
                <p>${data.education.institution}</p>
                <p>${data.education.coursework}</p>
            `;

            const skillsList = document.getElementById("skillsList");
            data.skills.skills.forEach(skill => {
                let li = document.createElement("li");
                li.textContent = skill;
                skillsList.appendChild(li);
            });

            const toolsList = document.getElementById("toolsList");
            data.skills.toolsAndFrameworks.forEach(tool => {
                let li = document.createElement("li");
                li.textContent = tool;
                toolsList.appendChild(li);
            });

            const funList = document.getElementById("funList");
            data.skills.fun.forEach(fun => {
                let li = document.createElement("li");
                li.textContent = fun;
                funList.appendChild(li);
            });

        })
        .catch(error => {
            console.error("There was an error fetching or parsing the JSON:", error);
        });
});
