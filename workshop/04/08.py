from random import randrange

class World:
    def __init__(self):
        self.name = 'EARTH'
        self.__characters = []
        self.__messages_in_transit = []
    def __str__(self):
        return (self.name)
    def get_messages(self):
        return self.__messages_in_transit
    def add_messages(self,message):
        self.__messages_in_transit.append(message)
    def clear_messages(self):
        self.__messages_in_transit = []
    def get_charaters(self):
        return self.__characters
    def add_character(self,character):
        self.__characters.append(character)
    def clear_messages(self):
        self.__messages_in_transit = []
    def process_attacking_characters(self):
        for character in self.__characters:
            if character.get_wants_to_attack() == True:
                targets = [target for target in self.__characters if target != character]
                print(f"targets are {targets}")
                for target in targets:
                    character.create_message(target)
                    self.add_messages(character.dispatch_message())
    def process_messages(self):
        for character in self.__characters:
          for message in self.__messages_in_transit:
            if message.target == character:
              print(f"character {character} received message {message}")
              character.receive_attacking_message(True)
        self.clear_messages()

class Message:
    def __init__(self,content,target):
        self.content = content
        self.target = target
    def __str__(self):
        if self.content == True:
          return (f"Dear {self.target}: ATTACK!")
        else:
          return (f"Dear {self.target}: WAIT!")

class General:
    def __init__(self,violent):
        self.name = self.create_name()
        if violent:
          self.__wants_to_attack = True
        else:
          self.__wants_to_attack = False
        self.__message_buffer = ""
        self.__attacking= False
    def __str__(self):
        return(f'General {self.name}')
    def create_name(self):
        vowels = ['a','e','i','o','u']
        cons = ['b','c','d','f','g','h','j','k','l','m','n','p','r','s','t','v','z']
        name = ''.join([cons[randrange(0,len(cons))].upper(),vowels[randrange(0,len(vowels))],cons[randrange(0,len(cons))],])
        return name
    def get_wants_to_attack(self):
        return self.__wants_to_attack
    def set_wants_to_attack(self,value):
        if value in ([True,False]):
          self.__wants_to_attack = value
        else:
          print('Unreasonable strategy detected!')
    def create_message(self,general_name):
        content = self.__wants_to_attack
        self.__message_buffer = Message(content,general_name)
        self.attack()
        self.set_wants_to_attack(False)
    def dispatch_message(self):
        if self.__message_buffer=="":
            return False
        else:
            message = self.__message_buffer
            self.__message_buffer = ""
            return message
    def receive_attacking_message(self,content):
        if content == True:
            self.set_wants_to_attack(True)
            self.attack() 
    def attack(self):
        self.__attacking == True
        print(f"{self} is attacking")
    def get_attacking(self):
        return self.__attacking

if __name__ == '__main__':
    world = World()
    world.add_character(General(True))
    world.add_character(General(False))
    for i in [1,2]:
        world.process_attacking_characters()
        print([str(i) for i in world.get_messages()])
        world.process_messages()