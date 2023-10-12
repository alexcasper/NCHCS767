from threading import Thread

def list_generate(character):
    for i in range(0,100):
        print(f'{character}:'+str(i))


thread1 = Thread(target=list_generate, args=['a'])
thread2 = Thread(target=list_generate, args=['b'])

thread1.start()
thread2.start()