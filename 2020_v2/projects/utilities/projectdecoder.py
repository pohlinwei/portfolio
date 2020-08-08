from .Project import Project

def as_project(dct):
    if not '__project__' in dct:
        raise TypeError('Not all entries in .json represent a valid project')
    return Project(dct['name'], dct['image'], dct['summary'], dct['description'], dct['tools'],
                    dct['date'], dct['page'], dct['screenshots'], dct['github'])
