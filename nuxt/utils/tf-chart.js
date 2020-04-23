import * as tfvis from '@tensorflow/tfjs-vis'

export function toggleVisor(){
  tfvis.visor().toggle()
}

export function lineChart({
  name='Line chart',
  tab='Line charts'},
  {values, series},
  config
){
  tfvis.render.linechart(
    {name, tab},
    {values, series},
    config
  );
  return tfvis
}

export function scatterPlot({
  name='Scatter',
  tab='Scatter'},
  {values, series},
  config
){
  tfvis.render.scatterplot(
    {name, tab},
    {values, series},
    config
  );
  return tfvis
}

export function historyChart(){
  tfvis.show.history(surface, history, ['loss', 'acc']);
}

export function visModel({model, ...options}){
  // {name: 'Model Summary', tab:"Model"}
  tfvis.show.modelSummary({...options}, model);
}

export function visLayer({layer, ...options}){
  // {name: 'Model Summary', tab:"Model"}
  tfvis.show.layer({...options}, layer);
}
