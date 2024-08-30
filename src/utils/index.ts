export const sleepResolve = <T = void>(msec: number, retVal?: T) =>
  new Promise<T>((resolve) => setTimeout(resolve, msec, retVal))
export const sleepReject = <T = void>(msec: number, retVal?: T) =>
  new Promise<T>((_, reject) => setTimeout(reject, msec, retVal))

export function str2hash(str: string) {
  let hash = 0, i, chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return hash
}
