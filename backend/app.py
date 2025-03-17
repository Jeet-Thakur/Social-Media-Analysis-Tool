import matplotlib
matplotlib.use("Agg")  # Use a non-interactive backend
from matplotlib import pyplot as plt

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from wordcloud import WordCloud
import io
import base64
from googleapiclient.discovery import build

app = Flask(__name__)
CORS(app)  # Enable CORS

# Replace with your API key
API_KEY = "AIzaSyCXaG9Bwef_M6GXTa7-OwXPLqRmn-Um3Ho"

# Build the YouTube API client
youtube = build("youtube", "v3", developerKey=API_KEY)

def fetch_trending_videos(region_code="IN"):
    """Fetch real-time trending videos from YouTube"""
    request = youtube.videos().list(
        part="snippet,statistics",
        chart="mostPopular",
        regionCode=region_code,  # Default to India, can be changed by the user
        maxResults=100  # Number of trending videos to fetch
    )
    response = request.execute()

    trending_videos = []
    for item in response["items"]:
        title = item["snippet"]["title"]
        views = item["statistics"]["viewCount"]
        likes = item["statistics"].get("likeCount", "N/A")  # Some videos disable likes
        published_at = item["snippet"]["publishedAt"]
        trending_videos.append([title, views, likes, published_at])

    return trending_videos

# Endpoint to get trending data
@app.route("/get_trending_data")
def get_data():
    # Get the region code from the query parameter (default to "IN" for India)
    region_code = request.args.get("region", "IN")
    trending_videos = fetch_trending_videos(region_code)

    # Convert to DataFrame for better handling
    df = pd.DataFrame(trending_videos, columns=["Title", "Views", "Likes", "Published At"])
    return jsonify(df.to_dict(orient="records"))

# Endpoint to generate word cloud
@app.route("/wordcloud")
def generate_wordcloud():
    # Get the region code from the query parameter (default to "IN" for India)
    region_code = request.args.get("region", "IN")
    trending_videos = fetch_trending_videos(region_code)

    # Convert to DataFrame for better handling
    df = pd.DataFrame(trending_videos, columns=["Title", "Views", "Likes", "Published At"])

    # Generate word cloud
    text = " ".join(df["Title"].astype(str))
    wordcloud = WordCloud(width=800, height=400, background_color="black").generate(text)

    img = io.BytesIO()
    plt.figure(figsize=(8, 4))
    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.savefig(img, format="PNG", bbox_inches="tight", pad_inches=0)
    plt.close()
    img.seek(0)

    encoded_img = base64.b64encode(img.getvalue()).decode("utf-8")
    return jsonify({"wordcloud": f"data:image/png;base64,{encoded_img}"})

if __name__ == "__main__":
    app.run(debug=True)