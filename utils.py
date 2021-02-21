import os
from dotenv import load_dotenv
load_dotenv()


environment = os.environ.get('ENV')
debuging = True if os.environ.get('ENV') == 'DEVELOPMENT' else False
api_key='e46f50f1468f97c817ce9f7598851c3d'

url = 'http://localhost:5000' if debuging == True else 'https://sqtbackend.azurewebsites.net/'

link = {
    'placeholder_image':{
        'backdrop_path': '{}/api/placeholder_image/backdrop_path_placeholder.jpg'.format(url),
        'poster_path':'{}/api/placeholder_image/poster_placeholder.png'.format(url),
        'profile_path':'{}/api/placeholder_image/profile_placeholder.png'.format(url) 
    },
    'image':{
        'backdrop_path':'https://image.tmdb.org/t/p/w780',
        'poster_path':'https://image.tmdb.org/t/p/w185',
        'profile_path':'https://image.tmdb.org/t/p/w185',
    },
    'home':'https://api.themoviedb.org/3/trending/movie/week?api_key={}'.format(api_key),
    'arriving_today':'https://api.themoviedb.org/3/tv/airing_today?api_key={}'.format(api_key),
    'genre_list_movie':'https://api.themoviedb.org/3/genre/movie/list?api_key={}&language=en-US'.format(api_key),
    'genre_list_tv':'https://api.themoviedb.org/3/genre/tv/list?api_key={}&language=en-US'.format(api_key),
}

def get_search_movie(query):
    return 'https://api.themoviedb.org/3/search/movie?api_key={}&query={}&language=en-US&page=1&include_adult=false'.format(api_key, query)
    
def get_search_show(query):
    return 'https://api.themoviedb.org/3/search/tv?api_key={}&language=en-US&page=1&query={}&include_adult=false'.format(api_key, query)

def get_search_multi(query):
    return 'https://api.themoviedb.org/3/search/multi?api_key={}&language=en-US&query={}&page=1&include_adult=false'.format(api_key, query)

def get_movie_detail(id):
    return 'https://api.themoviedb.org/3/movie/{}?api_key={}&language=en-US'.format(id, api_key)

def get_movie_credits(id):
    return 'https://api.themoviedb.org/3/movie/{}/credits?api_key={}&language=en-US'.format(id, api_key)

def get_movie_reviews(id):
    return 'https://api.themoviedb.org/3/movie/{}/reviews?api_key={}&language=en-US&page=1'.format(id, api_key)

def get_show_detail(id):
    return 'https://api.themoviedb.org/3/tv/{}?api_key={}&language=en-US'.format(id, api_key)

def get_show_credits(id):
    return 'https://api.themoviedb.org/3/tv/{}/credits?api_key={}&language=en-US'.format(id, api_key)

def get_show_reviews(id):
    return 'https://api.themoviedb.org/3/tv/{}/reviews?api_key={}&language=en-US&page=1'.format(id, api_key)

def genre_to_dict(res):
    ans = {}
    for item in res:
        ans[str(item['id'])] = item['name']
    return ans