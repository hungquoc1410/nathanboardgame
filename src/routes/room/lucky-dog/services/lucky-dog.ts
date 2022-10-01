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
  dice: number[]
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

  updateRoom(id, { deck: newDeck, phase: 'player', turn: newTurn })
}

const getCurrentPlayer = (roomData: ILDRoom) => {
  const { turn } = roomData
  const players: ILDPlayer[] = createArrayFromObject(roomData.players)
  const player = players[turn - 1]
  return player.id
}

export const LDPlayerRollDice = (roomData: ILDRoom) => {
  const newDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1)
  const turnId = getCurrentPlayer(roomData)
  updatePlayer(roomData.id, turnId, { phase: 'first' })
  updateRoom(roomData.id, { dice: newDice })
}

export const LDPlayerReRollDice = (roomData: ILDRoom) => {
  const newDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1)
  const turnId = getCurrentPlayer(roomData)
  updatePlayer(roomData.id, turnId, { phase: 'second' })
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
