#!/usr/bin/env python

import redis
from weibo import WeiboClient
from data import User

class Store(object):
    
    FIELD_NAME = "name"
    FIELD_UID = "uid"

    def __bollowRedis(self):
        return redis.StrictRedis(host='localhost', port=6379, db=0)

    def __getKey(self, user):
        return "wb:user:%d" % user.uid
        

    def saveUser(self, user):
        client = self.__bollowRedis()
        key = self.__getKey(user)
        client.hset(key, Store.FIELD_UID, user.uid)
        client.hset(key, Store.FIELD_NAME, user.name)

    def getUser(self, uid):
        client = self.__bollowRedis()
        key = self.__getKey(user)
        name = client.hget(key, Store.FIELD_NAME)
        return User(uid, name)

if __name__ == '__main__':
    store = Store()

    client = WeiboClient()
    uList = client.dumpFriends("2207639514", "2.006oOL1DnB3GRCf3190d110eWXjkAC")
    for user in uList:
        store.saveUser(user)
    for user in uList:
        print store.getUser(user.uid)
