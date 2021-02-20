import os
from dotenv import load_dotenv
load_dotenv()


environment = os.environ.get('ENV')
debuging = True if os.environ.get('ENV') == 'DEVELOPMENT' else False
api_key='e46f50f1468f97c817ce9f7598851c3d'

link = {
    'placeholder_image':{
        'backdrop_path':''  
    },
    'home':'https://api.themoviedb.org/3/trending/movie/week?api_key={}'.format(api_key),
    'arriving_today':'https://api.themoviedb.org/3/tv/airing_today?api_key={}'.format(api_key),
}