import * as tfvis from '@tensorflow/tfjs-vis'

export const state=()=>({
  visible:false,
})

export const actions={
  toggleVisor({commit},action){
    commit("toggleVisor",true)
  },
  plotTrainingLoss({commit}, payload){
    // debugger
    if (payload.payload){
      payload = payload.payload
    }
    const {loss, name, tab} = payload
    //prepare values
    const values = loss.map((val,i)=>{
      return {
        x: i,
        y: val
      }
    })
    const series=['Loss']
    const config={
      yLabel:'Loss',
      xLabel:'Epoch'
    }
    //create line chart
    commit("lineChart",{name,tab,values,series, config})
    return true
  }
}

export const mutations={
  toggleVisor(state,payload){
    tfvis.visor().toggle()
    state.visible = !state.visible
  },
  lineChart(state,{name,tab,values,series,config}){
    // debugger
    tfvis.render.linechart(
      {name, tab},
      {values, series},
      config
    )
  },
  scatterPlot(state,{name,tab,values,series,config}){
    tfvis.render.scatterplot(
      {name, tab},
      {values, series},
      config
    );
  }
}
