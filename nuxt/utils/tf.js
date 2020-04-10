import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

/**
 * Creating linear model based on training
 * https://codelabs.developers.google.com/codelabs/tfjs-training-regression/index.html#3
 */
export function createLinearModel(units){
  //create sequential model - linear model
  //see https://js.tensorflow.org/api/latest/#sequential
  const model = tf.sequential()

  // Add a single input layer
  model.add(tf.layers.dense({inputShape: [1], units, useBias: true}));

  model.add(tf.layers.dense({units: 24, activation: 'sigmoid', useBias: true}))
  // Add an output layer
  model.add(tf.layers.dense({units: 1, useBias: true}));

  return model;
}

export function drawScatterplot({name,tab,values,series},config){
  // debugger
  tfvis.render.scatterplot(
    {name, tab},
    {values, series},
    {...config}
  );
}

export function visModel(model){
  tfvis.show.modelSummary({name: 'Model Summary', tab:"Model"}, model);
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 * https://codelabs.developers.google.com/codelabs/tfjs-training-regression/index.html#4
 */
export function convertToTensor(data) {
  // Wrapping these calculations in a tidy will dispose any
  // intermediate tensors.

  return tf.tidy(() => {
    // Step 1. Shuffle the data
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map(d => d.horsepower)
    const labels = data.map(d => d.mpg);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  });
}

export function trainModel(model, {inputs, labels}) {
  // Prepare the model for training.
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  const batchSize = 64;
  const epochs = 64;
  //train the model - fit the line
  return model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    // callbacks: tfvis.show.fitCallbacks(
    //   { name: 'Training Performance' },
    //   ['loss', 'mse'],
    //   { height: 200, callbacks: ['onEpochEnd'] }
    // )
  });
}

export function testModel(model, inputData, normalizationData) {
  const {inputMax, inputMin, labelMin, labelMax} = normalizationData;

  // Generate predictions for a uniform range of numbers between 0 and 1;
  // We un-normalize the data by doing the inverse of the min-max scaling
  // that we did earlier.
  const [xs, preds] = tf.tidy(() => {

    //generate 100 cases
    const xs = tf.linspace(0, 1, 100);
    const preds = model.predict(xs.reshape([100, 1]));

    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin);

    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin);

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });


  const predictedPoints = Array.from(xs).map((val, i) => {
    return {x: val, y: preds[i]}
  });

  const originalPoints = inputData.map(d => ({
    x: d.horsepower, y: d.mpg,
  }));

  tfvis.render.scatterplot(
    {
      name: 'Model Predictions vs Original Data',
      tab: "Model"
    },{
      values: [originalPoints, predictedPoints],
      series: ['original', 'predicted']
    },{
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  );
}

export function makePrediction(model,{inputMax, inputMin, labelMin, labelMax}){
  // Generate predictions for a uniform range of numbers between 0 and 1;
  // We un-normalize the data by doing the inverse of the min-max scaling
  // that we did earlier.
  const [xs, preds] = tf.tidy(() => {
    //generate 100 cases
    const xs = tf.linspace(0, 1, 100);
    const preds = model.predict(xs.reshape([100, 1]));

    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin);

    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin);

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });

  const predictedPoints = Array.from(xs).map((val, i) => {
    return {x: val, y: preds[i]}
  });

  return predictedPoints
}

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
  name='Line chart',
  tab='Line charts'},
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
