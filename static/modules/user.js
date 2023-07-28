import canvas from './canvas.js'

const BLOCK_SIZE = 32;

class User {
  absCoordinates = {
    x: 0,
    y: 0,
  }

  skin =  Math.floor(Math.random() * 42) + 1;
  // skinStyle = `background-image: url("images/chars/char-${this.skin}.png");`

  genieHitCollision = false;

  constructor(id) {
    if (id) {
      this.element = canvas.create('div', {
        'class': 'user',
        'data-id': id,
        // 'style': this.skinStyle
      })
    };

    this.coordinates = {
      x: 0,
      y: 0,
    };

    this.maxCoordinates = {
      x: (canvas.element.clientWidth / BLOCK_SIZE - 1) / 2,
      y: (canvas.element.clientHeight / BLOCK_SIZE - 1) / 2
    }
  }

  isMoveAllowed(axis, direction) {
    return this.coordinates[axis] + direction
      <= this.maxCoordinates[axis]
      && this.coordinates[axis] + direction
      >= this.maxCoordinates[axis] * -1
  }

  getCharDirection(direction) {
    const rndInt = Math.floor(Math.random() * 3) + 1;
    const directions = {
      ArrowUp: `calc(32px * ${rndInt}) 32px`,
      ArrowDown: `calc(32px * ${rndInt}) 0px`,
      ArrowLeft: `calc(32px * ${rndInt}) 96px`,
      ArrowRight: `calc(32px * ${rndInt}) 64px`
    };
    return directions[direction];
  }

  move(axis, direction, arrowDirection) {
    if (!this.isMoveAllowed(axis, direction)) return
    const x = axis === 'x'
      ? this.coordinates.x + direction
      : this.coordinates.x
    const y = axis === 'y'
      ? this.coordinates.y + direction
      : this.coordinates.y
    this.setPosition({ x, y }, this.getCharDirection(arrowDirection));
  }

  getGenieArea() {
    const genie = document.getElementById('genie-container');
    const area = {
      x: {
        min: genie.offsetLeft,
        max: genie.offsetLeft + genie.offsetWidth,
      },
      y: {
        min: genie.offsetTop,
        max: genie.offsetTop + genie.offsetHeight,
      }
    }
    return area;
  }

  hitDetection() {
    const { x, y } = this.absCoordinates;
    const genieArea = this.getGenieArea();
    this.genieHitCollision = false;
    if (
      (x >= genieArea.x.min && x < genieArea.x.max)
      && (y >= genieArea.y.min && y < genieArea.y.max)
    ) {
      this.genieHitCollision = true;
    }
  }

  setPosition({ x, y }, newDirection = 'background-position: 64px 0') {
    this.element.style = `transform: translate(${x * BLOCK_SIZE}px, ${y * BLOCK_SIZE}px); background-position: ${newDirection}; background-image: url("images/chars/char-${this.skin}.png");`;
    this.coordinates = { x, y };
    this.absCoordinates = {
      x: this.element.offsetLeft + (x * BLOCK_SIZE),
      y: this.element.offsetTop + (y * BLOCK_SIZE),
    }
    this.hitDetection();
    if (this.genieHitCollision) {
      this.element.style.backgroundColor = 'red';
    }
  }
}
export default User