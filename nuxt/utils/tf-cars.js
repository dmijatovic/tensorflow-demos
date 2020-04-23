import * as tf from '@tensorflow/tfjs'
// import { minMaxNormalization } from './tf-data'

/**
 * Create sequantial model. Sequantial model has fully contected layers (dense)
 * which are stacked in sequance. The sequence is the order of layers in the array.
 * First item need to be input layer and has inputDim defined (number of features).
 * @param {Array} layers array of tensorflow layers to be used with model
 */
export function createSequentialModel(layers=[]){
  // debugger
  //create model
  const model = tf.sequential()
  // debugger
  // add layers to model
  layers.map(layer=>{
    model.add(layer)
  })
  //return model
  return model
}
/**
 * Create dense tensorflow layer. Dense layer is fully connected layer.
 * First layer of the model need to be input layer.
 * Input layer has inputDim defined (number of features).
 * @param {Object} args
 */
export function createDenseLayer(args){
  return tf.layers.dense(args)
}

/**
 * Define optimizer method to be used in the model.
 * @param {*} param0
 */
export function createOptimizer({name='sgd', ...options}){
  debugger
  switch(name.toLowerCase()){
    case "sgd":
      //options:{leraningRate}
      if (options && options.learningRate){
        return tf.train.sgd(options.learningRate)
      } else {
        throw new Error("createOptimizer: provide learningRate for SGD optimizer")
      }
    case "momentum":
      if (options && options.learningRate){
        return tf.train.momentum(options)
      }
    case "adam":
      const {learningRate,beta1,beta2,epsilon } = options
      return tf.train.adam(learningRate, beta1,beta2,epsilon)
    default:
      if (options){
        const {learningRate,beta1,beta2,epsilon } = options
        return tf.train.adam(learningRate, beta1,beta2,epsilon)
      } else {
        return tf.train.adam()
      }
  }
}

