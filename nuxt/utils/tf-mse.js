import * as tf from '@tensorflow/tfjs'

let features=[]
let labels=[]
let weights=[]
let R=null
let epochStat=[]
let options={}
let optimum=[]

function getInfo(append={}){
  const [c,...s] = weights.arraySync()
  const info = {
    ...options,
    ...append,
    Rsq: R,
    // optimum,
    weights: {
      const:c[0],
      slopes:s,
      // epochStat
    },
    mse: epochStat.map(r=> r.mse)
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
    units: 100,
    treshold: 0.001
  }
  features=[]
  labels=[]
  weights=[]
  optimum=[]
  epochStat=[]
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
    ...options,
    ...config
  }

  const {units, batchSize} = options

  labels = tf.tensor(config.labels, [config.labels.length, 1])

  //create standardized features tensors
  features = standardizeFeatures(config)
  // console.log("features created...", features.shape)
  //create inital weights
  //these are constant and slope (richting coef.)
  weights = tf.zeros([features.shape[1],1])
  //get initial learning rate
  let step = options.step
  //find the optimum
  for (let i=0;i<units;i++){
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
        step
      })
      //save pass stats
      epochStat.push({
        epoch: i,
        ...stats
      })
    }
    // update learning rate based on MSE
    step = tuneLearningRate(step)
    //check if we need to break
    if (step === 0) {
      //save how many runs we did
      options.units = i
      break;
    }
  }
  //get model accuracy
  R = rSquared(options)
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
function batchGradientDescend({features, labels, epoch, step=0.01,batchSize=50}){
  //calculate loop cycle
  const cycles = Math.floor(features.shape[0] / batchSize)
  //local help vars
  let stats=[], r1=0, c1=0, r2=batchSize, c2=-1 //-1=all columns
  for (let i=0; i < cycles;i++){
    // debugger
    //slice batch from main data
    //[start position], [rows,cols] to take
    const f = features.slice([r1,c1],[r2,c2])
    const l = labels.slice([r1,c1],[r2,c2])
    const s = gradientDescend({
      features:f,
      labels:l,
      step
    })
    epochStat.push({
      epoch,
      batch: i,
      ...s
    })
    r1+= batchSize
    // update learning rate based on MSE
    step = tuneLearningRate(step)
  }
  //return last step
  return step
}

/**
 * Gradien descent calculation of linear model
 * @param {Float} step learning rate
 */
function gradientDescend({features, labels, step=0.01}){

  // make current guesses based on current weights
  const currentGuess = features.matMul(weights)
  // calculate deviation from actual = error
  const errorGuess = currentGuess.sub(labels)
  // debugger
  // calculate mse
  const mse = errorGuess
    .pow(2)
    .sum()
    .div(features.shape[0])
    .arraySync()

  // calculate gross weight correction using matrix multiplication
  const grossWeightsCorrection = features
    .transpose()
    .matMul(errorGuess)
    .div(features.shape[0])

  const netWeightsCorrection = grossWeightsCorrection.mul(step)

  weights = weights.sub(netWeightsCorrection)

  return {
    mse,
    step,
    grossWeightsCorrection: grossWeightsCorrection.arraySync()
  }
}
/**
 * Calculate optimal learning rate.
 * The step to walk gradient descent function
 */
function tuneLearningRate(step){
  const x = epochStat.length
  // debugger
  if (x > 1){
    const [pre, cur] = epochStat.slice(x-2)
    if (pre.mse < cur.mse) {
      //overshooting minimum
      //get mse 2 epochs ago
      const pra = epochStat[x-3]
      if (pra && pra.mse < pre.mse){
        //we already overshooted
        const init = defaultStep()
        if (init === pre.step){
          // we need to reduce defaultStep too
          return init * 0.50
        } else if (init < pre.step) {
          return init
        } else {
          // debugger
          return pre.step * 0.50
        }
      }else {
        return defaultStep()
      }
    } else if (pre.mse > cur.mse) {
      // current error is smaller
      return cur.step * 1.25
    } else {
      // these are equal?!?
      //save this as optimum
      optimum.push(cur)
      // check if slope epochStatections
      // debugger
      // are close to 0
      if (optimalMinimum(cur)===true){
        // do not move?!?
        // return zero?
        return 0
      }else {
        return step
      }
    }
  } else {
    return defaultStep()
  }
}

function defaultStep(){
  if (options.step){
    return options.step
  } else {
    //default step
    return 0.001
  }
}

function optimalMinimum({grossepochStat}){
  const all = grossepochStat.reduce((tot,val)=>{
    return tot+=Math.abs(val)
  },0)
  if (all < options.treshold){
    return true
  } else {
    return false
  }
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

/**
 * Make prediction for given features and the model
 * @param {Array} features to base prediction on
 * @param {Array} weights to use from mse model
 */
export function predict(features=[],weights=[]){
  const ft = standardizeFeatures({features})
  const w = tf.tensor2d(weights,[weights.length, 1])
  const p = ft.matMul(w)
  return p.arraySync()
}

export default lineFit
