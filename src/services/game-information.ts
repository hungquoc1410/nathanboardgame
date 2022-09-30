import { grey, indigo, orange } from '@mui/material/colors'

export type GameInfo = {
  title: string
  subtitle: string
  image: string
  players: string
  playtime: string
  color: string
  slug: string
  minPlayer: number
  maxPlayer: number
}

export const gameInfo: GameInfo[] = [
  {
    title: 'Blank Slate',
    subtitle: 'The game where _______ minds think alike.',
    image:
      'https://cf.geekdo-images.com/3esMv2fRjFZHNM8IbGG-kw__itemrep/img/LTD6KNm2SQPmoNPtY_tOu2BWdI0=/fit-in/246x300/filters:strip_icc()/pic4163219.jpg',
    players: '3-8 Players',
    playtime: '20-35 Minutes',
    color: grey[500],
    slug: 'bs',
    minPlayer: 3,
    maxPlayer: 8,
  },
  {
    title: 'Cards Against Humanity',
    subtitle: 'Who can come up with the most hilariously obscene answers in this party game?',
    image:
      'https://cf.geekdo-images.com/nYLrPiI9gnvlrwOrKQ4_CA__itemrep/img/3iYDiQxF_q2FExBNdtW3gRk1N2o=/fit-in/246x300/filters:strip_icc()/pic2909692.jpg',
    players: '4-10 Players',
    playtime: '30 Mintues',
    color: grey[900],
    slug: 'cah',
    minPlayer: 4,
    maxPlayer: 10,
  },
  {
    title: 'Dixit',
    subtitle: 'Give the perfect clue so most (not all) players guess the right surreal image card.',
    image:
      'https://cf.geekdo-images.com/J0PlHArkZDJ57H-brXW2Fw__itemrep/img/tsmN3sAHJ6trDaWNbq08BZXtq7g=/fit-in/246x300/filters:strip_icc()/pic6738336.jpg',
    players: '3-6 Players',
    playtime: '30 Mintues',
    color: orange[500],
    slug: 'dixit',
    minPlayer: 3,
    maxPlayer: 6,
  },
  {
    title: 'Lucky Dog',
    subtitle: 'The dice game where the dog always wins!',
    image: './games/ld/logo.jpeg',
    players: '2-4 Players',
    playtime: '5-15 Mintues',
    color: indigo[400],
    slug: 'ld',
    minPlayer: 2,
    maxPlayer: 4,
  },
]
