from threading import Thread, local,Lock
from time import sleep
from random import uniform
import os

lock = Lock()
fps=5
number_of_snails = 5
threads = {}
race_length = 3
snail_positions = {}
screen = ""

def move_snail(character):
    my_data = local()
    my_data.position = 0
    for i in range(0,race_length+2):
        my_data.position += 1
        snail_positions[character] = my_data.position 
        sleep(uniform(0.2,3.4))

def display_snails():
    my_data = local()
    my_data.winner = ""
    while min(snail_positions.values())<=race_length+2:
       lock.acquire()
       screenframe = ""
       for i in range(97,97+number_of_snails):
            letter = chr(i)
            position = snail_positions[letter]
            remaining = race_length-(1+position)
            snail_string = (position*' ')+'@'+((((' '*remaining)+'|' if remaining>=0 else '')))
            screenframe = screenframe+ (f'{letter}:{snail_string}\n')
       os.system('clear')
       print(screenframe)
       if (my_data.winner==""):
         if (max(snail_positions.values())>=race_length):
           my_data.winner = [snail_position[0] for snail_position in snail_positions.items() if snail_position[1]==race_length][0]
       else:
           print(f"The winner is snail {my_data.winner}")
       lock.release()
       sleep(1/fps)
       

for i in range(97,97+number_of_snails):    
    print(chr(i))
    letter = chr(i)
    snail_positions[letter] = 0
    threads[letter] = Thread(target = move_snail, args=[letter])
threads['DISPLAY']=Thread(target=display_snails,daemon=True)

for key in threads:
    threads[key].start()