import pickle
import pandas  as pd

class BookRecommender:
    def __init__(self):
        self.books = pickle.load(open('books_list.pkl', 'rb'))
        self.similarity = pickle.load(open('similarity.pkl', 'rb'))

    def recommend(self, book):
        try:
            filtered = self.books[self.books['title'].str.strip().str.lower() == book.strip().lower()]
            if filtered.empty:
                return []
            index = filtered.index[0]

        except IndexError:
            return []
        distance = sorted(
            list(enumerate(self.similarity[index])), reverse=True, 
            key=lambda vector:vector[1])
        recommanded_books = []
        for i in distance[1:6]:
            recommanded_books.append({
                "title": self.books.iloc[i[0]]['title'],
                "author": self.books.iloc[i[0]]['authors'] if pd.notna(self.books.iloc[i[0]]['authors']) else None
                })
        return recommanded_books