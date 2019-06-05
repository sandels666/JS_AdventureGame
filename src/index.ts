import * as readline from 'readline'
import GameState from './GameState'

/////////////////TODO:////////////////////////
//
// -Technical:
//   -Save states
//   -Clear screen after each input (properly)
// -Gameplay:
//   -Armor/shield system (reduces incoming damage)
//   -Armor/shield swapping
// -Content:
//   -More rooms
//   -More monsters
//   -More items
//   -More story/choices
//   -Rules of the game explained to player (more in-depth 'help' function)
//
//////////////////////////////////////////////

////////////////////////////////////
// Game Intro and Item Types
////////////////////////////////////

console.log("\nYou wake up. You're laying on the floor of a kid's bedroom.")
console.log('You have no memory of any previous events.')
console.log('\nYou find a note on the ground with some instructions written on it. The note says:')
console.log('\n\tWelcome to AdventureGame(TM) by Sandels Entertainment!')
console.log(
  "\tYou can look around by typing 'look'. You can pick up and drop items by typing 'pick' or 'drop' and the item's name.",
)
console.log(
  "\tYou can move to different rooms by typing 'move' and the room's name. You can attack by typing 'attack'.",
)
console.log("\tYou can use consumable items by typing 'eat' or 'drink' and the item's name.")
console.log("\tYou can view this note again by typing 'help' at any time!")
console.log('\n\tEnjoy the game!\n')

export const TYPE_WEAPON = 0
export const TYPE_SHIELD = 1
export const TYPE_ARMOR = 2
export const TYPE_CONSUMABLE = 3

////////////////////////////////////
// Game State
////////////////////////////////////
const gameState = new GameState()

////////////////////////////////////
// Game Functionality
////////////////////////////////////
function save(args) {
  if (gameState.save()) {
    console.log('Game saved!')
  }
}

function move(args) {
  const targetRoom = args[0]
  if (gameState.playerCurrentRoom.connectedRooms.indexOf(targetRoom) != -1) {
    gameState.playerCurrentRoom = gameState.rooms[targetRoom]
  } else {
    console.log('I can not get there from here.')
  }
}

function pickup(args) {
  const targetItem = args.join(' ')
  const roomItemIndex = gameState.playerCurrentRoom.items.findIndex(
    item => item.name.toLowerCase() === targetItem.toLowerCase(),
  )
  const roomItem = gameState.playerCurrentRoom.items[roomItemIndex]

  if (roomItem) {
    const playerWeaponIndex = gameState.playerItems.findIndex(item => item.type === TYPE_WEAPON)
    const playerWeapon = gameState.playerItems[playerWeaponIndex]
    const roomItemIsWeapon = roomItem.type === TYPE_WEAPON

    //if player already has a weapon and the room item is a weapon
    if (playerWeaponIndex !== -1 && roomItemIsWeapon) {
      //-> drop previous weapon and pick up new one
      console.log(`\nYou dropped a ${playerWeapon.name}`)
      gameState.playerCurrentRoom.items.push(playerWeapon)
      gameState.playerItems.splice(playerWeaponIndex, 1)
      gameState.playerItems.push(roomItem)
      gameState.playerCurrentRoom.items.splice(roomItemIndex, 1)

      console.log(`\nYou picked up a ${roomItem.name}\n`)
    } else {
      gameState.playerItems.push(roomItem)
      gameState.playerCurrentRoom.items.splice(roomItemIndex, 1)
      console.log(`\nYou picked up a ${roomItem.name}\n`)
    }
  } else {
    console.log('You moron! That item is not in this room!')
  }
}

function eat(args) {
  const targetItemName = args.join(' ')
  const itemIndex = gameState.playerItems.findIndex(
    item => item.name.toLowerCase() === targetItemName.toLowerCase(),
  )

  if (itemIndex === -1) {
    console.log('You do not have that item.')
    return
  }

  // Item does exist
  const item = gameState.playerItems[itemIndex]

  if (item.type !== TYPE_CONSUMABLE) {
    console.log('That item is not consumable.')
    return
  }

  // Item is a consumable
  const heals = item.heals
  gameState.playerHealth += heals
  console.log(`\nYou have consumed ${item.name} and have been healed ${heals}HP.\n`)

  // Destroy item
  gameState.playerItems.splice(itemIndex, 1)
}

function drop(args) {
  const targetItem = args.join(' ')
  const playerItemIndex = gameState.playerItems.findIndex(
    item => item.name.toLowerCase() === targetItem.toLowerCase(),
  )
  const playerItem = gameState.playerItems[playerItemIndex]
  if (playerItem) {
    gameState.playerCurrentRoom.items.push(playerItem)
    gameState.playerItems.splice(playerItemIndex, 1)
    console.log(`\nYou dropped a ${playerItem.name}\n`)
  } else {
    console.log('You moron! You do not have that item!')
  }
}

function observe() {
  if (gameState.playerCurrentRoom.items) {
    console.log(`Room Items: ${gameState.playerCurrentRoom.items.map(item => `\n\t${item.name}`)}`)
  }
  if (gameState.playerCurrentRoom.connectedRooms) {
    console.log(`Connected rooms: ${gameState.playerCurrentRoom.connectedRooms.join(', ')}`)
  }
  if (gameState.playerCurrentRoom.description) {
    console.log(`\n\x1b[34m%s\x1b[0m`, gameState.playerCurrentRoom.description, `\n`)
  }
}

function help() {
  console.log('\n\tWelcome to AdventureGame(TM) by Sandels Entertainment!')
  console.log(
    "\tYou can look around by typing 'look'. You can pick up and drop items by typing 'pick' or 'drop' and the item's name.",
  )
  console.log(
    "\tYou can move to different rooms by typing 'move' and the room's name. You can attack by typing 'attack'.",
  )
  console.log("\tYou can view this note again by typing 'help' at any time!")
  console.log('\n\tEnjoy the game!\n')
}

function attack(args) {
  const weapon = gameState.playerItems.find(item => item.type === TYPE_WEAPON)
  if (!weapon) {
    console.log('You do not have a weapon!')
    return
  }

  const monster = gameState.playerCurrentRoom.monster
  if (!monster) {
    console.log('There is nothing to attack in this room!')
    return
  }

  if (gameState.godmode == true) {
    //godmode-enabled attack properties
    const damage = 10000

    monster.health = monster.health - damage
    console.log(`\nYou attack the monster! You deal ${damage} damage.`)
  } else {
    //regular attacking without godmode
    const type = args[0]
    const damage = type === 'slash' ? weapon.damage * 1.5 : weapon.damage

    monster.health = monster.health - damage
    console.log(`\nYou attack the monster! You deal ${damage} damage.`)
  }

  if (monster.health > 0) {
    const monsterDamage = gameState.playerCurrentRoom.monster.damage

    if (gameState.godmode == false) {
      //regular monster attack
      gameState.playerHealth = gameState.playerHealth - monsterDamage
      console.log(`The monster attacks you back! You take ${monsterDamage} damage.\n`)
    } else {
      //godmode monster attack
      console.log(
        `The monster attacks you back, but fails to damage you due to your god-like status.\n`,
      )
    }
  } else {
    console.log(`You killed the ${gameState.playerCurrentRoom.monster.name}! Nice job!\n`)
    if (gameState.playerCurrentRoom.monster.drops) {
      //monster loot drops
      gameState.playerCurrentRoom.items.push(gameState.playerCurrentRoom.monster.drops)
      console.log(
        `\x1b[32m%s\x1b[0m`,
        `The monster dropped ${gameState.playerCurrentRoom.monster.drops.name}!\n`,
      )
    }
    delete gameState.playerCurrentRoom.monster
  }
}

function tgm() {
  if (gameState.godmode == false) {
    console.log(
      '\x1b[31m%s\x1b[0m',
      '\nGod mode enabled! \nYou have gained mysterious superpowers...\n',
    )
    gameState.godmode = true
  } else {
    console.log('\x1b[31m%s\x1b[0m', '\nGod mode disabled. \nYou have lost your superpowers.\n')
    gameState.godmode = false
  }
}

function examine(args) {
  const targetName = args.join(' ')
  console.log('')

  //searches player items to see if player has an item by that name
  const itemIndex = gameState.playerItems.findIndex(
    item => item.name.toLowerCase() === targetName.toLowerCase(),
  )
  if (itemIndex === -1) {
    //searches current room's monsters to see if there's a monster by that name
    const monster =
      gameState.playerCurrentRoom.monster.name.toLowerCase() === targetName.toLowerCase()
    if (!monster) {
      console.log(`There's no item or monster by that name.`)
      return
    } else {
      //monster exists by that name
      for (var property in gameState.playerCurrentRoom.monster) {
        if (gameState.playerCurrentRoom.monster.hasOwnProperty(property)) {
          if (property != 'drops') {
            console.log(property + ': ' + gameState.playerCurrentRoom.monster[property])
          }
        }
      }
    }
  } else {
    //item in player's inventory exists by that name
    const item = gameState.playerItems[itemIndex]
    //console.log(`\nName: ${item.name}\nWeight: ${item.weight}g\nHeals: ${item.heals}HP\n`)

    for (var property in item) {
      if (item.hasOwnProperty(property)) {
        if (property != 'type') {
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
  if (gameState.playerCurrentRoom) {
    console.log(`Room: ${gameState.playerCurrentRoom.name}`)
  }

  if (gameState.playerItems.length > 0) {
    console.log(`Inventory: ${gameState.playerItems.map(item => `\n\t${item.name}`)}`)
  }

  if (gameState.playerCurrentRoom && gameState.playerCurrentRoom.monster) {
    console.log(
      `\x1b[33m%s\x1b[0m`,
      `\nMonster: ${gameState.playerCurrentRoom.monster.name} (${
        gameState.playerCurrentRoom.monster.health
      }HP)`,
    )
  }

  if (gameState.playerHealth > 0 || gameState.godmode) {
    console.log(`Your health: ${gameState.playerHealth}HP`)
  } else {
    playerDeath()
  }
}

function playerDeath() {
  console.log('\x1b[31m%s\x1b[0m', `\nYour health is ${gameState.playerHealth}HP.`)
  console.log('\x1b[31m%s\x1b[0m', `\nOh dear, you're dead!`)
  console.log('\x1b[31m%s\x1b[0m', `Better luck next time!`)
  //console.log(`\nDo you want to play again? (Y/N)`)
  console.log('\x1b[31m%s\x1b[0m', `The game will exit in 15 seconds.`)
  setTimeout(process.exit, 15000)
}

////////////////////////////////////
// Game Input
////////////////////////////////////

function perform(command, args) {
  if (['save'].indexOf(command) != -1) {
    return save(args)
  }

  if (['take', 'pick', 'collect', 'grab', 'pickup'].indexOf(command) != -1) {
    return pickup(args)
  }

  if (['look', 'search', 'observe'].indexOf(command) != -1) {
    return observe()
  }

  if (['go', 'goto', 'walk', 'move'].indexOf(command) != -1) {
    return move(args)
  }

  if (['enablecheats', 'cheats', 'cheat', 'godmode', 'tgm'].indexOf(command) != -1) {
    return tgm()
  }

  if (['discard', 'abandon', 'dismiss', 'drop'].indexOf(command) != -1) {
    return drop(args)
  }

  if (['drink', 'consume', 'gulp', 'eat'].indexOf(command) != -1) {
    return eat(args)
  }

  if (['attack'].indexOf(command) != -1) {
    return attack(args)
  }

  if (['examine'].indexOf(command) != -1) {
    return examine(args)
  }

  if (['halp', 'helpme', 'stuck', 'help'].indexOf(command) != -1) {
    return help()
  }

  return undefined
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n--> ',
})

rl.prompt()
rl.on('line', line => {
  line = line.trim()
  const words = line.split(' ')
  const args = words.slice(1)

  process.stdout.write('\u001b[2J\u001b[0;0H') // Clear screen

  perform(words[0], args)

  printUI()

  rl.prompt()
}).on('close', () => {
  process.exit(0)
})
