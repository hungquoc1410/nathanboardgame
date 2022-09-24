import { grey } from '@mui/material/colors'

import { createPlayer, createRoom } from '../../../../services/firebase'

import { wordsData } from './words'

export const BLNewGame = (roomId: string, playerId: string, name: string, color: string) => {
  BSRoom(roomId)
  BSPlayer(roomId, playerId, name, color, true)
}

export const BSRoom = (roomId: string) => {
  const roomData = {
    id: roomId,
    game: 'bs',
    title: 'Blank Slate',
    color: grey[500],
    minPlayer: 3,
    maxPlayer: 8,
    words: wordsData,
    current: '',
    round: 0,
    numOfPlayers: 1,
    phase: 'waiting',
  }
  createRoom(roomId, roomData)
}

export const BSPlayer = (
  roomId: string,
  playerId: string,
  name: string,
  color: string,
  master = false
) => {
  const playerData = {
    id: playerId,
    points: 0,
    answer: '',
    name: name,
    color: color,
    master,
    phase: 'waiting',
  }
  createPlayer(roomId, playerId, playerData)
}
