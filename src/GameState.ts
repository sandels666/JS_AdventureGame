import { TYPE_WEAPON, TYPE_CONSUMABLE, TYPE_SHIELD } from "./index"
import { existsSync, readFileSync, writeFileSync } from "fs"

const GAMESTATE_FILENAME = 'gamestate.json'

export default class GameState {
  rooms: any
  playerCurrentRoom: any
  playerItems: any[]
  playerHealth: number
  godmode: boolean

  constructor() {
    if (this.load()) {
      return
    }

    this.initRooms()
    this.playerCurrentRoom = this.rooms["Bob"]
    this.playerItems = []
    this.playerHealth = 100
    this.godmode = false
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

    for(const prop in gameState) {
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
    this.rooms = {}
    this.rooms["Bob"] = {
      name: "Bob's Bedroom",
      items: [
        {
          name: 'Bronze Sword',
          damage: 25,
          weight: 3000,
          type: TYPE_WEAPON,
        },
        {
          name: 'Water Bottle',
          weight: 300,
          type: TYPE_CONSUMABLE,
          heals: 10,
        }
      ],
      connectedRooms: [
        "Anna"
      ],
      description: 
    `As you look around the room, you notice that it quite resembles the bedroom 
you had when you were a child. I wonder if that's a coincidence..?`,
    }
    this.rooms["Anna"] = {
      name: "Anna's Bedroom",
      items: [
        {
          name: 'Shield',
          armor: 34,
          weight: 4000,
          type: TYPE_SHIELD,
        }
      ],
      monster: {
        name: "Angry Bill",
        health: 100,
        damage: 10,
        drops:
          {
            name: 'Steel sword',
            damage: 35,
            weight: 2000,
            type: TYPE_WEAPON,
          }
      },
      connectedRooms: [
        "Bob",
        "Attic"
      ],
      description: 
    `Why are you looking around a little girl's bedroom? Are you a pedophile? o.O`,
    }
    this.rooms["Attic"] = {
      name: "Attic",
      items: [
        {
          name: 'Health potion',
          weight: 500,
          type: TYPE_CONSUMABLE,
          heals: 50,
        }
      ],
      monster: {
        name: "Grue",
        health: 10000,
        damage: 10000,
        drops:
          {
            name: 'Liquid Anthrax',
            weight: 500,
            type: TYPE_CONSUMABLE,
            heals: -500,
          }
      },
      connectedRooms: [
        "Anna"
      ],
      description: 
    `It's creepy as fuck in here. You can vaguely spot a grue lurking in the shadows.
You probably shouldn't try attacking it...`,
    }
  }
}
