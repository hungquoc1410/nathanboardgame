import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { IRoomPlayers, updatePlayer, updateRoom } from '../../../../services/firebase'

import { cardsData } from './cards'

export type IDIXITRoom = {
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
  players: { [x: string]: IDIXITPlayer }
}

export type IDIXITPlayer = {
  id: string
  points: number
  name: string
  color: string
  master: boolean
  phase: string
  answer: string
  teller: boolean
}

export const DIXITNewGame = (roomId: string, playersData: IRoomPlayers) => {
  playersData.forEach((player) => {
    updatePlayer(roomId, player.id, { answer: '', points: 0, teller: false, phase: 'ready' })
  })
  updateRoom(roomId, { words: cardsData, current: '', phase: 'play' })
}

export const DIXITRoomPlay = (roomData: IDIXITRoom) => {
  updateRoom(roomData.id, { phase: 'prompt' })
}

export const DIXITRoomPrompt = (roomData: IDIXITRoom) => {
  const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)
  const hasTeller = players.filter((player) => player.teller)
  if (hasTeller.length === 0) {
    const currentMaster = players.filter((player) => player.master)[0]
    updatePlayer(roomData.id, currentMaster.id, { teller: true })
  } else {
    const currentTeller = hasTeller[0]
    const nextTellerIndex = players.indexOf(currentTeller)
    players.forEach((player, index) => {
      if (index === nextTellerIndex) {
        updatePlayer(roomData.id, player.id, { teller: true })
      } else {
        updatePlayer(roomData.id, player.id, { teller: false })
      }
    })
  }
}
