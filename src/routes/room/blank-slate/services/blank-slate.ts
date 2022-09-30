import _ from 'underscore'

import { IRoomPlayers, updatePlayer, updateRoom } from '../../../../services/firebase'

import { createArrayFromObject } from './../../../../services/create-array-from-object'
import { getInfo } from './../../../../services/localforage'
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
    updatePlayer(roomId, player.id, { answer: '', points: 0 })
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

export const BSRoomAnswer = (roomData: IBSRoom) => {
  const players: IBSPlayer[] = createArrayFromObject(roomData.players)
  const allSubmit = !players.map((player) => player.phase === 'submit').includes(false)
  if (allSubmit) {
    updateRoom(roomData.id, { phase: 'point' })
  }
}

export const BSRoomPoint = (roomData: IBSRoom) => {
  const players: IBSPlayer[] = createArrayFromObject(roomData.players)
  const allPoint = !players.map((player) => player.phase === 'point').includes(false)
  if (allPoint) {
    return updateRoom(roomData.id, { phase: 'end' })
  }
  const allAnswers = players.map((player) => player.answer)
  getInfo().then((value) => {
    if (value && value.playerId) {
      const player = players.filter((player) => player.id === value.playerId)[0]
      if (player.phase === 'submit') {
        const repeatTimes = allAnswers.filter((answer) => answer === player.answer).length
        if (repeatTimes === 1) {
          updatePlayer(roomData.id, player.id, { phase: 'point' })
        } else if (repeatTimes === 2) {
          updatePlayer(roomData.id, player.id, { phase: 'point', points: player.points + 3 })
        } else {
          updatePlayer(roomData.id, player.id, { phase: 'point', points: player.points + 1 })
        }
      }
    }
  })
}

export const BSRoomEnd = (roomData: IBSRoom) => {
  const players: IBSPlayer[] = createArrayFromObject(roomData.players)
  const allPoints = players.map((player) => player.points)
  const maxPoint = Math.max(...allPoints)
  if (maxPoint < 25) {
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

export const BSReset = (roomData: IBSRoom) => {
  const players: IBSPlayer[] = createArrayFromObject(roomData.players)
  players.forEach((player) => {
    updatePlayer(roomData.id, player.id, { points: 0, answer: '', phase: 'ready' })
  })
  updateRoom(roomData.id, { words: wordsData, current: '' })
}
