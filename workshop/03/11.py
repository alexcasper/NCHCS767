from threading import Thread,local,Lock
from random import uniform
from time import sleep

data = {'main_number': 0}
threads = {}
lock = Lock()
def act(name):
    while True:
        lock.acquire()
        my_data = local()
        my_data.local_number = data['main_number']
        my_data.sleep_time = uniform(1.0,5.0)
        print(f"{name}: I think the number is {my_data.local_number}. Going to sleep for {my_data.sleep_time} seconds")
        sleep(my_data.sleep_time)
        if my_data.local_number+1 == data['main_number']:
            print(f"{name}: I woke up and agree the main number is {my_data.local_number+1}")
        else:
            print(f"{name}: I woke up and will assert main number is {my_data.local_number+1} instead of {data['main_number']}")
            data['main_number'] = my_data.local_number+1
        lock.release()
        sleep(1)


for i in ['Drone_001','Drone_002','Drone_003','Drone_004']: 
    threads[i] = Thread(target = act, args=[i])
    threads[i].start()