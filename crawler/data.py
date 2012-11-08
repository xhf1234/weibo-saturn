#!/usr/bin/env python
#coding=UTF-8

import json

class User(object):
    
    KEY_NAME = "screen_name"
    KEY_UID = "id"
        
    def __init__(self, uid, name):
        self.uid = uid
        self.name = name

    def __str__(self):
        return "{uid:%d name:%s}" %(self.uid, self.name)

    @staticmethod
    def decodeFromDict(dictValue): 
        uid = dictValue[User.KEY_UID]
        if not uid:
            return None
        name = dictValue[User.KEY_NAME]
        if isinstance(name, unicode):
            name = name.encode("UTF-8")
        if name == '':
            name = str(uid)
        return User(uid, name)

    @staticmethod
    def decodeFromJson(jsonValue):
        dictValue = json.loads(jsonValue)
        return User.decodeFromDict(dictValue)

    @staticmethod
    def decodeList(strJson):
        tDict = json.loads(strJson)
        tList = tDict["users"]
        userList = []
        for v in tList:
            u = User.decodeFromDict(v)
            userList.append(u)
        return userList

    @staticmethod
    def extractIds(userList):
        def extract(user):
            return user.uid
        return map(extract, userList)

class Teacher(object):
    KEY_UID = 'id'
    KEY_NAME = 'screen_name'
    KEY_VERIFY = 'verified_reason'
    KEY_FANS_COUNT = 'followers_count'
    KEY_AVATAR = 'profile_image_url'
    KEY_URL = 'profile_url'

    def __init__(self, uid, name, verify, fansCount, avatar, url):
        self.uid = int(uid)
        self.name = name
        self.verify = verify
        self.fansCount = int(fansCount)
        self.avatar = avatar
        self.url = url

    @staticmethod
    def decodeFromJson(jsonValue):
        dictValue = json.loads(jsonValue)
        if dictValue['verified'] is False:
            return None
        return Teacher.decodeFromDict(dictValue)

    @staticmethod
    def decodeFromDict(dictValue): 
        uid = dictValue[Teacher.KEY_UID]
        if not uid:
            return None
        name = dictValue[Teacher.KEY_NAME]
        fansCount = dictValue[Teacher.KEY_FANS_COUNT]
        verify = dictValue[Teacher.KEY_VERIFY]
        avatar = dictValue[Teacher.KEY_AVATAR]
        url = dictValue[Teacher.KEY_URL]
        if isinstance(name, unicode):
            name = name.encode("UTF-8")
        if name == '':
            name = str(uid)
        if isinstance(verify, unicode):
            verify = verify.encode("UTF-8")
        if isinstance(avatar, unicode):
            avatar = avatar.encode("UTF-8")
        if isinstance(url, unicode):
            url = url.encode("UTF-8")
        teacher = Teacher(uid, name, verify, fansCount, avatar, url)
        if '主持人' in teacher.verify:
            return teacher
        return None

    @staticmethod
    def decodeList(strJson):
        tDict = json.loads(strJson)
        tList = tDict["users"]
        teacherList = []
        for v in tList:
            u = Teacher.decodeFromDict(v)
            if u is not None:
                teacherList.append(u)
        return teacherList

    def __str__(self):
        return "[uid %d, name %s, verify %s, fansCount %d, avatar %s, url %s]" %(self.uid, self.name, self.verify, self.fansCount, self.avatar, self.url)
