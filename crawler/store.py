#!/usr/bin/env python

import redis
from weibo import WeiboClient
from data import User
from utils import Utils,Properties
import const

class AbsRedisStore(object):
    
    def _bollowRedis(self):
        return redis.StrictRedis(host=const.redisHost, port=6379, db=0)

class UserStore(AbsRedisStore):
    
    FIELD_NAME = "name"
    FIELD_UID = "uid"

    __key_prefix = "wb:user:"

    def __getKey(self, uid):
        return self.__key_prefix + str(uid)

    def saveUser(self, user):
        client = self._bollowRedis()
        pipe = client.pipeline()
        key = self.__getKey(user.uid)
        pipe.hset(key, UserStore.FIELD_UID, user.uid)
        pipe.hset(key, UserStore.FIELD_NAME, user.name)
        pipe.execute()

    def saveUsers(self, users):
        client = self._bollowRedis()
        pipe = client.pipeline()
        for user in users:
            key = self.__getKey(user.uid)
            pipe.hset(key, UserStore.FIELD_UID, user.uid)
            pipe.hset(key, UserStore.FIELD_NAME, user.name)
        pipe.execute()

    def getUser(self, uid):
        client = self._bollowRedis()
        key = self.__getKey(uid)
        name = client.hget(key, UserStore.FIELD_NAME)
        return User(uid, name)

    def count(self):
        client = self._bollowRedis()
        keys = client.keys(self.__key_prefix + "*")
        return len(keys)

class FriendsStore(AbsRedisStore):

    def __getKey(self, uid):
        return "wb:friendids:%d" % uid

    def saveFriends(self, uid, friendIds):
        client = self._bollowRedis()
        key = self.__getKey(uid)
        if len(friendIds) != 0:
            client.sadd(key, *friendIds)
        else:
            print 'save Friends', friendIds

    def getFriends(self, uid):
        client = self._bollowRedis()
        key = self.__getKey(uid)
        return client.smembers(key)

    def count(self, uid):
        client = self._bollowRedis()
        key = self.__getKey(uid)
        return client.scard(key)

    def counts(self, uids):
        """ get the count list for the uid list """
        client = self._bollowRedis()
        pipe = client.pipeline()
        for uid in uids:
            key = self.__getKey(uid)
            pipe.scard(key)
        return pipe.execute()

    def uids(self):
        """ get the uid list """
        client = self._bollowRedis()
        keys = client.keys('wb:friendids:*')
        
        def extractId(key):
            return int(key[13:])
        return map(extractId, keys)

    def keyCount(self) :
        client = self._bollowRedis()
        keys = client.keys('wb:friendids:*')
        return len(keys)

class Queue(AbsRedisStore):
    __key = "wb:queue"
    
    def enqueue(self, uid):
        client = self._bollowRedis()
        client.zincrby(self.__key, uid, 1)

    def enqueuePipe(self, uids):
        client = self._bollowRedis()
        pipe = client.pipeline()
        for uid in uids:
            pipe.zincrby(self.__key, uid, 1)
        pipe.execute()

    def dequeue(self):
        client = self._bollowRedis()
        tList = client.zrevrange(self.__key, 0, 0)
        value = None
        if len(tList) > 0:
            value = tList[0]
            client.zrem(self.__key, value)
        return int(value)

    def putFront(self, uid):
        client = self._bollowRedis()
        client.zadd(self.__key, 10000, uid)

    def count(self):
        client = self._bollowRedis()
        return client.zcard(self.__key)

if __name__ == '__main__':
    userStore = UserStore()
    friendsStore = FriendsStore()
    queue = Queue()

    print userStore.count()
