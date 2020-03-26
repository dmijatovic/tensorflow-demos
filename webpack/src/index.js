// tensorflow.js
import {classifyImage} from "./tensor"

// import {Dv4IconCamera} from '@dv4all/icons'
import {Dv4CustomButton, Dv4InfoModal} from '@dv4all/web-components'

// project modules
import {addLoader, clearLoader} from "./loader"
import {loadFile,addImage} from "./fileLoader"
import {showPrediction, clearPrediction} from "./prediction"

// TensorFlow worker
// let tfWorker
// loaded image data

let imgData

function addEventListeners(){
  const browseBtn = document.getElementById("browse-btn")
  const predictBtn = document.getElementById("predict-btn")
  const fileInput = document.getElementById("file-input")

  //add event listener
  fileInput.addEventListener("change",(el)=>{

    loadFile(el)
      .then(dataUrl=>{
        return addImage(dataUrl)
      })
      .then(data=>{
        if (data) imgData = data
      })
      .then(()=>{
        clearPrediction()
      })
      .catch(e=>console.error("loadFile: ", e))
  })

  browseBtn.addEventListener("click",()=>{
    fileInput.click()
  })

  predictBtn.addEventListener("click",({target})=>{
    // console.log("button...", target)
    makePrediction()
  })
}

function makePrediction(){
  // get image
  const image = document.getElementById("img-predict")

  classifyImage(image)
    .then(pred=>{
      // console.log("Predictions...", pred)
      showPrediction(pred)
    })
    .catch(e=>console.error(e))

  // ATTEMPT TO USE WEB WORKER - not succefull
  // const tensor = TensorFromImage(image)
  // if (tensor){
  //   tfWorker.postMessage({
  //     type:"PREDICT",
  //     payload: tensor
  //   })
  // }
}

addEventListeners()






