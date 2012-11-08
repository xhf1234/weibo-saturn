#!/usr/bin/env python

import httplib
from data import User, Teacher
import json

class WeiboClient(object):
    pageSize = 200

    def getFollowTeachers(self, uid, access_token):
        page = 1
        rList = []
        while True:
            friends = self._getFollowTeachers(uid, access_token, page)
            rList.extend(friends)
            if len(friends) != self.pageSize:
                break 
            page = page + 1
        return rList

    def _getFollowTeachers(self, uid, access_token, page):
        conn = httplib.HTTPSConnection("api.weibo.com")
        conn.request("GET", "/2/friendships/friends.json?page=%d&count=%d&uid=%d&access_token=%s" %(page, self.pageSize, uid, access_token))
        resp = conn.getresponse()
        if resp.status != 200:
            raise ApiException(resp)
        strJson = resp.read()
        return Teacher.decodeList(strJson) 

    def getTeacher(self, uid, access_token):
        conn = httplib.HTTPSConnection("api.weibo.com")
        conn.request("GET", "/2/users/show.json?uid=%d&&access_token=%s" %(uid, access_token))
        resp = conn.getresponse()
        if resp.status != 200:
            raise ApiException(resp)
        strJson = resp.read()
        return Teacher.decodeFromJson(strJson)

    def searchTeacher(self, access_token):
        conn = httplib.HTTPSConnection("api.weibo.com")
        conn.request("GET", "/2/search/suggestions/users.json?q=%s&&count=100&access_token=%s" %("%E4%B8%BB%E6%8C%81%E4%BA%BA", access_token))
        resp = conn.getresponse()
        if resp.status != 200:
            raise ApiException(resp)
        strJson = resp.read()
        tList = json.loads(strJson)
        rList = []
        for v in tList:
            rList.append(int(v['uid']))
        return rList

    def dumpFriends(self, uid, access_token):
        page = 1
        rList = []
        while True:
            friends = self.__dumpFriends(uid, access_token, page)
            rList.extend(friends)
            if len(friends) != self.pageSize:
                break 
            page = page + 1
        return rList

    def __dumpFriends(self, uid, access_token, page):
        conn = httplib.HTTPSConnection("api.weibo.com")
        conn.request("GET", "/2/friendships/friends/bilateral.json?page=%d&count=%d&uid=%d&access_token=%s" %(page, self.pageSize, uid, access_token))
        resp = conn.getresponse()
        if resp.status != 200:
            raise ApiException(resp)
        strJson = resp.read()
        return User.decodeList(strJson) 

    def getUserByName(self, name, access_token):
        conn = httplib.HTTPSConnection("api.weibo.com")
        conn.request("GET", "https://api.weibo.com/2/users/show.json?screen_name=%s&access_token=%s" %(name, access_token))
        resp = conn.getresponse()
        if resp.status == 400:
            return None
        if resp.status != 200:
            raise ApiException(resp)
        strJson = resp.read()
        return User.decodeFromJson(strJson) 

class ApiException(Exception):
    def __init__(self, resp):
        self.status = resp.status
        self.reason = resp.reason
        self.resp = resp.read()

    def __str__(self):
        return "%d %s %s" %(self.status, self.reason, self.resp)
    

if __name__ == '__main__':
    client = WeiboClient()
    uList = client.dumpFriends("2207639514", "2.006oOL1DnB3GRCf3190d110eWXjkAC")
    print '[%s]' % ', '.join(map(str, uList))
