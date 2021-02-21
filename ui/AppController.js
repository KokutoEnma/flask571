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

                const title = document.createElement('span')
                title.classList.add('search-list-item-text-title')
                title.innerHTML = e.name
                textBox.appendChild(title)

                const types = document.createElement('span')


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