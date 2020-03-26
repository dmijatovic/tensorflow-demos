export const state=()=>({
  loading:false
})

export const mutations={
  setLoading(state, action){
    const {payload} = action
    state.loading = payload
  }
}
