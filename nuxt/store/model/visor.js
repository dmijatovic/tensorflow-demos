import * as tfvis from '@tensorflow/tfjs-vis'


function formatData(data=[], labels=['Loss','Epochs']){
  const values = data.map((val,i)=>{
    return {
      x: i,
      y: val
    }
  })
  const series=[labels[0]]
  const config={
    yLabel:labels[0],
    xLabel:labels[1]
  }
  return{
    values,
    series,
    config
  }
}

export const state=()=>({
  visible:false,
})

export const actions={
  toggleVisor({commit},action){
    commit("toggleVisor",true)
  },
  plotTraining({commit}, payload){
    // debugger
    if (payload.payload){
      payload = payload.payload
    }
    const {acc, loss, name, tab} = payload
    //prepare values
    let setting = formatData(loss,['Loss','Epochs'])
    //create line chart
    commit("lineChart",{name:"Loss chart",tab,...setting})
    //prepare values
    setting = formatData(acc,['Acc','Epochs'])
    commit("lineChart",{name:"Acc chart",tab,...setting})
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
