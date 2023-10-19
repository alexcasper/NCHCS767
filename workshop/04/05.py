from multiprocessing import Process
from random import randrange

def f(name):
    print('hi', name)

def create_name():
    vowels = ['a','e','i','o','u']
    cons = ['b','c','d','f','g','h','j','k','l','m','n','p','r','s','t','v','z']
    return (''.join([cons[randrange(0,len(cons))].upper(),vowels[randrange(0,len(vowels))],cons[randrange(0,len(cons))]]))

if __name__ == '__main__':
    p = Process(target=f, args=(create_name(),))
    p.start()
    p.join()