import * as tf from '@tensorflow/tfjs'
import { standardizeValues } from "./tf-data"
import { create2DTensor } from './tf-utils'


//Tensorflow model object needs to be outside of state
//because of vuex observers
let tfModel = null

export function modelExist(){
  // debugger
  return tfModel!=null
}
/**
 * Get local tensorflow model object
 * @returns Tensorflow model tensor
 */
export function getModel(){
  return tfModel
}
/**
 * Set local model
 * @param {Object} model Tensorflow model object
 */
export function setModel(model){
  tfModel = model
}

export function createSequentialModel({layersDef, optimizerDef,
  lossDef, metrics=[], inputShape}){
  // debugger
  // const {layersDef, optimizerDef, lossDef, metrics=[], inputShape } = payload
  // create dense layers tensors
  const layers = createDenseLayers({layersDef, inputShape})
  // create sequential model
  const model = tf.sequential()
  // add layers to model
  layers.map(layer=>{
    model.add(layer)
  })
  //create optimizer tensor
  const optimizer = createOptimizer(optimizerDef)
  //compile model
  //https://js.tensorflow.org/api/latest/#tf.LayersModel.compile
  model.compile({
    optimizer,
    loss: lossDef.type,
    metrics
  })
  //return new model
  return model
}

/**
 * Create feature and label tensors from JS data array.
 * @param {Array} data the data array with all props and data that need to extracted and converted to tensors
 * @param {String} label the prop name of the label variable to be extracted from data array
 * @param {Array} features the list of features props to be extracted from data array
 * @returns {
 *  features: feature tensor,
 *  labels: label tensor
 * }
 */
export function createTensors({data=[], label="", features=[]}){
  const f=[], l=[]
  // debugger
  if (data.length===0) throw new Error("model.createTensors: data array is empty!")
  data.map(rec=>{
    let fts=[]
    l.push(rec[label])
    features.map(fld=>{
      fts.push(rec[fld])
    })
    f.push(fts)
  })

  if (f.length===0) throw new Error("model.createTensors: features array is empty!")
  if (l.length===0) throw new Error("model.createTensors: labels array is empty!")
  const ft = standardizeValues(f)
  const lb = create2DTensor(l)

  return{
    features: ft,
    labels: lb
  }
}
//---------------------------------------
// MODEL HELPER FUNCTIONS
//---------------------------------------
function createDenseLayers({layersDef=[], inputShape=[1]}){
  const layers = layersDef.map((layer, pos)=>{
    // debugger
    if (pos===0){
      //first layer should indicate how many
      //features we use as input
      layer['inputShape'] = inputShape
    }
    //create dense layer
    return tf.layers.dense({
      ...layer
    })
  })
  return layers
}

function createOptimizer(optimizerDef){
  const {type} = optimizerDef
  const args = {}
  optimizerDef.args.forEach(arg=>{
    // debugger
    if (arg.value){
      args[arg.name] = arg.value
    } else if(arg.required){
      args[arg.name] = arg.default
    } else {
      args[arg.name] = undefined
    }
  })

  switch(type.toLowerCase()){
    case "sgd":
      return tf.train.sgd(args['learningRate'])
    case "momentum":
      return tf.train.momentum(
        args['learningRate'],
        args['momentum'],
        args['useNesterov'])
    case "adagrad":
      return tf.train.adagrad(
        args['learningRate'],
        args['initialAccumulatorValue']
      )
    case "adam":
      return tf.train.momentum(
        args['learningRate'],
        args['beta1'],
        args['beta2'],
        args['epsilon']
      )
    default:
      console.error("Optimizer type not supported...", type)
      return null
  }
}
