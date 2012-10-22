#!/usr/bin/env python
import ConfigParser

class Utils(object):
    @staticmethod
    def listToStr(alist):
        return '[%s]' % ', '.join(map(str, alist))

class Properties(object):
    FAKE_SECTION = 'fakeSection'
    
    def load(self, path):
        self.__parser = ConfigParser.ConfigParser()
        self.__parser.readfp(self.__FakeSecHead(open(path)))

    def get(self, key):
        return self.__parser.get(Properties.FAKE_SECTION, key)

    def list(self):
        return self.__parser.items(Properties.FAKE_SECTION);

    class __FakeSecHead(object):
        def __init__(self, fp):
            self.fp = fp
            self.sechead = '[%s]\n' % Properties.FAKE_SECTION
        def readline(self):
            if self.sechead:
                try: return self.sechead
                finally: self.sechead = None
            else: return self.fp.readline()

