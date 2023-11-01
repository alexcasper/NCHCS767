from bs4 import BeautifulSoup as bs
from requests import get

url = "https://www.gutenberg.org/cache/epub/2944/pg2944-images.html"

def get_book(url):
    soup = bs(get(url).text,'html.parser')
    return soup.find_all('p')

paragraphs = get_book(url)
for paragraph in paragraphs:
  print(paragraph.get_text())

print(len(paragraphs))