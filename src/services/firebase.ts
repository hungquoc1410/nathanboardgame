// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { get, getDatabase, query, ref, set, update } from 'firebase/database'

import { createArrayFromObject } from './create-array-from-object'
import { getInfo } from './localforage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyByckPKS9VLEtAo9PCpCm_MhxnChcznTjo',
  authDomain: 'nathan-boardgame.firebaseapp.com',
  projectId: 'nathan-boardgame',
  storageBucket: 'nathan-boardgame.appspot.com',
  messagingSenderId: '685742545433',
  appId: '1:685742545433:web:f553f7916533124fcca888',
  measurementId: 'G-B87DNLZV6V',
  databaseURL: 'https://nathan-boardgame-default-rtdb.asia-southeast1.firebasedatabase.app',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const Auth = getAuth(app)

// Initialize Realtime Database and get a reference to the service
export const Database = getDatabase(app)
export const DatabaseRef = ref(Database)
export const connectedRef = ref(Database, '.info/connected')

// Initialize type

export type PlayerDataType = {
  id: string
  name: string
  color: string
  master: boolean
  phase: string
}

type RoomPlayersDataType = PlayerDataType[]

// set ref
export const setRoomRef = (roomId: string) => {
  return ref(Database, `rooms/${roomId}`)
}

export const setRoomPlayersRef = (roomId: string) => {
  return ref(Database, `rooms/${roomId}/players`)
}

export const setPlayerRef = (roomId: string, playerId: string) => {
  return ref(Database, `rooms/${roomId}/players/${playerId}`)
}

// Create data
export const createRoom = (roomId: string, data: object) => {
  const roomRef = setRoomRef(roomId)
  return set(roomRef, data)
}

export const createPlayer = (roomId: string, playerId: string, data: object) => {
  const playerRef = setPlayerRef(roomId, playerId)
  return set(playerRef, data)
}

// Remove data
export const removeRoom = (roomId: string) => {
  const roomRef = setRoomRef(roomId)
  set(roomRef, null)
}

export const removePlayer = (roomId: string, playerId: string) => {
  const playerRef = setPlayerRef(roomId, playerId)
  set(playerRef, null)
}

// Get data
export const getRoomsData = async () => {
  const snapshot = await get(query(ref(Database, 'rooms')))
  return snapshot.val()
}

export const getRoomData = async (roomId: string) => {
  const roomRef = setRoomRef(roomId)
  const snapshot = await get(query(roomRef))
  return snapshot.val()
}

export const getRoomPlayers = async (roomId: string) => {
  const roomRef = setRoomPlayersRef(roomId)
  const data = await get(query(roomRef))
  return data.val()
}

// Update data
export const updatePlayer = (roomId: string, playerId: string, data: object) => {
  const playerRef = setPlayerRef(roomId, playerId)
  return update(playerRef, data)
}

export const updateRoom = (roomId: string, data: object) => {
  const roomRef = setRoomRef(roomId)
  return update(roomRef, data)
}

// Clean data
export const checkRoom = async () => {
  const info = await getInfo()
  const { roomId, playerId } = info
  if (roomId && playerId) {
    const snapshot = await getRoomPlayers(roomId)
    const roomPlayers: RoomPlayersDataType = createArrayFromObject(snapshot)
    if (roomPlayers.length === 1) {
      removeRoom(roomId)
    } else {
      const hasMaster = roomPlayers.map((player: PlayerDataType) => player.master).includes(true)
      if (!hasMaster) {
        updatePlayer(roomId, roomPlayers[0].id, { master: true })
      }
      removePlayer(roomId, playerId)
    }
  }
}
