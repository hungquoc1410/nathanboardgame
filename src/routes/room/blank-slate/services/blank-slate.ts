import _ from 'underscore'

import { grey } from '@mui/material/colors'

import {
  createPlayer,
  createRoom,
  getRoomInfo,
  updatePlayer,
  updateRoom,
} from '../../../../services/firebase'

import { createArrayFromObject } from './../../../../services/create-array-from-object'
import { wordsData } from './words'

export type IBLPlayer = {
  id: string
  points: number
  answer: string
  name: string
  color: string
  master: boolean
  phase: string
}

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
    phase: 'wait',
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
    phase: master === true ? 'ready' : 'wait',
  }
  createPlayer(roomId, playerId, playerData)
}

export const BSPlay = async (roomId: string) => {
  const words = await getRoomInfo(roomId, 'words')
  const newWords = _.shuffle(words)
  const word = newWords.splice(0, 1)[0]
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: IBLPlayer[] = createArrayFromObject(snapshot)
  players.forEach((player) => updatePlayer(roomId, player.id, { phase: 'answer' }))
  updateRoom(roomId, { current: word, words: newWords, phase: 'answer' })
}

export const BSAnswer = async (roomId: string) => {
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: IBLPlayer[] = createArrayFromObject(snapshot)
  const allSubmit = !players.map((player) => player.phase === 'submit').includes(false)
  if (allSubmit) {
    updateRoom(roomId, { phase: 'point' })
  }
}
