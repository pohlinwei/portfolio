from json import JSONEncoder
from .Project import Project

class ProjectEncoder(JSONEncoder):
    def default(self, project):
        if isinstance(project, Project):
            return {
                "__project__": True, 
                "name": project.get_name(),
                "image": project.get_image(),
                "description": project.get_description(),
                "tools": project.get_tools(),
                "date": project.get_date(),
                "page": project.get_page(),
                "screenshots": project.get_screenshots(),
                "github": project.get_github()
            }

        # Let the base class default method raise the TypeError
        return JSONEncoder.default(self, project)
