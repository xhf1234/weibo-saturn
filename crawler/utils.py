#!/usr/bin/env python

class Utils(object):
    @staticmethod
    def listToStr(alist):
        return '[%s]' % ', '.join(map(str, alist))
