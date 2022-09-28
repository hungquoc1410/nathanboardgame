import _ from 'underscore'

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
  cards: string[]
  prompt: string
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
  cards: string[]
}

export const DIXITNewGame = (roomId: string, playersData: IRoomPlayers) => {
  playersData.forEach((player) => {
    updatePlayer(roomId, player.id, {
      answer: '',
      points: 0,
      teller: false,
      phase: 'ready',
      cards: [],
    })
  })
  updateRoom(roomId, { cards: cardsData, prompt: '', phase: 'play' })
}

export const DIXITRoomDivide = (roomData: IDIXITRoom) => {
  const roomCards = roomData.cards
  const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)
  const allPlayerCards = players.map((player) => player.cards).flat()
  const remainingCards = _.difference(roomCards, allPlayerCards)
  const allReceive = !players.map((player) => player.phase === 'receive').includes(false)
  if (allReceive) {
    updateRoom(roomData.id, { phase: 'prompt', cards: remainingCards })
  } else {
    players.forEach((player) => {
      if (player.phase === 'ready') {
        const playerCards = player.cards
        let newCards: string[]
        if (playerCards) {
          const cardNeeded = 6 - playerCards.length
          newCards = playerCards.concat(_.shuffle(remainingCards).splice(0, cardNeeded))
        } else {
          newCards = _.shuffle(remainingCards).splice(0, 6)
        }
        updatePlayer(roomData.id, player.id, { cards: newCards, phase: 'receive' })
      }
    })
  }
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
