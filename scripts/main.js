"use strict";
const PARENT_DIR = 'https://pohlinwei.github.io/portfolio/';
window.onload = () => {
    fetch(PARENT_DIR + 'projects/featured_works.json')
        .then(response => response.json())
        .then(works => {
        const overviewWorks = [];
        works.forEach((work) => overviewWorks.push({
            name: work.name,
            summary: work.summary,
            tools: work.tools,
            date: work.date,
            page: work.page
        }));
        setUpWorks(overviewWorks);
        setupActionAnimation();
        setupDropdownMenu();
        setupForm();
        setTimeout(hideLoaderShowContent, 1000); // delay at least 1s
    });
};
/** Hides loader from main view and show content. */
function hideLoaderShowContent() {
    const loader = document.getElementById('loader');
    ensureNonNull(loader);
    loader.classList.add('fade-out');
    setTimeout(() => {
        loader.style.display = Display.HIDE;
        const contentElements = document.getElementsByTagName('section');
        const footer = document.getElementsByTagName('footer');
        ensureNonNull(contentElements, loader);
        for (let i = 0; i < contentElements.length; i++) {
            contentElements[i].style.display = Display.SHOW;
        }
        const homeSection = document.getElementById('home');
        ensureNonNull(homeSection);
        homeSection.style.display = Display.SHOW;
        for (let i = 0; i < footer.length; i++) {
            footer[i].style.display = Display.SHOW;
        }
    }, 3000); // duration should be synchronised with fade-out's 
}
