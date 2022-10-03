import _ from 'underscore'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { IRoomPlayers, updatePlayer, updateRoom } from '../../../../services/firebase'
import { getInfo } from '../../../../services/localforage'

import { cardsData } from './cards'

export type ILDRoom = {
  id: string
  game: string
  title: string
  color: string
  minPlayer: number
  maxPlayer: number
  numOfPlayers: number
  phase: string
  cards: string[]
  turn: number
  dice: { fixed: boolean; value: number }[]
  deck: string[]
  players: { [x: string]: ILDPlayer }
}

export type ILDPlayer = {
  id: string
  points: number
  name: string
  color: string
  master: boolean
  phase: string
}

export const LDNewGame = (roomId: string, playersData: IRoomPlayers) => {
  playersData.forEach((player) => {
    updatePlayer(roomId, player.id, { points: 0, phase: 'ready' })
  })
  updateRoom(roomId, {
    cards: cardsData,
    phase: 'play',
    turn: 0,
    dice: [],
    deck: [],
  })
}

export const LDRoomPlay = (roomData: ILDRoom) => {
  const { cards, deck, id, turn, numOfPlayers } = roomData
  let newDeck: string[]
  if (deck) {
    newDeck = deck.concat(_.shuffle(cards).splice(0, 5 - deck.length))
  } else {
    newDeck = _.shuffle(cards).splice(0, 5)
  }
  let newTurn: number
  if (turn === numOfPlayers) {
    return updateRoom(id, { phase: 'end', deck: newDeck, cards: cards })
  } else {
    newTurn = turn + 1
    const newDice = Array(5).fill({ fixed: false, value: 0 })
    updateRoom(id, { deck: newDeck, phase: 'player', turn: newTurn, dice: newDice, cards: cards })
  }
}

export const LDGetCurrentPlayer = (roomData: ILDRoom) => {
  const { turn } = roomData
  const players: ILDPlayer[] = createArrayFromObject(roomData.players)
  const player = players[turn - 1]
  return player
}

export const LDPlayerRollDice = (roomData: ILDRoom, reroll = false) => {
  const turnId = LDGetCurrentPlayer(roomData).id
  if (reroll) {
    updatePlayer(roomData.id, turnId, { phase: 'second' })
  } else {
    updatePlayer(roomData.id, turnId, { phase: 'first' })
  }
  const { dice } = roomData
  const newDice: { fixed: boolean; value: number }[] = []
  dice.forEach((die) => {
    if (die.fixed) {
      newDice.push({ fixed: true, value: die.value })
    } else {
      newDice.push({ fixed: false, value: Math.floor(Math.random() * 6) + 1 })
    }
  })
  updateRoom(roomData.id, { dice: newDice })
}

export const LDPlayerDiscard = (roomData: ILDRoom, chose: string) => {
  const { cards, deck } = roomData
  const index = deck.indexOf(chose)
  deck.splice(index, 1)
  const newDeck = deck.concat(_.shuffle(cards).splice(0, 5 - deck.length))
  const turnId = LDGetCurrentPlayer(roomData).id
  updatePlayer(roomData.id, turnId, { phase: 'second' })
  updateRoom(roomData.id, { deck: newDeck })
}

export const LDToggleFixedDice = (roomData: ILDRoom, index: number) => {
  const { dice } = roomData
  const die = dice[index]
  const newDie = { fixed: !die.fixed, value: die.value }
  dice[index] = newDie
  updateRoom(roomData.id, { dice: dice })
}

export const LDCheckRequirements = (roomData: ILDRoom, playerData: ILDPlayer) => {
  const roomDice = roomData.dice.map((die) => die.value)
  const roomDeck = roomData.deck
  const roomCard = roomData.cards
  const removeCards: string[] = []
  let points = playerData.points
  roomDeck.forEach((card) => {
    switch (card.split('_')[0]) {
      case '3K':
        if (check3K(roomDice)) {
          points += 3
          removeCards.push(card)
        }
        break
      case '3R':
        if (check3R(roomDice)) {
          points += 2
          removeCards.push(card)
        }
        break
      case '4K':
        if (check4K(roomDice)) {
          points += 5
          removeCards.push(card)
        }
        break
      case '4R':
        if (check4R(roomDice)) {
          points += 4
          removeCards.push(card)
        }
        break
      case '15':
        if (check15(roomDice)) {
          points += 2
          removeCards.push(card)
        }
        break
      case '20':
        if (check20(roomDice)) {
          points += 2
          removeCards.push(card)
        }
        break
      case 'AE':
        if (checkAE(roomDice)) {
          points += 4
          removeCards.push(card)
        }
        break
      case 'AO':
        if (checkAO(roomDice)) {
          points += 4
          removeCards.push(card)
        }
        break
      case 'FH':
        if (checkFH(roomDice)) {
          points += 4
          removeCards.push(card)
        }
        break
      case 'TO':
        if (checkTO(roomDice)) {
          points += 2
          removeCards.push(card)
        }
        break
      case 'TP':
        if (checkTP(roomDice)) {
          points += 2
          removeCards.push(card)
        }
        break
      case 'AT':
        if (checkAT(roomDeck, roomData)) {
          points += 1
          removeCards.push(card)
        }
        break
    }
  })
  const newRoomData = {
    ...roomData,
    deck: _.difference(roomDeck, removeCards),
    cards: _.difference(roomCard, removeCards),
  }
  updatePlayer(roomData.id, playerData.id, { points: points, phase: 'ready' })
  LDRoomPlay(newRoomData)
}

const checkAT = (deck: string[], roomData: ILDRoom) => {
  const filterDeck = deck.filter((card) => card.split('_')[0] !== 'AT')
  const result = filterDeck.map((card) => LDCheckRule(card.split('_')[0], roomData))
  if (result.includes(true)) {
    return false
  } else {
    return true
  }
}

const check3K = (dice: number[]) => {
  if (!dice.includes(0)) {
    const unique = _.uniq(dice)
    let result = false
    const repeatTime = unique.map((el) => dice.filter((die) => die === el).length)
    repeatTime.forEach((time) => {
      if (time >= 3) {
        result = true
      }
    })
    return result
  }
}

const check3R = (dice: number[]) => {
  const rules = [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6],
  ]
  const result = rules.map((rule) => _.difference(rule, dice).length === 0).includes(true)
  return result
}

const check4K = (dice: number[]) => {
  if (!dice.includes(0)) {
    const unique = _.uniq(dice)
    let result = false
    const repeatTime = unique.map((el) => dice.filter((die) => die === el).length)
    repeatTime.forEach((time) => {
      if (time >= 4) {
        result = true
      }
    })
    return result
  }
}

const check4R = (dice: number[]) => {
  const rules = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
  ]
  const result = rules.map((rule) => _.difference(rule, dice).length === 0).includes(true)
  return result
}

const check15 = (dice: number[]) => {
  return dice.reduce((a, b) => a + b, 0) > 15
}

const check20 = (dice: number[]) => {
  return dice.reduce((a, b) => a + b, 0) > 20
}

const checkAE = (dice: number[]) => {
  if (!dice.includes(0)) {
    const result = !dice.map((die) => die % 2 === 0).includes(false)
    return result
  } else {
    return false
  }
}

const checkAO = (dice: number[]) => {
  const result = !dice.map((die) => die % 2 !== 0).includes(false)
  return result
}

const checkFH = (dice: number[]) => {
  const unique = _.uniq(dice)
  let result = false
  if (unique[0] !== 0) {
    if (unique.length === 1) {
      result = true
    } else if (unique.length === 2) {
      const firstLength = dice.filter((die) => die === unique[0]).length
      console.log(firstLength)
      const secondLength = dice.filter((die) => die === unique[1]).length
      console.log(secondLength)

      if ((firstLength === 3 && secondLength === 2) || (firstLength === 2 && secondLength === 3)) {
        result = true
      }
    }
  }
  return result
}

const checkTO = (dice: number[]) => {
  const result = dice.filter((die) => die === 1).length
  return result >= 2
}

const checkTP = (dice: number[]) => {
  const unique = _.uniq(dice)
  let result = false
  if (unique.length <= 3) {
    const repeatTime = unique
      .map((el) => dice.filter((die) => die === el).length >= 2)
      .filter((el) => el === true).length
    if (repeatTime >= 2) {
      result = true
    }
  }
  return result
}

export const LDCheckRule = (rule: string, roomData: ILDRoom) => {
  const roomDice = roomData.dice.map((die) => die.value)
  switch (rule) {
    case '3K':
      return check3K(roomDice)
    case '3R':
      return check3R(roomDice)
    case '4K':
      return check4K(roomDice)
    case '4R':
      return check4R(roomDice)
    case '15':
      return check15(roomDice)
    case '20':
      return check20(roomDice)
    case 'AE':
      return checkAE(roomDice)
    case 'AO':
      return checkAO(roomDice)
    case 'FH':
      return checkFH(roomDice)
    case 'TO':
      return checkTO(roomDice)
    case 'TP':
      return checkTP(roomDice)
    case 'AT':
      return checkAT(roomData.deck, roomData)
  }
}

export const LDRoomEnd = (roomData: ILDRoom) => {
  const players: ILDPlayer[] = createArrayFromObject(roomData.players)
  const allPoints = players.map((player) => player.points)
  const maxPoint = Math.max(...allPoints)
  if (maxPoint < 20) {
    updateRoom(roomData.id, { phase: 'play', turn: 0 })
  } else {
    getInfo().then((value) => {
      if (value && value.playerId) {
        updatePlayer(roomData.id, value.playerId, { phase: 'end' })
      }
    })
  }
}
