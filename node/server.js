
const loadCSV = require('./utils/load-csv')


const file = './data/kc_house_data.csv'

const config={
  shuffle:true,
  splitTest:10,
  dataColumns:['lat','long'],
  labelColumns:['price']
}

const {features,labels,testFeatures, testLabels} = loadCSV(file,config)

console.log("loadCSV...", testLabels)
