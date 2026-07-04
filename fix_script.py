import urllib.parse
import posixpath
import re

def is_path_blocked(path):
    path = path.split('?')[0].split('#')[0]
    path = urllib.parse.unquote(path)
    path = re.sub(r'/+', '/', path)
    path = posixpath.normpath(path)

    blocked_extensions = ('.py', '.pyc', '.md', '.log', '.sh', '.env')
    blocked_files = ('/data.json', '/reports.json', '/visitors.json', '/server.py')
    blocked_dirs = ('/.git', '/__pycache__')

    if any(path.endswith(ext) for ext in blocked_extensions):
        return True

    if any(path == f or path.startswith(f + '/') for f in blocked_files):
        return True

    if any(path == d or path.startswith(d + '/') for d in blocked_dirs):
        return True

    return False

print(is_path_blocked('/data.json'))
