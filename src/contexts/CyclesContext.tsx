import { ReactNode, createContext, useMemo, useState, useReducer, useEffect } from 'react';
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer';
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from '../reducers/cycles/actions';
import { differenceInSeconds } from 'date-fns';

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CycleContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CycleContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null
  }, (initialState) => {
    const storedStateAsJson = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')
    if (!storedStateAsJson) return initialState
    return JSON.parse(storedStateAsJson);
  })
  const { cycles, activeCycleId } = cyclesState

  const activeCycle = useMemo(() => {
    return (cycles.find((cycle) => cycle.id === activeCycleId) || undefined)
  }, [cycles, activeCycleId])

  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(() => {
    if (!activeCycle) return 0
    const secondsDifference = differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    return secondsDifference
  })

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    try {

      dispatch(interruptCurrentCycleAction())

    } catch (error) {
      console.dir(error);
    }
  }

  useEffect(() => {

    const stateJson = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJson)

  }, [cyclesState])

  return (
    <CyclesContext.Provider value={{ cycles, activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed, createNewCycle, interruptCurrentCycle }}>
      {children}
    </CyclesContext.Provider>
  )
}