
from threading import Thread
from time import sleep

def list_generate():
    for i in range(0,100):
        print('a:'+str(i))
        #sleep(0.00000000000000000001)
       
def say_something():
    print('something')

thread1 = Thread(target=list_generate)
thread2 = Thread(target=say_something)
thread1.start()
thread2.start()