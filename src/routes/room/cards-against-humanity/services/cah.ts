import _ from 'underscore'

import { grey } from '@mui/material/colors'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import {
  createPlayer,
  createRoom,
  getRoomInfo,
  updatePlayer,
  updateRoom,
} from '../../../../services/firebase'

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
  updateRoom(roomId, { phase: 'black' })
}

export const CAHPlayerDraw = async (roomId: string) => {
  const snapshot = await getRoomInfo(roomId, 'blackCards')
  const blackCard = _.shuffle(snapshot)[0]
  const index = snapshot.indexOf(blackCard)
  snapshot.splice(index, 1)
  updateRoom(roomId, { currentBlack: blackCard, blackCards: snapshot })
}

export const CAHRoomWhite = async (roomId: string) => {
  const whiteCards = await getRoomInfo(roomId, 'whiteCards')
  const snapshot = await getRoomInfo(roomId, 'players')
  const players: ICAHPlayer[] = createArrayFromObject(snapshot)
  const distributedWhites = players.map((player) => player.currentWhites || []).flat()
  const remainingWhites = _.difference(whiteCards, distributedWhites)
  players.forEach((player) => {
    if (player.phase === 'ready') {
      const playerCards = player.currentWhites
      let newCards
      if (!playerCards) {
        newCards = _.shuffle(remainingWhites).splice(1, 10)
      } else {
        if (playerCards.length === 10) {
          newCards = playerCards
        } else if (playerCards.length > 0) {
          newCards = playerCards.concat(
            _.shuffle(remainingWhites).splice(1, 10 - playerCards.length)
          )
        }
      }
      updatePlayer(roomId, player.id, { currentWhites: newCards, phase: 'receive' })
    } else {
      updatePlayer(roomId, player.id, { phase: 'receive' })
    }
  })
}
