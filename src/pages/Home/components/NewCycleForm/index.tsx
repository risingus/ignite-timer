import { useContext } from 'react';
import { useFormContext } from 'react-hook-form'
import { CyclesContext } from '../..';
import { FormContainer, MinutesAmountInput, TaskInput } from './styles';

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        placeholder="Dê um nome para o seu projeto"
        list="task-suggestions"
        disabled={!!activeCycle}
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
        disabled={!!activeCycle}
        step={5}
        min={1}
        max={60}
        {...register('minutesAmount', { valueAsNumber: true })}
      />
      <span>minutos.</span>
    </FormContainer>
  )
}