import {getCSV} from "../utils/tf-data"

export const state=()=>({
  url:'/data/kc_house_data.csv',
  housesData:[],
})

export const actions={
  getHousesData({commit,state}, action){
    // console.log("getCarsData...", action)
    if (state.housesData.length > 0) return true
    return getCSV(state.url)
      .toArray()
      .then(resp=>resp)
      .then(data=>{
        commit ("setHousesData",data)
      })
      .catch(e=>{console.error(e)})
      .finally(()=>{
        return true
      })
  }
}

export const mutations={
  setHousesData(state, rawData){
    // console.log("setCarsData...", rawData)
    const plotData=[]
    rawData.forEach(row =>{
      if (row['price'] != null
        && row['sqft_living'] != null
        && row['sqft_lot'] != null){
        // debugger
        plotData.push({
          x:row['sqft_living'],
          y:row['price']
        })
      }
    })
    //save data to state
    state.housesData = rawData
    state.plotData = plotData
    // state.mpgData = mpgData
    // state.carLabel = carLabel
  }
}
