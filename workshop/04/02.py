# Using multithreading.

from multiprocessing import Pool
import cProfile


def f(x):
    return x*x

def test():
    with Pool(5) as p:     
        return(p.map(f, [i for i in range(0,10000000)]))

if __name__ == '__main__':
    ## print(test())
    cProfile.run('test()')


