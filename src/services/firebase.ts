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

export const setPlayerRef = (roomId: string, playerId: string) => {
  return ref(Database, `rooms/${roomId}/players/${playerId}`)
}

export const setRoomPlayersRef = (roomId: string) => {
  return ref(Database, `rooms/${roomId}/players`)
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
  }
}

// Get data
const getAllRoomsData = async () => {
  const snapshot = await get(query(ref(Database, 'allRooms/ids')))
  return snapshot.val()
}

export const getRoomInfo = async (roomId: string, key: string) => {
  const snapshot = await get(query(ref(Database, `rooms/${roomId}/${key}`)))
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

// Check data
export const checkRoom = async (roomId: string, playerId: string) => {
  const snapshot = await getRoomInfo(roomId, 'players')
  if (snapshot) {
    const roomPlayers: IRoomPlayers = createArrayFromObject(snapshot)
    if (roomPlayers.length === 1 && roomPlayers[0].id === playerId) {
      removeRoom(roomId)
    } else {
      removePlayer(roomId, playerId)
    }
    clearInfo()
  }
}

export const checkMaster = (roomId: string, roomData: object) => {
  const roomPlayers: IRoomPlayers = createArrayFromObject(roomData)
  const hasMaster = roomPlayers.map((player: IPlayer) => player.master).includes(true)
  if (!hasMaster) {
    updatePlayer(roomId, roomPlayers[0].id, { master: true, phase: 'ready' })
  }
}
