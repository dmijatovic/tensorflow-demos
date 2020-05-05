// import * as tf from '@tensorflow/tfjs'
import * as tfmodel from "../../utils/tf-model"
import { saveModelToLS, loadModelFromLS } from "../../utils/tf-data"

export const state=()=>({
  name: "",
  createdAt: null,
  stadium: "new",
  training:{
    timeSpend: 0,
    trainedAt: null,
  }
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
  /**
   * Create sequential model using tensorflow.js
   * @param {Object} context
   * @param {Object} action.payload
   * @returns {Object} model Tensorflow model object/tensor
   */
  async createSequentialModel({state,commit},{payload}){
    // debugger
    const model = tfmodel.createSequentialModel(payload)
    commit("setTrainingTimeSpend", 0)
    return model
  },
  async trainModel({state},{payload}){
    //commit to loading
    if (tfmodel.modelExist===false) throw new Error("Create model first")
    const tfModel = tfmodel.getModel()
    //start time
    const startTime = new Date()
    //training arguments
    const {args} = payload
    // debugger
    //feature and label tensors
    // const {features, labels} = await dispatch("createTensors", payload)
    const {features, labels} = tfmodel.createTensors(payload)
    // debugger
    //training
    const stats = await tfModel.fit(features, labels, args)
    // debugger
    //time taken
    const trainingEnd = new Date()
    const trainingTime = trainingEnd - startTime
    stats['timeSpend'] = trainingTime
    stats['trainedAt'] = trainingEnd
    // log data source
    stats['source'] = 'model/trainModel'
    return stats
  }
}

export const mutations={
  setModelName(state, payload){
    state.name = payload
  },
  setModelStadium(state, payload){
    state.stadium = payload
  },
  saveModel(state, payload){
    // debugger
    const {name, model} = payload
    //save model
    tfmodel.setModel(model)
    //save model info
    state.name = name
    state.stadium = "created"
    state.createdAt = new Date(),
    //remove training info
    state.training={
      timeSpend: 0,
      trainedAt: null
    }
  },
  setTrainingTimeSpend(state,payload){
    state.training.timeSpend = payload
  },
  addTrainingTimeSpend(state,payload){
    state.training.timeSpend += payload
  },
  setTrainingStats(state, payload){
    const {training} = state
    if (training.timeSpend){
      //additional training
      state.training = joinTraningStats(training,payload)
    }else{
      state.training = payload
    }
  }
}

export const getters={
  modelExist(state){
    // debugger
    const {stadium} = state
    let exist = false
    if (["created", "trained"].includes(stadium)===false){
      exist = false
    }
    exist = tfmodel.modelExist()
    return exist
  },
  getModel(state){
    const model = tfmodel.getModel()
    return model
  },
  getModelInfo(state){
    const {name,createdAt,stadium} = state
    // debugger
    return{
      name,
      createdAt,
      stadium
    }
  },
  getTrainingInfo(state){
    const {training} = state
    let acc=[], loss=[]
    if (training && training.history){
      acc = training.history?.acc
      loss = training.history?.loss
    }
    return {
      timeSpend: training.timeSpend,
      maxAccuracy: acc.reduce((max,val)=>{
        if (max === null || max < val) {
          return Math.round(val*10000)/10000
        } else {
          return max
        }
      }, null),
      lossRange:[
        loss.length > 0 ? Math.round(loss[0]*10000)/10000 : null,
        loss.length > 0 ? Math.round(loss[loss.length-1]*10000)/10000 : null,
      ]
    }
  }
}


function joinTraningStats(oldStats,newStats){
  let totalStats={
    ...newStats
  }
  const {history:oldH} = oldStats
  const {history:newH} = newStats
  //join loss
  totalStats.history.loss = [
    ...oldH.loss,
    ...newH.loss
  ]
  //join acc
  totalStats.history.acc = [
    ...oldH.acc,
    ...newH.acc
  ]
  //sum training time
  totalStats.timeSpend+=oldStats.timeSpend
  return totalStats
}
