import {
  Application,
  Container,
  Graphics
} from 'pixi.js'

function setCssRules(target, rules) {
  Object.keys(rules).reduce((ret, cur) => {
    target.style[cur] = rules[cur]
    return ret
  }, target)
}

export default class DontTapWhite {
  constructor() {
    this.initGameWrapper()
    this.initStage()
    this.initScene()
  }

  initScene() {
    const pageA = this.buildPage()
    const pageB = this.buildPage()
    pageA.y = 0
    pageB.y = this.app.view.height
    this.app.stage.addChild(pageA)
    this.app.stage.addChild(pageB)
  }

  buildPage(color) {
    const page = new Container()
    const blockWidth = this.app.view.width / 4
    const blockHeight = this.app.view.height / 5

    // blocks
    for(let i = 0; i < 5; i++) {
      const indexWithBlack = Math.floor(Math.random() * 4)
      for(let j = 0; j < 4; j++) {
        const g = new Graphics()
        g.beginFill(indexWithBlack == j ? 0x000000 : 0xffffff)
        g.drawRect(j * blockWidth, i * blockHeight, blockWidth, blockHeight)
        g.endFill()
        page.addChild(g)
      }
    }

    //lines
    const g = new Graphics()
    g.lineStyle(1, 0x000000)
    for(let i = 1; i < 5; i++) {
      g.moveTo(0, i * blockHeight)
      g.lineTo(this.app.view.width, i * blockHeight)
    }
    for(let j = 1; j < 4; j++) {
      g.moveTo(j * blockWidth, 0)
      g.lineTo(j * blockWidth, this.app.view.height)
    }
    g.closePath()
    page.addChild(g)
    return page
  }

  initStage() {
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff
    })
    this.wrapper.appendChild(this.app.view)
  }

  initGameWrapper() {
    this.wrapper = document.createElement('div')
    setCssRules(this.wrapper, {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      bottom: 0
    })
    document.body.appendChild(this.wrapper)
  }

  start() {

  }
}