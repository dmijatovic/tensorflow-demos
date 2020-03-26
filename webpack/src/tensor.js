// thrid party
import * as tf from "@tensorflow/tfjs"
import * as mobilenet from "@tensorflow-models/mobilenet"

import {addLoader,clearLoader} from "./loader"

let model=null

addLoader()

// load model
setTimeout(()=>{
  mobilenet.load()
  .then(m=>{
    model = m
    clearLoader()
  })
  .catch(e=>console.error("Failed to load model: ", e))
}, 1000)

/**
 * Classify image
 * @param {*} image
 */
function classifyImage(image){
  return model.classify(image)
}

/**
 * Create data tensor from image object
 * @param {HTMLImageObject} image
 */
function tensorFromImage(image, model="mobilenet"){

  const tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([224,224])
    .toFloat()

  if (model.toLowerCase()==="vgg"){
    // VGG model corrections
    const meanImageNetRGB = tf.tensor1d([123.68, 116.779,103.939])

    return tensor
      .sub(meanImageNetRGB)
      .reverse(2)
      .expandDims()

  } else if(model.toLocaleLowerCase()==="mobilenet"){
    // mobilenet correction
    const offset = tf.scalar(127.5)
    return tensor
      .sub(offset)
      .div(offset)
      .expandDims();
  } else {
    //no correction?!?
    return tensor
      .expandDims()
  }
}

export {
  tf,
  mobilenet,
  model,
  classifyImage,
  tensorFromImage
}
