import canvas from './canvas.js'
import User from './user.js'

class Player extends User {
  constructor() {
    super()
    this.element = canvas.create('div', {'class': ['player', 'user']})
    this.initMovement()
  }

  set(key, value) {
    this[key] = value
  }

  initMovement() {
    const keycodes = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
    window.addEventListener('keydown', event => {
      // console.log(event)
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
      if (keycodes.includes(event.key)) {
        this.socket.emit('user-move', this.coordinates)
      }
    })
  }
}

const player = new Player()
export default player