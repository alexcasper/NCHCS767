#!/usr/bin/env python
# https://www.rabbitmq.com/tutorials/tutorial-two-python.html
# Send script for Tutorial 2 - Durability

import sys
import pika

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    ## adding durability here
    channel.queue_declare(queue='task_queue', durable=True)
    message = ' '.join(sys.argv[1:]) or "Hello World!"
    channel.basic_publish(exchange='',
                      routing_key="task_queue",
                      body=message,
                      properties=pika.BasicProperties(
                         delivery_mode = pika.spec.PERSISTENT_DELIVERY_MODE
                      ))
    print(f" [x] Sent {message}")

main()