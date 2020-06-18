from pathlib import Path

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
        