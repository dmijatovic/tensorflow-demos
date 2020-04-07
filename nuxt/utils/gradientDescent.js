/**
 * Naive gradient descent implementation in JavaScript.
 * This module is created to increase my understanding
 * of gradiend descent approach in machine learning.
 */
let options={
  units: 1000,
  learnRate: 0.1,
  features:[],
  labels:[]
}

let slope = 0
let constant = 0

function init(){
  options={
    units: 1000,
    learnRate: 0.1,
    features:[],
    labels:[]
  }
  slope=0
  constant=0
}

/**
 * Fit line to data
 * @param {Object} config {
 *  units: 1000,
 *  learnRate: 0.1,
 *  features: [],
 *  labels: []
 * }
 */
function fitLine(config){

  init()

  options={
    ...config
  }

  if (config.step) options.learnRate = config.step

  let cError, sError

  function getStatus(){
    return {
      err:`Did not converge after ...${options.units}`,
      slope,
      constant,
      cError,
      sError
    }
  }
  //run training
  return new Promise((res,rej)=>{
  try{
    for (let i=0; i<options.units;i++){

      const {constError, slopeError} = gradiendDescent(options)

      //check if errors are close to 0
      if (constError.toString()
        .replace(".","")
        .replace("-","")
        .substr(0,4)==="0000" &&
        slopeError.toString()
          .replace(".","")
          .replace("-","")
          .substr(0,4)==="0000"){
          console.log("converged at...", i)
          // return
        res({
          slope,
          constant
        })
      } else {
        cError = constError
        sError = slopeError
      }
    }
    //did not coverged within max attempts
    rej(getStatus())
  } catch(e) {
    rej(getStatus())
  }})
}

function gradiendDescent({features=[], labels=[], learnRate}){

  const currentGuess = features.map(item =>{
    if (slope===0){
      return 0 + constant
    }else {
      return (slope * item) + constant
    }
    // return parseFloat(slope * row[0] + constant)
  })

  let constError = currentGuess
    .map((guess,i)=>{
      //calculate diff guess - actual
      return guess - labels[i]
    })
    .reduce((sum,val)=>{
      //sum differences
      return sum+=val
    },0)


  let slopeError = currentGuess
    .map((guess,i)=>{
      //calculate diff guess - actual
      return -1 * features[i] * (labels[i] - guess)
    })
    .reduce((sum,val)=>{
      //sum differences
      return sum+=val
    },0)

  //correct constant estimation
  if (constError && learnRate){
    constError = (constError * 2) / features.length
    constant = constant - (constError * learnRate)
  } else {
    debugger
    throw new Error("Parameters incorrect")
  }
  //correct slope estimate
  if (slopeError && learnRate){
    slopeError = (slopeError * 2) / features.length
    slope = slope - (slopeError * learnRate)
  } else {
    debugger
    throw new Error("Parameters incorrect")
  }

  return {
    constError,
    slopeError
  }
}

export default fitLine
