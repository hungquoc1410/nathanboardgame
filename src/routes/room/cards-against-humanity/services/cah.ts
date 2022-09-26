import { grey } from '@mui/material/colors'

import { createPlayer, createRoom } from '../../../../services/firebase'

export type ICAHPlayer = {
  id: string
  points: number
  name: string
  color: string
  master: boolean
  phase: string
  currentWhites: string[]
}

export const CAHNewGame = (roomId: string, playerId: string, name: string, color: string) => {
  CAHRoom(roomId)
  CAHPlayer(roomId, playerId, name, color, true)
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
    blackCards: [],
    whiteCards: [],
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
  master = false
) => {
  const playerData = {
    id: playerId,
    points: 0,
    name: name,
    color: color,
    master,
    phase: master === true ? 'ready' : 'wait',
    currentWhites: [],
  }
  createPlayer(roomId, playerId, playerData)
}
