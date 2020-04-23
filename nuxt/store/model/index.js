import * as tf from '@tensorflow/tfjs'
import { saveModelToLS, loadModelFromLS, standardizeValues } from "../../utils/tf-data"
import { create2DTensor } from '../../utils/tf-utils'

//Tensorflow model object needs to be outside of state
//because of vuex observers
let tfModel = null

export const state=()=>({
  status: "idle",
  name: "",
  info: null,
  trainingStats: null,
})

export const actions={
  saveModel({state,commit}, action){
    debugger
    const {name, model} = action
    return saveModelToLS(name, model)
      .then(resp=>{
        commit("saveModel", {name,model})
      })
      .catch(e=>{
        state.status = "error"
        state['err'] = e
        throw new Error(e.message)
      })
  },
  loadModel({state,commit},action){
    if (state.name){
      const model = loadModelFromLS()
      commit("saveModel",{
        name:state.name,
        model
      })
    }else{
      console.log("No model saved to load")
    }
  },
  createSequentialModel({state,commit},{payload}){
    const {layersDef, layersDef:{[0]:firstLayer}} = state
    const losses=[]
    // console.log("Create model...", state.layersDef)
    const layers = layersDef.map((layer, pos)=>{
      // debugger
      if (pos===0){
        //first layer should indicate how many
        //features we use as input
        layer['inputShape'] = payload['inputShape']
      }
      losses.push(layer.loss)
      //create dense layer
      return tf.layers.dense({
        ...layer
      })
    })
    // console.log("Layers...", layers)
    // create model with layers
    const model = tf.sequential()
    // debugger
    // add layers to model
    layers.map(layer=>{
      model.add(layer)
    })
    //compile model
    //debugger
    //https://js.tensorflow.org/api/latest/#tf.LayersModel.compile
    model.compile({
      optimizer: firstLayer.optimizer,
      loss: firstLayer.loss,
    })
    //save model
    tfModel = model
    //set model flag
    commit("setModel", true)
    //remove training time
    commit(
      "model/options/setTrainingOptions",
      {item:'timeSpent',value:0},
      {root:true}
    )
  },
  async trainModel({state,commit, dispatch},{payload}){
    //commit to loading
    commit("setLoader", {show:true,message:"Training..."},{ root: true })
    //start time
    const startTime = new Date()
    //training arguments
    const {args} = payload
    //feature and label tensors
    const {features, labels} = await dispatch("createTensors", payload)
    //training
    const stats = await tfModel.fit(features, labels, args)
    //time taken
    const trainingTime = new Date() - startTime
    stats['trainingTime'] = trainingTime
    //log data source
    stats['source'] = 'model/trainModel'
    //update training time
    commit(
      "model/options/setTrainingOptions",
      {item:'timeSpent',value:trainingTime},
      {root:true}
    )
    //save stats
    commit("setTrainingStats", stats)
    //plot loss chart
    dispatch({
      type: "model/visor/plotTrainingLoss",
      payload: {
        ...stats.history,
        name:"Model loss",
        tab:"Model"
      }},{root:true}
    )
    //return stats
    return stats
  },
  async createTensors({state},{data=[], label="", features=[]}){
    const f=[], l=[]

    data.map(rec=>{
      let fts=[]
      l.push(rec[label])
      features.map(fld=>{
        fts.push(rec[fld])
      })
      f.push(fts)
    })

    const ft = standardizeValues(f)
    const lb = create2DTensor(l)

    state['label'] = label
    state['features'] = features

    return{
      features: ft,
      labels: lb
    }
  }
}

export const mutations={
  setModelName(state, payload){
    state.name = payload
  },
  setStatus(state, action){
    const {payload} = action
    state.status = payload
  },
  saveModel(state, payload){
    state.name = name
    state.tfModel = model
  },
  setModel(state, payload){
    //set flag
    state.model = payload
  },
  setTrainingStats(state, payload){
    state.trainingStats = payload
  }
}

export const getters={
  // getLayersInfo(state){
  //   const {layersDef} = state
  //   const li = layers.map(layer=>{
  //     debugger
  //     console.log("layer...", layer)
  //     return {
  //       name: layer.name,
  //       units: layer.units,
  //       useBias: layer.useBias,
  //       activation: layer.activation,
  //       losses: layer.losses,
  //       weights: layer.weights,
  //     }
  //   })
  //   debugger
  //   return li
  // },
  tfModelExists(){
    if (tfModel){
      return true
    } else {
      return false
    }
  },
  getTensorFlowModel(){
    return tfModel
  }
  // itemIsInStore: state =>{
  //   return (item)=>{
  //     const path = item.split("/")
  //     return state.hasOwnProperty(item)
  //   }
  // }
}
