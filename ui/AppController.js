class Controller {
    constructor() { }

    init() {
        this.sidebarHome = document.getElementById('sidebar-tab-home')
        this.sidebarSearch = document.getElementById('sidebar-tab-search')

        this.displayHome = document.getElementById('display-home')
        this.displayHomeTrendingMovie = document.getElementById('home-trending-movie')
        this.displayHomeArrivingToday = document.getElementById('home-arriving-today')

        this.displaySearch = document.getElementById('display-search')

        this.requester = new Requester()
        this.initSidebar()
        this.initHome()
        this.initSearch()
    }

    initModal(id, type) {
        this.modalWrapper = document.getElementById('modal-wrapper')
        this.modal = document.getElementById('modal-container')
        this.removeAllChildNodes(this.modal)

        const close = document.createElement('span')
        close.classList.add('close')
        close.innerHTML = '&times;'
        close.addEventListener('click', e => this.modalWrapper.style.display = 'none')

        this.modalWrapper.style.display = 'flex'
        this.modal.appendChild(close)

        if (type === 'movie')
            this.requester.fetch_movie_detail(id, res => this.buildModalDetail(res, type))
        else if (type === 'tv')
            this.requester.fetch_show_detail(id, res => this.buildModalDetail(res, type))
    }

    buildModalDetail(res, type) {
        const { data, error, message } = res
        if (error) this.modal.innerHTML = message
        else {
            console.log(data)
        }

        const image = document.createElement('img')
        image.src = data.backdrop_path
        image.classList.add('modal-detail-image')

        const detailWrapper = document.createElement('div')
        detailWrapper.classList.add('modal-item-box')

        const detailTitle = document.createElement('span')
        detailTitle.classList.add('modal-detail-title')
        detailTitle.innerHTML = data.name

        const titleIcon = document.createElement('span')
        titleIcon.innerHTML = '<a>&#9432;'
        titleIcon.addEventListener('click', e => window.open(`https://www.themoviedb.org/${type}/${data.id}`))
        detailTitle.appendChild(titleIcon)

        const types = document.createElement('div')
        types.classList.add('modal-detail-types')
        types.innerHTML = `${new Date(data.date).getFullYear()}|${data.genres}`

        const ratingsBox = document.createElement('div')
        ratingsBox.classList.add('modal-detail-ratings-box')
        const ratings = document.createElement('span')
        ratings.classList.add('modal-detail-ratings')
        ratings.innerHTML = `${data.vote_average / 2}/5.0 `
        const votes = document.createElement('span')
        votes.innerHTML = `${data.vote_count} votes`
        ratingsBox.appendChild(ratings)
        ratingsBox.appendChild(votes)

        const description = document.createElement('div')
        description.classList.add('modal-detail-description')
        description.innerHTML = data.overview

        detailWrapper.appendChild(detailTitle)
        detailWrapper.appendChild(types)
        detailWrapper.appendChild(ratingsBox)
        detailWrapper.appendChild(description)

        this.modal.appendChild(image)
        this.modal.appendChild(detailWrapper)

    }

    initSearch() {
        this.kinput = document.getElementById('kinput')
        this.category = document.getElementById('category')
        this.searchBtn = document.getElementById('search-btn')
        this.clearBtn = document.getElementById('clear-btn')
        this.clearBtn.addEventListener('click', e => {
            this.category.value = 'empty'
            this.kinput.value = ''
        })
        this.searchBtn.addEventListener('click', e => this.searchBtnClick())
    }

    searchBtnClick() {
        const category = this.category.value;
        const query = this.kinput.value;

        if (category === 'empty' || query === '') {
            this.searchBtn.style.backgroundColor = 'red'
            alert('Please fill out this field')
            this.searchBtn.style.backgroundColor = 'black'
        } else {
            if (category === 'movie') {
                this.requester.fetch_search_movie(query, res => this.buildSearchList(res))
            } else if (category === 'show') {
                this.requester.fetch_search_show(query, res => this.buildSearchList(res))
            } else if (category === 'multi') {
                this.requester.fetch_search_multi(query, res => this.buildSearchList(res))
            }
        }
    }

    buildSearchList(res) {
        const { error, message, data } = res
        const errorDom = document.getElementById('search-error')
        if (error) {
            errorDom.innerHTML = message
            errorDom.style.display = 'block'
        } else if (data.length === 0)
            errorDom.style.display = 'block'
        else {
            console.log(data)

            const wrapper = document.getElementById('search-list-wrapper')
            this.removeAllChildNodes(wrapper)

            const showingMessage = document.createElement('p')
            showingMessage.innerHTML = 'Showing results...'

            wrapper.appendChild(showingMessage)
            wrapper.style.display = 'block'

            const items = data.map(e => {
                const item_wrapper = document.createElement('div')
                item_wrapper.classList.add('search-list-item')

                const img = document.createElement('img')
                img.src = e.image

                const textBox = document.createElement('div')
                textBox.classList.add('search-list-item-textbox')

                const title = document.createElement('div')
                title.classList.add('search-list-item-text-title')
                title.innerHTML = e.name

                const text = document.createElement('div')
                text.classList.add('search-list-item-types')

                const types = document.createElement('div')
                types.innerHTML = `${new Date(e.date).getFullYear()} | ${e.genres}`

                const points = document.createElement('div')
                points.innerHTML = `<span style='color:red'>${e.vote_average / 2}/5.0    </span><span>${e.vote_count} votes</span>`

                text.appendChild(types)
                text.appendChild(points)

                const description = document.createElement('span')
                description.classList.add('search-list-item-types')
                description.setAttribute('id', 'search-list-item-description')
                description.innerHTML = e.overview

                const button = document.createElement('button')
                button.innerHTML = 'show more'
                button.setAttribute('id', 'show-more-btn')
                button.addEventListener('click', () => this.initModal(e.id, e.type))

                textBox.appendChild(title)
                textBox.appendChild(text)
                textBox.appendChild(description)
                textBox.appendChild(button)

                item_wrapper.appendChild(img)
                item_wrapper.appendChild(textBox)
                return item_wrapper
            })

            items.forEach(e => wrapper.appendChild(e))
        }
    }



    removeAllChildNodes(dom) {
        while (dom.firstChild)
            dom.removeChild(dom.firstChild)
    }

    initHome() {
        this.requester.fetch_trending_movie(res => this.initHomeSlides(res, this.displayHomeTrendingMovie))
        this.requester.fetch_arriving_today(res => this.initHomeSlides(res, this.displayHomeArrivingToday))
    }

    initHomeSlides(res, target) {
        const { error, message, data } = res
        if (error) {
            image.src = this.get_placeholder_image('backdrop_path_placeholder.jpg')
            text.innerHTML = message
        }
        else {
            const elements = data.map(e => {
                const year = new Date(e.date).getFullYear()
                const root = document.createElement('div')
                const image = document.createElement('img')
                image.src = e.image
                const text = document.createElement('div')
                text.classList.add('home-list-item-title')
                text.innerHTML = `${e.title}(${year})`

                root.appendChild(image)
                root.appendChild(text)
                return root
            })
            elements[0].style.display = 'block'
            elements.forEach(e => target.appendChild(e))

            let i = 1
            setInterval(function () {
                i = i >= data.length ? 0 : i
                elements.forEach(element => {
                    element.style.display = 'none'
                });
                elements[i].style.display = 'block'
                i += 1
            }, 1000)
        }
    }

    initHomeArrivingToday(res) {
        const image = document.getElementById('home-arriving-today-image')
        const text = document.getElementById('home-arriving-today-text')


        const { error, message, data } = res
        if (error) {
            text.innerHTML = message
        }
        else {
            console.log(data)
            let i = 0
            setInterval(function () {
                i = i >= data.length ? 0 : i
                image.src = data[i].image
                i += 1
            }, 1000)
        }
    }

    initSidebar() {


        this.sidebarClick(null, this.sidebarHome, this.displayHome)

        this.sidebarHome.addEventListener('click', e => this.sidebarClick(e, this.sidebarHome, this.displayHome))
        this.sidebarSearch.addEventListener('click', e => this.sidebarClick(e, this.sidebarSearch, this.displaySearch))
    }

    sidebarClick(e, element, display) {
        this.clearSidebarShow()
        this.clearDisplay()

        element.classList.add('sidebar-show')

        if (display) {
            display.classList.remove('hide')
        }
    }


    clearSidebarShow() {
        this.sidebarHome.classList.remove('sidebar-show')
        this.sidebarSearch.classList.remove('sidebar-show')
    }

    clearDisplay() {
        this.displayHome.classList.add('hide')
        this.displaySearch.classList.add('hide')
    }

    get_placeholder_image = image => (`https://sqtbackend.azurewebsites.net/api/placeholder_image/${image}`)
}