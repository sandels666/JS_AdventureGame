import { TYPE_WEAPON, TYPE_CONSUMABLE, TYPE_SHIELD } from "./index"

export default class GameState {
  rooms: any
  playerCurrentRoom: any
  playerItems: any[]
  playerHealth: number
  godmode: boolean

  constructor() {
    this.initRooms()
    this.playerCurrentRoom = this.rooms["Bob"]
    this.playerItems = []
    this.playerHealth = 100
    this.godmode = false
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
