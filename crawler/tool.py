#!/usr/bin/env python
#coding=UTF-8
import sys
from store import Queue, UserStore, FriendsStore, NameIndexer, TeacherStore
from weibo import WeiboClient, ApiException
from data import User, Teacher
import time
import const
import string

friendsStore = FriendsStore()
userStore = UserStore()
teacherStore = TeacherStore()
queue = Queue()
indexer = NameIndexer()
client = WeiboClient()
access_token = const.accessToken

def runFlterEmpty(uids):
    global access_token
    print 'step1: get empty uids'
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
	    friendsStore.delEmpty(uid)
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

def startFilterEmpty():
    while (True):
        uids = friendsStore.filterUids(0)
        if len(uids)==0:
            break
        runFilterEmpty(uids)

def startFilterName():
    uids = userStore.uids()
    users = userStore.getUsers(uids)
    for user in users:
        if user.name is None:
            print user
            break
        if user.name == '':
            user.name = str(user.uid)
            userStore.saveUser(user)
            continue
        if len(user.name) < 2:
            print user
            break

def startIndex():
    uids = userStore.uids()
    users = userStore.getUsers(uids)
    indexer.setIndexPipe(users)

def filterTeachers():
    uids = teacherStore.uids()
    teachers = teacherStore.getTeachers(uids)
    toDelete = []
    for teacher in teachers:
        verify = teacher.verify
        if '主持人' in verify:
            print verify
        else:
            toDelete.append(teacher.uid)
    teacherStore.deletePipe(toDelete)
    print teacherStore.count()

def main(arg):
    if len(arg) == 0:
        print 'need arguments'
        exit(0)
    cmd = arg[0]
    if cmd == 'empty':
        startFilterEmpty()
    elif cmd == 'name':
        startFilterName()
    elif cmd == 'index':
        startIndex()
    elif cmd == 'getIndex':
        print indexer.getIndex(arg[1])
    elif cmd == 'filterTeacher':
        filterTeachers()

if __name__ == '__main__':
    del sys.argv[0]
    main(sys.argv)
