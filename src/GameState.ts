import { existsSync, readFileSync, writeFileSync } from 'fs'
import { loadFile } from './ContentLoader'

const GAMESTATE_FILENAME = 'gamestate.json'

export default class GameState {
  rooms: any
  playerCurrentRoomKey: string
  playerItems: any[]
  playerHealth: number
  godmode: boolean

  constructor() {
    if (this.load()) {
      return
    }

    this.initRooms()
    this.playerCurrentRoomKey = 'Bob'
    this.playerItems = []
    this.playerHealth = 100
    this.godmode = false
  }

  getPlayerCurrentRoom() {
    return this.rooms[this.playerCurrentRoomKey]
  }

  setPlayerCurrentRoom(key: string) {
    this.playerCurrentRoomKey = key
  }

  load(): boolean {
    if (!existsSync(GAMESTATE_FILENAME)) {
      return false
    }

    const gameStateJson = readFileSync(GAMESTATE_FILENAME, 'utf8')
    if (!gameStateJson) {
      return false
    }

    const gameState = JSON.parse(gameStateJson)
    if (!gameState) {
      return false
    }

    for (const prop in gameState) {
      this[prop] = gameState[prop]
    }

    return true
  }

  save(): boolean {
    const gameStateJson = JSON.stringify(this, null, 2)
    if (!gameStateJson) {
      return false
    }

    writeFileSync(GAMESTATE_FILENAME, gameStateJson, 'utf8')

    return true
  }

  initRooms() {
    const roomsContent = loadFile<any>('rooms.json')
    if (!roomsContent) {
      // TODO: Move error check
      throw Error(`Can not load game content: rooms.json`)
    }
    this.rooms = roomsContent
  }
}
