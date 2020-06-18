const parentDir = 'https://pohlinwei.github.io/portfolio/';

fetch(parentDir + 'projects/test.json')
  .then(response => response.json())
  .then(projects_json => setupProjects(projects_json))

const setupProjects = (projects_json) => {
  const projectsPlaceholder = document.getElementById('projects');
  const leftButton = '<div id="left-button" class="button"><i class="fas fa-chevron-circle-left fa-lg"></i></div>';
  const projects = toProjects(projects_json);
  const projectDivs = projects.map(project => project.div());
  const projectsHTML = projectDivs.map(projectDiv => projectDiv.outerHTML)
                                  .join('');
  const rightButton = '<div id="right-button" class="button"><i class="fas fa-chevron-circle-right fa-lg"></i></div>';
  projectsPlaceholder.innerHTML = leftButton + projectsHTML + rightButton;
}

const toProjects = (projects_json) => {
  const projects = projects_json.map(project_json => toProject(project_json));
  return projects;
}

const toProject = (project_json) => {
  const name = project_json.name;
  const image = project_json.image;
  const description = project_json.description;
  const tools = project_json.tools;
  const date = project_json.date;
  const page = project_json.page;
  return new Project(name, image, description, tools, date, page);
}
