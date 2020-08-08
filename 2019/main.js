const Project= require('./project.js');

/*================
    FUNCTIONS 
================*/
// General 
const isLandscape = () => window.innerWidth > window.innerHeight;
const scrollTo = element => isLandscape() ? element.scrollIntoView(false) : element.scrollIntoView(true);

// For navigation
const dropdownMenu = document.getElementById('dropdown-menu');
let isMenuOpen = false;
const serveMenu = () => {
    for (let e of toggle) {
        e.classList.add('hidden');
    }
    dropdownMenu.classList.remove('hidden');
    isMenuOpen = true;
}
const closeMenu = () => {
    dropdownMenu.classList.add('hidden');
    for (let e of toggle) {
        e.classList.remove('hidden');
    }
    isMenuOpen = false;
}
const toCloseMenu = () => {
    if (isMenuOpen && isLandscape()) {
        closeMenu();
    }
}

// For home page
const alternate = () => blink.style.color = blink.style.color == 'rgb(255, 255, 255)' 
                        ? 'rgb(0, 0, 0)'
                        : 'rgb(255, 255, 255)';
const toHomeDiv = () => scrollTo(homeDiv);

// For work page and descriptions
let currentDescription = -1;
const showDescription = i => {
    for (let j = 0; j < toggle.length; j++) {
        toggle[j].classList.add('hidden');
    }
    currentDescription = allDescriptions[i];
    currentDescription.classList.remove('hidden');
    body.style.backgroundColor = '#EDEDED';
    currentDescription.scrollIntoView(true);
}
const hideDescription = () => { 
    // hide 'pop up' window
    currentDescription.classList.add('hidden');
    for (let i = 0; i < toggle.length; i++) {
        toggle[i].classList.remove('hidden');
    }
    body.style.backgroundColor = '#000';
    scrollTo(workDiv);
    currentDescription = -1;
}

// Obtain required data for showcase
const files = ['tumblrTheme', 'zeitraum', 'acompianist'];
for (let i in files) {
   new Project(i, files[i]);
}

/*====================
    EVENT HANDLERS
====================*/
// General
const body = document.querySelector('body');
body.onresize = toCloseMenu;

// For navigation
const allButtons = document.getElementsByClassName('button');
const allContentDiv = document.getElementsByClassName('content');
for (let i = 0; i < allButtons.length; i++) {
    const button = allButtons[i];
    button.onclick = () => {
        if (i >= 3) {
            closeMenu();
        }
        scrollTo(allContentDiv[i % 3]);
    }
}
const homeButton = document.getElementById('home-button');
const logo = document.getElementById('logo');
homeButton.onclick = toHomeDiv;
logo.onclick = toHomeDiv;
const menuButton = document.getElementById('menu');
menuButton.onclick = serveMenu;
// Naviation in portrait mode
const menuClose = document.getElementById('menu-close').children[0];
const homeSmallButton = document.getElementById('home-small');
menuClose.onclick = closeMenu;
homeSmallButton.onclick = closeMenu;

// For home page
const homeDiv = document.getElementById('home-div');
const blink = document.getElementById('blink');
blink.style.color = 'rgb(255, 255, 255)';
setInterval(alternate, 500);

// For work page
const workDiv = document.getElementById('work-div');
const allProjects = document.getElementsByClassName('project');
const toggle = document.getElementsByClassName('toggle');
for (let i = 0; i < allProjects.length; i++) {
    allProjects[i].onclick = () => showDescription(i);
}

// For description
const allDescriptions = document.getElementsByClassName('description');
const closeButtons = document.getElementsByClassName('close');
for (let closeButton of closeButtons) {
    closeButton.onclick = hideDescription;
}