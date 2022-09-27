import localforage from 'localforage'

export type IInfo = {
  playerId?: string
  roomId?: string
  playerName?: string
  playerColor?: string
  gameId?: string
}

type IInfoKeys = keyof IInfo

const isAnInfo = (obj: object | unknown): obj is IInfo => {
  return typeof obj === 'object' && obj !== null && 'playerId' in obj
}

const set = (info: IInfo) => {
  return localforage.setItem('info', info)
}

export const getInfo = async (): Promise<IInfo> => {
  const info = await localforage.getItem('info')
  if (isAnInfo(info)) {
    return info
  }
  return {}
}

export const setInfo = async (data: IInfo) => {
  const info = await getInfo()
  if (info !== undefined) {
    Object.keys(data).forEach((key) => {
      info[key as IInfoKeys] = data[key as IInfoKeys]
    })
    if (isAnInfo(info)) {
      await set(info)
    }
  }
  return info
}

export const clearInfo = async () => {
  const info = await getInfo()
  if (info !== undefined) {
    delete info['roomId']
    await set(info)
  }
}
