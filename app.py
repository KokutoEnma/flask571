from flask import Flask, send_file
import requests
import json
import os
from utils import *

app = Flask(__name__)

@app.route('/')
def home():
    li = [
        "<div><a href='https://sqtbackend.azurewebsites.net/'>home</a></div>",
        "<div><a href='https://cs210032000b9b49df9.z13.web.core.windows.net/'>front end</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/trending_movie'>trending movie</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/arriving_today'>arriving today</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/search_movie/doctor'>try search movie key word: doctor</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/search_show/doctor'>try search show key word: doctor</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/search_multi/doctor'>try search multi key word: doctor</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/movie_detail/284052'>try movie detail with id: 284052</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/movie_credits/284052'>try movie credits with id: 284052</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/movie_reviews/284052'>try movie reviews with id: 284052</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/show_detail/1399'>try show detail with id: 1399</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/show_credits/1399'>try show credits with id: 1399</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/show_reviews/1399'>try show reviews with id: 1399</a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/genre_list/movie'>movie genre list </a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/genre_list/tv'>tv show genre list </a></div>",
        "<div><a href='https://sqtbackend.azurewebsites.net/api/placeholder_image/backdrop_path_placeholder.jpg'>try placeholer image: backdrop_path_placeholder.jpg</a></div>",
    ]
    
    return '<div>{}</div>'.format(''.join(li))

@app.route('/api/trending_movie', methods=['GET'])
def trending_movie():
    res = json.loads(requests.get(link['home']).content)['results']
    return {'data':
        [{
            'title':res[i]['title'],
            'image':link['image']['backdrop_path']+res[i]['backdrop_path'] if res[i]['backdrop_path'] else link['placeholder_image']['backdrop_path'],
            'date':res[i]['release_date']
        }for i in range(5) if i<len(res)]
    }

@app.route('/api/arriving_today', methods=['GET'])
def arriving_today():
    res = json.loads(requests.get(link['arriving_today']).content)['results']
    return {'data':
        [{
            'title':res[i]['name'],
            'image':link['image']['backdrop_path']+res[i]['backdrop_path'] if res[i]['backdrop_path'] else link['placeholder_image']['backdrop_path'],
            'date':res[i]['first_air_date']
        }for i in range(5) if i<len(res)]
    }

@app.route('/api/search_movie/<query>', methods=['GET'])
def search_movie(query):
    res = json.loads(requests.get(get_search_movie(query.replace(' ', '%20'))).content)['results']
    genre_res = genre_list_movie()['data']
    return {'data':
    [{
        'type':item['media_type'] if 'media_type' in item else 'movie',
        'id':item['id'],
        'name':item['title'],
        'overview':item['overview'],
        'image':link['image']['poster_path']+item['poster_path'] if item['poster_path'] else link['placeholder_image']['poster_path'],
        'date':item['release_date'],
        'vote_average':item['vote_average'],
        'vote_count':item['vote_count'],
        'genres':', '.join([genre_res[str(id)] for id in item['genre_ids']])
    }for item in res]}
    
@app.route('/api/search_show/<query>', methods=['GET'])
def search_show(query):
    res = json.loads(requests.get(get_search_show(query.replace(' ', '%20'))).content)['results']
    genre_res = genre_list_tv()['data']
    return {'data':[{
        'type':item['media_type'] if 'media_type' in item else 'tv',
        'id':item['id'] if 'id' in item else 'Not Available',
        'name':item['name'] if 'name' in item else 'Not Available',
        'overview':item['overview'] if 'overview' in item else 'Not Available',
        'image':link['image']['poster_path']+item['poster_path'] if item['poster_path'] else link['placeholder_image']['poster_path'],
        'date':item['first_air_date'] if 'first_air_date' in item else 'Not Available',
        'vote_average':item['vote_average'] if 'vote_average' in item else 'Not Available',
        'vote_count':item['vote_count'] if 'vote_count' in item else 'Not Available',
        'genres':', '.join([genre_res[str(id)] for id in item['genre_ids']])
    }for item in res]}

@app.route('/api/search_multi/<query>', methods=['GET'])
def search_multi(query):
    res = json.loads(requests.get(get_search_multi(query.replace(' ', '%20'))).content)['results']
    genre_res_movie = genre_list_movie()['data']
    genre_res_tv = genre_list_tv()['data']

    return {'data':[{
        'type':item['media_type'] if 'media_type' in item else 'movie' if 'release_date' in item else 'tv',
        'id':item['id'] if 'id' in item else 'Not Available',
        'name':item['name'] if 'name' in item else item['title'],
        'overview':item['overview'] if 'overview' in item else 'Not Available',
        'image':link['image']['poster_path']+item['poster_path'] if item['poster_path'] else link['placeholder_image']['poster_path'],
        'date':item['first_air_date'] if 'first_air_date' in item else item['release_date'] if 'release_date' in item else 'Not Available',
        'vote_average':item['vote_average'] if 'vote_average' in item else 'Not Available',
        'vote_count':item['vote_count'] if 'vote_count' in item else 'Not Available',
        'genres':', '.join([genre_res_movie[str(id)] if str(id) in genre_res_movie else genre_res_tv[str(id)] for id in item['genre_ids']])
    }for item in res]}

@app.route('/api/movie_detail/<id>', methods=['GET'])
def movie_detail(id):
    res = json.loads(requests.get(get_movie_detail(id)).content)
    genre_res = genre_list_movie()['data']
    return {'data':{
        'id':res['id'],
        'name':res['title'],
        'runtime':res['runtime'],
        'date':res['release_date'],
        'overview':res['overview'],
        'languages':', '.join([item['name'] for item in res['spoken_languages']]),
        'vote_average':res['vote_average'],
        'vote_count':res['vote_count'],
        'poster_path':link['image']['poster_path']+res['poster_path'] if res['poster_path'] else link['placeholder_image']['poster_path'],
        'backdrop_path':link['image']['backdrop_path']+res['backdrop_path'] if res['backdrop_path'] else link['placeholder_image']['backdrop_path'],
        'genres':', '.join([genre_res[str(item['id'])] for item in res['genres']])
    }for item in res}

@app.route('/api/movie_credits/<id>', methods=['GET'])
def movie_credits(id):
    res = json.loads(requests.get(get_movie_credits(id)).content)['cast']
    return {'data': [{
        'name':res[i]['name'],
        'image':link['image']['profile_path']+res[i]['profile_path'] if res[i]['profile_path'] else link['placeholder_image']['profile_path'],
        'character':res[i]['character']
    } for i in range(8) if i<len(res)]}

@app.route('/api/movie_reviews/<id>', methods=['GET'])
def movie_reviews(id):
    res = json.loads(requests.get(get_movie_reviews(id)).content)['results']
    return {'data':[{
        'username':res[i]['author_details']['username'],
        'content':res[i]['content'],
        'rating':res[i]['author_details']['rating'],
        'date':res[i]['created_at']
    } for i in range(5) if i < len(res)]}

@app.route('/api/show_detail/<id>', methods=['GET'])
def show_detail(id):
    res = json.loads(requests.get(get_show_detail(id)).content)
    genre_res = genre_list_tv()['data']
    return {'data':{
        'duration':res['episode_run_time'],
        'date':res['first_air_date'],
        'genres':', '.join([genre_res[str(item['id'])] for item in res['genres']]),
        'id':res['id'],
        'name':res['name'],
        'number_of_seasons':res['number_of_seasons'],
        'overview':res['overview'],
        'poster_path':link['image']['poster_path']+res['poster_path'] if res['poster_path'] else link['placeholder_image']['poster_path'],
        'backdrop_path':link['image']['backdrop_path']+res['backdrop_path'] if res['backdrop_path'] else link['placeholder_image']['backdrop_path'],
        'languages':', '.join([item['name'] for item in res['spoken_languages']]),
        'vote_average':res['vote_average'],
        'vote_count':res['vote_count'],
    }for item in res}

@app.route('/api/show_credits/<id>', methods=['GET'])
def show_credits(id):
    res = json.loads(requests.get(get_show_credits(id)).content)['cast']
    return {'data': [{
        'name':res[i]['name'],
        'image':link['image']['profile_path']+res[i]['profile_path'] if res[i]['profile_path'] else link['placeholder_image']['profile_path'],
        'character':res[i]['character']
    } for i in range(8) if i<len(res)]}


@app.route('/api/show_reviews/<id>', methods=['GET'])
def show_reviews(id):
    res = json.loads(requests.get(get_show_reviews(id)).content)['results']
    return {'data':[{
        'username':res[i]['author_details']['username'],
        'content':res[i]['content'],
        'rating':res[i]['author_details']['rating'],
        'date':res[i]['created_at']
    } for i in range(5) if i < len(res)]}

@app.route('/api/genre_list/movie', methods=['GET'])
def genre_list_movie():
    res = json.loads(requests.get(link['genre_list_movie']).content)['genres']
    return {'data':genre_to_dict(res)}

@app.route('/api/genre_list/tv', methods=['GET'])
def genre_list_tv():
    res = json.loads(requests.get(link['genre_list_tv']).content)['genres']
    return {'data':genre_to_dict(res)}
    
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