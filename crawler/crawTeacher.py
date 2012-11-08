#!/usr/bin/env python

from store import TeacherQueue, UserStore, FriendsStore, NameQueue, FlagSet, TeacherStore
from weibo import WeiboClient, ApiException
from data import User
import time
import const
import string
import sys

queue = TeacherQueue()
userStore = UserStore()
teacherStore = TeacherStore()
friendsStore = FriendsStore()
nameQueue = NameQueue()
client = WeiboClient()
flagSet = FlagSet()

def main():
    initUid = const.initUid
    access_token = const.accessToken
    try:
        print 'INIT : search teacher'
        uids = client.searchTeacher(access_token)
        print 'INIT : teacher uids', uids
        print 'INIT : enqueue teacher uid'
        for uid in uids:
            queue.putFront(uid)
    except ApiException, e:
        print e
        return
    while(True):
        print 'teacher total count:', teacherStore.count()
        print 'step 1. dequeue uid'
        uid = queue.dequeue()
        try:
            print 'uid:%d'% uid
            if uid is not None:
                print 'step 2. get teacher from teacher'
                teacher = teacherStore.getTeacher(uid)
                if teacher is None:
                    print 'teacher not exists in store, get from weibo'
                    teacher = client.getTeacher(uid, access_token)
                    print 'teacher :', teacher
                    print 'save teacher'
                    if teacher is not None:
                        teacherStore.saveTeacher(teacher)
                    else:
                        queue.enqueue(uid)
                print teacher
                if teacher is not None:
                    print 'step 3. check if teacher follows crawled'
                    if not flagSet.exists('teacher:crawled', uid):
                        print 'step 4. crawl follows'
                        follows = client.getFollowTeachers(uid, access_token)
                        flagSet.set('teacher:crawled', uid)
                        for u in follows:
                            print 'craw teacher', u
                            print 'step 5. save teacher and enqueue teacher.uid'
                            teacherStore.saveTeacher(u)
                            queue.enqueue(u.uid)
            else:
                break
        except ApiException, e:
            print e
            if e.status == 403:
                print "reload config"
                const.loadConfig()
                access_token = const.accessToken
            if e.status != 400:
                queue.putFront(uid)
            time.sleep(60)
            continue

if __name__ == '__main__':
    main()
