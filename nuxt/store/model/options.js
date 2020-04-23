export const state=()=>({
  training:{
    epochs: 20,
    batchSize: 128,
  },
  activations:[{
    type:'elu',
    args:[]
  },{
    type:'relu',
    args:[]
  },{
    type:'relu6',
    args:[]
  },{
    type:'hardSigmoid',
    args:[]
  },{
    type:'sigmoid',
    args:[]
  },{
    type:'softmax',
    args:[]
  },{
    type:'softplus',
    args:[]
  },{
    type:'linear',
    args:[]
  },{
    type:'tanh',
    args:[]
  }],
  //https://js.tensorflow.org/api/latest/#Training-Optimizers
  optimizers:[{
    type:'sgd',
    args:[{
      name:'learningRate',
      type: 'float',
      required: true,
      default: 0.125
    }]
  },{
    type:'momentum',
    args:[{
      name:'learningRate',
      type: 'float',
      required: true,
      default: 0.125
    },{
      name:'momentum',
      type: 'int',
      required: true,
      default: 1
    },{
      name:'useNesterov',
      type: 'boolean',
      required: false,
    }]
  },{
    type:'adagrad',
    args:[{
      name:'learningRate',
      type: 'float',
      required: true,
      default: 0.125
    },{
      //Starting value for the accumulators, must be positive
      name:'initialAccumulatorValue',
      type: 'float',
      required: false,
    }]
  },{
    type:'adam',
    args:[{
      name:'learningRate',
      type: 'float',
      required: false,
      default: 0.125
    },{
      // The exponential decay rate for the 1st moment estimates
      name:'beta1',
      type: 'float',
      required: false,
    },{
      // The exponential decay rate for the 2nd moment estimates
      name:'beta2',
      type: 'float',
      required: false,
    },{
      // A small constant for numerical stability.
      name:'epsilon',
      type: 'float',
      required: false,
    }]
  }],
  losses:[{
    type:'meanSquaredError',
    args:[]
  },{
    type:'binaryCrossentropy',
    args:[]
  },{
    type:'sigmoidCrossEntropy',
    args:[]
  },{
    type:'softmaxCrossEntropy',
    args:[]
  }]
})

export const mutations={
  set(state, payload){
    state = payload
  },
  setTrainingOptions(state,payload){
    // debugger
    const {item, value} = payload
    state.training[item] = value
  }
}

export const getters={
  getTrainingOptions:state=>{
    const {training} = state
    return {
      ...training
    }
  },
  getActivationOptions:state=>{
    const {activations} = state
    const list = activations.map(item=>{
      return item.type
    })
    return list.toString()
  },
  // getOptimizers:state=>{
  //   const {activations} = state
  //   return (activation='')=>{
  //     if (!activation) return ""
  //     const a = activations.filter(a=>{
  //      return  a.type === activation
  //     })
  //     if (a.length>0){
  //       return a[0].optimizer.toString()
  //     }
  //   }
  // },
  getOptimizerOptions:state=>{
    const {optimizers} = state
    const list = optimizers.map(item=>{
      return item.type
    })
    return list.toString()
  },
  getLossOptions:state=>{
    const {losses} = state
    const list = losses.map(item=>{
      return item.type
    })
    return list.toString()
  },
  // getLoss:state=>{
  //   const {activations} = state
  //   return (activation='')=>{
  //     if (!activation) return ""
  //     const a = activations.filter(a=>{
  //      return  a.type === activation
  //     })
  //     if (a.length>0){
  //       return a[0].loss.toString()
  //     }
  //   }
  // },
  // getLossArgs: state => {
  //   const {optimizers} = state
  //   return (optimizer)=>{
  //     return optimizers.filter(o=>{
  //       o.type === optimizer
  //     })
  //   }
  // }
}
