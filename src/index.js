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
  speed = 1
  constructor() {
    this.initGameWrapper()
    this.initStage()
    this.initScene()
    this.update()
  }

  update = () => {
    requestAnimationFrame(this.update)
    this.pageA.y += this.speed
    this.pageB.y += this.speed

    if(this.pageA.y >= this.app.view.height) {
      this.pageA.y = -this.app.view.height
      this.redrawPage(this.pageA._blockContainer)
    }
    if(this.pageB.y >= this.app.view.height) {
      this.pageB.y = -this.app.view.height
      this.redrawPage(this.pageB._blockContainer)
    }
  }

  initScene() {
    const pageA = this.buildPage()
    const pageB = this.buildPage()
    this.pageA = pageA
    this.pageB = pageB
    pageA.y = 0
    pageB.y = -this.app.view.height
    this.app.stage.addChild(pageA)
    this.app.stage.addChild(pageB)
  }

  get blockWidth() {
    return this.app.view.width / 4
  }

  get blockHeight() {
    return this.app.view.height / 5
  }

  blockClick = (evt) => {
    evt.target.clear()
  }

  redrawPage(page) {
    page.removeChildren()
    for(let i = 0; i < 5; i++) {
      const indexWithBlack = Math.floor(Math.random() * 4)
      for(let j = 0; j < 4; j++) {
        const g = new Graphics()
        g.interactive = true
        g.pointertap = this.blockClick
        g.beginFill(indexWithBlack == j ? 0x000000 : 0xffffff)
        g.drawRect(j * this.blockWidth, i * this.blockHeight, this.blockWidth, this.blockHeight)
        g.endFill()
        page.addChild(g)
      }
    }
  }
  buildPage(color) {
    const page = new Container()
    page._blockContainer = new Container()
    page.addChild(page._blockContainer)
    this.redrawPage(page._blockContainer)
    //lines
    const g = new Graphics()
    g.lineStyle(1, 0x000000)
    for(let i = 0; i < 5; i++) {
      g.moveTo(0, i * this.blockHeight)
      g.lineTo(this.app.view.width, i * this.blockHeight)
    }
    for(let j = 1; j < 4; j++) {
      g.moveTo(j * this.blockWidth, 0)
      g.lineTo(j * this.blockWidth, this.app.view.height)
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
}