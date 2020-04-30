
function classifyFn(val){
  if (parseInt(val) > 15){
    return 1
  }else {
    return 0
  }
}

function YYYY(rec){
  return parseInt(rec['Year'].substr(0,4))
}

function missingCheck(row){
  for (let col in row){
    if (col===null || col===""){
      return false
    }
  }
  //if we get here no invalid columns
  return true
}

export const state=()=>({
  validation: missingCheck,
  label:{
    //number, boolean, categorical
    type:'boolean',
    source:'Miles_per_Gallon',
    target:'Low_CO2_Emission',
    classifyFn,
  },
  features:['Horsepower','Weight_in_lbs','Cylinders', YYYY],
  data:[],
  createModelEnabled:false,
  trainModelEnabled:false,
  //save config here?!?
  config:null
})

export const actions={
  getCarsData({commit}, action){
    // console.log("getCarsData...", action)
    return fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
      .then(resp=>resp.json())
      .then(data=>{
        commit ("prepareData",data)
        return true
      })
      .catch(e=>{console.error(e)})
  }
}

export const mutations={
  prepareData(state, rawData){
    const data=[]
    // debugger
    rawData.forEach(row=>{
      const {label, features} = state
      const select=[]
      // classify function
      if (label.classifyFn){
        select[label.target] = label.classifyFn(row[label.source])
      }
      features.forEach(feature=>{
        if (typeof(feature)==='function'){
          select[feature.name]= feature(row)
        }else{
          select[feature]= row[feature]
        }
      })
      if (state.validation){
        if (state.validation(select)===true){
          data.push(select)
        }
      }else {
        data.push(select)
      }
    })
    //save data to state
    state.data = data
    state.rawData = rawData
  },
  setCreateModelEnabled(state,payload){
    // debugger
    state.createModelEnabled = payload
  },
  setTrainModelEnabled(state,payload){
    // debugger
    state.trainModelEnabled = payload
  }
}


export const getters={
  dataInfo: state =>{
    // debugger
    const {data, label, features} = state
    return{
      dataLength: data.length,
      labelTarget: label.target,
      labelType: label.type,
      featuresList: features.map(f=>{
        return typeof f ==='function' ? f.name : f
      })
    }
  }
}
