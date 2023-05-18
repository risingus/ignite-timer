import { createContext, useContext, useMemo, useState } from 'react';
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
import { CyclesContext } from '../../contexts/CyclesContext';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().trim().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { createNewCycle, interruptCurrentCycle, activeCycle } = useContext(CyclesContext)

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
    createNewCycle(form)
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} noValidate>

          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
        <Countdown />

        {
          activeCycle
            ? (
              <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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
