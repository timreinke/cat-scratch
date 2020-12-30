import {interpret} from 'xstate'

import {CounterEvent, CounterMachine, mkDefaultCounterMachine} from '../model/counter'

import * as immer from "immer"
immer.enablePatches()

let listen = (...args) => console.log(args)

let svc : any = interpret(mkDefaultCounterMachine({patchListener: listen}).withContext({value: 13}))
svc.start()
svc.send({type: 'increment', quantity: 12})

console.log(svc.state.context)
console.log("heya!")
setTimeout(() => {}, 1)