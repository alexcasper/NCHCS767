#!/usr/bin/env python
# https://www.rabbitmq.com/tutorials/tutorial-two-python.html
# Send script for Tutorial 2

import sys
import pika

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='hello')
    message = ' '.join(sys.argv[1:]) or "Hello World!"
    channel.basic_publish(exchange='',
                        routing_key='hello',
                        body=message)
    print(f" [x] Sent {message}")

main()