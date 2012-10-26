#!/usr/bin/env python
import sys
from store import FriendsStore

def analyze(min, max):
    """ get the number of users whose friends count is between min(include) and max(exclude)"""

    friendsStore = FriendsStore()
    uids = friendsStore.uids()
    counts = friendsStore.counts(uids)
    size = 0
    for count in counts:
        if count >= min:
            if max < 0 or count < max:
                size = size + 1
    print '\ntotal:%d' % len(uids)
    print 'hits:%d' % size

def usage():
    print 'usage : analyzer min max'
    print '\t-1 means no limit'
    exit(0)

def main(arg):
    if len(arg) is not 2:
        usage()
    analyze(int(arg[0]), int(arg[1]))

if __name__ == '__main__':
    del sys.argv[0]
    main(sys.argv)
