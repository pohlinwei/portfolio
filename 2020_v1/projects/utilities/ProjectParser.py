from .projectutilities import NAME_PREFIX, IMG_PREFIX, DESCRIPTION_PREFIX, TOOLS_PREFIX,\
    DATE_PREFIX, PAGE_PREFIX, SCREENSHOTS_PREFIX, GITHUB_PREFIX, PREFIXES

class ProjectParser:
    """ Parses and extracts the relevant values found in an array of strings that represents a project.

    Attributes:
        name_value: A string which indicates the project's name.
        image_value: A string which indicates the project image's (relative) path.
        description_value: A string which describes the project.
        tools_value: A string which indicates the tools used to create the project.
        date_value: A string which indicates when the project was done.
        page_link_value: A link (as a string) that redirects the user to the relevant project page.
    """

    def __init__(self, project_strings):
        project_strings = [project_string.strip() for project_string in project_strings]

        self.ensure_correct_format(project_strings)
        
        self.name = self.extract_value(project_strings, NAME_PREFIX)
        self.image = self.extract_value(project_strings, IMG_PREFIX)
        self.description = self.extract_value(project_strings, DESCRIPTION_PREFIX)
        self.tools = self.extract_value(project_strings, TOOLS_PREFIX)
        self.date = self.extract_value(project_strings, DATE_PREFIX)
        self.page = self.extract_value(project_strings, PAGE_PREFIX)
        self.screenshots = self.extract_value(project_strings, SCREENSHOTS_PREFIX)
        self.github = self.extract_value(project_strings, GITHUB_PREFIX)
    
    def ensure_correct_format(self, project_strings):
        for prefix in PREFIXES:
            prefix_freq = project_strings.count(prefix)
            if prefix_freq == 0:
                raise TypeError('Missing prefix {p} in project_strings'
                                .format(p=prefix))
            elif prefix_freq > 1:
                raise TypeError('Multiple {p} inputs in project_strings'
                                .format(p=prefix))

    def extract_value(self, project_strings, prefix):
        prefix_index = project_strings.index(prefix)
        val_index_start = prefix_index + 1
        val_index_end = prefix_index

        for i in range(val_index_start, len(project_strings)):
            val_index_end = i

            curr_str = project_strings[i]
            is_other_prefix = (curr_str != prefix) and (curr_str in PREFIXES)
            if is_other_prefix:
                break
            elif i == len(project_strings) - 1:
                val_index_end += 1
                
        return '\n'.join(project_strings[val_index_start : val_index_end])

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
