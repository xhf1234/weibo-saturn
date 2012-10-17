#!/usr/bin/env python

import redis
from weibo import WeiboClient
from data import User
from utils import Utils

class AbsRedisStore(object):

    def _bollowRedis(self):
        return redis.StrictRedis(host='localhost', port=6379, db=0)

class UserStore(AbsRedisStore):
    
    FIELD_NAME = "name"
    FIELD_UID = "uid"

    def __getKey(self, uid):
        return "wb:user:%d" % uid

    def saveUser(self, user):
        client = self._bollowRedis()
        key = self.__getKey(user.uid)
        client.hset(key, UserStore.FIELD_UID, user.uid)
        client.hset(key, UserStore.FIELD_NAME, user.name)

    def getUser(self, uid):
        client = self._bollowRedis()
        key = self.__getKey(uid)
        name = client.hget(key, UserStore.FIELD_NAME)
        return User(uid, name)

class FriendsStore(AbsRedisStore):

    def __getKey(self, uid):
        return "wb:friendids:%d" % uid

    def saveFriends(self, uid, friendIds):
        client = self._bollowRedis()
        key = self.__getKey(uid)
        client.sadd(key, *friendIds)

    def getFriends(self, uid):
        client = self._bollowRedis()
        key = self.__getKey(uid)
        return client.smembers(key)


if __name__ == '__main__':
    userStore = UserStore()
    friendsStore = FriendsStore()

    uid = 2207639514
    client = WeiboClient()
    uList = client.dumpFriends(uid, "2.006oOL1DnB3GRCff1ae130c0n4ySvC")
    friendIds = User.extractIds(uList)
    friendsStore.saveFriends(uid, friendIds)
    friendIds = friendsStore.getFriends(uid)

    print Utils.listToStr(friendIds)
