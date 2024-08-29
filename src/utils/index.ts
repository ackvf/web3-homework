export const sleepResolve = <T = void>(msec: number, retVal?: T) =>
  new Promise<T>((resolve) => setTimeout(resolve, msec, retVal))
export const sleepReject = <T = void>(msec: number, retVal?: T) =>
  new Promise<T>((_, reject) => setTimeout(reject, msec, retVal))
