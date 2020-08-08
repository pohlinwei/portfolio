from errno import EEXIST
from os import strerror
from pathlib import Path

# all prefixes that are used to define a project
PREFIX_FORMAT = '###{type}###'
NAME_PREFIX = PREFIX_FORMAT.format(type='NAME')
IMG_PREFIX = PREFIX_FORMAT.format(type='IMAGE')
DESCRIPTION_PREFIX = PREFIX_FORMAT.format(type='DESCRIPTION')
TOOLS_PREFIX = PREFIX_FORMAT.format(type='TOOLS')
DATE_PREFIX = PREFIX_FORMAT.format(type='DATE')
PAGE_PREFIX = PREFIX_FORMAT.format(type='PAGE')
SCREENSHOTS_PREFIX = PREFIX_FORMAT.format(type='SCREENSHOTS')
GITHUB_PREFIX = PREFIX_FORMAT.format(type='GITHUB')
PREFIXES = [NAME_PREFIX, IMG_PREFIX, DESCRIPTION_PREFIX, TOOLS_PREFIX, DATE_PREFIX, PAGE_PREFIX,
            SCREENSHOTS_PREFIX, GITHUB_PREFIX]

def create_template(file_path):
    p = Path(file_path)

    if p.exists():
        raise FileExistsError(EEXIST, strerror(EEXIST), 
                                'File already exists at {}'.format(file_path))
    
    p.write_text('\n'.join(PREFIXES))

def create_file(file_path):
    dirs = file_path.split('/')[:-1]
    subdirs_path = '/'.join(dirs)
    # create intermediate dirs (if necessary)
    create_dir(subdirs_path)
    # create file
    Path(file_path).touch()

def create_dir(dir_path):
    directory = Path(dir_path)
    if not directory.exists():
        directory.mkdir(parents=True)

def remove_file_ext(file_path):
    return ''.join(file_path.split('.')[:-1])
