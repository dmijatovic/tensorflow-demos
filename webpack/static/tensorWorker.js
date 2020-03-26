// thrid party
// importScripts(
//   'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.7.0',
//   'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.0.4'
// )

// loads global object tf
self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.7.0')
// loads global object mobilenet
self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.0.4')

//will be loaded
let model

/**
 * Receive messages from main app.
 * We use redux action format for communicating
 */
onmessage = function({data}){
  // notify
  // console.log("action received ...", data)
  const {type, payload} = data
  switch(type){
    case "LOAD_MODEL":
      LoadModel(data)
      break;
    case "CLASSIFY":
      Classify(data)
      break;
    case "PREDICT":
      Predict(data)
      break;
    default:
      throw new Error(`ACTION TYPE ${type} - UNKNOWN!`)
  }
  //echo back
  //postMessage({...data})
}

// console.log("tensorWorker...tfjs...", tfjs)
// console.log("tensorWorker...mobilenet", mobilenet)

function LoadModel(action){
  const {type, payload} = action
  // debugger
  // start
  mobilenet.load()
    .then(resp=>{
      console.log("tensorWorker...LoadModel...", resp)
      console.log("tfjs...", tf)
      console.log("tfjs...backend...", tf.getBackend())
      model = resp
      postMessage({
        type:"MODEL_LOADED",
        payload:"DONE"
        // payload: {
        //   mobilenet,
        //   model,
        //   tf
        // }
      })
    })
}
/**
 * Classification function from basic model
 * @param {Object} action
 */
function Classify(action){
  const {type, payload} = action
  model.classify(payload)
    .then(resp => {
      console.log("tensorWorker...Classify...", resp)
      postMessage({
        type:"CLASSIFIED",
        payload: [
          ...resp
        ]
      })
    })
}

/**
 * This is more granulated approach with tf?!?
 * @param {Object} action
 */
function Predict(action){
  const {type, payload} = action
  debugger
  model.classify(payload)
    .then(resp => {
      console.log("tensorWorker...Predict...", resp)
      postMessage({
        type:"CLASSIFIED",
        payload: [
          ...resp
        ]
      })
    })
}