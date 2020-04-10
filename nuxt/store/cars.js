
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
    const plotData=[], carData=[], mpgData=[], carLabel=[], passedTest=[]
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
          "YYYY": parseInt(car['Year'].substr(0,4)),
          "Low_CO2_Emission": car['Miles_per_Gallon'] > 15 ? 1 : 0,
          "Fuel_Efficiency": fuelEfficiency(car['Miles_per_Gallon'])
        })
        carLabel.push(`${car['Name']} [${car['Year']}]`)
      }
    })
    //save data to state
    state.carData = carData
    state.plotData = plotData
    state.mpgData = mpgData
    state.carLabel = carLabel
    state.passedTest = passedTest
  }
}

/**
 * Make 3 fuel efficiency classes
 * low, medium, high
 * @param {Float} mpg
 * @returns {Array} [low, medium, heigh] with 0 - 1 value
 */
function fuelEfficiency(mpg){
  let fe=[0,0,0]
  // debugger
  if (mpg < 16){
    fe[0]=1
  } else if(mpg < 32){
    fe[1]=1
  } else {
    fe[2]=1
  }
  return fe
}
