# Try to times ten million by ten million. Because why not.
import cProfile

def f(x):
    return x*x

def test():
    return ([f(i) for i in range(0,10000000)])

def test_1():
    blank_list = []
    for i in range(0,10000000):
        blank_list.append(f(i))
    return blank_list    

if __name__ == '__main__':
   #print(test())
   cProfile.run('test_1()')


