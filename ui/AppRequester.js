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
    trending_movie: 'https://sqtbackend.azurewebsites.net/api/trending_movie',
    arriving_today: 'https://sqtbackend.azurewebsites.net/api/arriving_today',
    get_search_movie: query => (`https://sqtbackend.azurewebsites.net/api/search_movie/${query}`),
    get_search_show: query => (`https://sqtbackend.azurewebsites.net/api/search_show/${query}`),
    get_search_multi: query => (`https://sqtbackend.azurewebsites.net/api/search_multi/${query}`),
    get_movie_detail: id => (`https://sqtbackend.azurewebsites.net/api/movie_detail/${id}`),
    get_movie_credites: id => (`https://sqtbackend.azurewebsites.net/api/movie_credits/${id}`),
    get_movie_reviews: id => (`https://sqtbackend.azurewebsites.net/api/movie_reviews/${id}`),
    get_show_detail: id => (`https://sqtbackend.azurewebsites.net/api/show_detail/${id}`),
    get_show_credites: id => (`https://sqtbackend.azurewebsites.net/api/show_credits/${id}`),
    get_show_reviews: id => (`https://sqtbackend.azurewebsites.net/api/show_reviews/${id}`),
    get_placeholder_image: image => (`https://sqtbackend.azurewebsites.net/api/placeholder_image/${image}`),
}