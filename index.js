const readline = require("readline")

const TYPE_WEAPON = 0
const TYPE_SHIELD = 1
const TYPE_ARMOR = 2
const TYPE_CONSUMABLE = 3


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
    damage: 10,
    drops:
      {
        name: 'Health potion',
        weight: 500,
        type: TYPE_CONSUMABLE,
        heals: 50,
      }
  },
  connectedRooms: [
    "Bob",
    "Attic"
  ]
}

rooms["Attic"] = {
  name: "Attic",
  items: [
    {
      name: 'Iron sword',
      damage: 35,
      weight: 2000,
      type: TYPE_WEAPON,
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
  ]
}

let playerCurrentRoom = rooms["Bob"]
let playerItems = []
let playerHealth = 100
let godmode = false


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
      const weapon = playerItems.find(item => item.type === TYPE_WEAPON) 
      //if player already has a weapon
      if (weapon){
        //-> drop previous weapon and pick up new one
        const playerItem = playerItems[weapon]
        //console.log(`\nYou dropped a ${playerItem.name}\n`)
        playerCurrentRoom.items.push(playerItem)
        playerItems.splice(playerItem, 1)
        ///////////////////////////////////////

        playerItems.push(roomItem)
        playerCurrentRoom.items.splice(roomItemIndex, 1)
        console.log(`\nYou picked up a ${roomItem.name}\n`)
      }
      else {
        playerItems.push(roomItem)
        playerCurrentRoom.items.splice(roomItemIndex, 1)
        console.log(`\nYou picked up a ${roomItem.name}\n`)
      }
      
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
      console.log(`\nYou dropped a ${playerItem.name}\n`)
    } else {
      console.log('You moron! You do not have that item!')
    }
  },

  eat: args => {
    const targetItem = args.join(" ")
    const consumable = playerItems.find(targetItem.type === TYPE_CONSUMABLE)   /////////////////////////////////////
    if (!consumable) {
      console.log(`\nYou can't eat a ${targetItem}!\n`)
      return
    }
    const playerItemIndex = playerItems.findIndex(item => item.name.toLowerCase() === targetItem.toLowerCase())
    const playerItem = playerItems[playerItemIndex]
    if (playerItem) {
      playerHealth = playerHealth + playerItem.heals
      playerItems.splice(playerItemIndex, 1)
      console.log(`\nYou consume ${playerItem.name}.`)
      console.log(`It heals you ${playerItem.heals}HP\n`)
    } else {
      console.log('You moron! You do not have that item!')
    }
  },

  observe: _ => {
    if (playerCurrentRoom.items){
      console.log(`Room Items: ${playerCurrentRoom.items.map(item => `\n\t${item.name}`)}`)
    }
    if (playerCurrentRoom.connectedRooms) {
      console.log(`Connected rooms: ${playerCurrentRoom.connectedRooms.join(", ")}`)
    }
  },

  help: _ => {
    console.log("\n\tWelcome to AdventureGame(TM) by Sandels Entertainment!")
    console.log("\tYou can look around by typing 'look'. You can pick up and drop items by typing 'pick' or 'drop' and the item's name.")
    console.log("\tYou can move to different rooms by typing 'move' and the room's name. You can attack by typing 'attack'.")
    console.log("\tYou can view this note again by typing 'help' at any time!")
    console.log("\n\tEnjoy the game!\n")
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

    if (godmode == true) {  //godmode-enabled attack properties
      const damage = 10000

      monster.health = monster.health - damage
      console.log(`\nYou attack the monster! You deal ${damage} damage.`)
    }
    else {  //regular attacking without godmode
      const type = args[0]
      const damage = type === 'slash' ? weapon.damage * 1.5 : weapon.damage

      monster.health = monster.health - damage
      console.log(`\nYou attack the monster! You deal ${damage} damage.`)
    }

    if(monster.health > 0){
      const monsterDamage = playerCurrentRoom.monster.damage

      if (godmode == false){  //regular monster attack
        playerHealth = playerHealth - monsterDamage
        console.log(`The monster attacks you back! You take ${monsterDamage} damage.\n`)
      }
      else { //godmode monster attack
        console.log(`The monster attacks you back, but fails to damage you due to your god-like status.\n`)
      }

    }
    else {
      console.log(`You killed the ${playerCurrentRoom.monster.name}! Nice job!\n`)
      if (playerCurrentRoom.monster.drops){  //monster loot drops
        playerCurrentRoom.items.push(playerCurrentRoom.monster.drops)
        console.log(`\x1b[32m%s\x1b[0m`,`The monster dropped ${playerCurrentRoom.monster.drops.name}!\n`)
      }
      delete playerCurrentRoom.monster
    }

  },

  tgm: _ => {
    if (godmode == false){
      console.log('\x1b[31m%s\x1b[0m','\nGod mode enabled! \nYou have gained mysterious superpowers...\n')
      godmode = true
    }
    else {
      console.log('\x1b[31m%s\x1b[0m','\nGod mode disabled. \nYou have lost your superpowers.\n')
      godmode = false
    }

  }

}


// function dropItem(){
//     const targetItem = playerItems.find(item => item.type === TYPE_WEAPON)
//     const playerItem = playerItems[targetItem]
//     if (playerItem) {
//       playerCurrentRoom.items.push(playerItem)
//       playerItems.splice(targetItem, 1)
//       console.log(`\nYou dropped a ${playerItem.name}\n`)
//     }
// }


////////////////////////////////////
// Game UI
////////////////////////////////////
function printUI() {
  if (playerCurrentRoom) {
    console.log(`Room: ${playerCurrentRoom.name}`)
  }

  if (playerItems.length > 0) {
    console.log(`Inventory: ${playerItems.map(item => `\n\t${item.name}`)}`)
  }

  if (playerCurrentRoom && playerCurrentRoom.monster) {
    console.log(`\x1b[33m%s\x1b[0m`,`\nMonster: ${playerCurrentRoom.monster.name} (${playerCurrentRoom.monster.health}HP)`)
  }

  if (playerHealth > 0 || godmode){
    console.log(`Your health: ${playerHealth}HP`)
  }
  else {
    playerDeath()
  }

}

function playerDeath() {
  console.log('\x1b[31m%s\x1b[0m',`\nYour health is ${playerHealth}HP.`)
  console.log('\x1b[31m%s\x1b[0m',`\nOh dear, you're dead!`)
  console.log('\x1b[31m%s\x1b[0m',`Better luck next time!`)
  //console.log(`\nDo you want to play again? (Y/N)`)
  console.log('\x1b[31m%s\x1b[0m',`The game will exit in 15 seconds.`)
  setTimeout(process.exit, 15000)
  
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
  if ([
    'halp',
    'helpme',
    'stuck',
  ].indexOf(command) != -1) {
    return 'help'
  }
  return command
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "\n--> ",
})

console.log("\nYou wake up. You're laying on the floor of a kid's bedroom.")
console.log("You have no memory of any previous events.")
console.log("\nYou find a note on the ground with some instructions written on it. The note says:")
console.log("\n\tWelcome to AdventureGame(TM) by Sandels Entertainment!")
console.log("\tYou can look around by typing 'look'. You can pick up and drop items by typing 'pick' or 'drop' and the item's name.")
console.log("\tYou can move to different rooms by typing 'move' and the room's name. You can attack by typing 'attack'.")
console.log("\tYou can view this note again by typing 'help' at any time!")
console.log("\n\tEnjoy the game!\n")
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
