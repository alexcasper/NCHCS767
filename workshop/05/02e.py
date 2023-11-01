#!/usr/bin/env python
# https://www.rabbitmq.com/tutorials/tutorial-two-python.html
# Recieve script for Tutorial 2 - Durability

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
        ch.basic_ack(delivery_tag = method.delivery_tag)

    channel = connection.channel()
    ## Changing queue
    channel.queue_declare(queue='task_queue', durable=True)
    channel.basic_consume(queue='task_queue',
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