class Pawn extends THREE.Mesh {
    constructor(color, name) {
        let geo = new THREE.CylinderGeometry(20, 20, 10, 32)
        let mat = new THREE.MeshBasicMaterial({
            map: game.pawnTexture,
            color: color,
            wireframe: false
        })
        super(geo, mat)

        this.name = name

        this.savedColor = color
        this.highlighted = false
    }

    highlight() {
        this.material.color.setHex(0xdddd33)
        this.highlighted = true
    }

    lowlight() {
        this.material.color.setHex(this.savedColor)
        this.highlighted = false
    }
}