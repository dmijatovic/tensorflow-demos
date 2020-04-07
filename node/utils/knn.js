const tf = require('@tensorflow/tfjs')

/**
 * Standardize data
 * @param {*} rawData
 */
function standardize(rawData){
  //
  const {mean, variance} = tf.moments(rawData, 0)


}


function knnNaive(fData, lData, k ){
  const features = tf.tensor([fData])
  const label = tf.tensor([lData])

}


module.exports={
  knnNaive
}