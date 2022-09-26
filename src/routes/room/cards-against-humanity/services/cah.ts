import { grey } from '@mui/material/colors'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { createPlayer, createRoom, getRoomInfo, updatePlayer } from '../../../../services/firebase'

import { blackCardsData } from './black-cards'
import { whiteCardsData } from './white-cards'

export type ICAHPlayer = {
  id: string
  points: number
  name: string
  color: string
  master: boolean
  phase: string
  drawer: boolean
  currentWhites: string[]
}

export const CAHNewGame = (roomId: string, playerId: string, name: string, color: string) => {
  CAHRoom(roomId)
  CAHPlayer(roomId, playerId, name, color, true, true)
}

export const CAHRoom = (roomId: string) => {
  const roomData = {
    id: roomId,
    game: 'cah',
    title: 'Cards Against Humanity',
    color: grey[900],
    minPlayer: 4,
    maxPlayer: 10,
    numOfPlayers: 1,
    phase: 'wait',
    blackCards: blackCardsData,
    whiteCards: whiteCardsData,
    currentBlack: '',
    currentWhites: [],
    choseCard: '',
  }
  createRoom(roomId, roomData)
}

export const CAHPlayer = (
  roomId: string,
  playerId: string,
  name: string,
  color: string,
  master = false,
  drawer = false
) => {
  const playerData = {
    id: playerId,
    points: 0,
    name: name,
    color: color,
    master,
    drawer,
    phase: master === true ? 'ready' : 'wait',
    currentWhites: [],
  }
  createPlayer(roomId, playerId, playerData)
}

export const CAHStart = async (roomId: string) => {
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: ICAHPlayer[] = createArrayFromObject(snapshot)
  players.forEach((player) => {
    if (player.drawer) {
      updatePlayer(roomId, player.id, { phase: 'draw' })
    }
  })
}
