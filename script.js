document.addEventListener("DOMContentLoaded", function() {
    fetch('resume.json')
      .then(response => response.json())
      .then(data => {
        // Populate name and contact
        document.getElementById('name').textContent = data.name;
        document.getElementById('contact').textContent = data.contact;

        // Populate product management section
        populateList(data.productManagement, 'productManagementList');

        // Populate professional experiences
        const professionalExperienceContainer = document.getElementById('professionalExperience');
        data.professionalExperience.forEach(experience => {
            const article = document.createElement('article');
            const h3 = document.createElement('h3');
            h3.textContent = experience.title;
            article.appendChild(h3);
            article.appendChild(document.createElement('p').textContent = experience.company);
            article.appendChild(document.createElement('p').textContent = experience.duration);
            article.appendChild(document.createElement('p').textContent = experience.description);
            
            const ul = document.createElement('ul');
            experience.responsibilities.forEach(responsibility => {
                const li = document.createElement('li');
                li.textContent = responsibility;
                ul.appendChild(li);
            });
            article.appendChild(ul);

            professionalExperienceContainer.appendChild(article);
        });

        // Populate education
        document.getElementById('education').textContent = data.education;

        // Populate skills, tools, and fun sections
        populateList(data.skills, 'skillsList');
        populateList(data.tools, 'toolsList');
        populateList(data.fun, 'funList');
    });
});

function populateList(items, listId) {
    const ul = document.getElementById(listId);
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
}
