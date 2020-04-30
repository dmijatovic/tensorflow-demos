import * as tf from '@tensorflow/tfjs'

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


//---------------------------------------
// HELPER FUNCTIONS
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
