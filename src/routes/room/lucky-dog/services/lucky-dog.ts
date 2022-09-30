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
  discards: string[]
  dice: number[]
  decK: string[]
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
    discards: [],
    dice: [],
    deck: [],
  })
}
