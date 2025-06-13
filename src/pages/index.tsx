
import { useEffect, useState } from "react"

import { ws, type ServerDataMessage, type ServerTimeStampMessage } from "@/client"
import { useAppState } from "@/context/AppState"
import useForceUpdate from "@/hooks/useForceUpdate"
import useToggle from "@/hooks/useToggle"
import {
	Block, Label, Switch, Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components"

export default function HistoryTable() {
	const { appState: { wsConnected, wsStarted } } = useAppState()
	const [checked, , , , turn] = useToggle()

	return (
		<main id="MainContentWrap" className="flex-grow pt-8">
			<Block id="HistoryTable"
				borderStyle={wsConnected ? "gradient" : "solid"}
				className={`relative gap-4 w-[700px] mx-auto max-w-3xl px-4 py-8 ${wsStarted && '[--block-bg-border-color:theme("colors.orange.900")]'}`}
			>
				<h1 className="text-stone-500 md:text-2xl">Tabulka záznamů</h1>

				<div className="flex items-center space-x-2">
					<Switch id="airplane-mode" onCheckedChange={turn} />
					<Label htmlFor="airplane-mode">Filtrovat záznamy</Label>
				</div>

				<LiveTable filter={checked} />

			</Block>
		</main>
	)
}

let lastTimestamp: string

function LiveTable({ filter = false }) {
	const forceUpdate = useForceUpdate()
	const { appState: { wsConnected }, refState } = useAppState()
	const [modalText, setModalText] = useState<[boolean, string] | null>(null)

	useEffect(() => {
		if (wsConnected) ws.onMessage(forceUpdate)
		return () => { if (!refState.current.wsConnected) ws.off(forceUpdate) } // eslint-disable-line react-hooks/exhaustive-deps
	}, [wsConnected]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Table>
				<TableCaption>tip: Klikni na řádek tabulky.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Timestamp</TableHead>
						<TableHead className="text-right">Data</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{ws.data.map((row, ix, ar) => {
						const timestamp = lastTimestamp = (row as ServerTimeStampMessage).timeStamp ??= lastTimestamp

						const rowData = (row as ServerDataMessage).data
						if (rowData === undefined) return null

						let data = rowData
						if (filter) data = data.filter(aeXae)
						if (data.length === 0) return null
						const hasAeXae = data.some(aeXae)
						const text = data.join(" ")

						return (
							<TableRow key={timestamp + ix}>
								<TableCell className="font-medium">{timestamp}</TableCell>
								<TableCell onClick={() => setModalText([hasAeXae, rowData.join(" ")])}>{data.join(" ")}</TableCell>
							</TableRow>
						)
					}).filter(row => row !== null).slice(-20)}
				</TableBody>
				{/* <TableFooter>
						<TableRow>
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right">$2,500.00</TableCell>
						</TableRow>
					</TableFooter> */}
			</Table>

			{modalText && <div className="absolute inset-0 z-10 backdrop-blur-2 bg-stone-800/70" onClick={() => setModalText(null)}>
				<Block
					className="absolute inset-16 w-[unset] max-h-40 my-auto flex items-center justify-center"
					onClick={e => e.stopPropagation()}
				>
					<Button onClick={() => setModalText(null)} />
					{modalText?.[0] ? "Ano" : "Ne"}
					<br />
					<span className="text-stone-300">{modalText?.[1]}</span>
				</Block>
			</div>}
		</>
	)
}

const aeXae = (str: string) => /[ae].*X.*[ae]/.test(str)


const Button: React.FC<{ onClick: AnyFunction }> = ({ onClick }) => (
	<button
		id="MenuButton"
		onClick={onClick}
		className="absolute top-2 right-2 size-6
		cursor-click
		flex items-center justify-center rounded-sm text-base font-extralight transition-colors duration-100 hover:!bg-stone-700 group-hover:bg-stone-900 selected:bg-stone-700
		"
	>
		⨉
	</button>
)
