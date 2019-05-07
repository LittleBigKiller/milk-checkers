class Pawn extends THREE.Mesh {
    constructor(color, name, isKing) {
        let geo
        if (isKing)
            geo = new THREE.CylinderGeometry(20, 20, 30, 32)
        else
            geo = new THREE.CylinderGeometry(20, 20, 10, 32)

        let mat = new THREE.MeshBasicMaterial({
            map: game.pawnTexture,
            color: color,
            wireframe: false
        })
        super(geo, mat)

        this.name = name
        this.isKing = isKing

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