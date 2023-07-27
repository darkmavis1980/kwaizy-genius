import canvas from './canvas.js'
import User from './user.js'

class Player extends User {
  constructor () {
    super()
    this.element = canvas.create('div', {'class': ['player', 'user']})

    this.coordinates = {
      x: 0,
      y: 0,
    }

    this.maxCoordinates = {
      x: (canvas.clientWidth / 32 - 1) / 2,
      y: (canvas.clientHeight / 32 - 1) / 2
    }

    this.initMovement()
  }

  initMovement() {
    window.addEventListener('keydown', event => {
      console.log(event)
      if (event.key === "ArrowUp") { // up
        this.move('y', -1)
      }
      if (event.key === "ArrowDown") { // down
        this.move('y', 1)
      }
      if (event.key === "ArrowLeft") { // left
        this.move('x', -1)
      }
      if (event.key === "ArrowRight") { // right
        this.move('x', 1)
      }
    })
  }

  isMoveAllowed(axis, direction) {
    return this.coordinates[axis] + direction
        <= this.maxCoordinates[axis]
        // check negative direction:
        && this.coordinates[axis] + direction
        >= this.maxCoordinates[axis] * -1
  }

  move(axis, direction) {
    if (!this.isMoveAllowed(axis, direction)) return

    const x = axis === 'x'
      ? this.coordinates.x + direction
      : this.coordinates.x
    const y = axis === 'y'
      ? this.coordinates.y + direction
      : this.coordinates.y
    this.setPosition({x, y})
  }
  setPosition({x, y}) {
    this.element.style =  `transform: translate(${x * 32}px, ${y * 32}px);`
    this.coordinates = {x, y}
  }
}

const player = new Player()
export default player