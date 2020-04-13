import * as tf from '@tensorflow/tfjs'

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
 * Min/Max normalizations
 * @param {Tensor} data data tensor to be normalized
 * @returns tensor with values 0 to 1
 */
export function minMaxNormalization(data){
  return tf.tidy(()=>{
    const min = data.min()
    const max = data.max()

    return data.sub(min)
      .div(max.sub(min))
  })
}
