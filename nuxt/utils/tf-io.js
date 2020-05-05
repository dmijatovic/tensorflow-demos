import * as tf from '@tensorflow/tfjs'
//---------------------------------------
// MODEL IO
//---------------------------------------
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

