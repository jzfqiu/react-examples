from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

posts = {
    0: {
        "content": "The Industrial Revolution and its consequences have been a disaster for the human race. They have greatly increased the life-expectancy of those of us who live in “advanced” countries, but they have destabilized society, have made life unfulfilling, have subjected human beings to indignities, have led to widespread psychological suffering (in the Third World to physical suffering as well) and have inflicted severe damage on the natural world.",
        "likes": 0
    },
    1: {
        "content": "We're Knights of the Round Table. We dance whene'er we're able. We do routines and chorus scenes With footwork impeccable. We dine well here in Camelot. We eat ham and jam and spam a lot.",
        "likes": 11
    },
    2: {
        "content": "Ratio.",
        "likes": 31284
    },
    3: {
        "content": "It is long said that her whispers, as an avatar of Mother Nature, have healing properties. Whether or not that is true is something only those who have heard them can say. While she is usually affable, warm, and slightly mischievous, any who anger her will bear the full brunt of Nature's fury.",
        "likes": 1024
    },
}
max_idx = 3

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/get_all", methods=['GET'])
def get_all():
    return {"success": True, "data": list(posts.keys())}

@app.route("/get", methods=['POST'])
def get():
    idx = request.json.get("idx")
    return {"success": True, "data": posts[idx]}

@app.route("/edit", methods=['POST'])
def edit():
    idx = request.json.get("idx")
    posts[idx]["content"] = request.json.get("updated")
    return {"success": True, "data": posts[idx]}

@app.route("/like", methods=['POST'])
def like():
    idx = request.json.get("idx")
    posts[idx]["likes"] += 1 if request.json.get("like") else -1
    return {"success": True, "data": posts[idx]["likes"]}

@app.route("/delete", methods=['POST'])
def delete():
    idx = request.json.get("idx")
    posts.pop(idx)
    return {"success": True, "data": idx}

@app.route("/new", methods=['POST'])
def new():
    max_idx = max(posts.keys())
    idx = max_idx + 1
    posts[idx] = {
        'content': request.json.get("content"),
        'likes': 0
    }
    return {"success": True, "data": idx}


    