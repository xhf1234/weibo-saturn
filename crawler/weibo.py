#!/usr/bin/env python

import httplib
from data import User



class WeiboClient(object):

    def dumpFriends(self, uid, access_token):
        conn = httplib.HTTPSConnection("api.weibo.com")
        conn.request("GET", "/2/friendships/friends/bilateral.json?uid=%d&access_token=%s" %(uid, access_token))
        resp = conn.getresponse()
        if resp.status != 200:
            raise ApiException(resp.status, resp.reason)
        strJson = resp.read()
        return User.decodeList(strJson) 

class ApiException(Exception):
    def __init__(self, status, reason):
        self.status = status
        self.reason = reason

    def __str__(self):
        return "%d %s" %(self.status, self.reason)
    

if __name__ == '__main__':
    client = WeiboClient()
    uList = client.dumpFriends("2207639514", "2.006oOL1DnB3GRCf3190d110eWXjkAC")
    print '[%s]' % ', '.join(map(str, uList))
