const readline = require("readline")

const TYPE_WEAPON = 0
const TYPE_SHIELD = 1
const TYPE_ARMOR = 2
const TYPE_MISC = 3


////////////////////////////////////
// Game State
////////////////////////////////////
let rooms = {}
rooms["Bob"] = {
  name: "Bob's Bedroom",
  items: [
    {
      name: 'Bronze Sword',
      damage: 25,
      weight: 2000,
      type: TYPE_WEAPON,
    },
    {
      name: 'Water Bottle',
      weight: 300,
      type: TYPE_MISC,
    }
  ],
  connectedRooms: [
    "Anna"
  ]
}

rooms["Anna"] = {
  name: "Anna's Bedroom",
  items: [
    {
      name: 'Shield',
      armour: 34,
      weight: 4000,
      type: TYPE_SHIELD,
    }
  ],
  monster: {
    name: "Angry Bill",
    health: 100,
  },
  connectedRooms: [
    "Bob",
    "Attic"
  ]
}

rooms["Attic"] = {
    name: "Attic",
    // items: [
    //   {
    //     name: 'Shield',
    //     armour: 34,
    //     weight: 4000,
    //     type: TYPE_SHIELD,
    //   }
    // ],
    monster: {
      name: "Grue",
      health: 10000,
    },
    connectedRooms: [
      "Anna"
    ]
  }

let playerCurrentRoom = rooms["Bob"]
let playerItems = []


////////////////////////////////////
// Game Functionality
////////////////////////////////////
const actions = {
  move: args => {
    const targetRoom = args[0]
    if (playerCurrentRoom.connectedRooms.indexOf(targetRoom) != -1) {
      playerCurrentRoom = rooms[targetRoom]
    } else {
      console.log('I can not get there from here.')
    }
  },
  pickup: args => {
    const targetItem = args.join(" ")
    const roomItemIndex = playerCurrentRoom.items.findIndex(item => item.name.toLowerCase() === targetItem.toLowerCase())
    const roomItem = playerCurrentRoom.items[roomItemIndex]
    if (roomItem) {
      playerItems.push(roomItem)
      playerCurrentRoom.items.splice(roomItemIndex, 1)
      console.log(`\nYou picked up a ${roomItem.name}\n`)  //////////////////////////////////////
    } else {
      console.log('You moron! That item is not in this room!')
    }
  },
  drop: args => {
    const targetItem = args.join(" ")
    const playerItemIndex = playerItems.findIndex(item => item.name.toLowerCase() === targetItem.toLowerCase())
    const playerItem = playerItems[playerItemIndex]
    if (playerItem) {
      playerCurrentRoom.items.push(playerItem)
      playerItems.splice(playerItemIndex, 1)
      console.log(`\nYou dropped a ${playerItem.name}\n`)  //////////////////////////////////////
    } else {
      console.log('You moron! You do not have that item!')
    }
  },
  observe: _ => {
    console.log(`Room Items: ${playerCurrentRoom.items.map(item => `\n\t${item.name}`)}`)
  },
  attack: args => {
    const weapon = playerItems.find(item => item.type === TYPE_WEAPON)
    if (!weapon) {
      console.log('You do not have a weapon!')
      return
    }

    const monster = playerCurrentRoom.monster
    if (!monster) {
      console.log('There is nothing to attack in this room!')
      return
    }

    const type = args[0]
    const damage = type === 'slash' ? weapon.damage * 1.5 : weapon.damage
    
    monster.health = monster.health - damage
  },
  tgm: _ => {
    console.log('\nGod mode enabled! \nYou have gained mysterious superpowers...\n')
  }

}


////////////////////////////////////
// Game UI
////////////////////////////////////
function printUI() {
  if (playerCurrentRoom) {
    console.log(`Room: ${playerCurrentRoom.name}`)
  }

  if (playerCurrentRoom.connectedRooms) {
      console.log(`Connected rooms: ${playerCurrentRoom.connectedRooms.join(", ")}`)
  }

  if (playerItems.length > 0) {
    console.log(`Inventory: ${playerItems.map(item => `\n\t${item.name}`)}`)
  }

  if (playerCurrentRoom && playerCurrentRoom.monster) {
    console.log(`Monster: ${playerCurrentRoom.monster.name} - ${playerCurrentRoom.monster.health}HP`)
  }
}


////////////////////////////////////
// Game Input
////////////////////////////////////
function mapCommand(command) {
  if ([
    'take',
    'pick',
    'collect',
    'grab',
  ].indexOf(command) != -1) {
    return 'pickup'
  }
  if ([
    'look',
    'search',
  ].indexOf(command) != -1) {
    return 'observe'
  }
  if ([
    'go',
    'goto',
    'walk',
  ].indexOf(command) != -1) {
    return 'move'
  }
  if ([
    'enablecheats',
    'cheats',
    'cheat',
    'godmode',
  ].indexOf(command) != -1) {
    return 'tgm'
  }
  if ([
    'discard',
    'abandon',
    'dismiss',
  ].indexOf(command) != -1) {
    return 'drop'
  }
  return command
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "\n--> ",
})
rl.prompt()
rl.on('line', (line) => {
  line = line.trim()
  const words = line.split(" ")
  const command = mapCommand(words[0])
  const args = words.slice(1)

  const action = actions[command.toLowerCase()]
  if (action) {
    action(args)
  }
  
  printUI()

  rl.prompt()
}).on('close', () => {
  process.exit(0)
})
