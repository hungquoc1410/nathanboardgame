import _ from 'underscore'

import { grey } from '@mui/material/colors'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { createPlayer, createRoom, updatePlayer, updateRoom } from '../../../../services/firebase'

import { blackCardsData } from './black-cards'
import { whiteCardsData } from './white-cards'

export type ICAHRoom = {
  id: string
  game: string
  title: string
  color: string
  minPlayer: number
  maxPlayer: number
  numOfPlayers: number
  phase: string
  blackCards: string[]
  whiteCards: string[]
  currentBlack: string
  currentWhites: string[]
  choseCard: string
  players: { [x: string]: ICAHPlayer }
}

export type ICAHPlayer = {
  id: string
  points: number
  name: string
  color: string
  master: boolean
  drawer: boolean
  phase: string
  choseCard: string
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
    choseCard: '',
    currentWhites: [],
  }
  createPlayer(roomId, playerId, playerData)
}

export const CAHStart = (roomData: ICAHRoom) => {
  const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
  players.forEach((player) => {
    if (player.drawer) {
      updatePlayer(roomData.id, player.id, { phase: 'draw' })
    }
  })
  updateRoom(roomData.id, { phase: 'black' })
}

export const CAHPlayerDraw = (roomData: ICAHRoom) => {
  const blackCards = roomData.blackCards
  const blackCard = _.shuffle(blackCards)[0]
  const index = blackCards.indexOf(blackCard)
  blackCards.splice(index, 1)
  updateRoom(roomData.id, { currentBlack: blackCard, blackCards: blackCards })
}

export const CAHRoomWhite = (roomData: ICAHRoom) => {
  const whiteCards = roomData.whiteCards
  const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
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
      updatePlayer(roomData.id, player.id, { currentWhites: newCards, phase: 'receive' })
    } else {
      updatePlayer(roomData.id, player.id, { phase: 'receive' })
    }
  })
}

export const CAHPlayerPhase = (
  roomData: ICAHRoom,
  playerPhase: string,
  roomPhase: string,
  playerNextPhase = ''
) => {
  const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
  const allSubmit = !players.map((player) => player.phase === playerPhase).includes(false)
  const drawerPlayer = players.filter((player) => player.drawer)[0]
  if (allSubmit) {
    if (playerNextPhase) {
      updatePlayer(roomData.id, drawerPlayer.id, { phase: playerNextPhase })
    }
    updateRoom(roomData.id, { phase: roomPhase })
  }
}

export const CAHRoomChoose = (roomData: ICAHRoom) => {
  const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
  const distributedWhites = players.map((player) => player.choseCard)
  updateRoom(roomData.id, { currentWhites: distributedWhites.filter((e) => e) })
}

export const CAHPlayerConfirmWhite = (roomId: string, playerData: ICAHPlayer) => {
  const choseWhite = playerData.choseCard
  const currentWhites = playerData.currentWhites
  const index = playerData.currentWhites.indexOf(choseWhite)
  currentWhites.splice(index, 1)
  updatePlayer(roomId, playerData.id, { currentWhites: currentWhites, phase: 'submit' })
}

export const CAHRoomConfirmWhite = async (roomData: ICAHRoom) => {
  const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
  const currentMaster = players.filter((player) => player.master)[0]
  let index = players.indexOf(currentMaster)
  if (index === roomData.numOfPlayers - 1) {
    index = 0
  } else {
    index += 1
  }
  const nextMaster = players[index].id
  players.forEach((player) => {
    if (player.phase === 'submit') {
      if (player.choseCard === roomData.choseCard) {
        updatePlayer(roomData.id, player.id, {
          phase: 'ready',
          points: player.points + 1,
          choseCard: '',
        })
      } else {
        updatePlayer(roomData.id, player.id, { phase: 'ready', choseCard: '' })
      }
      if (player.drawer) {
        updatePlayer(roomData.id, player.id, { drawer: false })
      }
      if (player.id === nextMaster) {
        updatePlayer(roomData.id, player.id, { drawer: true })
      }
    }
  })
  updateRoom(roomData.id, { phase: 'play', currentBlack: '', currentWhites: [], choseCard: '' })
}
