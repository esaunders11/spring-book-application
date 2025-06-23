import pickle
import pandas  as pd

class BookRecommender:
    def __init__(self):
        self.books = pickle.load(open('books_list.pkl', 'rb'))
        self.similarity = pickle.load(open('similarity.pkl', 'rb'))

    def recommend(self, book):
        try:
            index = self.books[self.books['title'] ==  book].index[0]
        except IndexError:
            return []
        distance = sorted(
            list(enumerate(self.similarity[index])), reverse=True, 
            key=lambda vector:vector[1])
        recommanded_books = []
        for i in distance[1:6]:
            recommanded_books.append(self.books[i[0]].title)
        return recommanded_books