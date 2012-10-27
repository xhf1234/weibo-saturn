#!/usr/bin/env python

import httplib
from data import User



class WeiboClient(object):
    pageSize = 200

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
