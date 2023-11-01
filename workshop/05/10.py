import pika
import sys
import os
import re
import json

final_data = {}

def reduce():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    
    def callback(ch, method, properties, body):
        data = json.loads(body.decode())
        for dictionary_key in data:
            if dictionary_key in final_data:
                final_data[dictionary_key] += data[dictionary_key]
            else:
                final_data[dictionary_key] = data[dictionary_key]         
        ch.basic_ack(delivery_tag = method.delivery_tag)

    channel = connection.channel()
    channel.queue_declare(queue='reduce')
    channel.basic_consume(queue='reduce',
                        on_message_callback=callback)

    print(' [*] Waiting for messages on reduce. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == '__main__':
    try:
        reduce()
    except KeyboardInterrupt:
        print('Quit - Writing output')
        f = open("output.json", "w+")
        f.write(json.dumps(final_data))
        f.close()
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)