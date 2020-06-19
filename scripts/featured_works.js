const parentDir = 'https://pohlinwei.github.io/portfolio/';

fetch(parentDir + 'projects/test.json')
    .then(response => response.json())
    .then(projects_json => setupWorkSection(projects_json))
    .catch(err => console.error(err));

/** 
 * Sets up featured works section by creating project elements, and
 * left- and right- buttons for navigation.
 */
function setupWorkSection(projects_json) {
  const projectsHtml = setupProjects(projects_json);
  const worksHtml = addNavButtons(projectsHtml);

  const projectsPlaceholder = document.getElementById('projects');
  ensureNonNull(projectsPlaceholder);
  projectsPlaceholder.innerHTML = worksHtml;

  enableNavigation();
}

/** Creates string which is used to display all projects. */
function setupProjects(projects_json) {
  const projects = toProjects(projects_json);
  const projectDivs = projects.map(project => project.div);
  const projectsHtml = projectDivs.map(projectDiv => projectDiv.outerHTML)
                          .join('');
  return projectsHtml;
}

/** 
 * Converts an array of projects that is represented as JSON objects to Projects. 
 * @return {Array<Project>}
 */
const toProjects = (projects_json) => {
  const projects = projects_json.map(project_json => toProject(project_json));
  return projects;
}

/** 
 * Converts a JSON-represented project to Project. 
 * @return {Project}
 */
const toProject = (project_json) => {
  const name = project_json.name;
  const image = project_json.image;
  const description = project_json.description;
  const tools = project_json.tools;
  const date = project_json.date;
  const page = project_json.page;
  return new Project(name, image, description, tools, date, page);
}

/**
 * Adds navigation buttons.
 * @return {string} This string is the complete HTML content required for the
 *    featured works section.
 */
function addNavButtons(projectsHtml) {
  const leftButton = '<div id="left-button" class="button">' + 
      '<i class="fas fa-chevron-circle-left fa-lg"></i></div>';
  const rightButton = '<div id="right-button" class="button">' + 
      '<i class="fas fa-chevron-circle-right fa-lg"></i></div>';
  
  return leftButton + projectsHtml + rightButton;
}

/** */