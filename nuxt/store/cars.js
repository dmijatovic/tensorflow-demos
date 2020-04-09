
export const state=()=>({
  carData:[],
  mpgData:[],
  plotData:[],
  carLabel:[]
})

export const actions={
  getCarsData({commit}, action){
    // console.log("getCarsData...", action)
    return fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
      .then(resp=>resp.json())
      .then(data=>{
        commit ("setCarsData",data)
      })
      .catch(e=>{console.error(e)})
  }
}

export const mutations={
  setCarsData(state, rawData){
    // console.log("setCarsData...", rawData)
    const plotData=[], carData=[], mpgData=[], carLabel=[]
    rawData.forEach(car=>{
      if (car['Miles_per_Gallon'] != null && car['Horsepower'] != null){
        plotData.push({
          x:car.Horsepower,
          y:car.Miles_per_Gallon
        })
        mpgData.push({
          mpg: car.Miles_per_Gallon,
          horsepower: car.Horsepower
        })
        carData.push({
          ...car,
          "YYYY": parseInt(car['Year'].substr(0,4))
        })
        carLabel.push(`${car['Name']} [${car['Year']}]`)
      }
    })
    //save data to state
    state.carData = carData
    state.plotData = plotData
    state.mpgData = mpgData
    state.carLabel = carLabel
  }
}
