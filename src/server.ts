import { WebSocketServer, type WebSocket } from "ws"

import c from "@/utils/color"

const enableLog = true

let clientCounter = 1

const wss = new WebSocketServer({ port: 3001 })

wss.on("connection", (ws: WebSocket) => {
	let liveInterval: NodeJS.Timeout | null = null
	let dataTimeout: NodeJS.Timeout | null = null
	const clientId = clientCounter++

	function sendTimeStamp() {
		const msg = {
			clientId,
			timeStamp: new Date().toISOString(),
		}
		enableLog && console.log(c.bg.blue`↗`, msg as any)
		ws.send(JSON.stringify(msg))
	}

	function sendInfo(info: string) {
		const msg = {
			clientId,
			info,
		}
		enableLog && console.log(c.bg.blue`↗`, msg)
		ws.send(JSON.stringify(msg))
	}

	function sendError(error: string) {
		const msg = {
			clientId,
			error,
		}
		enableLog && console.log(c.bg.blue`↗`, msg)
		ws.send(JSON.stringify(msg))
	}

	function sendData() {
		const count = Math.floor(Math.random() * 4) + 1 // 1-4 strings
		const data = Array.from({ length: count }, () =>
			Math.random().toString(6)
				.slice(2, 10)
				.replaceAll("0", "X")
				.replaceAll("1", "a")
				.replaceAll("2", "b")
				.replaceAll("3", "c")
				.replaceAll("4", "d")
				.replaceAll("5", "e")
		)
		const msg = {
			clientId,
			data,
		}
		enableLog && console.log(c.bg.blue`↗`, msg)
		ws.send(JSON.stringify(msg))
		scheduleNextData()
	}

	function scheduleNextData() {
		const interval = 500 + Math.random() * 2000 // 0.5s - 2.5s
		dataTimeout = setTimeout(sendData, interval)
	}

	function startLive() {
		if (!liveInterval) {
			enableLog && console.log(c.bg.green`≈`, `Client ${clientId} connected`)
			liveInterval = setInterval(sendTimeStamp, 1000)
		}
	}

	function stopLive() {
		if (liveInterval) {
			clearInterval(liveInterval)
			liveInterval = null
		}
	}

	function startData() {
		if (!dataTimeout) {
			scheduleNextData()
		}
	}

	function stopData() {
		if (dataTimeout) {
			clearTimeout(dataTimeout)
			dataTimeout = null
		}
	}

	ws.on("message", (data) => {
		enableLog && console.log(c.bg.yellow`↙`, data.toString())
		try {
			const msg = JSON.parse(data.toString())
			if (msg.command === "start") {
				startData()
				sendInfo("Started")
			} else if (msg.command === "stop") {
				stopData()
				sendInfo("Stopped")
			}
		} catch (err) {
			sendError("Invalid JSON or command")
		}
	})

	ws.on("close", () => {
		enableLog && console.log(c.bg.red`≠`, `Client ${clientId} disconnected`)
		stopData()
		stopLive()
	})

	startLive()
})

export interface ResponseData {
	message: string
}

export default function handler(req: any, res: any) {
	if (req.method === "GET") {
		if (res.socket!.server.wss) {
			res.status(200).end()
			return
		}

		res.socket.server.wss = wss
		res.socket.server.on("upgrade", (request: any, socket: any, head: any) => {
			wss.handleUpgrade(request, socket, head, (ws) => {
				wss.emit("connection", ws, request)
			})
		})
		res.status(200).end()
	} else {
		res.status(405).end()
	}
}

enableLog && console.log(c.bg.green.fg.black`WebSocket server running on ws://localhost:3001`)
