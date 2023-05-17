import { useContext, useEffect, useMemo, useState } from 'react'
import { CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../..'

export function Countdown() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed } = useContext(CyclesContext)


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


  useEffect(() => {
    let newInterval: number;
    if (!activeCycle) return;

    newInterval = window.setInterval(() => {
      const secondsDifference = differenceInSeconds(new Date(), new Date(activeCycle.startDate))

      if (secondsDifference >= totalSeconds) {
        markCurrentCycleAsFinished()
        setSecondsPassed(totalSeconds)
        clearInterval(newInterval);
        return;
      }

      setSecondsPassed(secondsDifference)
    }, 1000)

    return () => {
      clearInterval(newInterval);
    }

  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed])


  useEffect(() => {
    if (!activeCycle) {
      document.title = 'timer'
      return;
    }

    document.title = `${minutes}:${seconds}`

  }, [minutes, seconds, activeCycle])


  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}