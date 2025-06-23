from fastapi import FastAPI
from recommender import BookRecommender

app = FastAPI()
br = BookRecommender()

@app.get("/recommend")
def get_recommendations(title):
    recommendations = br.recommend(title)
    return {"recommendations": recommendations}