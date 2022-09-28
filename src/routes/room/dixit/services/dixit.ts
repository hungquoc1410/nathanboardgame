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
  submitCards: string[]
  prompt: string
  tellerCard: string
  players: { [x: string]: IDIXITPlayer }
}

export type IDIXITPlayer = {
  id: string
  points: number
  name: string
  color: string
  master: boolean
  phase: string
  teller: boolean
  cards: string[]
  submitCard: string
  voteCard: string
}

export const DIXITNewGame = (roomId: string, playersData: IRoomPlayers) => {
  playersData.forEach((player) => {
    updatePlayer(roomId, player.id, {
      answer: '',
      points: 0,
      teller: false,
      phase: 'ready',
      cards: [],
      submitCard: '',
      voteCard: '',
    })
  })
  updateRoom(roomId, {
    cards: cardsData,
    prompt: '',
    phase: 'play',
    tellerCard: '',
    submitCards: [],
  })
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

export const DIXITTellerPrompt = (
  roomData: IDIXITRoom,
  tellerId: string,
  prompt: string,
  choseCard: string
) => {
  const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)
  const teller = players.filter((player) => player.teller)[0]
  const tellerCards = teller.cards
  const newCards = _.difference(tellerCards, [choseCard])
  updatePlayer(roomData.id, tellerId, { phase: 'vote', cards: newCards })
  updateRoom(roomData.id, { tellerCard: choseCard, prompt: prompt, phase: 'submit' })
}

export const DIXITPlayerSubmit = (roomData: IDIXITRoom, playerId: string, choseCard: string) => {
  const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)
  const player = players.filter((player) => player.id === playerId)[0]
  const cards = player.cards
  const newCards = _.difference(cards, [choseCard])
  updatePlayer(roomData.id, playerId, { phase: 'submit', cards: newCards, submitCard: choseCard })
}

export const DIXITRoomSubmit = (roomData: IDIXITRoom) => {
  const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)
  const playersNoTeller = players.filter((player) => !player.teller)
  const allSubmit = !playersNoTeller.map((player) => player.phase === 'submit').includes(false)
  if (allSubmit) {
    const allSubmitCards = playersNoTeller.map((player) => player.submitCard)
    updateRoom(roomData.id, {
      phase: 'vote',
      submitCards: allSubmitCards.concat([roomData.tellerCard]),
    })
  }
}

export const DIXITPlayerVote = (roomData: IDIXITRoom, playerId: string, choseCard: string) => {
  updatePlayer(roomData.id, playerId, { phase: 'vote', voteCard: choseCard })
}

export const DIXITRoomVote = (roomData: IDIXITRoom) => {
  const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)
  const allVote = !players.map((player) => player.phase === 'vote').includes(false)
  if (allVote) {
    updateRoom(roomData.id, { phase: 'point' })
  }
}

export const DIXITRoomPoint = (roomData: IDIXITRoom) => {
  const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)
  const allPoint = !players.map((player) => player.phase === 'point').includes(false)
  if (allPoint) {
    updateRoom(roomData.id, { phase: 'end' })
  } else {
    const allVotes = players.map((player) => player.voteCard).filter((e) => e)
    const repeatTimes = allVotes.filter((vote) => vote === roomData.tellerCard).length
    players.forEach((player) => {
      if (player.phase === 'vote') {
        if (player.teller) {
          let newPoints = player.points
          if (repeatTimes !== 0 && repeatTimes !== roomData.numOfPlayers - 1) {
            newPoints += 3
          }
          updatePlayer(roomData.id, player.id, { phase: 'point', points: newPoints })
        } else {
          const voteForPlayer = allVotes.filter((vote) => vote === player.submitCard).length
          let newPoints = player.points + voteForPlayer
          if (repeatTimes === 0 || repeatTimes === roomData.numOfPlayers - 1) {
            newPoints += 2
          } else {
            if (player.voteCard === roomData.tellerCard) {
              newPoints += 3
            }
          }
          updatePlayer(roomData.id, player.id, { phase: 'point', points: newPoints })
        }
      }
    })
  }
}
