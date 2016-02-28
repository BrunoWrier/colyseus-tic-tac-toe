import PIXI from 'pixi.js'
import GameScreen from './GameScreen'

import LocalStorage from '../core/LocalStorage'

export default class EndGameScreen extends PIXI.Container {

  constructor (options = {}) {
    super()

    let titleText = "Draw game!"
      , incrementAttribute = null

    if (options.draw) {
      titleText = "Draw game!"
      incrementAttribute = 'draw'

    } else if (options.won) {
      titleText = "You win!"
      incrementAttribute = 'win'

    } else {
      titleText = "You lose! :("
      incrementAttribute = 'loss'
    }

    // increment statistics
    LocalStorage.set( incrementAttribute, LocalStorage.get(incrementAttribute)+1 )

    this.title = new PIXI.Text(titleText, {
      font: "132px JennaSue",
      fill: 0x000,
      textAlign: 'center'
    })
    this.title.pivot.x = this.title.width / 2
    this.addChild(this.title)

    this.instructionText = new PIXI.Text("touch to play again", {
      font: "52px JennaSue",
      fill: 0x000,
      textAlign: 'center'
    })
    this.instructionText.pivot.x = this.instructionText.width / 2
    this.instructionText.pivot.y = this.instructionText.height / 2
    this.addChild(this.instructionText)

    let statuses = `Win ${ LocalStorage.get('win') } | Draw ${ LocalStorage.get('draw') } | Loss ${ LocalStorage.get('loss') } `
    this.statusesText = new PIXI.Text(statuses, {
      font: "52px JennaSue",
      fill: 0x000,
      textAlign: 'center'
    })
    this.statusesText.pivot.x = this.statusesText.width / 2
    this.statusesText.pivot.y = this.statusesText.height / 2
    this.addChild(this.statusesText)

    this.colyseus = new PIXI.Sprite.fromImage('images/colyseus.png')
    this.colyseus.pivot.x = this.colyseus.width / 2
    this.addChild(this.colyseus)

    this.interactive = true
    this.on('click', this.startGame.bind(this))
    this.on('touchstart', this.startGame.bind(this))

    this.on('dispose', this.onDispose.bind(this))

    this.onResizeCallback = this.onResize.bind(this)
    window.addEventListener('resize', this.onResizeCallback)
    this.onResize()
  }

  startGame () {
    console.log("WAT")
    this.emit('goto', GameScreen)
  }

  onResize () {
    this.MARGIN = (window.innerHeight / 100) * 8 // 5%

    this.title.x = window.innerWidth / 2;
    this.title.y = this.MARGIN

    this.instructionText.x = window.innerWidth / 2
    this.instructionText.y = window.innerHeight / 2

    this.statusesText.x = window.innerWidth / 2
    this.statusesText.y = this.instructionText.y + this.instructionText.height + this.MARGIN

    this.colyseus.x = window.innerWidth / 2
    this.colyseus.y = window.innerHeight - this.colyseus.height - this.MARGIN
  }

  onDispose () {
    window.removeEventListener('resize', this.onResizeCallback)
  }

}





