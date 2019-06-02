
const readline = require("readline")
const utils = require('./utils')

// const x = utils.myFunc()
// console.log(x)


/////////////////TODO:////////////////////////
//
// -Technical:
//   -Save states
//   -Modulizing functions to another file
//   -Clear screen after each input (properly)
// -Gameplay:
//   -Armor/shield system (reduces incoming damage)
//   -Armor/shield swapping
// -Content:
//   -More rooms
//   -More monsters
//   -More items
//   -More story/choices
//
//////////////////////////////////////////////


////////////////////////////////////
// Game Intro and Item Types
////////////////////////////////////
console.log("\nYou wake up. You're laying on the floor of a kid's bedroom.")
console.log("You have no memory of any previous events.")
console.log("\nYou find a note on the ground with some instructions written on it. The note says:")
console.log("\n\tWelcome to AdventureGame(TM) by Sandels Entertainment!")
console.log("\tYou can look around by typing 'look'. You can pick up and drop items by typing 'pick' or 'drop' and the item's name.")
console.log("\tYou can move to different rooms by typing 'move' and the room's name. You can attack by typing 'attack'.")
console.log("\tYou can use consumable items by typing 'eat' or 'drink' and the item's name.")
console.log("\tYou can view this note again by typing 'help' at any time!")
console.log("\n\tEnjoy the game!\n")

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
  ]
}


rooms["Attic"] = {
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
    move(args)
  },

  pickup: args => {
    pickup(args)
  },

  drop: args => {
    drop(args)
  },

  eat: args => {
    eat(args)
  },

  observe: _ => {
    observe()
  },

  help: _ => {
    help()
  },

  attack: args => {
    attack(args)
  },

  tgm: _ => {
    tgm()
  },

  examine: args => {
    examine(args)
  },

}


function move(args){
  const targetRoom = args[0]
  if (playerCurrentRoom.connectedRooms.indexOf(targetRoom) != -1) {
    playerCurrentRoom = rooms[targetRoom]
  } else {
    console.log('I can not get there from here.')
  }
}


function pickup(args){
  const targetItem = args.join(" ")
  const roomItemIndex = playerCurrentRoom.items.findIndex(item => item.name.toLowerCase() === targetItem.toLowerCase())
  const roomItem = playerCurrentRoom.items[roomItemIndex]

  if (roomItem) {

    const playerWeaponIndex = playerItems.findIndex(item => item.type === TYPE_WEAPON)
    const playerWeapon = playerItems[playerWeaponIndex]
    const roomItemIsWeapon = roomItem.type === TYPE_WEAPON

    //if player already has a weapon and the room item is a weapon
    if (playerWeaponIndex !== -1 && roomItemIsWeapon){
      //-> drop previous weapon and pick up new one
      console.log(`\nYou dropped a ${playerWeapon.name}`)
      playerCurrentRoom.items.push(playerWeapon)
      playerItems.splice(playerWeaponIndex, 1) 
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
}


function eat(args){
  const targetItemName = args.join(" ")
  const itemIndex = playerItems.findIndex(item => item.name.toLowerCase() === targetItemName.toLowerCase())
  
  if (itemIndex === -1) {
    console.log('You do not have that item.')
    return
  }

  // Item does exist
  const item = playerItems[itemIndex]
  
  if (item.type !== TYPE_CONSUMABLE) {
    console.log('That item is not consumable.')
    return
  }

  // Item is a consumable
  const heals = item.heals
  playerHealth += heals
  console.log(`\nYou have consumed ${item.name} and have been healed ${heals}HP.\n`)

  // Destroy item
  playerItems.splice(itemIndex, 1)
}


function drop(args){
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
}


function observe(){
  if (playerCurrentRoom.items){
    console.log(`Room Items: ${playerCurrentRoom.items.map(item => `\n\t${item.name}`)}`)
  }
  if (playerCurrentRoom.connectedRooms) {
    console.log(`Connected rooms: ${playerCurrentRoom.connectedRooms.join(", ")}`)
  }
}


function help(){
  console.log("\n\tWelcome to AdventureGame(TM) by Sandels Entertainment!")
  console.log("\tYou can look around by typing 'look'. You can pick up and drop items by typing 'pick' or 'drop' and the item's name.")
  console.log("\tYou can move to different rooms by typing 'move' and the room's name. You can attack by typing 'attack'.")
  console.log("\tYou can view this note again by typing 'help' at any time!")
  console.log("\n\tEnjoy the game!\n")
}


function attack(args){
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
}


function tgm (){
  if (godmode == false){
    console.log('\x1b[31m%s\x1b[0m','\nGod mode enabled! \nYou have gained mysterious superpowers...\n')
    godmode = true
  }
  else {
    console.log('\x1b[31m%s\x1b[0m','\nGod mode disabled. \nYou have lost your superpowers.\n')
    godmode = false
  }

}


function examine (args) {
  const targetName = args.join(" ")
  console.log('')

  //searches player items to see if player has an item by that name
  const itemIndex = playerItems.findIndex(item => item.name.toLowerCase() === targetName.toLowerCase())
  if (itemIndex === -1) {

    //searches current room's monsters to see if there's a monster by that name
    const monster = playerCurrentRoom.monster.name.toLowerCase() === targetName.toLowerCase()
    if (!monster){

      console.log(`There's no item or monster by that name.`)
      return

    }
    else { //monster exists by that name
      for (var property in playerCurrentRoom.monster){
        if (playerCurrentRoom.monster.hasOwnProperty(property)){
          if (property != "drops"){
            console.log(property + ': ' + playerCurrentRoom.monster[property])
          }
        }
      }
    }

  }
  else { //item in player's inventory exists by that name
    const item = playerItems[itemIndex]
    //console.log(`\nName: ${item.name}\nWeight: ${item.weight}g\nHeals: ${item.heals}HP\n`)   //TODO

    for (var property in item){
      if (item.hasOwnProperty(property)){
        if (property != "type"){
          console.log(property + ': ' + item[property])
        }
      }
    }
  }

  console.log('')

}


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
    'drink',
    'consume',
    'gulp',
  ].indexOf(command) != -1) {
    return 'eat'
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

//console.clear()