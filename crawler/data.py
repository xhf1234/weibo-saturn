#!/usr/bin/env python

import json

class User(object):
        
    def __init__(self, jsonValue=None, dictValue=None):
        if jsonValue is None and dictValue is None:
            raise "illegale params"
        self.__json = jsonValue
        self.__dict = dictValue
        if self.__dict is None:
            self.__dict = json.loads(self.__json)

        self.uid = self.__dict["id"]
        self.name = self.__dict["screen_name"]

    def __str__(self):
        return "{uid:%d name:%s}" %(self.uid, self.name.encode("UTF-8"))
    
    

    @staticmethod
    def decodeList(strJson):
        tDict = json.loads(strJson)
        tList = tDict["users"]
        userList = []
        for v in tList:
            u = User(dictValue=v)
            userList.append(u)
        return userList
