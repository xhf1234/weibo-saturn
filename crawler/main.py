#!/usr/bin/env python

from store import Queue, UserStore, FriendsStore, NameQueue
from weibo import WeiboClient, ApiException
from data import User
import time
import const
import string

queue = Queue()
userStore = UserStore()
friendsStore = FriendsStore()
nameQueue = NameQueue()
client = WeiboClient()

def main():
    initUid = const.initUid
    access_token = const.accessToken

    if queue.count()==0:
        queue.enqueue(initUid)

    while True:
        print '*******check name queue********'
        print 'step1: dequeue name'
        name = nameQueue.dequeue()
        if name is not None:
            print 'step2: get user by name : %s' % name
            try:
                user = client.getUserByName(name, access_token)
                if user is not None:
                    print 'step3 save user : %s' % str(user)
                    userStore.saveUser(user)
                    print 'step4 put queue front, uid:%d' % user.uid
                    queue.putFront(user.uid)
            except ApiException, e:
                print e
                if e.status == 403:
                    print "reload config"
                    const.loadConfig()
                    access_token = const.accessToken
                nameQueue.enqueue(name)
                time.sleep(60)
                continue
        print '*******check uid queue********'
        print 'step1: dequeue'
        uid = queue.dequeue()
        if uid is None:
            break
        try:
            print 'step2: dump friends, uid=%d' % uid
            friends = client.dumpFriends(uid, access_token)
        except ApiException, e:
            print e
            if e.status == 403:
                print "reload config"
                const.loadConfig()
                access_token = const.accessToken
            queue.putFront(uid)
            time.sleep(60)
            continue
        friendIds = User.extractIds(friends)
        if len(friendIds)==0:
            print 'empty friends, uid=%d' % uid
            continue
        print 'step3: save friend ids'
        friendsStore.saveFriends(uid, friendIds)
        print 'step4: save every friend in user store'
        userStore.saveUsers(friends)
        print 'step5: get enqueue list'
        existList = friendsStore.existPipe(friendIds)
        enqueueList = []
        for i in range(len(friendIds)):
            if existList[i] == False:
                enqueueList.append(friendIds[i])
        print 'step6: enqueue'
        queue.enqueuePipe(enqueueList)

        print 'friends.keyCount=%d' % friendsStore.keyCount()
        print '\n\n--------------------------------\n\n'

if __name__ == '__main__':
    main()
