import pika
import sys
import os
import re
import json

def map():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))

    def callback(ch, method, properties, body):
        data = body.decode()
        words = {}
        for item in data.split():
            word = re.sub('[^A-Za-z0-9]+', '', item.lower())
            if word in words:
                words[word] += 1
            else:
                words[word] = 1
        print(words)
        send_to_reduce(words)  
        ch.basic_ack(delivery_tag = method.delivery_tag)
    
    def send_to_reduce(message):
        channel.queue_declare(queue='reduce')
        channel.basic_publish(exchange='',
                            routing_key='reduce',
                            body=json.dumps(message))

    channel = connection.channel()
    channel.queue_declare(queue='map')
    channel.basic_consume(queue='map',
                        on_message_callback=callback)

    print(' [*] Waiting for messages on map. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == '__main__':
    try:
        map()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)