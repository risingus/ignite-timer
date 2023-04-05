import { useEffect, useMemo, useState } from 'react';
import { Play } from 'phosphor-react'
import { differenceInSeconds } from 'date-fns';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod';
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().trim().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)

  const activeCycle = useMemo(() => {

    return (cycles.find((cycle) => cycle.id === activeCycleId) || null)

  }, [cycles, activeCycleId])

  const totalSeconds = useMemo(() => {
    if (!activeCycle) return 0

    return activeCycle.minutesAmount * 60

  }, [activeCycle])

  const currentSeconds = useMemo(() => {
    if (!activeCycle) return 0

    return totalSeconds - amountSecondsPassed

  }, [activeCycle, amountSecondsPassed, totalSeconds])

  const minutesAmount = useMemo(() => {

    return Math.floor(currentSeconds / 60)

  }, [currentSeconds])


  const secondsAmount = useMemo(() => {

    return currentSeconds % 60

  }, [currentSeconds])

  const minutes = useMemo(() => {
    return String(minutesAmount).padStart(2, '0')
  }, [minutesAmount])

  const seconds = useMemo(() => {
    return String(secondsAmount).padStart(2, '0')
  }, [secondsAmount])


  const { register, handleSubmit, watch, formState, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })
  const { errors } = formState
  const task = watch('task')
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

    reset()
  }



  useEffect(() => {
    if (!activeCycle) return;

    setInterval(() => {
      setAmountSecondsPassed(differenceInSeconds(new Date(), new Date(activeCycle.startDate)))
    }, 1000)

  }, [activeCycle])

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
          />
          <datalist id="taks-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Banana" />
          </datalist>
          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
