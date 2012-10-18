#!/usr/bin/env python

from store import Queue, UserStore, FriendsStore
from weibo import WeiboClient
from data import User

queue = Queue()
userStore = UserStore()
friendsStore = FriendsStore()
client = WeiboClient()

def main():
    initId = 2207639514
    access_token = "2.006oOL1DnB3GRCff1ae130c0n4ySvC"

    if queue.count()==0:
        queue.enqueue(initId)

    while True:
        uid = queue.dequeue()
        if uid is None:
            break
        friends = client.dumpFriends(uid, access_token)
        friendIds = User.extractIds(friends)
        friendsStore.saveFriends(uid, friendIds)
        for user in friends:
            userStore.saveUser(user)
            if not friendsStore.exists(user.uid):
                queue.enqueue(user.uid)
        print userStore.count()

if __name__ == '__main__':
    main()
