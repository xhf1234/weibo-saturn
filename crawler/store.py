#!/usr/bin/env python

import redis
from weibo import WeiboClient
from data import User
from utils import Utils,Properties
import const

class AbsRedisStore(object):
    
    def _bollowRedis(self):
        return redis.StrictRedis(host=const.redisHost, port=6379, db=0)

class NameIndexer(AbsRedisStore):
    __key_prefix = 'wb:name:index:'

    def __getKey(self, name):
        return self.__key_prefix + name;

    def setIndex(self, user):
        client = self._bollowRedis()
        key = self.__getKey(user.name)
        client.set(key, user.uid)
        
    def setIndexPipe(self, users):
        client = self._bollowRedis()
        pipe = client.pipeline()
        for user in users:
            key = self.__getKey(user.name)
            pipe.set(key, user.uid)
        pipe.execute()

    def getIndex(self, name):
        client = self._bollowRedis()
        key = self.__getKey(name)
        return int(client.get(key))

class UserStore(AbsRedisStore):
    
    FIELD_NAME = "name"
    FIELD_UID = "uid"

    __key_prefix = "wb:user:"

    def __getKey(self, uid):
        return self.__key_prefix + str(uid)

    def __extractId(self, key):
        return int(key[8:])

    def uids(self):
        client = self._bollowRedis()
        keys = client.keys('wb:user:*')
        return map(self.__extractId, keys)

    def saveUser(self, user):
        client = self._bollowRedis()
        pipe = client.pipeline()
        key = self.__getKey(user.uid)
        pipe.hset(key, UserStore.FIELD_UID, user.uid)
        pipe.hset(key, UserStore.FIELD_NAME, user.name)
        pipe.execute()

        indexer = NameIndexer()
        indexer.setIndex(user)

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

    def getUsers(self, uids):
        client = self._bollowRedis()
        pipe = client.pipeline()
        for uid in uids:
            key = self.__getKey(uid)
            name = pipe.hget(key, UserStore.FIELD_NAME)
        names = pipe.execute()
        rlist = []
        for i in range(len(uids)):
            uid = uids[i]
            name = names[i]
            user = User(uid, name)
            rlist.append(user)
        return rlist

    def count(self):
        client = self._bollowRedis()
        keys = client.keys(self.__key_prefix + "*")
        return len(keys)

class FriendsStore(AbsRedisStore):

    def __getEmptyKey(self, uid):
        return "wb:empty:friendids:%d" % uid

    def __getKey(self, uid):
        return "wb:friendids:%d" % uid

    def __extractId(self, key):
        return int(key[13:])

    def __extractEmptyId(self, key):
        return int(key[19:])

    def saveFriends(self, uid, friendIds):
        client = self._bollowRedis()
        key = self.__getKey(uid)
        if len(friendIds) != 0:
            client.sadd(key, *friendIds)
        else:
            key = self.__getEmptyKey(uid)
            client.set(key, '0')

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

    def existPipe(self, uids):
        client = self._bollowRedis()
        counts = self.counts(uids)
        keys = map(self.__getKey, uids)
        emptyKeys = []
        indexList = []
        for i in range(len(keys)):
            if counts[i] == 0:
                emptyKeys.append(keys[i])
                indexList.append(i)
        pipe = client.pipeline()
        for key in emptyKeys:
            pipe.get(key)
        emptyResult = pipe.execute()
        r = [True]*len(keys)
        for i in range(len(emptyResult)):
            if emptyResult[i] == None:
                r[indexList[i]] = False 
        return r

    def uids(self):
        """ get the uid list """
        client = self._bollowRedis()
        keys = client.keys('wb:friendids:*')
        r1 = map(self.__extractId, keys)

        keys = client.keys('wb:empty:friendids:*')
        r2 = map(self.__extractEmptyId, keys)
        r1.extend(r2)
        return r1

    def delEmpty(self, uid):
        client = self._bollowRedis()
        key = self.__getEmptyKey(uid)
        client.delete(key)

    def filterUids(self, count):
        """ get uid list which count == $count """
        client = self._bollowRedis()
        if count == 0:
            keys = client.keys('wb:empty:friendids:*')
            return map(self.__extractEmptyId, keys)
        else:
            keys = client.keys('wb:friendids:*')
            uids = map(self.__extractId, keys)
            counts = self.counts(uids)
            r = []
            for i in range(len(uids)):
                if counts[i] == count:
                    r.append(uids[i])
            return r

    def keyCount(self) :
        client = self._bollowRedis()
        keys = client.keys('wb:friendids:*')
        emptyKeys = client.keys('wb:empty:friendids:*')
        return len(keys) + len(emptyKeys)

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
        client.zincrby(self.__key, uid, 10000)

    def count(self):
        client = self._bollowRedis()
        return client.zcard(self.__key)

if __name__ == '__main__':
    userStore = UserStore()
    friendsStore = FriendsStore()
    queue = Queue()

    print userStore.count()
