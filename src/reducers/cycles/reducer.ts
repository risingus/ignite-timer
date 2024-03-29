import { produce } from 'immer'
import { ActionTypes, CycleActions } from './actions'

export interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptedDate?: Date
	finishedDate?: Date
}

interface CyclesState {
	cycles: Cycle[]
	activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: CycleActions) {
	switch (action.type) {
		case ActionTypes.ADD_NEW_CYCLE: {
			// return {
			// 	...state,
			// 	activeCycleId: action.payload.newCycle.id,
			// 	cycles: [...state.cycles, action.payload.newCycle],
			// }

			return produce(state, (draft) => {
				if (!action?.payload) return state
				draft.cycles.push(action.payload)
				draft.activeCycleId = action.payload.id
			})
		}

		case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
			// return {
			// 	...state,
			// 	cycles: state.cycles.map((cycle) => {
			// 		if (cycle?.id !== state.activeCycleId) return cycle
			// 		return {
			// 			...cycle,
			// 			interruptedDate: new Date(),
			// 		}
			// 	}),
			// 	activeCycleId: null,
			// }

			const currentCycleIndex = state.cycles.findIndex((cycle) => {
				return cycle.id === state.activeCycleId
			})

			if (currentCycleIndex < 0) return state

			return produce(state, (draft) => {
				draft.activeCycleId = null
				draft.cycles[currentCycleIndex].interruptedDate = new Date()
			})
		}

		case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
			// return {
			// 	...state,
			// 	cycles: state.cycles.map((cycle) => {
			// 		if (cycle?.id !== state.activeCycleId) return cycle
			// 		return {
			// 			...cycle,
			// 			finishedDate: new Date(),
			// 		}
			// 	}),
			// 	activeCycleId: null,
			// }
			const currentCycleIndex = state.cycles.findIndex((cycle) => {
				return cycle.id === state.activeCycleId
			})

			if (currentCycleIndex < 0) return state

			return produce(state, (draft) => {
				draft.activeCycleId = null
				draft.cycles[currentCycleIndex].finishedDate = new Date()
			})
		}

		default:
			return state
	}
}
