from threading import Thread, local
from time import sleep
from random import uniform


def list_generate(character):
    my_data = local()
    my_data.list = []
    for i in range(0,10):
        my_data.list.append(f'{character}:'+str(i))
        while len(my_data.list)>0:
            item = my_data.list.pop()
            print(item)
        sleep(uniform(0.2,3.4))
    

threads = {}
for i in range(65,91):
    print(chr(i))
    letter = chr(i)
    threads[letter] = Thread(target = list_generate, args=[letter])

for key in threads:
    threads[key].start()