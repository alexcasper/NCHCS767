from threading import Thread, local,Lock
from time import sleep
from random import uniform
import os

lock = Lock()
fps=5
number_of_snails = 3
threads = {}
race_length = 10
snail_positions = {}
screen = ""

def move_snail(character):
    my_data = local()
    my_data.position = 0
    for i in range(0,race_length):
        my_data.position += 1
        snail_positions[character] = my_data.position 
        sleep(uniform(0.2,3.4))

def display_snails():
    while max(snail_positions.values())<race_length:
       lock.acquire()
       screenframe = ""
       for i in range(97,97+number_of_snails):
            letter = chr(i)
            position = snail_positions[letter]
            remaining = race_length-(1+position)
            snail_string = (position*' ')+'@'+(' '*(remaining|0))+'|'
            screenframe = screenframe+ (f'{letter}:{snail_string}\n')
       os.system('clear')
       print(screenframe)
       lock.release()
       sleep(1/fps)
    winner = [snail_position[0] for snail_position in snail_positions.items() if snail_position[1]==race_length][0]
    print(f'The winner is snail {winner}')

for i in range(97,97+number_of_snails):    
    print(chr(i))
    letter = chr(i)
    snail_positions[letter] = 0
    threads[letter] = Thread(target = move_snail, args=[letter])
threads['DISPLAY']=Thread(target=display_snails,daemon=True)

for key in threads:
    threads[key].start()