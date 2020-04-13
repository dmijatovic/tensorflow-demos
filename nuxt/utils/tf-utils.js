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
  // memory cleanup
  return tf.tidy(()=>{
    //create features tensors
    //debugger
    const feat = create2DTensor(features)
    //create tensor with ones for constant
    const ones =  tf.ones([features.length, 1])
    //concatenate two tensors
    const axis = 1;
    const fset = tf.concat([
      ones,
      feat
    ], axis)

    //standardize values to -1 to +1
    const {mean, variance} = tf.moments(fset,0)
    // debugger
    // eplace all 0 variable values with 1 to avoid division by 0 = NaN problem
    // const corrector = variance.cast('bool').logicalNot().cast('float32')
    // variance.add(corrector)
    const fstd = fset
      .sub(mean)
      .div(variance.sqrt())
    // returned standardized features tensor
    return fstd
  })
}
/**
 * Gradien descent calculation. Supports both linear and logistic regression model.
 * Provide
 * @param {Tensor2d} features the independent variables
 * @param {Tensor2d} labels dependent variables
 * @param {Tensor2d} weights current weights to apply (contant + slopes)
 * @param {Float} step learning rate
 * @param {String} activation values 'sigmoid', 'softmax', 'mse', default is mse
 * @param {Float} sigmoidTreshold value when false breaks to true when activation type is sigmoid
 */
export function gradientDescend({features, labels, weights,
  ...options}){
  let {activation, step } = options
  //use tidy to free TF memory of temp used tensors
  return tf.tidy(()=>{
    // if (!activation) throw new Error("Activation type not provided")
    // make predictions based on current weights
    let predictions = makePrediction({features,weights,activation})
    // calculate deviation from actual = error
    const errPredictions = predictions.sub(labels)
    // use features size as sample size
    const sampleSize = features.shape[0]
    // calculate costs
    let cost
    if (activation.toLowerCase()==='mse'){
      //MSE cost calculation
      cost =  calcMSE({
        errPredictions,
        sampleSize
      })
    }else{
      //Cross Entropy error/cost calculation
      cost = calcCrossEntropy({
        labels,
        predictions,
        sampleSize
      })
    }
    // calculate gross weight correction using matrix multiplication
    const grossWeightsCorrection = features
      .transpose()
      .matMul(errPredictions)
      .div(sampleSize)

    const netWeightsCorrection = grossWeightsCorrection.mul(step)
    const newWeights = weights.sub(netWeightsCorrection)
    // debugger
    return {
      step,
      cost,
      weights: newWeights,
      grossWeightsCorrection: grossWeightsCorrection.arraySync()
    }
  })
}
/**
 * Make predictions based on provided features and weights. Supports linear
 * and logic regression models based on sigmoid and sigmoidTreshold flags.
 * If sigmoid is true and sigmoidTreshold is not provided delivers raw sigmoid values
 * @param {Tensor2d} features the independent variables
 * @param {Tensor2d} weights current weights to apply (contant + slopes)
 * @param {String} activation Fn to use, values 'sigmoid', 'softmax' or 'mse, default is MSE *
 */
export function makePrediction({features, weights, activation}){
  // debugger
  if (!activation) throw new Error("makePrediction: Activation type not provided")
  // apply weights to features
  let currentGuess = features
    .matMul(weights)
  // apply additional activation fn
  // mainly for logistic regression models
  switch (activation.toLowerCase()){
    case "sigmoid":
      // apply sigmoid Fn to prediction
      return currentGuess
        .sigmoid()
    case "softmax":
      // apply softmax Fn to prediction
      return currentGuess
        .softmax()
    case "mse":
    default:
      return currentGuess
  }
}
/**
 * Calculate MSE (mean-square-error). Used for linear regression models.
 * @param {Tensor} errPredictions tensor with difference (actual - prediction) = error of prediction
 * @param {Number} sampleSize sample size
 * @returns {Number} mean squared error (single) float value
 */
function calcMSE({errPredictions, sampleSize}){
  // square it, sumit and divide by sample size
  const mse = errPredictions
      .pow(2)
      .sum()
      .div(sampleSize)
      .arraySync()
  return mse
}
/**
 * Calculate Cross Entropy cost fn. It is used with logistic regression models.
 * @param {Tensor} labels tensor with actual labels from training set
 * @param {Tensor}  predictions tensor with predictions made
 * @param {Number} sampleSize sample size
 */
function calcCrossEntropy({labels, predictions, sampleSize}){
  // debugger
  const min1LogPredictions = predictions
    .mul(-1)
    .add(1)
    .log()

  const min1TransposeLabels = labels
    .mul(-1)
    .add(1)
    .transpose()

  const transposeLabels = labels
    .transpose()
  const logPredictions = predictions.log()
  const first = transposeLabels.matMul(logPredictions)

  const second = min1TransposeLabels
    .matMul(min1LogPredictions)

  const tot = first
    .add(second)
    .div(sampleSize)
    .mul(-1)

  // debugger
  if (tot.size > 1){
    //sum devitations for multivariate analyses
    //per column and take first item (all items should have same value)
    const res = tot
      .sum(0)
      .bufferSync()
      .get(0)
    return res
  } else {
    return tot
      .arraySync()
  }
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
      return cur.step * 1.05
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
/**
 * Classify raw predictions. This is usefull for logistic regression models.
 * @param {Tensor2d} rawPrediction tensor with raw prediction (weights applied)
 * @param {String} activation Fn to use, values 'sigmoid', 'softmax' or 'mse, default is MSE *
 * @param {Float} sigmoidTreshold value when false breaks to true when using sigmoid algorithm, default NULL
 */
export function classifyPrediction({rawPredictions, ...options}){
  const {activation, sigmoidTreshold=0.5} = options
  // debugger
  switch (activation.toLowerCase()){
    case "sigmoid":
      return rawPredictions
        .greater(sigmoidTreshold)
        .cast('float32')
    case "softmax":
      return rawPredictions
        .argMax(1)
    case "mse":
    default:
      return rawPredictions
  }
}

