#!/usr/bin/env python
import sys
from store import Queue, UserStore, FriendsStore
from weibo import WeiboClient, ApiException
from data import User
import time
import const
import string

def main(arg):
    friendsStore = FriendsStore()
    userStore = UserStore()
    queue = Queue()
    client = WeiboClient()
    access_token = const.accessToken

    print 'step1: get empty uids'
    uids = friendsStore.filterUids(0)
    for uid in uids:
        try:
            print 'step2: dump friends, uid=%d' % uid
            friends = client.dumpFriends(uid, access_token)
        except ApiException, e:
            print e
            if e.status == 403:
                print "reload config"
                const.loadConfig()
                access_token = const.accessToken
            time.sleep(60)
            continue
        friendIds = User.extractIds(friends)
        if len(friendIds)==0:
            print 'empty friends, uid=%d' % uid
            print friends
            continue
        print 'step2: del empty uid'
        friendsStore.delEmpty(uid)
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
    del sys.argv[0]
    main(sys.argv)
