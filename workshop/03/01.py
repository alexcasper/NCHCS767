from threading import Thread

t = Thread(target=print,args=['echo'])
t.run()

