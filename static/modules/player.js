import canvas from './canvas.js'
class Player {
  constructor() {
    // create element for player and save reference to it
    this.element = canvas.create('div', {'class': ['player', 'user']})
  }
}
const player = new Player()
export default player