import GameState from './GameState'

export function turn(gameState: GameState) {
  if (gameState.getPlayerCurrentRoom()) {
    console.log(`Room: ${gameState.getPlayerCurrentRoom().name}`)
  }

  if (gameState.playerItems.length > 0) {
    console.log(`Inventory: ${gameState.playerItems.map(item => `\n\t${item.name}`)}`)
  }

  if (gameState.getPlayerCurrentRoom() && gameState.getPlayerCurrentRoom().enemy) {
    console.log(
      `\x1b[33m%s\x1b[0m`,
      `\nEnemy: ${gameState.getPlayerCurrentRoom().enemy.name} (${
        gameState.getPlayerCurrentRoom().enemy.health
      }HP)`,
    )
  }

  if (gameState.playerHealth > 0 || gameState.godmode) {
    console.log(`Your health: ${gameState.playerHealth}HP`)
  } else {
    gameEnd(gameState)
  }
}

export function gameStart() {
  console.log("\nYou wake up. You're laying on the floor of an old dungeon cell.")
  console.log('You have no memory of any previous events.')
  console.log(
    '\nYou find a note on the ground with some instructions written on it. The note says:',
  )
  console.log('\n\tWelcome to dungeonDungeon(TM) by Sandels Entertainment!')
  console.log(
    "\tYou can look around by typing '\x1b[33mlook\x1b[0m'. You can pick up and drop items by typing '\x1b[33mpick\x1b[0m' or '\x1b[33mdrop\x1b[0m' and the item's name.",
  )
  console.log(
    "\tYou can move to different rooms by typing '\x1b[33mmove\x1b[0m' and the room's name. You can attack by typing '\x1b[33mattack\x1b[0m'.",
  )
  console.log("\tYou can use consumable items by typing '\x1b[33meat\x1b[0m' or '\x1b[33mdrink\x1b[0m' and the item's name.")
  console.log("\tYou can view this note again by typing '\x1b[33mhelp\x1b[0m' at any time!")
  console.log('\n\tEnjoy the game!\n')
  
/* "name": "Grue",
"health": 10000,
"damage": 10000,
"drops": {
  "name": "Liquid Anthrax",
  "weight": 500,
  "type": "Consumable",
  "heals": -500
  */
}

export function gameEnd(gameState: GameState) {
  console.log('\x1b[31m%s\x1b[0m', `\nYour health is ${gameState.playerHealth}HP.`)
  console.log('\x1b[31m%s\x1b[0m', `\nOh dear, you're dead!`)
  console.log('\x1b[31m%s\x1b[0m', `Better luck next time!`)
  //console.log(`\nDo you want to play again? (Y/N)`)
  console.log('\x1b[31m%s\x1b[0m', `The game will exit in 15 seconds.`)
  setTimeout(process.exit, 15000)
}

export function clearScreen() {
  process.stdout.write('\u001b[2J\u001b[0;0H')
}
