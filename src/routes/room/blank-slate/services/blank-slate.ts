import _ from 'underscore'

import { getRoomInfo, IRoomPlayers, updatePlayer, updateRoom } from '../../../../services/firebase'

import { createArrayFromObject } from './../../../../services/create-array-from-object'
import { wordsData } from './words'

export type IBSRoom = {
  id: string
  game: string
  title: string
  color: string
  minPlayer: number
  maxPlayer: number
  numOfPlayers: number
  phase: string
  words: string[]
  current: string
  players: { [x: string]: IBSPlayer }
}

export type IBSPlayer = {
  id: string
  points: number
  name: string
  color: string
  master: boolean
  phase: string
  answer: string
}

export const BSNewGame = (roomId: string, playersData: IRoomPlayers) => {
  playersData.forEach((player) => {
    updatePlayer(roomId, player.id, { answer: '' })
  })
  updateRoom(roomId, { words: wordsData, current: '' })
}

export const BSRoomPlay = (roomData: IBSRoom) => {
  const players: IBSPlayer[] = createArrayFromObject(roomData.players)
  players.forEach((player) => {
    if (player.phase !== 'ready') {
      updatePlayer(roomData.id, player.id, { phase: 'ready' })
    }
  })
}

export const BSRoomStart = (roomData: IBSRoom) => {
  const words = roomData.words
  const newWords = _.shuffle(words)
  const word = newWords.splice(0, 1)[0]
  const players: IBSPlayer[] = createArrayFromObject(roomData.players)
  players.forEach((player) => updatePlayer(roomData.id, player.id, { phase: 'answer' }))
  updateRoom(roomData.id, { current: word, words: newWords, phase: 'answer' })
}

export const BSRoomPoint = (roomData: IBSRoom) => {
  const players: IBSPlayer[] = createArrayFromObject(roomData.players)
  const allAnswers = players.map((player) => player.answer)
  players.forEach((player) => {
    if (player.phase === 'submit') {
      const repeatTimes = allAnswers.filter((answer) => answer === player.answer).length
      switch (repeatTimes) {
        case 1:
          updatePlayer(roomData.id, player.id, { phase: 'point' })
          break
        case 2:
          updatePlayer(roomData.id, player.id, { phase: 'point', points: player.points + 3 })
          break
        default:
          updatePlayer(roomData.id, player.id, { phase: 'point', points: player.points + 1 })
          break
      }
    }
  })
}

export const BSRoomEnd = (roomData: IBSRoom) => {
  const players: IBSPlayer[] = createArrayFromObject(roomData.players)
  const allPoints = players.map((player) => player.points)
  const maxPoint = Math.max(...allPoints)
  if (maxPoint < 7) {
    updateRoom(roomData.id, { phase: 'play' })
  } else {
    players.forEach((player) => {
      if (player.phase === 'point') {
        updatePlayer(roomData.id, player.id, { phase: 'end' })
      }
    })
    updateRoom(roomData.id, { phase: 'end' })
  }
}

export const BSReset = async (roomData: IBSRoom) => {
  const players: IBSPlayer[] = createArrayFromObject(roomData.players)
  players.forEach((player) => {
    updatePlayer(roomData.id, player.id, { points: 0, answer: '', phase: 'ready' })
  })
  updateRoom(roomData.id, { words: wordsData, current: '' })
}

export const BSPlayerPhase = async (roomId: string, playerPhase: string, roomPhase: string) => {
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: IBSPlayer[] = createArrayFromObject(snapshot)
  const allSubmit = !players.map((player) => player.phase === playerPhase).includes(false)
  if (allSubmit) {
    updateRoom(roomId, { phase: roomPhase })
  }
}
