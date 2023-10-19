from multiprocessing import Process, get_start_method
from random import randrange
from time import sleep, time

def f(thread_number):
    name = create_name()
    print(''.join(['hi | ', name, f' | thread_number: {thread_number}']))

def create_name():
    time_taken = 1 + randrange(1,10)/10
    sleep(time_taken)
    vowels = ['a','e','i','o','u']
    cons = ['b','c','d','f','g','h','j','k','l','m','n','p','r','s','t','v','z']
    name = ''.join([cons[randrange(0,len(cons))].upper(),vowels[randrange(0,len(vowels))],cons[randrange(0,len(cons))],f' time:{time_taken}'])
    return (name)

if __name__ == '__main__':
    print (get_start_method())
    processes = []
    a = time()
    for i in range(100):
      processes.append(Process(target=f, args=[i]))
    for p in processes:
      p.start()
    for j in processes:
      j.join()
    b = time()
    print(b-a)