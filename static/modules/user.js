import canvas from './canvas.js'

class User {
  constructor(id) {
    if (id) {
      this.element = canvas.create('div', {
        'class': 'user',
        'data-id': id,
      })
    }

    this.coordinates = {
      x: 0,
      y: 0,
    }

    this.maxCoordinates = {
      x: (canvas.element.clientWidth / 32 - 1) / 2,
      y: (canvas.element.clientHeight / 32 - 1) / 2
    }
  }

  isMoveAllowed(axis, direction) {
    return this.coordinates[axis] + direction
      <= this.maxCoordinates[axis]
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
    this.setPosition({ x, y })
  }

  setPosition({ x, y }) {
    this.element.style = `transform: translate(${x * 32}px, ${y * 32}px);`;
    this.coordinates = { x, y };
  }
}
export default User