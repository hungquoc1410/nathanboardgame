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
}