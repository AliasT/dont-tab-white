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
  blacks = []
  constructor() {
    this.initGameWrapper()
    this.initStage()
    this.initScene()
    this.update()
  }

  update = () => {
    const _raf = requestAnimationFrame(this.update)
    this.pageA.y += this.speed
    this.pageB.y += this.speed

    this.indicatorY += this.speed

    // gameover
    const rect = this.blacks[this.blacks.length - 1].getBounds()
    if(rect.y >= this.viewHeight) {
      cancelAnimationFrame(_raf)
      return 
    }

    if(this.pageA.y >= this.viewHeight) {
      this.pageA.y = -this.viewHeight
      this.redrawPage(this.pageA._blockContainer)
    }
    if(this.pageB.y >= this.viewHeight) {
      this.pageB.y = -this.viewHeight
      this.redrawPage(this.pageB._blockContainer)
    }
  }

  initScene() {
    const pageA = this.buildPage()
    const pageB = this.buildPage()

    this.pageA = pageA
    this.pageB = pageB

    pageA.y = 0
    pageB.y = -this.viewHeight
    this.app.stage.addChild(pageA)
    this.app.stage.addChild(pageB)
  }

  get viewWidth() {
    return this.app.view.width
  }

  get viewHeight() {
    return this.app.view.height
  }

  get blockWidth() {
    return this.viewWidth / 4
  }

  get blockHeight() {
    return this.viewHeight / 5
  }

  blockClick = (evt, page, index) => {
    const currentBlackIndex = this.blacks.indexOf(evt.target)
    if(!this.blacks[currentBlackIndex+1]) {
      evt.target.clear()
      this.blacks.pop()
    }
    // 设置indicatorY的新位置
  }

  redrawPage(page) {
    // 数组存储黑块
    page._blacks = []
    page.removeChildren()
    for(let i = 0; i < 5; i++) {
      const indexWithBlack = Math.floor(Math.random() * 4)
      for(let j = 0; j < 4; j++) {
        const isBlack = indexWithBlack == j
        const g = new Graphics()
        g.interactive = true
        g.pointertap = (evt) => this.blockClick(evt, page, i * 5 + j)
        if(isBlack) page._blacks.push(g)
        g.beginFill(isBlack ? 0x000000 : 0xffffff)
        g.drawRect(j * this.blockWidth, i * this.blockHeight, this.blockWidth, this.blockHeight)
        g.endFill()
        page.addChild(g)
      }
    }
    this.blacks = page._blacks.concat(this.blacks)
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
      g.lineTo(this.viewWidth, i * this.blockHeight)
    }
    for(let j = 1; j < 4; j++) {
      g.moveTo(j * this.blockWidth, 0)
      g.lineTo(j * this.blockWidth, this.viewHeight)
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