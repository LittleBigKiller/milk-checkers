class Game {
    constructor() {
        this.boardData = [
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ]
        this.pawnData = [
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ]

        this.camera
        this.board
        this.scene

        this.draw()
    }

    draw() {
        var scene = new THREE.Scene()
        this.scene = scene
        
        var winWidth = $(window).width()
        var winHeight = $(window).height()
        
        var camera = new THREE.PerspectiveCamera(45, winWidth/winHeight, 0.1, 10000)
        this.camera = camera
        
        var renderer = new THREE.WebGLRenderer()
        renderer.setClearColor(0xAAAAAA)
        renderer.setSize(winWidth, winHeight)

        $("#root").append(renderer.domElement)

        this.camera.position.set(0, 500, -500)
        camera.lookAt(scene.position)

        var grid = new Grid(2000, 200)
        scene.add(grid.getGH())

        var orbitControl = new THREE.OrbitControls(camera, renderer.domElement)
        orbitControl.addEventListener('change', function () {
            renderer.render(scene, camera)
        })

        var axes = new THREE.AxesHelper(1000)
        scene.add(axes)

        let board = this.createLevel()
        this.board = board
        scene.add(board)

        let pawns = this.createPawns()
        scene.add(pawns)
        
        function render() {
            requestAnimationFrame(render)
                    
            renderer.render(scene, camera)
        }
        
        $(window).resize(function() {
            winWidth = $(window).width()
            winHeight = $(window).height()
            camera.aspect = winWidth/winHeight
            camera.updateProjectionMatrix()
            renderer.setSize(winWidth, winHeight)
        })
        
        render()
    }

    createLevel() {
        var container = new THREE.Object3D()
        var geo = new THREE.BoxGeometry(50, 10, 50)

        for (let i in this.boardData) {
            for (let j in this.boardData[i]) {
                var mat = new THREE.MeshBasicMaterial({
                    color: 0xdd8833,
                    wireframe: false
                })
                if (this.boardData[i][j] == 0) {
                    mat.color.setHex(0x111111)
                } else {
                    mat.color.setHex(0xeeeeee)
                }
                var mesh = new THREE.Mesh(geo, mat)
                mesh.position.x = -175 + (50 * i)
                mesh.position.z = 175 + (-50 * j)
                mesh.position.y += 5
                container.add(mesh)
            }
        }
        return container
    }

    createPawns() {
        var container = new THREE.Object3D()
        let geo = new THREE.CylinderGeometry(20, 20, 10, 32)

        for (let i in this.boardData) {
            for (let j in this.boardData[i]) {
                let mat = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    wireframe: false
                })
                if (this.pawnData[i][j] == 2) {
                    mat.color.setHex(0x222222)
                } else if (this.pawnData[i][j] == 1) {
                    mat.color.setHex(0xdddddd)
                } else {
                    continue
                }
                let mesh = new THREE.Mesh(geo, mat)

                mesh.position.y += 15
                
                mesh.position.x = -175 + (50 * i)
                mesh.position.z = 175 + (-50 * j)
                container.add(mesh)
            }
        }
        return container
    }

    setupCamera(playerId) {
        console.log('pId: ' + playerId)
        if (playerId == 0) {
            console.log('0')
            this.camera.position.set(500, 500, 0)
            this.camera.lookAt(this.board.position)
        } else if (playerId == 1) {
            console.log('1')
            this.camera.position.set(-500, 500, 0)
            this.camera.lookAt(this.board.position)
        } else {
            console.log('lmao')
            this.camera.position.set(0, 500, -500)
            this.camera.lookAt(this.board.position)
        }
    }
}

