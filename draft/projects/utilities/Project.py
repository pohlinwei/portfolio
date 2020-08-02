from errno import ENOENT
from os import strerror
from .ProjectParser import ProjectParser
from pathlib import Path

class Project:
    def __init__(self, name, image, description, tools, date, page, screenshots, github):
        self.name = name
        self.image = image
        self.description = description
        self.tools = tools
        self.date = date
        self.page = page
        self.screenshots = screenshots
        self.github = github
    
    @staticmethod
    def file_to_project(file_path):
        p = Path(file_path)

        if not p.exists():
            raise FileNotFoundError(ENOENT, strerror(ENOENT), file_path)
        
        project_strings = []

        with p.open() as file:
            project_strings.extend(file.readlines())
        
        parser = ProjectParser(project_strings)
        return Project(parser.get_name(),
                        parser.get_image(),
                        parser.get_description(),
                        parser.get_tools(),
                        parser.get_date(),
                        parser.get_page(),
                        parser.get_screenshots(),
                        parser.get_github())
    
    def get_name(self):
        return self.name
    
    def get_image(self):
        return self.image
    
    def get_description(self):
        return self.description
    
    def get_tools(self):
        return self.tools
    
    def get_date(self):
        return self.date

    def get_page(self):
        return self.page
    
    def get_screenshots(self):
        return self.screenshots
    
    def get_github(self):
        return self.github
