import _ from 'underscore'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { IRoomPlayers, updatePlayer, updateRoom } from '../../../../services/firebase'

import { cardsData } from './cards'

export type ILDRoom = {
  id: string
  game: string
  title: string
  color: string
  minPlayer: number
  maxPlayer: number
  numOfPlayers: number
  phase: string
  cards: string[]
  turn: number
  dice: { fixed: boolean; value: number }[]
  deck: string[]
  players: { [x: string]: ILDPlayer }
}

export type ILDPlayer = {
  id: string
  points: number
  name: string
  color: string
  master: boolean
  phase: string
}

export const LDNewGame = (roomId: string, playersData: IRoomPlayers) => {
  playersData.forEach((player) => {
    updatePlayer(roomId, player.id, { points: 0, phase: 'ready' })
  })
  updateRoom(roomId, {
    cards: cardsData,
    phase: 'play',
    turn: 0,
    dice: [],
    deck: [],
  })
}

export const LDRoomPlay = (roomData: ILDRoom) => {
  const { cards, deck, id, turn, maxPlayer } = roomData
  let newDeck: string[]
  if (deck) {
    newDeck = deck.concat(_.shuffle(cards).splice(0, 5 - deck.length))
  } else {
    newDeck = _.shuffle(cards).splice(0, 5)
  }
  let newTurn: number
  if (turn === maxPlayer) {
    newTurn = 1
  } else {
    newTurn = turn + 1
  }
  const newDice = Array(5).fill({ fixed: false, value: 0 })
  updateRoom(id, { deck: newDeck, phase: 'player', turn: newTurn, dice: newDice })
}

const getCurrentPlayer = (roomData: ILDRoom) => {
  const { turn } = roomData
  const players: ILDPlayer[] = createArrayFromObject(roomData.players)
  const player = players[turn - 1]
  return player.id
}

export const LDPlayerRollDice = (roomData: ILDRoom, reroll = false) => {
  const turnId = getCurrentPlayer(roomData)
  if (reroll) {
    updatePlayer(roomData.id, turnId, { phase: 'second' })
  } else {
    updatePlayer(roomData.id, turnId, { phase: 'first' })
  }
  const { dice } = roomData
  const newDice: { fixed: boolean; value: number }[] = []
  dice.forEach((die) => {
    if (die.fixed) {
      newDice.push({ fixed: true, value: die.value })
    } else {
      newDice.push({ fixed: false, value: Math.floor(Math.random() * 6) + 1 })
    }
  })
  updateRoom(roomData.id, { dice: newDice })
}

export const LDPlayerDiscard = (roomData: ILDRoom, chose: string) => {
  const { cards, deck } = roomData
  const index = deck.indexOf(chose)
  deck.splice(index, 1)
  const newDeck = deck.concat(_.shuffle(cards).splice(0, 1))
  const turnId = getCurrentPlayer(roomData)
  updatePlayer(roomData.id, turnId, { phase: 'second' })
  updateRoom(roomData.id, { deck: newDeck })
}

export const LDToggleFixedDice = (roomData: ILDRoom, index: number) => {
  const { dice } = roomData
  const die = dice[index]
  const newDie = { fixed: !die.fixed, value: die.value }
  dice[index] = newDie
  updateRoom(roomData.id, { dice: dice })
}
