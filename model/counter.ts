import { PatchListener, WritableDraft } from 'immer/dist/internal'
import * as t from 'io-ts'
import { AssignAction, createMachine } from 'xstate'

import { assign, ImmerAssigner } from '../flavor/xstate'

export const IncrementEvent = t.readonly(t.type({
    type: t.literal("increment"),
    quantity: t.number
}))

export type IncrementEvent = t.TypeOf<typeof IncrementEvent>

export function isAIncrementEvent(event: {type: string}) : event is IncrementEvent {
  return event.type == "increment"
}

export const SetEvent = t.readonly(t.type({
  type: t.literal("set"),
  quantity: t.number
}))

export type SetEvent = t.TypeOf<typeof SetEvent>

export function isASetEvent(event: {type: string}) : event is SetEvent {
  return event.type == "set"
}


export const CounterEvent = t.union([IncrementEvent, SetEvent])
export type CounterEvent = t.TypeOf<typeof CounterEvent>


export const Context = t.readonly(t.type({
    value: t.number
}))
export type Context = t.TypeOf<typeof Context>

export type CounterTypeState = {value: 'active', context: Context}


export const handleSet = assign((ctx : WritableDraft<Context>, event : SetEvent) => {
    ctx.value = event.quantity
})

export const handleIncrement = assign((ctx : WritableDraft<Context>, event : IncrementEvent) => {
    ctx.value += event.quantity
})

export const CounterMachine = createMachine<Context, CounterEvent, CounterTypeState>({
    id: 'counter',
    initial: 'active',
    states: {
        active: {
            on: {
                set: {actions: ['handleSet']},
                increment: {actions: 'handleIncrement'},
            }
        }
    }
})

export function mkDefaultCounterMachine(options : {patchListener: PatchListener}) {
    return CounterMachine.withConfig({
        actions: {
            handleSet: handleSet.listener(options.patchListener) as AssignAction<Context, CounterEvent>,
            handleIncrement: handleSet.listener(options.patchListener) as AssignAction<Context, CounterEvent>,
        }
    })
}