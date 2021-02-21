class Controller {
    constructor() { }

    init() {
        this.requester = new Requester()
        this.initSidebar()
    }

    initSidebar() {
        this.sidebarHome = document.getElementById('sidebar-tab-home')
        this.sidebarSearch = document.getElementById('sidebar-tab-search')

        this.displayHome = document.getElementById('display-home')

        this.sidebarHome.classList.add('sidebar-show')
        this.sidebarHome.addEventListener('click', e => this.sidebarClick(e, this.sidebarHome, this.displayHome))
        this.sidebarSearch.addEventListener('click', e => this.sidebarClick(e, this.sidebarSearch, null))
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
    }

}