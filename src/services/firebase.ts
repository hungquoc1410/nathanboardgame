// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { get, getDatabase, query, ref, set, update } from 'firebase/database'

import { createArrayFromObject } from './create-array-from-object'
import { clearInfo } from './localforage'

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
export const connectedRef = ref(Database, '.info/connected')

// Initialize type

export type IPlayer = {
  id: string
  name: string
  color: string
  master: boolean
  phase: string
}

export type IRoomPlayers = IPlayer[]

// set ref
const setRoomRef = (roomId: string) => {
  return ref(Database, `rooms/${roomId}`)
}

export const setRoomGameRef = (roomId: string) => {
  return ref(Database, `rooms/${roomId}/game`)
}

export const setPlayerRef = (roomId: string, playerId: string) => {
  return ref(Database, `rooms/${roomId}/players/${playerId}`)
}

// Create data
export const createRoom = (roomId: string, data: object) => {
  const roomRef = setRoomRef(roomId)
  updateAllRooms(roomId)
  set(roomRef, data)
}

export const createPlayer = (roomId: string, playerId: string, data: object) => {
  const playerRef = setPlayerRef(roomId, playerId)
  set(playerRef, data)
}

// Remove data
const removeRoom = async (roomId: string) => {
  await removeRoomId(roomId)
  const roomRef = setRoomRef(roomId)
  set(roomRef, null)
}

const removePlayer = (roomId: string, playerId: string) => {
  const playerRef = setPlayerRef(roomId, playerId)
  set(playerRef, null)
}

const removeRoomId = async (roomId: string) => {
  const snapshot = await getAllRoomsData()
  if (snapshot) {
    const allRoomIds = snapshot
    const index = allRoomIds.indexOf(roomId)
    allRoomIds.splice(index, 1)
    update(ref(Database, 'allRooms'), { ids: allRoomIds })
    console.log('Run')
  }
}

// Get data
export const getRoomsData = async () => {
  const snapshot = await get(query(ref(Database, 'rooms')))
  return snapshot.val()
}

export const getAllRoomsData = async () => {
  const snapshot = await get(query(ref(Database, 'allRooms/ids')))
  return snapshot.val()
}

// Update data
export const updatePlayer = (roomId: string, playerId: string, data: object) => {
  const playerRef = setPlayerRef(roomId, playerId)
  update(playerRef, data)
}

const updateAllRooms = async (roomId: string) => {
  const snapshot = await getAllRoomsData()
  let allRoomIds = [roomId]
  if (snapshot?.ids) {
    allRoomIds = snapshot.ids
    allRoomIds.push(roomId)
  }
  update(ref(Database, 'allRooms'), { ids: allRoomIds })
}

export const getRoomInfo = async (roomId: string, key: string) => {
  const snapshot = await get(query(ref(Database, `rooms/${roomId}/${key}`)))
  return snapshot.val()
}

// Room Players
export const setRoomPlayersRef = (roomId: string) => {
  return ref(Database, `rooms/${roomId}/players`)
}

const getRoomPlayers = async (roomId: string) => {
  const roomRef = setRoomPlayersRef(roomId)
  const data = await get(query(roomRef))
  return data.val()
}

// Clean data
export const checkRoom = async (roomId: string, playerId: string) => {
  const snapshot = await getRoomPlayers(roomId)
  if (snapshot !== null) {
    const roomPlayers: IRoomPlayers = createArrayFromObject(snapshot)
    if (roomPlayers.length === 1) {
      removeRoom(roomId)
    } else {
      const hasMaster = roomPlayers.map((player: IPlayer) => player.master).includes(true)
      if (!hasMaster) {
        updatePlayer(roomId, roomPlayers[0].id, { master: true })
      }
      removePlayer(roomId, playerId)
    }
    clearInfo()
  } else {
    removeRoom(roomId)
  }
}
