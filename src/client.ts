export type MessageHandler = (msg: ServerMessage, data: ServerMessage[]) => void

class WebSocketClient {
	// static readonly url = "ws://localhost:3001"
	static readonly url = "wss://devel01.129bit.cz:7070/ws"

	private static instance: WebSocketClient

	private ws: WebSocket | null = null
	private handlers: MessageHandler[] = []

	/**
	 * Data received from the WebSocket server.
	 * This is an array that accumulates all messages received.
	 *
	 * Subscribe to `onMessage` to get notified on new messages as they arrive.
	 */
	public readonly data: ServerMessage[] = []

	constructor() {
		return WebSocketClient.instance ??= this
	}

	connect() {
		if (this.ws) return
		this.ws = new WebSocket(WebSocketClient.url)
		this.ws.onmessage = (event) => {
			const msg = JSON.parse(event.data)
			this.data.push(msg)
			this.handlers.forEach(h => h(msg, this.data))
		}
	}

	/** Add listener */
	onMessage(handler: MessageHandler) {
		this.handlers.push(handler)
	}

	/** Remove listener */
	off(handler: MessageHandler) {
		this.handlers = this.handlers.filter(h => h !== handler)
	}

	sendCommand(command: "start" | "stop") {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify({ command }))
		}
	}

	close() {
		if (this?.ws) {
			this.ws.close()
			this.ws = null
			this.handlers.length = 0 // Clear the handlers array
			this.data.length = 0 // Clear the data array
		}
	}
}

export default WebSocketClient

export const ws = new WebSocketClient()

inspect({ws})

/*  */

export interface ServerCommand {
	command: "start" | "stop"
}

export interface ServerMessageBase {
	clientId: number
}

export interface ServerInfoMessage extends ServerMessageBase {
	info: string
}

export interface ServerErrorMessage extends ServerMessageBase {
	error: string
}

export interface ServerTimeStampMessage extends ServerMessageBase {
	timeStamp: string // ISO string
}

export interface ServerDataMessage extends ServerMessageBase {
	data: string[]
}

export type ServerMessage =
	| ServerInfoMessage
	| ServerErrorMessage
	| ServerTimeStampMessage
	| ServerDataMessage

// ...rest of your client code...
