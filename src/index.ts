import * as readline from 'readline'
import GameState from './GameState'
import * as Actions from './Actions'
import * as UserInterface from './UserInterface'

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

// State
const gameState = new GameState()

// Input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n--> ',
})

// Gameplay
UserInterface.clearScreen()
UserInterface.gameStart()

rl.prompt()
rl.on('line', line => {
  line = line.trim()
  const words = line.split(' ')
  const args = words.slice(1)

  UserInterface.clearScreen()
  Actions.dispatch(gameState, words[0], args)
  UserInterface.turn(gameState)

  rl.prompt()
}).on('close', () => {
  process.exit(0)
})
