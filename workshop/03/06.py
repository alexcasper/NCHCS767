from threading import Thread, local
from time import sleep


def list_generate(character):
    my_data = local()
    my_data.list = []
    for i in range(0,100):
        my_data.list.append(f'{character}:'+str(i))
        while len(my_data.list)>0:
            item = my_data.list.pop()
            print(item)
        sleep(1)
    



thread1 = Thread(target=list_generate, args=['a'])
thread2 = Thread(target=list_generate, args=['b'])


thread1.start()
thread2.start()