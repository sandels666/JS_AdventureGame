import GameState from './GameState'
import { ItemType } from './index'

function save(gameState: GameState, args: string[]) {
  if (gameState.save()) {
    console.log('Game saved!')
  }
}

function move(gameState: GameState, args: string[]) {
  const targetRoom = args[0]
  if (gameState.getPlayerCurrentRoom().connectedRooms.indexOf(targetRoom) != -1) {
    gameState.setPlayerCurrentRoom(targetRoom)
  } else {
    console.log('I can not get there from here.')
  }
}

function pickup(gameState: GameState, args: string[]) {
  const targetItem = args.join(' ')
  const roomItemIndex = gameState
    .getPlayerCurrentRoom()
    .items.findIndex(item => item.name.toLowerCase() === targetItem.toLowerCase())
  const roomItem = gameState.getPlayerCurrentRoom().items[roomItemIndex]

  if (roomItem) {
    const playerWeaponIndex = gameState.playerItems.findIndex(item => item.type === ItemType.Weapon)
    const playerWeapon = gameState.playerItems[playerWeaponIndex]
    const roomItemIsWeapon = roomItem.type === ItemType.Weapon

    //if player already has a weapon and the room item is a weapon
    if (playerWeaponIndex !== -1 && roomItemIsWeapon) {
      //-> drop previous weapon and pick up new one
      console.log(`\nYou dropped a ${playerWeapon.name}`)
      gameState.getPlayerCurrentRoom().items.push(playerWeapon)
      gameState.playerItems.splice(playerWeaponIndex, 1)
      gameState.playerItems.push(roomItem)
      gameState.getPlayerCurrentRoom().items.splice(roomItemIndex, 1)

      console.log(`\nYou picked up a ${roomItem.name}\n`)
    } else {
      gameState.playerItems.push(roomItem)
      gameState.getPlayerCurrentRoom().items.splice(roomItemIndex, 1)
      console.log(`\nYou picked up a ${roomItem.name}\n`)
    }
  } else {
    console.log('You moron! That item is not in this room!')
  }
}

function eat(gameState: GameState, args: string[]) {
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

  if (item.type !== ItemType.Consumable) {
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

function drop(gameState: GameState, args: string[]) {
  const targetItem = args.join(' ')
  const playerItemIndex = gameState.playerItems.findIndex(
    item => item.name.toLowerCase() === targetItem.toLowerCase(),
  )
  const playerItem = gameState.playerItems[playerItemIndex]
  if (playerItem) {
    gameState.getPlayerCurrentRoom().items.push(playerItem)
    gameState.playerItems.splice(playerItemIndex, 1)
    console.log(`\nYou dropped a ${playerItem.name}\n`)
  } else {
    console.log('You moron! You do not have that item!')
  }
}

function observe(gameState: GameState) {
  if (gameState.getPlayerCurrentRoom().items) {
    console.log(
      `Room Items: ${gameState.getPlayerCurrentRoom().items.map(item => `\n\t${item.name}`)}`,
    )
  }
  if (gameState.getPlayerCurrentRoom().connectedRooms) {
    console.log(`Connected rooms: ${gameState.getPlayerCurrentRoom().connectedRooms.join(', ')}`)
  }
  if (gameState.getPlayerCurrentRoom().description) {
    console.log(`\n\x1b[34m%s\x1b[0m`, gameState.getPlayerCurrentRoom().description, `\n`)
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

function attack(gameState: GameState, args: string[]) {
  const weapon = gameState.playerItems.find(item => item.type === ItemType.Weapon)
  if (!weapon) {
    console.log('You do not have a weapon!')
    return
  }

  const monster = gameState.getPlayerCurrentRoom().monster
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
    const monsterDamage = gameState.getPlayerCurrentRoom().monster.damage

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
    console.log(`You killed the ${gameState.getPlayerCurrentRoom().monster.name}! Nice job!\n`)
    if (gameState.getPlayerCurrentRoom().monster.drops) {
      //monster loot drops
      gameState.getPlayerCurrentRoom().items.push(gameState.getPlayerCurrentRoom().monster.drops)
      console.log(
        `\x1b[32m%s\x1b[0m`,
        `The monster dropped ${gameState.getPlayerCurrentRoom().monster.drops.name}!\n`,
      )
    }
    delete gameState.getPlayerCurrentRoom().monster
  }
}

function tgm(gameState: GameState) {
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

function examine(gameState: GameState, args: string[]) {
  const targetName = args.join(' ')
  console.log('')

  //searches player items to see if player has an item by that name
  const itemIndex = gameState.playerItems.findIndex(
    item => item.name.toLowerCase() === targetName.toLowerCase(),
  )
  if (itemIndex === -1) {
    //searches current room's monsters to see if there's a monster by that name
    const monster =
      gameState.getPlayerCurrentRoom().monster.name.toLowerCase() === targetName.toLowerCase()
    if (!monster) {
      console.log(`There's no item or monster by that name.`)
      return
    } else {
      //monster exists by that name
      for (var property in gameState.getPlayerCurrentRoom().monster) {
        if (gameState.getPlayerCurrentRoom().monster.hasOwnProperty(property)) {
          if (property != 'drops') {
            console.log(property + ': ' + gameState.getPlayerCurrentRoom().monster[property])
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

export function dispatch(gameState: GameState, command: string, args: string[]): any {
  if (['save'].includes(command)) {
    return save(gameState, args)
  }

  if (['take', 'pick', 'collect', 'grab', 'pickup'].includes(command)) {
    return pickup(gameState, args)
  }

  if (['look', 'search', 'observe'].includes(command)) {
    return observe(gameState)
  }

  if (['go', 'goto', 'walk', 'move'].includes(command)) {
    return move(gameState, args)
  }

  if (['enablecheats', 'cheats', 'cheat', 'godmode', 'tgm'].includes(command)) {
    return tgm(gameState)
  }

  if (['discard', 'abandon', 'dismiss', 'drop'].includes(command)) {
    return drop(gameState, args)
  }

  if (['drink', 'consume', 'gulp', 'eat'].includes(command)) {
    return eat(gameState, args)
  }

  if (['attack'].includes(command)) {
    return attack(gameState, args)
  }

  if (['examine'].includes(command)) {
    return examine(gameState, args)
  }

  if (['halp', 'helpme', 'stuck', 'help'].includes(command)) {
    return help()
  }

  return undefined
}
