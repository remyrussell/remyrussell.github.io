/* General styles */
body {
    font-family: Arial, sans-serif;
    padding: 2rem;
    color: #333;
    background-color: #f0f0f0;
    margin: 0;
    transition: background-color 0.3s ease;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
}

h1, h2, h3 {
    margin-top: 0;
    margin-bottom: 1rem;
}

h2 {
    margin-top: 2rem;
    border-bottom: 1px solid #ccc;
}

/* Experience, Education, and Certification items */
.experience-item, .education-item, .certification-item {
    margin-top: 1.5rem;
}

.experience-item img, .education-item img {
    width: 150px;
    max-width: 150px;
    max-height: 100px;
    margin: 0 auto 1rem auto;
    display: block;
    filter: brightness(0.8) contrast(1.2);
    object-fit: contain;
    image-rendering: crisp-edges;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
}

.theme-dark .experience-item img, .theme-dark .education-item img {
    filter: brightness(1) contrast(1);
}

/* Specific styling for CaseWorthy logo */
.caseworthy-logo {
    /* No specific styles needed unless further adjustments are required */
}

/* Specific styling for Eccovia logo in light theme */
.eccovia-logo {
    filter: grayscale(1) brightness(0.3) contrast(1.2); /* Force a darker grey similar to #444 */
}

/* Ensure Eccovia logo in dark theme remains unchanged */
.theme-dark .eccovia-logo {
    filter: brightness(1) contrast(1);
}

.experience-item .header-content, .education-item .header-content {
    text-align: left;
}

.experience-item .sticky-header, .education-item .sticky-header {
    padding: 0;
    margin: 0;
}

.experience-item .sticky-header h3, .education-item .sticky-header h3 {
    margin: 0;
    font-size: 1.25em;
}

.experience-item .date-range, .education-item .date-range {
    display: block;
    font-size: 1em;
    color: #666;
    margin-top: 0.25rem;
}

.experience-item .location, .education-item .location {
    display: block;
    font-size: 1em;
    color: #666;
    margin-top: 0.25rem;
}

.experience-item .details, .education-item .details {
    margin-left: 0;
    text-align: left;
}

/* Ensure bullets are left-aligned with standard indent */
.experience-item ul, .education-item ul, .certification-item ul {
    list-style-type: disc;
    padding-left: 1rem;
    margin-top: 0.5rem;
    text-align: left;
}

/* Other content styling */
.contact p {
    margin: 0.5rem 0;
}

.contact p#phone:empty {
    display: none;
}

.location-note {
    font-style: italic;
    color: #666;
    margin: 0.5rem 0;
}

/* Dark mode styles */
.theme-dark {
    background-color: #333;
    color: #f0f0f0;
}

.theme-dark .container {
    background-color: #444;
    color: #f0f0f0;
}

.theme-dark h2 {
    border-color: #777;
}

.theme-dark .experience-item .sticky-header,
.theme-dark .education-item .sticky-header {
    background-color: #444;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.theme-dark .experience-item .date-range,
.theme-dark .education-item .date-range {
    color: #bbb;
}

.theme-dark .experience-item .location,
.theme-dark .education-item .location {
    color: #bbb;
}

.theme-dark .location-note {
    color: #bbb;
}

.theme-dark button {
    background-color: #f0f0f0;
    color: #333;
}

/* Liquid Glass theme toggle switch */
.theme-toggle-wrapper {
    position: relative;
    margin: 0.5rem 0;
    display: none;
}

.theme-toggle-checkbox {
    display: none;
}

.theme-toggle-label {
    display: inline-block;
    cursor: pointer;
}

.theme-toggle-track {
    display: block;
    width: 51px;
    height: 31px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    position: relative;
    transition: background 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

.theme-dark .theme-toggle-track {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.theme-toggle-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 27px;
    height: 27px;
    background: linear-gradient(145deg, #ffffff, #d0d0d0);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 0 5px rgba(255, 255, 255, 0.5);
    transition: transform 0.3s ease, background 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateZ(0);
}

.theme-dark .theme-toggle-knob {
    background: linear-gradient(145deg, #cccccc, #999999);
}

.theme-toggle-knob:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.7);
}

.theme-toggle-icon {
    font-size: 1rem;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.theme-toggle-icon.fa-sun {
    color: #ff9500;
    opacity: 0;
    transform: scale(0.8);
}

.theme-toggle-icon.fa-moon {
    color: #5856d6;
    opacity: 1;
    position: absolute;
    transform: scale(1);
}

.theme-toggle-checkbox:checked + .theme-toggle-label .theme-toggle-track {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: inset 0 0 15px rgba(255, 149, 0, 0.3);
}

.theme-dark .theme-toggle-checkbox:checked + .theme-toggle-label .theme-toggle-track {
    background: rgba(0, 0, 0, 0.25);
    box-shadow: inset 0 0 15px rgba(88, 86, 214, 0.3);
}

.theme-toggle-checkbox:checked + .theme-toggle-label .theme-toggle-knob {
    transform: translateX(20px);
    background: linear-gradient(145deg, #ffffff, #d0d0d0);
}

.theme-dark .theme-toggle-checkbox:checked + .theme-toggle-label .theme-toggle-knob {
    background: linear-gradient(145deg, #cccccc, #999999);
}

.theme-toggle-checkbox:checked + .theme-toggle-label .theme-toggle-icon.fa-sun {
    opacity: 1;
    transform: scale(1);
}

.theme-toggle-checkbox:checked + .theme-toggle-label .theme-toggle-icon.fa-moon {
    opacity: 0;
    transform: scale(0.8);
}

/* Hamburger menu styles */
button.menu-toggle {
    background-color: #333;
    border: none;
    padding: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
    position: fixed;
    top: 2rem;
    right: 2rem;
    color: #f0f0f0;
    font-size: 1.5rem;
    display: block;
    z-index: 1001;
}

.theme-dark button.menu-toggle {
    background-color: #f0f0f0;
    color: #333;
}

button.menu-toggle:hover {
    background-color: #555;
}

.menu {
    display: none;
    position: fixed;
    top: 4rem;
    right: 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 1rem;
    max-height: calc(100vh - 6rem);
    overflow-y: visible;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme-dark .menu {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu li {
    margin: 0.5rem 0;
    text-align: center;
    position: relative;
}

.menu a, .menu button.download-pdf {
    color: #c71585;
    text-decoration: none;
    font-size: 1rem;
    display: block;
    padding: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: center;
}

.theme-dark .menu a, .theme-dark .menu button.download-pdf {
    color: #c71585;
}

.menu a:hover, .menu button.download-pdf:hover {
    color: #fff;
    background-color: #c71585;
}

.menu-icon {
    font-size: 1.5rem;
    padding: 0.5rem;
    color: #c71585;
}

.menu-icon:hover {
    color: #fff;
    background-color: #c71585;
}

.prank-logo {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    filter: brightness(0) invert(0.7);
}

.menu-text {
    font-size: 1rem;
    padding: 0.5rem;
    color: #c71585;
}

.menu-text:hover {
    color: #fff;
    background-color: #c71585;
}

.menu.active {
    display: block;
}

.menu.active .theme-toggle-wrapper {
    display: block;
}

/* Nested dropdown menu */
.dropdown {
    position: relative;
}

.dropdown-toggle {
    display: block;
}

.dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: auto;
    right: -50px;
    width: max-content;
    min-width: 250px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1002;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme-dark .dropdown-menu {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.dropdown-menu li {
    margin: 0;
}

.dropdown-menu a {
    padding: 0.5rem;
    display: block;
    text-align: center;
}

@media (max-width: 768px) {
    .menu {
        right: 2rem;
    }
    .dropdown-menu {
        right: 0;
        min-width: 150px;
    }
}

/* General list styling */
ul {
    list-style-type: disc;
    padding-left: 1rem;
    margin-top: 0.5rem;
}

li {
    margin-bottom: 0.5rem;
}

/* Back to Top Button */
.back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background-color: #333;
    color: #f0f0f0;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease, opacity 0.3s ease;
    z-index: 1000;
    display: none;
}

.theme-dark .back-to-top {
    background-color: #f0f0f0;
    color: #333;
}

.back-to-top:hover {
    background-color: #555;
}

.theme-dark .back-to-top:hover {
    background-color: #ccc;
}

/* Download PDF Button */
.download-pdf {
    font-size: 1rem;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}
