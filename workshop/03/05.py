from threading import Thread, Lock
lock = Lock()

def list_generate(character):
    lock.acquire()
    for i in range(0,100):
        print(f'{character}:'+str(i))
    lock.release()    


thread1 = Thread(target=list_generate, args=['a'])
thread2 = Thread(target=list_generate, args=['b'])

thread1.start()
thread2.start()