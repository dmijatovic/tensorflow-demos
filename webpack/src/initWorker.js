
import {Reducer} from './reducer'

export function initWorker(){
  if (window.Worker) {
    tfWorker = new Worker('tensorWorker.js')
    // console.log("tfWorker...loaded...", tfWorker)

    tfWorker.onmessage = Reducer

    tfWorker.onerror = err =>{
      console.log("tfWorker...onerror...", err)
    }

    tfWorker.postMessage({
      type:"LOAD_MODEL",
      payload: "mobielnet"
    })
    return true
  }
}