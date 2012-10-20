#!/usr/bin/env python

from store import Queue, UserStore, FriendsStore
from weibo import WeiboClient, ApiException
from data import User
import time

queue = Queue()
userStore = UserStore()
friendsStore = FriendsStore()
client = WeiboClient()

def main():
    initId = 2207639514
    access_token = "2.006oOL1DnB3GRC97a59379120KoVZG"

    if queue.count()==0:
        queue.enqueue(initId)

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
