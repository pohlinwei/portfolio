from .create_file import create_file
from os import listdir
from pathlib import Path
from .Project import Project
from .ScreenshotPair import ScreenshotPair

class PageCreator:
    # assumes that relative paths are correct
    PARENT_PARENT_DIR_NAME = 'projects'
    # templates for page creation
    BUTTON_TEMPLATE = Path('templates/button_template.html')
    IMG_TEMPLATE = Path('templates/image_template.html')
    MAIN_TEMPLATE = Path('templates/project_template.html')

    def create(self, project, overwrite):
        proj_page_path = project.get_page()
        relative_page_path = self.to_relative_path_from_ancestor(proj_page_path)
        page = Path(relative_page_path)

        if page.exists() and not overwrite:
            print('Skipping the creation of .html page at ' + proj_page_path)
            print('To force the creation of this file, set \'overwrite\' to true')
            return
        elif not page.exists():
            create_file(relative_page_path)
        
        page_content = self.generate_content(project)
        page.write_text(page_content)

    def generate_content(self, project):
        name = project.get_name()
        images = self.get_screenshots_html(project.get_screenshots(), name)
        github_button = self.get_github_button_html(project.get_github())

        main_template = PageCreator.MAIN_TEMPLATE.read_text()
        return main_template.format(NAME=name, GITHUB_BUTTON=github_button, IMAGES=images)

    def get_screenshots_html(self, screenshots_path, name):
        screenshots_dir = Path(screenshots_path)
        screenshots = [screenshots_path + '/' + screenshot for screenshot in listdir(screenshots_dir)
                        if screenshot.endswith(('.jpg', '.png'))]
        screenshot_pairs = ScreenshotPair.get_pairs(screenshots)

        image_template = PageCreator.IMG_TEMPLATE.read_text()
        images = []
        images = [image_template.format(SHOTS_SMALL=screenshot_pair.get_small(), 
                    SHOTS=screenshot_pair.get_reg(), NAME=name) for screenshot_pair in screenshot_pairs]
        
        return ''.join([image for image in images])

    def get_github_button_html(self, github):
        if github == '':
            return ''
        github_button_template = PageCreator.BUTTON_TEMPLATE.read_text()
        return github_button_template.format(GITHUB=github)
    
    def to_relative_path_from_ancestor(self, path):
        dirs = path.split('/')
        parent_dir = dirs[0]

        if parent_dir != PageCreator.PARENT_PARENT_DIR_NAME:
            raise ValueError('Incompatible relative paths when converting to relative path')

        return '/'.join(dirs[1:])
