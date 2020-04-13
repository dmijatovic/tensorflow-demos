import * as tf from '@tensorflow/tfjs'
import {
  validate,
  standardizeFeatures,
  create2DTensor,
  gradientDescend,
  tuneLearningRate,
  makePrediction,
  classifyPrediction
} from "./tf-utils"

let features=[]
let labels=[]
let weights=[]
let epochStat=[]
let options={}
let optimum=[]
let R=null

function getInfo(append={}){
  const [c,...s] = weights.arraySync()
  const info = {
    cycles: epochStat.length,
    ...options,
    ...append,
    Rsq: R,
    // optimum,
    weights: weights.arraySync(),
    cost: epochStat.map(r=> r.cost),
    tfMemory: tf.memory()
  }
  //remove data
  delete info.features
  delete info.labels
  return info
}

function init(){
  //clear tf memory
  tf.dispose()
  //save options
  options={
    step: 0.01,
    epochs: 100,
    treshold: 0.001,
    activation:'mse'
  }
  features=[]
  labels=[]
  weights=[]
  optimum=[]
  epochStat=[]
  R=null
}

/**
 * Calculate the weights of logistic regression model
 * @param {Object} config {
 *  step: 0.0001,
    epochs: 100,
    features:[],
    labels:[]
 * }
 */
function trainModel(config){
return new Promise((res,rej)=>{
try{
  validate(config,rej)
  init()
  options={
    ...options,
    ...config
  }
  const {epochs, batchSize, activation} = options
  //get initial learning rate
  let step = options.step
  //create labels tensor
  labels = create2DTensor(config.labels)
  //create standardized features tensors
  features = standardizeFeatures(config)
  //create inital weights
  //these are constant and slope (richting coef.)
  weights = tf.zeros([features.shape[1],labels.shape[1]])

  //find the optimum
  for (let i=0; i<epochs; i++){
    // do one epoch / one pass
    let stats
    if (batchSize){
      step = batchGradientDescend({
        features,
        labels,
        epoch:i,
        step,
        batchSize,
        activation
      })
    }else{
      stats = gradientDescend({
        features,
        labels,
        weights,
        step,
        activation
      })
      //update weights
      weights = stats.weights
      //save epoch statistics
      saveEpochStats({
        epoch: i,
        ...stats
      })
      // update learning rate based on cost history
      step = tuneLearningRate({
        epochStat,
        step,
        options
      })
    }
    //check if we need to break
    if (step === 0) {
      //save how many runs we did
      debugger
      options.epochs = i
      break;
    }
  }
  //get model accuracy
  R = accuracy()
  // console.log("Rquared...", R)
  // return model info
  res(getInfo())
}catch(e){
  debugger
  console.error(e)
  const info = getInfo({err: e['message']})
  rej(info)
}
})}
/**
 *
 * @param {Object} param0
 */
function batchGradientDescend({features, labels, epoch, step=0.01,
  batchSize=50, activation}){
  //calculate loop cycle
  const cycles = Math.floor(features.shape[0] / batchSize)
  //local help vars
  let r1=0, c1=0, r2=batchSize, c2=-1 //-1=all columns
  for (let i=0; i < cycles;i++){
    // debugger
    //slice batch from main data
    //[start position], [rows,cols] to take
    const f = features.slice([r1,c1],[r2,c2])
    const l = labels.slice([r1,c1],[r2,c2])
    const s = gradientDescend({
      features:f,
      labels:l,
      weights,
      step,
      activation
    })
    //update weights
    weights = s.weights
    //save epoch statistics
    saveEpochStats({
      epoch,
      batch: i,
      ...s
    })
    //update first rec position
    r1+= batchSize
    // update learning rate based on cost history
    step = tuneLearningRate({
      epochStat,
      step,
      options
    })
  }
  //return last step
  return step
}

function saveEpochStats(stats){
  // debugger
  //remove weights tensor (save only arrays)
  delete stats.weights
  //save epoch stats
  epochStat.push(stats)
}

/**
 * Calculate the goodness of fit of logistic model.
 */
function accuracy(){
  const {activation, sigmoidTreshold} = options
  // const ft = createTensor(features)
  const rawPredictions = makePrediction({
    features,
    weights,
    activation
  })

  switch(activation.toLowerCase()){
    case "sigmoid":
      return sigmoidAccuracy({
        rawPredictions,
        sigmoidTreshold
      })
    case "softmax":
      return softmaxAccuracy(rawPredictions)
    case "mse":
    default:
      return rSquared()
  }
}

function sigmoidAccuracy({rawPredictions, sigmoidTreshold=0.5 }){

  const sampleSize = features.shape[0]

  const predictions = classifyPrediction({
    rawPredictions,
    activation:'sigmoid',
    sigmoidTreshold
  })
  const wrong = predictions
    .sub(labels)
    .abs()
    .sum()
    .div(sampleSize)

  const falsPositive = predictions
    .greater(labels)
    .sum()
    .div(sampleSize)
    .arraySync()

  const falsNegative = predictions
    .less(labels)
    .sum()
    .div(sampleSize)
    .arraySync()

  const acc = wrong
    .sub(1)
    .abs()
    .arraySync()

  return {
    acc,
    activation:'sigmoid',
    sigmoidTreshold,
    falsPositive,
    falsNegative
  }
}

function softmaxAccuracy(rawPredictions){
  const sampleSize = features.shape[0]
  const predictions = classifyPrediction({
    rawPredictions,
    activation:'softmax'
  })

  const lbl = labels.argMax(1)

  const acc = predictions
    .notEqual(lbl)
    .sum()
    .div(sampleSize)
    .sub(1)
    .abs()
    .arraySync()

  return{
    acc,
    activation:'softmax'
  }
}
/**
 * Calculate square root of R. This is goodness of fit for MSE.
 */
function rSquared(){
  // debugger
  // const ft = createTensor(features)
  const predictions = features.matMul(weights)

  const SSres = labels
    .sub(predictions)
    .square()
    .sum()
    .arraySync()

  // const mean = features.mean()

  const SStot = labels
    .sub(labels.mean())
    .square()
    .sum()
    .arraySync()

  // debugger
  const R = 1 - (SSres/SStot)
  return R
}
/**
 * Make prediction for given features and the model
 * @param {Array} features to base prediction on
 * @param {Array} weights to use from logistic model
 */
export function predict({features=[], weights=[],
  ...config}){
  const {activation, sigmoidTreshold=0.5} = config
  const prediction = tf.tidy(()=>{
    debugger
    const ft = standardizeFeatures({features})
    const w = tf.tensor2d(weights,[weights.length, 1])
    const rawPredictions = makePrediction({
      features: ft,
      weights: w,
      activation
    })
    return classifyPrediction({
      rawPredictions,
      activation,
      sigmoidTreshold
    })
  })
  return prediction.arraySync()
}

export default trainModel
