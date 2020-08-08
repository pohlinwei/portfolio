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