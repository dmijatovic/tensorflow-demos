import * as tf from '@tensorflow/tfjs'

/**
 * Validate configuration object
 * @param {Object} config
 * @param {Promise} rej
 */
export function validate(config, rej){
  if (config.features.length===0){
    rej({
      err: "Feature array lenght===0",
      ...config
    })
  }
}

/**
 * Create 2d tensor from data array
 * @param {Array} f
 */
export function create2DTensor(f=[]){
  const t = tf.tensor(f,[f.length, f[0].length || 1])
  return t
}

/**
 * Standardize feature values
 * @param {Object} config - features
 */
export function standardizeFeatures({features}){
  // debugger
  //create features tensors
  const feat = create2DTensor(features)
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
 * Gradien descent calculation. Supports both linear and logistic regression model.
 * Provide
 * @param {Tensor2d} features the independent variables
 * @param {Tensor2d} labels dependent variables
 * @param {Tensor2d} weights current weights to apply (contant + slopes)
 * @param {Float} step learning rate
 * @param {Boolean} sigmoid use sigmoid fn to convert estimates to values between 0 and 1
 * @param {Float} sigmoidTreshold value when false breaks to true
 */
export function gradientDescend({features, labels, weights, step=0.01,
  sigmoid=false, sigmoidTreshold=null}){
  // debugger
  // make predictions based on current weights
  let predictions = makePrediction({features,weights,sigmoid,sigmoidTreshold})
  // calculate deviation from actual = error
  const errPredictions = predictions.sub(labels)
  // use features size as sample size
  const sampleSize = features.shape[0]
  // calculate costs
  let cost
  if (sigmoid){
    //Cross Entropy error/cost calculation
    cost = calcCrossEntropy({
      labels,
      guesses: predictions,
      sampleSize
    })
  }else {
    //MSE cost calculation
    cost =  calcMSE({
      errPredictions,
      sampleSize
    })
  }
  // calculate gross weight correction using matrix multiplication
  const grossWeightsCorrection = features
    .transpose()
    .matMul(errPredictions)
    .div(sampleSize)

  const netWeightsCorrection = grossWeightsCorrection.mul(step)

  weights = weights.sub(netWeightsCorrection)

  return {
    cost,
    step,
    weights,
    grossWeightsCorrection: grossWeightsCorrection.arraySync()
  }
}
/**
 * Make predictions based on provided features and weights. Supports linear
 * and logic regression models based on sigmoid and sigmoidTreshold flags.
 * If sigmoid is true and sigmoidTreshold is not provided delivers raw sigmoid values
 * @param {Tensor2d} features the independent variables
 * @param {Tensor2d} weights current weights to apply (contant + slopes)
 * @param {Boolean} sigmoid use sigmoid fn to convert estimates to values between 0 and 1, default FALSE
 * @param {Float} sigmoidTreshold value when false breaks to true, default NULL
 */
export function makePrediction({features, weights, sigmoid=false, sigmoidTreshold=null}){
  let currentGuess
  // debugger
  if (sigmoid){
    // debugger
    currentGuess = features
      .matMul(weights)
      .sigmoid()

    if (sigmoidTreshold){
      // debugger
      currentGuess = currentGuess
        .greater(sigmoidTreshold)
        .cast('float32')
    }
  }else{
    currentGuess = features
      .matMul(weights)
  }
  return currentGuess
}

function calcMSE({errPredictions, sampleSize}){
  // square it, sumit and divide by sample size
  const mse = errPredictions
      .pow(2)
      .sum()
      .div(sampleSize)
      .arraySync()
  return mse
}
function calcCrossEntropy({labels, guesses, sampleSize}){
  // debugger
  const min1LogGuesses = guesses
    .mul(-1)
    .add(1)
    .log()

  const min1TransposeLabels = labels
    .mul(-1)
    .add(1)
    .transpose()

  const transposeLabels = labels
    .transpose()
  const logGuesses = guesses.log()
  const first = transposeLabels.matMul(logGuesses)

  const second = min1TransposeLabels
    .matMul(min1LogGuesses)

  const res = first
    .add(second)
    .div(sampleSize)
    .mul(-1)
    .arraySync()

  return res
}
/**
 * Calculate optimal learning rate.
 * The step to walk gradient descent function
 */
export function tuneLearningRate({epochStat, step, options}){
  // debugger
  const x = epochStat.length
  if (x > 1){
    const [pre, cur] = epochStat.slice(x-2)
    if (pre.cost < cur.cost) {
      // debugger
      //overshooting minimum
      //get cost 2 epochs ago
      const pra = epochStat[x-3]
      if (pra && pra.cost < pre.cost){
        //we already overshooted
        const init = defaultStep(options)
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
        if (!pra){
          //reduce default step
          return defaultStep(options) * 0.5
        } else {
          return defaultStep(options)
        }
      }
    } else if (pre.cost > cur.cost) {
      // current error is smaller
      return cur.step * 1.25
    } else {
      // equal cost in two runs
      // is this optimum (local minimum?!?)
      // debugger
      if (optimalMinimum(cur, options)===true){
        // do not move, return zero step?!?
        return 0
      }else {
        return step
      }
    }
  } else {
    return defaultStep(options)
  }
}
function defaultStep(options){
  if (options.step){
    return options.step
  } else {
    //default step
    return 0.001
  }
}
function optimalMinimum({grossWeightsCorrection},{treshold}){
  const all = grossWeightsCorrection.reduce((tot,val)=>{
    return tot+=Math.abs(val)
  },0)
  if (all < treshold){
    return true
  } else {
    return false
  }
}

