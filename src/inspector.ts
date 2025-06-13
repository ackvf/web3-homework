import { IS_DEV } from "./env"
// For debugging in DevTools. Put anything here for access in the console and TypeScript won't complain.
globalThis.d ??= {}
globalThis.inspect = (object: AnyObject) => IS_DEV && Object.assign(globalThis.d, object)
