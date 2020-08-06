import json
from pathlib import Path

from .projectutilities import create_file
from .PageCreator import PageCreator
from .Project import Project
from .ProjectEncoder import ProjectEncoder
from .projectdecoder import as_project

class ProjectManager:
    def __init__(self, json_path):
        self.projects = []
        self.encoder = ProjectEncoder(indent=4)
        self.json = Path(json_path)

        if not self.json.exists():
            create_file(json_path)
        elif self.json.stat().st_size > 0:
            projects = json.loads(self.json.read_text(), object_hook=as_project)
            self.projects.extend(projects)
        
        self.page_creator = PageCreator()
            
    def add(self, file_path, overwrite=False):
        """ Adds project by updating .json and creating .html files.
        """
        project = Project.file_to_project(file_path)
        self.projects.append(project)
        self.page_creator.create(project, overwrite)

        projects_as_json = self.encoder.encode(self.projects)
        self.json.write_text(projects_as_json)
