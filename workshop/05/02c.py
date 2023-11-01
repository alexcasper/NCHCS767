#!/usr/bin/env python
# https://www.rabbitmq.com/tutorials/tutorial-one-python.html
# Recieve script for Tutorial 2 - No auto acknowledgement

import pika
import sys
import os
import time

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))

    def callback(ch, method, properties, body):
        print(f" [x] Received {body.decode()}")
        time.sleep(body.count(b'.'))
        print(" [x] Done")
        ### Adding ack here
        ch.basic_ack(delivery_tag = method.delivery_tag)

    channel = connection.channel()
    channel.queue_declare(queue='hello')
    channel.basic_consume(queue='hello',
                       # Removing auto_ack here
                       # auto_ack=True,
                        on_message_callback=callback)
    

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)