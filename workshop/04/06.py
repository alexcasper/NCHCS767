from multiprocessing import Process, get_start_method
from random import randrange
from time import sleep

def f(name,thread_number):
    print('hi', name, f'thread_number: {thread_number}')

def create_name():
    time_taken = randrange(1,10)/10
    sleep(time_taken)
    vowels = ['a','e','i','o','u']
    cons = ['b','c','d','f','g','h','j','k','l','m','n','p','r','s','t','v','z']
    return (''.join([cons[randrange(0,len(cons))].upper(),vowels[randrange(0,len(vowels))],cons[randrange(0,len(cons))],f' time:{time_taken}']))

if __name__ == '__main__':
    print (get_start_method())
    for i in range(100):
      p = Process(target=f, args=(create_name(),i))
      p.start()
      #p.join()