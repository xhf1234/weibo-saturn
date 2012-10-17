#!/usr/bin/env python

import httplib
from data import User



class WeiboClient(object):

    def dumpFriends(self, uid, access_token):
        conn = httplib.HTTPSConnection("api.weibo.com")
        conn.request("GET", "/2/friendships/friends/bilateral.json?uid=%d&access_token=%s" %(uid, access_token))
        resp = conn.getresponse()
        print resp.status, resp.reason
        strJson = resp.read()
        return User.decodeList(strJson) 

if __name__ == '__main__':
    client = WeiboClient()
    uList = client.dumpFriends("2207639514", "2.006oOL1DnB3GRCf3190d110eWXjkAC")
    print '[%s]' % ', '.join(map(str, uList))
