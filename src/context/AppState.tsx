import { createContext, useContext, useMemo } from "react"

import { useShallowState } from "@/hooks"
import { contextFallbackFunction } from "@/utils"

type AppStateType = {
	/** Connected to the websocket. */
	wsConnected?: boolean
	/** Started receiving data after sending "Start" signal. */
	wsStarted?: boolean
}

const defaultState: AppStateType = {
	wsConnected: false,
	wsStarted: false,
}

type ShallowStateType = ReturnType<typeof useShallowState<AppStateType>>

type AppStateContextType = {
	setState: ShallowStateType[1]
	appState: AppStateType
	refState: ShallowStateType[3]
} & ShallowStateType[2]

const defaultContext: AppStateContextType = {
	setState: contextFallbackFunction,
	appState: defaultState,
	clearState: contextFallbackFunction,
	clearProperty: contextFallbackFunction,
	resetState: contextFallbackFunction,
	resetProperty: contextFallbackFunction,
	deleteState: contextFallbackFunction,
	deleteProperty: contextFallbackFunction,
	refState: { current: defaultState as AppStateType },
}

const AppStateContext = createContext<AppStateContextType>(defaultContext)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
	const [appState, setState, utils, refState] = useShallowState<AppStateType>(defaultContext.appState)

	const value = useMemo(() => ({ appState, setState, ...utils, refState }), [appState]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<AppStateContext.Provider value={value}>
			{children}
		</AppStateContext.Provider>
	)
}

export const AppState = AppStateContext.Consumer

export const useAppState = () => useContext(AppStateContext)
