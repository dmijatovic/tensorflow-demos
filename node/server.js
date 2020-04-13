
const loadCSV = require('./utils/load-csv')
const tf = require("@tensorflow/tfjs")

const file = './data/kc_house_data.csv'

console.log("backend...", tf.backend())

const config={
  shuffle:true,
  splitTest:10,
  dataColumns:['lat','long'],
  labelColumns:['price']
}

const {features,labels,testFeatures, testLabels} = loadCSV(file,config)

console.log("loadCSV...", testLabels)
