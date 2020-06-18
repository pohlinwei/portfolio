/** Represents a project in 'Featured Works' of the main page. */
class Project {
  constructor(name, image, description, tools, date, page) {
    ensureNonNull(name, description, tools, date, page);

    const div = document.createElement('div');
    const divClasses = ['project', 'hide-project'];
    divClasses.forEach(divClass => div.classList.add(divClass));

    const divContent = `<div class="project-name-placeholder">
                          <div class="project-image-placeholder">
                            <h1 class="project-name">${name}</h1>
                          </div>
                        </div>
                        <div class="project-details-placeholder">
                          <p class="project-description">${description}</p>
                          <p class="project-tools">Made a reality with: ${tools}</p>
                          <p class="project-date">Done: ${date}</p>
                          <div class="button more-button"><a href="${page}">More >></a></div>
                        </div>`;   
    div.innerHTML = divContent;
    
    this.addProjectImage(div, image);
    this.projectCondensed = div;
  }

  /** Ensures that the given arguments are not null. */
  ensureNonNull(...args) {
    hasError = false;
    errorType = '';

    for (arg of args) {
      if (arg === null) {
        errorType = 'Null value';
      } else if (typeof arg === 'string' && arg === '') {
        errorType = 'Empty string';
      } else if (typeof arg === 'number' && arg === NaN) {
        errorType = 'Invalid number';
      } else if (Array.isArray(arg) && arg.length === 0) {
        errorType = 'Empty array'
      } else {
        // arg is valid
      }

      if (errorType !== '') {
        hasError = true;
        break;
      }
    }

    if (hasError) {
      throw new Error(`Missing project attribute. ${errorType}.`);
    }
  }

  addProjectImage(element, image) {
    if (image === '') {
      return; // no representative image to add
    }

    const projectImagePlaceholder = this.getProjectImagePlaceholder(element);
    projectImagePlaceholder.style.backgroundImage = `url("${image}")`;
  }

  /** Gets an element which is supposed to contain the project image. */
  getProjectImagePlaceholder(element) {
    const projectImagePlaceholder = 'project-image-placeholder';
    const descendants = element.querySelectorAll('*');
    
    for (descendant of descendants) {
      if (descendant.classList.contains(projectImagePlaceholder)) {
        return descendant;
      }
    }

    throw new Error('Placeholder for project image cannot be found');
  }

  get div(){
    return this.projectCondensed;
  }
}
