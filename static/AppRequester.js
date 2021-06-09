class Requester {
    constructor() {
        // this.fetch_trending_movie(data => console.log(data))
    }

    fetch(url, callback) {
        let xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            callback({
                error: false,
                message: null,
                data: JSON.parse(this.responseText).data
            })
        };

        xhttp.onerror = function () {
            callback({
                error: true,
                message: this.statusText,
                data: null
            })
        }

        xhttp.open("GET", url, true);
        xhttp.send();
    }


    fetch_trending_movie = callback => this.fetch(url.trending_movie, callback)
    fetch_arriving_today = callback => this.fetch(url.arriving_today, callback)
    fetch_search_movie = (query, callback) => this.fetch(url.get_search_movie(query), callback)
    fetch_search_show = (query, callback) => this.fetch(url.get_search_show(query), callback)
    fetch_search_multi = (query, callback) => this.fetch(url.get_search_multi(query), callback)

    fetch_movie_detail = (id, callback) => this.fetch(url.get_movie_detail(id), callback)
    fetch_movie_credits = (id, callback) => this.fetch(url.get_movie_credits(id), callback)
    fetch_movie_reviews = (id, callback) => this.fetch(url.get_movie_reviews(id), callback)

    fetch_show_detail = (id, callback) => this.fetch(url.get_show_detail(id), callback)
    fetch_show_credits = (id, callback) => this.fetch(url.get_show_credits(id), callback)
    fetch_show_reviews = (id, callback) => this.fetch(url.get_show_reviews(id), callback)

    fetch_placeholser_image = (image, callback) => this.fetch(url.get_placeholder_image(image), callback)
}


const url = {
    trending_movie: 'http://flsk.shaw-yu.com/api/trending_movie',
    arriving_today: 'http://flsk.shaw-yu.com/api/arriving_today',
    get_search_movie: query => (`http://flsk.shaw-yu.com/api/search_movie/${query}`),
    get_search_show: query => (`http://flsk.shaw-yu.com/api/search_show/${query}`),
    get_search_multi: query => (`http://flsk.shaw-yu.com/api/search_multi/${query}`),
    get_movie_detail: id => (`http://flsk.shaw-yu.com/api/movie_detail/${id}`),
    get_movie_credits: id => (`http://flsk.shaw-yu.com/api/movie_credits/${id}`),
    get_movie_reviews: id => (`http://flsk.shaw-yu.com/api/movie_reviews/${id}`),
    get_show_detail: id => (`http://flsk.shaw-yu.com/api/show_detail/${id}`),
    get_show_credits: id => (`http://flsk.shaw-yu.com/api/show_credits/${id}`),
    get_show_reviews: id => (`http://flsk.shaw-yu.com/api/show_reviews/${id}`),
    get_placeholder_image: image => (`http://flsk.shaw-yu.com/api/placeholder_image/${image}`),
}