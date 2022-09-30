import _ from 'underscore'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { IRoomPlayers, updatePlayer, updateRoom } from '../../../../services/firebase'
import { getInfo } from '../../../../services/localforage'

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
  phase: string
  drawer: boolean
  choseCard: string
  currentWhites: string[]
}

export const CAHNewGame = (roomId: string, playersData: IRoomPlayers) => {
  playersData.forEach((player) => {
    if (player.master) {
      updatePlayer(roomId, player.id, { drawer: true, choseCard: '', currentWhites: [], points: 0 })
    } else {
      updatePlayer(roomId, player.id, {
        drawer: false,
        choseCard: '',
        currentWhites: [],
        points: 0,
      })
    }
  })
  updateRoom(roomId, {
    blackCards: blackCardsData,
    whiteCards: whiteCardsData,
    currentBlack: '',
    currentWhites: [],
    choseCard: '',
  })
}

export const CAHStart = (roomData: ICAHRoom) => {
  const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
  const drawer = players.filter((player) => player.drawer)[0]
  updatePlayer(roomData.id, drawer.id, { phase: 'draw' })
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
  const allTrue = !players
    .filter((player) => !player.drawer)
    .map((player) => player.phase === 'receive')
    .includes(false)
  if (allTrue) {
    updateRoom(roomData.id, { phase: 'submit' })
  } else {
    const distributedWhites = players.map((player) => player.currentWhites || []).flat()
    const remainingWhites = _.difference(whiteCards, distributedWhites)
    getInfo().then((value) => {
      if (value && value.playerId) {
        const player = players.filter((player) => player.id === value.playerId)[0]
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
        }
        if (player.drawer) {
          updatePlayer(roomData.id, player.id, { phase: 'submit' })
        }
      }
    })
  }
}

export const CAHRoomSubmit = (roomData: ICAHRoom) => {
  const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
  const allTrue = !players
    .filter((player) => !player.drawer)
    .map((player) => player.phase === 'submit')
    .includes(false)
  if (allTrue) {
    updateRoom(roomData.id, { phase: 'gather' })
  }
}

export const CAHRoomGather = (roomData: ICAHRoom) => {
  const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
  const distributedWhites = players.map((player) => player.choseCard)
  updateRoom(roomData.id, {
    currentWhites: _.shuffle(distributedWhites.filter((e) => e)),
    phase: 'choose',
  })
}

export const CAHPlayerConfirmWhite = (roomId: string, playerData: ICAHPlayer) => {
  const { choseCard, currentWhites } = playerData
  const index = playerData.currentWhites.indexOf(choseCard)
  currentWhites.splice(index, 1)
  updatePlayer(roomId, playerData.id, { currentWhites: currentWhites, phase: 'submit' })
}

export const CAHRoomConfirmWhite = async (roomData: ICAHRoom) => {
  const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
  const currentDrawer = players.filter((player) => player.drawer)[0]
  let index = players.indexOf(currentDrawer)
  if (index === roomData.numOfPlayers - 1) {
    index = 0
  } else {
    index += 1
  }
  const nextDrawer = players[index].id
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
      if (player.id === nextDrawer) {
        updatePlayer(roomData.id, player.id, { drawer: true })
      }
    }
  })
  updateRoom(roomData.id, { phase: 'play', currentBlack: '', currentWhites: [], choseCard: '' })
}
