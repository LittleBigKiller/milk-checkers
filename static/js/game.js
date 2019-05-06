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
        this.moveData = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
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

        /* var orbitControl = new THREE.OrbitControls(camera, renderer.domElement)
        orbitControl.addEventListener('change', function () {
            renderer.render(scene, camera)
        }) */

        var axes = new THREE.AxesHelper(1000)
        scene.add(axes)

        this.boardTexture = new THREE.TextureLoader().load('textures/wood1.png')
        this.pawnTexture = new THREE.TextureLoader().load('textures/wood1.png')

        this.spawnLevel()

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

                if (obj.name == 'PawnRed' && game.PID == 0 && game.myTurn) {
                    for (let i in game.pawns.children) {
                        if (game.pawns.children[i] != obj)
                            game.pawns.children[i].lowlight()
                    }

                    if (obj.highlighted) {
                        obj.lowlight()
                        game.selectedPawn = null
                    } else {
                        obj.highlight()
                        game.selectedPawn = obj
                    }
                } else if (obj.name == 'PawnBlack' && game.PID == 1 && game.myTurn) {
                    for (let i in game.pawns.children) {
                        if (game.pawns.children[i] != obj)
                            game.pawns.children[i].lowlight()
                    }

                    if (obj.highlighted) {
                        obj.lowlight()
                        game.selectedPawn = null
                    } else {
                        obj.highlight()
                        game.selectedPawn = obj
                    }
                } else if (obj.name == 'Board' && game.myTurn) {
                    if (game.selectedPawn != null) {
                        let targetX = (obj.position.x + 175) / 50
                        let targetZ = (obj.position.z - 175) / -50
                        let pawnX = (game.selectedPawn.position.x + 175) / 50
                        let pawnZ = (game.selectedPawn.position.z - 175) / -50

                        game.selectedPawn.position.z = obj.position.z
                        game.selectedPawn.position.x = obj.position.x

                        game.pawnData[pawnX][pawnZ] = 0

                        if (game.PID == 1)
                            if (targetX == 0 || game.selectedPawn.isKing)
                                game.pawnData[targetX][targetZ] = 3
                            else
                                game.pawnData[targetX][targetZ] = 1
                        else if (game.PID == 0)
                            if (targetX == 7 || game.selectedPawn.isKing)
                                game.pawnData[targetX][targetZ] = 4
                            else
                                game.pawnData[targetX][targetZ] = 2


                        game.selectedPawn.lowlight()
                        game.selectedPawn = null

                        game.preserveMove = false
                        game.myTurn = false

                        if (Math.abs(targetZ - pawnZ) == 2) { // Nie działa z królówkami
                            game.pawnData[pawnX + parseInt(targetX - pawnX) / 2][pawnZ + parseInt(targetZ - pawnZ) / 2] = 0
                            game.preserveMove = true
                            game.myTurn = true
                        }

                        game.spawnPawns()
                        net.pushMove(game.pawnData)
                    }
                }

                game.createMoveTable()
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

    init() {
        game.myPawns = 8
        game.enemyPawns = 8

        game.turnCheck = setInterval(() => {
            net.checkWin()
        }, 1000)
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
                    if (this.moveData[i][j] == 1) {
                        mat.color.setHex(0x33dd88)
                        name = 'Board'
                    } else if (this.moveData[i][j] == 2) {
                        mat.color.setHex(0xdd3333)
                        name = 'Board'
                    } else {
                        mat.color.setHex(0x333333)
                    }
                } else {
                    mat.color.setHex(0xdddddd)
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

        for (let i in this.boardData) {
            for (let j in this.boardData[i]) {
                let color
                let isKing = false
                if (this.pawnData[i][j] == 2 || this.pawnData[i][j] == 4) {
                    color = 0xdd3333
                    name = "PawnRed"
                    if (this.pawnData[i][j] > 2) {
                        isKing = true
                    }
                } else if (this.pawnData[i][j] == 1 || this.pawnData[i][j] == 3) {
                    color = 0x33dddd
                    name = "PawnBlack"
                    if (this.pawnData[i][j] > 2) {
                        isKing = true
                    }
                } else {
                    continue
                }

                let mesh = new Pawn(color, name, isKing)

                if (mesh != null) {
                    mesh.position.y += 15

                    mesh.position.x = -175 + (50 * i)
                    mesh.position.z = 175 + (-50 * j)
                    container.add(mesh)
                }
            }
        }
        return container
    }

    spawnPawns() {
        game.scene.remove(game.pawns)
        game.pawns = game.createPawns()
        game.scene.add(game.pawns)
    }

    spawnLevel() {
        this.scene.remove(this.board)
        this.board = this.createLevel()
        this.scene.add(this.board)
    }

    setupCamera(playerId) {
        this.PID = playerId
        if (playerId == 0) {
            this.camera.position.set(-500, 500, 0)
            this.camera.lookAt(this.board.position)

            game.myTurn = true

            game.pawnData = [
                [2, 0, 2, 0, 2, 0, 2, 0],
                [0, 2, 0, 2, 0, 2, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 1, 0, 1],
            ]
        } else if (playerId == 1) {
            this.camera.position.set(500, 500, 0)
            this.camera.lookAt(this.board.position)

            game.myTurn = false

            game.pawnData = [
                [2, 0, 2, 0, 2, 0, 2, 0],
                [0, 2, 0, 2, 0, 2, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 1, 0, 1],
            ]
        } else {
            this.camera.position.set(0, 500, -500)
            this.camera.lookAt(this.board.position)

            game.myTurn = false

            game.pawnData = [
                [2, 0, 2, 0, 2, 0, 2, 0],
                [0, 2, 0, 2, 0, 2, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 1, 0, 1],
            ]
        }
        this.spawnPawns()
    }

    resolveTableState(table) {
        if (!game.array_compare(table, game.pawnData)) {
            game.pawnData = table

            if (!game.preserveMove) {
                let localMyPawns = 0
                let localEnemyPawns = 0

                for (let i in game.pawnData) {
                    for (let j in game.pawnData[i]) {
                        if (game.pawnData[i][j] == 1 || game.pawnData[i][j] == 3) {
                            if (game.PID == 1) localMyPawns++
                            else if (game.PID == 0) localEnemyPawns++
                        } else if (game.pawnData[i][j] == 2 || game.pawnData[i][j] == 4) {
                            if (game.PID == 0) localMyPawns++
                            else if (game.PID == 1) localEnemyPawns++
                        }
                    }
                }

                console.warn('----------')
                console.warn(game.myTurn)
                console.log(game.myPawns)
                console.log(localMyPawns)
                console.log(game.enemyPawns)
                console.log(localEnemyPawns)

                if (!game.myTurn) {
                    if (game.myPawns == localMyPawns) {
                        game.myTurn = true
                    } else {
                        game.myTurn = false
                        game.myPawns = localMyPawns
                    }
                } else {
                    if (game.enemyPawns == localEnemyPawns) {
                        game.myTurn = false
                        game.enemyPawns = localEnemyPawns
                    } else {
                        game.myTurn = true
                    }
                }

                console.error(game.myTurn)
                console.warn('----------')
            } else {
                game.myTurn = true
            }

            game.spawnPawns()
        }

        if (game.myTurn) {
            ui.turnLock(false)
        } else {
            ui.turnLock(true)
        }
    }

    createMoveTable() {
        game.moveData = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]
        if (game.selectedPawn != null && game.myTurn) {
            let x = (game.selectedPawn.position.x + 175) / 50
            let z = (game.selectedPawn.position.z - 175) / -50

            if (game.selectedPawn.isKing) { //[TODO] 
                if (game.PID == 0) {
                    for (let i = 0; i < 7; i++) {
                        if (game.pawnData[x + i] != undefined)
                            if (game.pawnData[x + i][z + i] != undefined)
                                if (game.pawnData[x + i][z + i] == 0)
                                    game.moveData[x + i][z + i] = 1
                                else if ((game.pawnData[x + i][z + i] == 1 || game.pawnData[x + i][z + i] == 3) && game.pawnData[x + i + 1] != undefined)
                                    if (game.pawnData[x + i + 1][z + i + 1] != undefined)
                                        if (game.pawnData[x + i + 1][z + i + 1] == 0) {
                                            game.moveData[x + i][z + i] = 2
                                            game.moveData[x + i + 1][z + i + 1] = 1
                                        }

                        if (game.pawnData[x + i] != undefined)
                            if (game.pawnData[x + i][z - i] != undefined)
                                if (game.pawnData[x + i][z - i] == 0)
                                    game.moveData[x + i][z - i] = 1
                                else if ((game.pawnData[x + i][z - i] == 1 || game.pawnData[x + i][z - i] == 3) && game.pawnData[x + i + 1] != undefined)
                                    if (game.pawnData[x + i + 1][z - i - 1] != undefined)
                                        if (game.pawnData[x + i + 1][z - i - 1] == 0) {
                                            game.moveData[x + i][z - i] = 2
                                            game.moveData[x + i + 1][z - i - 1] = 1
                                        }

                        if (game.pawnData[x - i] != undefined)
                            if (game.pawnData[x - i][z + i] != undefined)
                                if (game.pawnData[x - i][z + i] == 0)
                                    game.moveData[x - i][z + i] = 1
                                else if ((game.pawnData[x - i][z + i] == 1 || game.pawnData[x - i][z + i] == 3) && game.pawnData[x - i - 1] != undefined)
                                    if (game.pawnData[x - i - 1][z + i + 1] != undefined)
                                        if (game.pawnData[x - i - 1][z + i + 1] == 0) {
                                            game.moveData[x - i][z + i] = 2
                                            game.moveData[x - i - 1][z + i + 1] = 1
                                        }

                        if (game.pawnData[x - i] != undefined)
                            if (game.pawnData[x - i][z - i] != undefined)
                                if (game.pawnData[x - i][z - i] == 0)
                                    game.moveData[x - i][z - i] = 1
                                else if ((game.pawnData[x - i][z - i] == 1 || game.pawnData[x - i][z - i] == 3) && game.pawnData[x - i - 1] != undefined)
                                    if (game.pawnData[x - i - 1][z - i - 1] != undefined)
                                        if (game.pawnData[x - i - 1][z - i - 1] == 0) {
                                            game.moveData[x - i][z - i] = 2
                                            game.moveData[x - i - 1][z - i - 1] = 1
                                        }
                    }

                } else if (game.PID == 1) {
                    for (let i = 0; i < 7; i++) {
                        if (game.pawnData[x + i] != undefined)
                            if (game.pawnData[x + i][z + i] != undefined)
                                if (game.pawnData[x + i][z + i] == 0)
                                    game.moveData[x + i][z + i] = 1
                                else if ((game.pawnData[x + i][z + i] == 2 || game.pawnData[x + i][z + i] == 4) && game.pawnData[x + i + 1] != undefined)
                                    if (game.pawnData[x + i + 1][z + i + 1] != undefined)
                                        if (game.pawnData[x + i + 1][z + i + 1] == 0) {
                                            game.moveData[x + i][z + i] = 2
                                            game.moveData[x + i + 1][z + i + 1] = 1
                                        }

                        if (game.pawnData[x + i] != undefined)
                            if (game.pawnData[x + i][z - i] != undefined)
                                if (game.pawnData[x + i][z - i] == 0)
                                    game.moveData[x + i][z - i] = 1
                                else if ((game.pawnData[x + i][z - i] == 2 || game.pawnData[x + i][z - i] == 4) && game.pawnData[x + i + 1] != undefined)
                                    if (game.pawnData[x + i + 1][z - i - 1] != undefined)
                                        if (game.pawnData[x + i + 1][z - i - 1] == 0) {
                                            game.moveData[x + i][z - i] = 2
                                            game.moveData[x + i + 1][z - i - 1] = 1
                                        }

                        if (game.pawnData[x - i] != undefined)
                            if (game.pawnData[x - i][z + i] != undefined)
                                if (game.pawnData[x - i][z + i] == 0)
                                    game.moveData[x - i][z + i] = 1
                                else if ((game.pawnData[x - i][z + i] == 2 || game.pawnData[x - i][z + i] == 4) && game.pawnData[x - i - 1] != undefined)
                                    if (game.pawnData[x - i - 1][z + i + 1] != undefined)
                                        if (game.pawnData[x - i - 1][z + i + 1] == 0) {
                                            game.moveData[x - i][z + i] = 2
                                            game.moveData[x - i - 1][z + i + 1] = 1
                                        }

                        if (game.pawnData[x - i] != undefined)
                            if (game.pawnData[x - i][z - i] != undefined)
                                if (game.pawnData[x - i][z - i] == 0)
                                    game.moveData[x - i][z - i] = 1
                                else if ((game.pawnData[x - i][z - i] == 2 || game.pawnData[x - i][z - i] == 4) && game.pawnData[x - i - 1] != undefined)
                                    if (game.pawnData[x - i - 1][z - i - 1] != undefined)
                                        if (game.pawnData[x - i - 1][z - i - 1] == 0) {
                                            game.moveData[x - i][z - i] = 2
                                            game.moveData[x - i - 1][z - i - 1] = 1
                                        }
                    }
                }
            } else {
                if (game.PID == 0) {
                    if (game.pawnData[x + 1][z - 1] == 0)
                        game.moveData[x + 1][z - 1] = 1
                    else if (game.pawnData[x + 1][z - 1] == 1 && game.pawnData[x + 2] != undefined)
                        if (game.pawnData[x + 2][z - 2] != undefined)
                            if (game.pawnData[x + 2][z - 2] == 0) {
                                game.moveData[x + 1][z - 1] = 2
                                game.moveData[x + 2][z - 2] = 1
                            }

                    if (game.pawnData[x + 1][z + 1] == 0)
                        game.moveData[x + 1][z + 1] = 1
                    else if (game.pawnData[x + 1][z + 1] == 1 && game.pawnData[x + 2] != undefined)
                        if (game.pawnData[x + 2][z + 2] != undefined)
                            if (game.pawnData[x + 2][z + 2] == 0) {
                                game.moveData[x + 1][z + 1] = 2
                                game.moveData[x + 2][z + 2] = 1
                            }

                } else if (game.PID == 1) {
                    if (game.pawnData[x - 1][z - 1] == 0)
                        game.moveData[x - 1][z - 1] = 1
                    else if (game.pawnData[x - 1][z - 1] == 2 && game.pawnData[x - 2] != undefined)
                        if (game.pawnData[x - 2][z - 2] != undefined)
                            if (game.pawnData[x - 2][z - 2] == 0) {
                                game.moveData[x - 1][z - 1] = 2
                                game.moveData[x - 2][z - 2] = 1
                            }

                    if (game.pawnData[x - 1][z + 1] == 0)
                        game.moveData[x - 1][z + 1] = 1
                    else if (game.pawnData[x - 1][z + 1] == 2 && game.pawnData[x - 2] != undefined)
                        if (game.pawnData[x - 2][z + 2] != undefined)
                            if (game.pawnData[x - 2][z + 2] == 0) {
                                game.moveData[x - 1][z + 1] = 2
                                game.moveData[x - 2][z + 2] = 1
                            }
                }
            }
        }

        game.spawnLevel()
    }

    array_compare(a1, a2) {
        if (a1.length != a2.length) {
            return false
        }
        for (var i in a1) {
            if (a1[i] instanceof Array && a2[i] instanceof Array) {
                if (!this.array_compare(a1[i], a2[i])) {
                    return false
                }
            }
            else if (a1[i] != a2[i]) {
                return false
            }
        }
        return true
    }
}

