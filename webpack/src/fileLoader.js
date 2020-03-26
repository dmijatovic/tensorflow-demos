
function loadFile({target}){
  return new Promise((res,rej)=>{
    const reader = new FileReader()
    if (target.files.length===0) res(null)
    reader.onload = () =>{
      const dataUrl = reader.result
      // addImage(dataUrl)
      res(dataUrl)
    }
    const file = target.files[0]
    reader.readAsDataURL(file)
  })
}

function addImage(dataUrl){
  const imgSection = document.getElementById("image-section")
  if (imgSection && dataUrl){
    //clear previous
    imgSection.innerHTML=""
    //create new image
    const el = document.createElement('img')
    el.setAttribute("src", dataUrl)
    el.setAttribute("id","img-predict")
    el.classList.add("image")
    imgSection.appendChild(el)
    //save this for worker?!?
    return dataUrl
  }
}

function makePrediction(){
  const image = document.getElementById("img-predict")
  console.log("Make prediction")
}

function showPrediction(prediction){
  const predSection = docucment.getElementById("prediction-section")
  console.log("Show prediction")
}


export {
  loadFile,
  addImage
}






