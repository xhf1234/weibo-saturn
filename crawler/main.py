#!/usr/bin/env python

from store import Queue, UserStore, FriendsStore
from weibo import WeiboClient, ApiException
from data import User
import time
import const

queue = Queue()
userStore = UserStore()
friendsStore = FriendsStore()
client = WeiboClient()

def main():
    initUid = const.initUid
    access_token = const.accessToken

    if queue.count()==0:
        queue.enqueue(initUid)

    while True:
        uid = queue.dequeue()
        if uid is None:
            break
        try:
            friends = client.dumpFriends(uid, access_token)
        except ApiException, e:
            print e
            if e.status==403 and e.reason=="Forbidden":
                print "sleeping... for api rate limit"
                queue.putFront(uid)
                time.sleep(60)
                continue
            else:
                raise
        friendIds = User.extractIds(friends)
        friendsStore.saveFriends(uid, friendIds)
        for user in friends:
            userStore.saveUser(user)
            if not friendsStore.exists(user.uid):
                queue.enqueue(user.uid)
        print userStore.count()
        time.sleep(4)

if __name__ == '__main__':
    main()
