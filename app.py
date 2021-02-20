from flask import Flask, send_file
import requests
import json
import os
from utils import *

app = Flask(__name__)

@app.route('/')
def test():
    return 'this is in {}'.format(environment)

@app.route('/api/home')
def home():
    res = json.loads(requests.get(link['home']).content)['results']
    return {'data':
        [{
            'title':res[i]['title'],
            'image':res[i]['backdrop_path'],
            'date':res[i]['release_date']
        }for i in range(5)]
    }

@app.route('/api/arriving_today')
def arriving_today():
    res = json.loads(requests.get(link['arriving_today']).content)['results']
    return {'data':
        [{
            'title':res[i]['name'],
            'image':res[i]['backdrop_path'],
            'date':res[i]['first_air_date']
        }for i in range(5)]
    }

@app.route('/api/placeholder_image/<image>')
def placeholder_image(image):
    if image=='backdrop_path_placeholder.jpg':
        return send_file(image, mimetype='image/jpg')
    elif image=='poster_placeholder.png':
        return send_file(image, mimetype='image/png')
    else:
        return send_file('profile_placeholder.png', mimetype='image/png')

if __name__ == "__main__":
    app.run(debug=debuging)