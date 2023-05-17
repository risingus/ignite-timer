import { createContext, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form'
import { HandPalm, Play } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().trim().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})


type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CycleContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CycleContextType)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)


  const activeCycle = useMemo(() => {

    return (cycles.find((cycle) => cycle.id === activeCycleId) || undefined)

  }, [cycles, activeCycleId])

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })
  const { handleSubmit, watch, formState, reset } = newCycleForm
  const task = watch('task')

  const { errors } = formState
  const isSubmitDisabled = !task


  function handleCreateNewCycle(form: NewCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: form.task,
      minutesAmount: form.minutesAmount,
      startDate: new Date()
    }

    setCycles((prevState) => [
      ...prevState,
      newCycle
    ])

    setActiveCycleId(id)
    setAmountSecondsPassed(0);
    reset()
  }

  function setSecondsPassed() {

  }

  function markCurrentCycleAsFinished() {
    setCycles((prevState) => prevState.map((cycle) => {
      if (cycle?.id !== activeCycleId) return cycle;
      return {
        ...cycle,
        finishedDate: new Date()
      }
    }))
  }

  function handleInterruptCycle() {
    try {
      setCycles((prevState) => prevState.map((cycle) => {
        if (cycle?.id !== activeCycleId) return cycle;
        return {
          ...cycle,
          interruptedDate: new Date()
        }
      }))

      setActiveCycleId(null);
    } catch (error) {
      console.dir(error);
    }
  }


  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>

        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed }}>

          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {
          activeCycle
            ? (
              <StopCountdownButton type="button" onClick={handleInterruptCycle}>
                <HandPalm size={24} />
                Interromper
              </StopCountdownButton>
            )
            : (
              <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
                <Play size={24} />
                Começar
              </StartCountdownButton>
            )
        }
      </form>
    </HomeContainer>
  )
}
