from threading import Thread
from time import sleep

def list_generate(character):
    for i in range(0,100):
        print(f'{character}:'+str(i))
        sleep(0.00001)

thread1 = Thread(target=list_generate, args=['a'])
thread2 = Thread(target=list_generate, args=['b'])
thread3 = Thread(target=list_generate, args=['c'])
thread1.start()
thread2.start()
thread3.start()