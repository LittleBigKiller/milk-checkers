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

        this.boardTexture
        this.pawnTexture

        this.draw()

        this.selectedPawn = null
        this.PID = null
        this.pawns
    }

    draw() {
        var scene = new THREE.Scene()
        this.scene = scene

        var winWidth = $(window).width()
        var winHeight = $(window).height()

        var camera = new THREE.PerspectiveCamera(45, winWidth / winHeight, 0.1, 10000)
        this.camera = camera

        var renderer = new THREE.WebGLRenderer({ antialias: true })
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

        this.boardTexture = new THREE.TextureLoader().load('textures/wood1.png')
        this.pawnTexture = new THREE.TextureLoader().load('textures/wood1.png')

        let board = this.createLevel()
        this.board = board
        scene.add(board)

        let tempLight = new THREE.PointLight(0xffffff, 1, 100)
        tempLight.position.set(50, 50, 50)
        scene.add(tempLight)

        $("#root").on('click', function (e) {
            var raycaster = new THREE.Raycaster()
            var mouseVector = new THREE.Vector2()

            mouseVector.x = (e.clientX / $(window).width()) * 2 - 1
            mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1
            raycaster.setFromCamera(mouseVector, camera)
            var inter = raycaster.intersectObjects(scene.children, true)

            if (inter.length > 0) {
                let obj = inter[0].object

                if (obj.name == 'PawnRed' && game.PID == 1) {
                    if (obj.highlighted) {
                        obj.lowlight()
                        game.selectedPawn = null
                    } else {
                        obj.highlight()
                        game.selectedPawn = obj
                    }
                } else if (obj.name == 'PawnBlack' && game.PID == 0) {
                    if (obj.highlighted) {
                        obj.lowlight()
                        game.selectedPawn = null
                    } else {
                        obj.highlight()
                        game.selectedPawn = obj
                    }
                } else if (obj.name == 'Board') {
                    if (game.selectedPawn != null) {
                        let targetX = (obj.position.x + 175) / 50
                        let targetZ = (obj.position.z - 175) / -50
                        let pawnX = (game.selectedPawn.position.x + 175) / 50
                        let pawnZ = (game.selectedPawn.position.z - 175) / -50
                        
                        if (game.pawnData[targetX][targetZ] == 0) {
                            game.selectedPawn.position.z = obj.position.z
                            game.selectedPawn.position.x = obj.position.x

                            game.pawnData[pawnX][pawnZ] = 0

                            if (game.PID == 1)
                                game.pawnData[targetX][targetZ] = 2
                            else if (game.PID == 0)
                                game.pawnData[targetX][targetZ] = 1
                        }
                    }
                }
            }
        })

        function render() {
            requestAnimationFrame(render)

            renderer.render(scene, camera)
        }

        $(window).resize(function () {
            winWidth = $(window).width()
            winHeight = $(window).height()
            camera.aspect = winWidth / winHeight
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
                let name
                var mat = new THREE.MeshBasicMaterial({
                    map: this.boardTexture,
                    color: 0xdd8833,
                    wireframe: false
                })
                if (this.boardData[i][j] == 0) {
                    mat.color.setHex(0x111111)
                    name = 'Board'
                } else {
                    mat.color.setHex(0xeeeeee)
                }
                var mesh = new THREE.Mesh(geo, mat)
                mesh.position.x = -175 + (50 * i)
                mesh.position.z = 175 + (-50 * j)
                mesh.position.y += 5
                mesh.name = name
                container.add(mesh)
            }
        }
        return container
    }

    createPawns() {

        var container = new THREE.Object3D()
        /* let geo = new THREE.CylinderGeometry(20, 20, 10, 32) */

        for (let i in this.boardData) {
            for (let j in this.boardData[i]) {
                let color
                if (this.pawnData[i][j] == 2) {
                    color = 0xdd2222
                    name = "PawnRed"
                } else if (this.pawnData[i][j] == 1) {
                    color = 0x22dddd
                    name = "PawnBlack"
                } else {
                    continue
                }

                let mesh = new Pawn(color)

                if (mesh != null) {
                    mesh.position.y += 15

                    mesh.position.x = -175 + (50 * i)
                    mesh.position.z = 175 + (-50 * j)
                    mesh.name = name
                    container.add(mesh)
                }
            }
        }
        return container
    }

    spawnPawns() {
        this.pawns = this.createPawns()
        this.scene.add(this.pawns)
    }

    setupCamera(playerId) {
        console.log('pId: ' + playerId)
        this.PID = playerId
        console.log('pId: ' + this.PID)
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
        this.spawnPawns()
    }
}

