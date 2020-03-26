
export const state=()=>({
  data:[]
})

export const actions={
  getCarsData({commit}, action){
    console.log("getCarsData...", action)
    fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
    .then(resp=>resp.json())
    .then(data=>{
      return data
        .map(car => ({
          mpg: car.Miles_per_Gallon,
          horsepower: car.Horsepower,
        }))
        .filter(car => (car.mpg != null && car.horsepower != null));
    })
    .then(clean=>{
      console.log("Cleaned data...", clean)
      commit("setCarsData",{payload:clean})
      // return clean
    })
    .catch(e=>{console.error(e)})
  }
}

export const mutations={
  setCarsData(state, action){
    // debugger
    // console.log("setCarsData...", action)
    const {payload} = action
    state.cars = payload
  }
}
