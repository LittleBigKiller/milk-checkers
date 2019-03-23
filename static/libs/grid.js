class Grid {
    constructor(size, divisions) {
        this.size = size
        this.divisions = divisions
        this.gridHelper
        this.init()
    }

    init() {
        this.gridHelper = new THREE.GridHelper(this.size, this.divisions)
    }

    getGH () {
        return this.gridHelper
    }
}