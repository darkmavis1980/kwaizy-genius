import canvas from './canvas.js';
import User from './user.js';

class Player extends User {
  constructor() {
    super();
    this.element = canvas.create('div', { 'class': ['player', 'user', 'char'], id: 'current-player' });
    this.initMovement();
    this.moveHandler = undefined;
    console.log(this.skin)
  }

  set(key, value) {
    this[key] = value;
  }

  initMovement() {
    const keycodes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    // TODO fix initial position
    this.move('y', 0, 'ArrowDown');
    this.move('x', 0, 'ArrowDown');

    window.addEventListener('keydown', event => {
      if (event.key === 'ArrowUp') { // up
        this.move('y', -1, event.key);
      }
      if (event.key === 'ArrowDown') { // down
        this.move('y', 1, event.key);
      }
      if (event.key === 'ArrowLeft') { // left
        this.move('x', -1, event.key);
      }
      if (event.key === 'ArrowRight') { // right
        this.move('x', 1, event.key);
      }
      if (keycodes.includes(event.key)) {
        this.socket.emit('user-move', this.coordinates)
        if (this.moveHandler) {
          this.moveHandler();
        }
      }
    });
  }

  setMoveHandler(moveHandler) {
    this.moveHandler = moveHandler;
  }
}

const player = new Player();
export default player;