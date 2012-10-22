#!/usr/bin/env python
from utils import Properties
import os.path

def __toHump(s):
    ss = s.split('.')
    result = None
    for s in ss:
        if result is None:
            result = [s]
        else:
            result.append(s.capitalize())
    return ''.join(result)

def __readConfig(path):
    p = Properties()
    p.load(path)
    for kv in p.list():
        key = __toHump(kv[0])
        value = kv[1]
        print 'read config',key,value
        globals()[key] = value

__base = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
__readConfig(__base + '/default.config')
if os.path.exists(__base + '/local.config'):
    __readConfig(__base + '/local.config')

        
