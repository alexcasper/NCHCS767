from threading import Thread, local
from time import sleep
from random import uniform

def list_generate(character):
    my_data = local()
    my_data.list = []
    for i in range(0,100):
        my_data.list.append(f'{character}:'+str(i))
        while len(my_data.list)>0:
            item = my_data.list.pop()
            print(item)
        sleep(uniform(0.2,3.4))
    

thread1 = Thread(target=list_generate, args=['a'])
thread2 = Thread(target=list_generate, args=['b'])


thread1.start()
thread2.start()