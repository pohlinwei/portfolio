(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Project= require('./project.js');

/*================
    FUNCTIONS 
================*/
// General 
const isLandscape = () => window.innerWidth > window.innerHeight;
const scrollTo = element => isLandscape() ? element.scrollIntoView(false) : element.scrollIntoView(true);
const goToPage = () => {
    const page = location.hash;
    console.log(page);
    if (page == '#' || page == '#home') {
        scrollTo(homeDiv);
    } else if (location.hash == '#work') {
        scrollTo(allContentDiv[0]);
    } else if (location.hash == '#about') {
        scrollTo(allContentDiv[1]);
    } else {
        scrollTo(allContentDiv[2]);
    }
}

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
window.onloadend = goToPage;

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
},{"./project.js":2}],2:[function(require,module,exports){
const mainURL = 'https://pohlinwei.github.io/';
module.exports = class Project {
    constructor(index, name) {
        this.index = index;
        this.name = name;
        /* For HTML element creation */
        this.preImage = '<div class="project-img"><img src="images/' + this.name + '/';
        this.postImage = '.png"/></div>';
        // !!! shall I change this?
        this.githubStart = '<div class="view-code"><a href="' 
        this.githubEnd = '">View Code <img src="vectors/github.svg"/></a></div>';
        this.github = '';
        this.text = [];
        this.title = '';
        this.length = 0;
        this.link = '';
        fetch(mainURL + '/json/' + name + '.json')
            .then(response => response.json())
            .then(data => {
                this.length = data.length;
                this.text.push(...data.text);
                this.title = data.title;
                this.link = data.link;
                if (this.length == 0) {
                    throw "this.length is 0";
                } else if (this.text.length == 0) {
                    throw "No text received";
                } else if (this.title.length == 0) {
                    throw "No title received";
                }
                this.github = this.githubStart + this.link + this.githubEnd;
                this.generateElements();
            })
            .catch(err => console.error('Parsing of .json was unsuccessful: ' + err));
    }

    generateElements() {
        let innerhtml = '<div><div class="title"><p>' + this.title + '</p></div>';
        innerhtml += '<div class="details">';
        for (let i = 0; i < this.length; i++) {
            innerhtml += (this.preImage + i + this.postImage);
            innerhtml += (this.preImage + 'mobile_' + i + this.postImage);
            innerhtml += ('<p>' + this.text[i] + '</p>');
        }
        innerhtml += (this.github + '</div></div>');
        const parentElement = document.getElementsByClassName('intro')[this.index];
        parentElement.innerHTML = innerhtml;
    }
}
},{}]},{},[1]);
