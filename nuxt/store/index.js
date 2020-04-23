export const state=()=>({
  loader:{
    show: false,
    message: "Loading..."
  },
})

export const mutations={
  setLoader(state, payload){
    state.loader = payload
  }
}
