from bs4 import BeautifulSoup as bs
from requests import get
import pika

url = "https://www.gutenberg.org/cache/epub/2944/pg2944-images.html"

def get_book(url):
    soup = bs(get(url).text,'html.parser')
    return soup.find_all('p')


def send():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='map')
    paragraphs = get_book(url)
    for paragraph in enumerate(paragraphs):
        message = paragraph[1].get_text()
        channel.basic_publish(exchange='',
                            routing_key='map',
                            body=message)
        print(f" [x] Sent paragraph {paragraph[0]}")

send()