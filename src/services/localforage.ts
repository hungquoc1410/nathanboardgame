import localforage from 'localforage';

type Info = {
  playerId?: string;
  roomId?: string;
  gameId?: string;
  playerName?: string;
  playerColor?: string;
}

type InfoKeys = keyof Info

const isAnInfo = (obj: object | unknown): obj is Info => {
  return (
    typeof obj === 'object' && obj !== null && 'playerId' in obj
  )
}

const set = (info: Info) => {
  return localforage.setItem('info', info)
}

export const getInfo = async () => {
  let info = await localforage.getItem('info')
  if (!info) info = {}
  if (isAnInfo(info)) {
    return info
  }
}

export const setInfo = async (data: Info) => {
  const info = await getInfo()
  if (info !== undefined) {
    Object.keys(data).forEach((key) => {
      info[key as InfoKeys] = data[key as InfoKeys]
    })
    if (isAnInfo(info)) {
      await set(info)
      return info
    }
  }
}

export const clearInfo = async () => {
  const info = await getInfo()
  if (info !== undefined) {
    delete info['roomId']
    delete info['gameId']
    await set(info)
    return info
  }
}
