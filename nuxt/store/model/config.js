export const state=()=>({
  epochs: 20,
  batchSize: 64,
  optimizer:{
    type:'sgd',
    args:[{
      name:'learningRate',
      type: Number,
      required: true,
      default: 0.125,
      value: 0.125
    }]
  },
  loss:{
    type:"meanSquaredError",
    args:null
  },
  layers:[],
  label:'Miles_per_Gallon',
  features:['Horsepower','Weight_in_lbs','Cylinders','YYYY']
})

export const mutations={
  set(state, payload){
    state = payload
  },
  setEpochs(state, payload){
    // debugger
    state.epochs = payload
  },
  setBatchSize(state,payload){
    // debugger
    state.batchSize = payload
  },
  addLayerDef(state, payload){
    // debugger
    state.layers.push(payload)
  },
  deleteLayerDef(state, payload){
    // debugger
    state.layers.splice(payload, 1)
    // console.log("layers...", state.layersDef)
  },
  setOptimizer(state,payload){
    // debugger
    state.optimizer = payload
  },
  setLoss(state,payload){
    // debugger
    state.loss = payload
  },
  setFeatures(state,payload){
    state.features = payload
  },
  setLabel(state,payload){
    state.label = payload
  }
}

export const getters={
  canCreateModel(state){
    // debugger
    const {epochs,batchSize,optimizer,loss,layers,features,label} = state
    try{
      if (!epochs) return false
      if (!batchSize) return false
      if (!optimizer.type) return false
      if (!loss.type) return false
      if (layers.length===0) return false
      if (features.length===0) return false
      if (!label) return false
      return true
    }catch(e){
      return false
    }
  },
  getModelConfig(state){
    return state
  }
}
