class Canvas {
  constructor() {
    this.element = document.querySelector('#map')
  }

  add(node) {
    this.element.appendChild(node)
  }

  create(type, props) {
    const node = document.createElement(type)
    Object.entries(props).forEach(([attr, value]) => {
      if (Array.isArray(value)) {
        value = value.join(' ')
      }
      node.setAttribute(attr, value)
    })
    this.add(node)
    return node
  }
};

const canvas = new Canvas();

export default canvas;