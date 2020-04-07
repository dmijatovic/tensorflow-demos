import * as tf from '@tensorflow/tfjs'
import { initializers } from '@tensorflow/tfjs'

let features=[]
let labels=[]
let weights=[]
let R=null

let corr=[]

let options={
  step: 0.0001,
  units: 100
}

function getInfo(){
  const [c,s] = weights.arraySync()
  const info = {
    ...options,
    model: {
      const:c[0],
      slope:s[0],
      finalCorrection: corr
    },
    Rsq: R
  }
  //remove data
  delete info.features
  delete info.labels
  return info
}

/**
 * Validate configuration object
 * @param {Object} config
 * @param {Promise} rej
 */
function validate(config, rej){
  if (config.features.length===0){
    rej({
      err: "Feature array lenght===0",
      ...config
    })
  }
}

function init(){
  options={
    step: 0.0001,
    units: 100
  }
  features=[]
  labels=[]
  weights=[]
  R=null
}

function createTensor(f=[]){
  const t = tf.tensor(f,[f.length, f[0].length || 1])
  return t
}

/**
 * Standardize feature values
 * @param {Object} config - features
 */
function standardizeFeatures({features}){
  // debugger
  //create features tensors
  const feat = createTensor(features)
  //create tensor with onces for constant
  const ones =  tf.ones([features.length, 1])
  //concatenate two tensors
  const axis = 1;
  const fset = tf.concat([
    ones,
    feat
  ], axis)

  //standardize values to -1 to +1
  const {mean, variance} = tf.moments(fset,0)
  const fstd = fset
    .sub(mean)
    .div(variance.sqrt())
  // returned standardized features tensor
  return fstd
}

/**
 * Calculate the line fit of regression model
 * @param {Object} config {
 *  step: 0.0001,
    units: 100,
    features:[],
    labels:[]
 * }
 */
function lineFit(config){
return new Promise((res,rej)=>{
try{

  validate(config,rej)

  init()

  options={
    ...config
  }
  const {units} = options

  labels = tf.tensor(config.labels, [config.labels.length, 1])

  //create standardized features tensors
  features = standardizeFeatures(config)
  // console.log("features created...", features.shape)
  //create inital weights
  //these are constant and slope (richting coef.)
  weights = tf.zeros([2,1])

  //find the optimum
  for (let i=0;i<units;i++){
    const resp = gradientDescend(config.step)
    corr = resp
    // console.log("Corrections...", resp)
  }

  //get model accuracy
  R = rSquared(options)
  // console.log("Rquared...", R)
  // return model info
  res(getInfo())

}catch(e){
  debugger
  console.error(e)
  const info = getInfo()
  info['err'] = e
  rej(info)}
})}

/**
 * Gradien descent calculation of linear model
 * @param {Float} step learning rate
 */
function gradientDescend(step=0.01){
  // make current gusses based on
  const currentGuess = features.matMul(weights)
  const errorGuess = currentGuess.sub(labels)

  // calculate correction using matrix multiplication
  const grossCorrection = features
    .transpose()
    .matMul(errorGuess)
    .div(features.shape[0])

  const netCorrection = grossCorrection.mul(step)

  weights = weights.sub(netCorrection)

  return netCorrection.arraySync()
}

/**
 * Calculate square root of R. This is goodness of fit.
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



export default lineFit
