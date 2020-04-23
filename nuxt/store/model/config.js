export const state=()=>({
  epochs: 20,
  batchSize: 64,
  layers:[],
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
  features:['Horsepower','Weight_in_lbs','Cylinders','YYYY'],
  // features:['Horsepower'],
  labels:'Miles_per_Gallon'
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
    debugger
    state.layers.push(payload)
  },
  deleteLayerDef(state, payload){
    debugger
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
  }
}
