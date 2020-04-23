import * as tf from '@tensorflow/tfjs'
import {create2DTensor} from "./tf-utils"

/**
 * Get refrence to TF library object
 */
export function getTF(){
  return tf
}
/**
 * Get memory usage information from tensorflow
 */
export function memoryInfo(){
  return tf.memory()
}
/**
 * Clear tensorflow memory.
 * @param {Any} tensors list or tensor objects
 */
export function clearMemory(tensors){
  tf.dispose(tensors)
}

/**
 * Load CSV data set
 * @param {String} url
 */
export function getCSV(url){
  return tf.data.csv(url)
}

/**
 * Min/Max normalizations. Note! All data need to use same min/max.
 * Note! Min and max values are required for decoding values back
 * to original values.
 * @param {Array} data array of data
 * @returns {
 *  tensor: tensor with values 0 to 1,
 *  min: used min tensor,
 *  max: used max tensor
 * }
 */
export function minMaxNormalization(features, savedMin=null, savedMax=null){
  return tf.tidy(()=>{
    const data = create2DTensor(features)
    const min = savedMin || data.min()
    const max = savedMax || data.max()

    return {
      min,
      max,
      tensor: data.sub(min)
          .div(max.sub(min))
    }
  })
}
/**
 * Decode minmax normalized values back to natural values
 * @param {*} param0
 */
export function minMaxNaturalValues({tensor, min, max}){
  return tf.tidy(()=>{
    return tensor.mul(max.sub(min))
      .add(min)
  })
}

/**
 * Standardize data to values between -1 and 1
 * @param {Array} features
 * @returns {Tensor} 2Dtensor with standirdized values
 */
export function standardizeValues(features=[]){
  // memory cleanup
  return tf.tidy(()=>{
    //create features tensors
    // debugger
    const ft = create2DTensor(features)
    //standardize values to -1 to +1
    const {mean, variance} = tf.moments(ft,0)
    // debugger
    // eplace all 0 variable values with 1 to avoid division by 0 = NaN problem
    // const corrector = variance.cast('bool').logicalNot().cast('float32')
    // variance.add(corrector)
    const fstd = ft
      .sub(mean)
      .div(variance.sqrt())
    // returned standardized features tensor
    return fstd
  })
}

/**
 * Save tensorflow model to local storage.
 * @param {String} name model name to use to save mode in local storage
 * @param {Tensor} model tensord of the model with all info
 * @returns Promise
 */
export function saveModelToLS(name, model){
  const storageKey = `localstorage://${name}`
  return model.save(storageKey)
}

export function listSavedModels(){
  return tf.io.listModels()
}

export function loadModelFromLS(name){
  const storageKey = `localstorage://${name}`
  let info

  return listSavedModels(name)
    .then(list=>{
      debugger
      if (list.hasOwnProperty(storageKey)){
        info = list[storageKey]
        return tf.loadLayersModel(storageKey)
      } else {
        return null
      }
    })
    .then(model=>{
      debugger
      if (model){
        return {
          info,
          model
        }
      }else {
        throw new Error (`$name models not found in local storage`)
      }
    })
    .catch(e=>{
      debugger
      throw new Error(e.message)
    })
}


/**
 * Calculate square root of R. This is goodness of fit for MSE.
 * @param {Tensor} prediction tensor with predictions
 * @param {Tensor} labels tensor with labels (actual results)
 */
export function rSquared(predictions, labels){
  debugger
  const SSres = labels
    .sub(predictions)
    .square()
    .sum()
    .arraySync()

  const SStot = labels
    .sub(labels.mean())
    .square()
    .sum()
    .arraySync()

  // debugger
  const R = 1 - (SSres/SStot)
  return R
}
