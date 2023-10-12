
from threading import Thread, Lock
from time import sleep
lock = Lock()

def list_generate():
    for i in range(0,100):
        sleep(1)
        print('a:'+str(i))
       
def say_something():
    print('something')

thread1 = Thread(target=list_generate)
thread2 = Thread(target=say_something)

thread1.start()
thread2.start()