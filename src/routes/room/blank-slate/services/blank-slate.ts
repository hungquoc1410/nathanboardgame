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

export type IBSPlayer = {
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

export const BSRoomPlay = async (roomId: string) => {
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: IBSPlayer[] = createArrayFromObject(snapshot)
  players.forEach((player) => {
    if (player.phase !== 'ready') {
      updatePlayer(roomId, player.id, { phase: 'ready' })
    }
  })
}

export const BSRoomStart = async (roomId: string) => {
  const words = await getRoomInfo(roomId, 'words')
  const newWords = _.shuffle(words)
  const word = newWords.splice(0, 1)[0]
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: IBSPlayer[] = createArrayFromObject(snapshot)
  players.forEach((player) => updatePlayer(roomId, player.id, { phase: 'answer' }))
  updateRoom(roomId, { current: word, words: newWords, phase: 'answer' })
}

export const BSRoomPoint = async (roomId: string) => {
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: IBSPlayer[] = createArrayFromObject(snapshot)
  const allAnswers = players.map((player) => player.answer)
  players.forEach((player) => {
    if (player.phase === 'submit') {
      const repeatTimes = allAnswers.filter((answer) => answer === player.answer).length
      switch (repeatTimes) {
        case 1:
          updatePlayer(roomId, player.id, { phase: 'point' })
          break
        case 2:
          updatePlayer(roomId, player.id, { phase: 'point', points: player.points + 3 })
          break
        default:
          updatePlayer(roomId, player.id, { phase: 'point', points: player.points + 1 })
          break
      }
    }
  })
}

export const BSRoomEnd = async (roomId: string) => {
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: IBSPlayer[] = createArrayFromObject(snapshot)
  const allPoints = players.map((player) => player.points)
  const maxPoint = Math.max(...allPoints)
  if (maxPoint < 7) {
    updateRoom(roomId, { phase: 'play' })
  } else {
    players.forEach((player) => {
      if (player.phase === 'point') {
        updatePlayer(roomId, player.id, { phase: 'end' })
      }
    })
    updateRoom(roomId, { phase: 'end' })
  }
}

export const BSReset = async (roomId: string) => {
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: IBSPlayer[] = createArrayFromObject(snapshot)
  players.forEach((player) => {
    updatePlayer(roomId, player.id, { points: 0, answer: '', phase: 'ready' })
  })
  updateRoom(roomId, { words: wordsData, current: '' })
}

export const BSPlayerPhase = async (roomId: string, playerPhase: string, roomPhase: string) => {
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: IBSPlayer[] = createArrayFromObject(snapshot)
  const allSubmit = !players.map((player) => player.phase === playerPhase).includes(false)
  if (allSubmit) {
    updateRoom(roomId, { phase: roomPhase })
  }
}
