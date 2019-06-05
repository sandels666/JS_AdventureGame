import * as readline from 'readline'
import GameState from './GameState'
import * as Actions from './Actions'

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
// Item Types
////////////////////////////////////

export enum ItemType {
  Weapon = 'Weapon',
  Shield = 'Shield',
  Armor = 'Armor',
  Consumable = 'Consumable',
}

////////////////////////////////////
// Game State
////////////////////////////////////
const gameState = new GameState()

////////////////////////////////////
// Game UI
////////////////////////////////////

function printUI() {
  if (gameState.getPlayerCurrentRoom()) {
    console.log(`Room: ${gameState.getPlayerCurrentRoom().name}`)
  }

  if (gameState.playerItems.length > 0) {
    console.log(`Inventory: ${gameState.playerItems.map(item => `\n\t${item.name}`)}`)
  }

  if (gameState.getPlayerCurrentRoom() && gameState.getPlayerCurrentRoom().monster) {
    console.log(
      `\x1b[33m%s\x1b[0m`,
      `\nMonster: ${gameState.getPlayerCurrentRoom().monster.name} (${
        gameState.getPlayerCurrentRoom().monster.health
      }HP)`,
    )
  }

  if (gameState.playerHealth > 0 || gameState.godmode) {
    console.log(`Your health: ${gameState.playerHealth}HP`)
  } else {
    gameEnd()
  }
}

function clearScreen() {
  process.stdout.write('\u001b[2J\u001b[0;0H')
}

function gameStart() {
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
}

function gameEnd() {
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n--> ',
})

////////////////////////////////////
// Gameplay
////////////////////////////////////

clearScreen()
gameStart()

rl.prompt()
rl.on('line', line => {
  line = line.trim()
  const words = line.split(' ')
  const args = words.slice(1)

  clearScreen()

  Actions.dispatch(gameState, words[0], args)

  printUI()

  rl.prompt()
}).on('close', () => {
  process.exit(0)
})
