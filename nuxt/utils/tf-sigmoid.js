import * as tf from '@tensorflow/tfjs'
import {
  validate,
  standardizeFeatures,
  create2DTensor,
  gradientDescend,
  tuneLearningRate,
  makePrediction
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
    weights: {
      const:c[0],
      slopes:s,
      // epochStat
    },
    cost: epochStat.map(r=> r.cost)
  }
  //remove data
  delete info.features
  delete info.labels
  return info
}

function init(){
  options={
    step: 0.01,
    epochs: 100,
    treshold: 0.001,
    sigmoid: true,
    sigmoidTreshold: 0.5
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
  const {epochs, batchSize} = options
  //create labels tensor
  labels = create2DTensor(config.labels)
  //create standardized features tensors
  features = standardizeFeatures(config)
  //create inital weights
  //these are constant and slope (richting coef.)
  debugger
  weights = tf.zeros([features.shape[1],labels.shape[1]])
  //get initial learning rate
  let step = options.step
  //find the optimum
  for (let i=0; i<epochs; i++){
    // do one epoch / one pass
    let stats
    // debugger
    if (batchSize){
      step = batchGradientDescend({
        features,
        labels,
        epoch:i,
        step,
        batchSize
      })
    }else{
      stats = gradientDescend({
        features,
        labels,
        weights,
        step
      })
      //save epoch statistics
      saveEpochStats({
        epoch: i,
        ...stats
      })
    }
    // update learning rate based on MSE history
    step = tuneLearningRate({
      epochStat,
      step,
      options
    })
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
  rej(info)}
})}
/**
 *
 * @param {Object} param0
 */
function batchGradientDescend({features, labels, epoch, step=0.01, batchSize=50}){
  const {sigmoid, sigmoidTreshold} = options
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
      sigmoid
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
    // update learning rate based on MSE
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
  // debugger
  const {sigmoid, sigmoidTreshold} = options
  // const ft = createTensor(features)
  const predictions = makePrediction({
    features,
    weights,
    sigmoid,
    sigmoidTreshold
  })
  const sampleSize = features.shape[0]

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
    falsPositive,
    falsNegative
  }
}

/**
 * Make prediction for given features and the model
 * @param {Array} features to base prediction on
 * @param {Array} weights to use from logistic model
 */
export function predict(features=[],weights=[],
  sigmoid=true, sigmoidTreshold=0.5){
  const ft = standardizeFeatures({features})
  const w = tf.tensor2d(weights,[weights.length, 1])
  const p = makePrediction({
    features: ft,
    weights: w,
    sigmoid,
    sigmoidTreshold
  })
  return p.arraySync()
}

export default trainModel
