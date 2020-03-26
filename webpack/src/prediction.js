
const prediction = document.getElementById("prediction-section")

export function formatProbability(p){
  // one decimal
  const pct = Math.round(p * 1000) / 10
  return `${pct}%`
}

export function showPrediction(predictions=[]){
  let html = predictions.reduce((acc,cur)=>{
    return acc+=`
      <tr class="prediction-item">
        <td class="class-name">
          ${formatProbability(cur['probability'])}
        </td>
        <td class="class-name">${cur['className']}</td>
      </div>
    `
  },"<table><tr><td>Conf %</td><td>Class</td></tr>")
  //close table
  html+='</table>'
  //write to html
  prediction.innerHTML = html
}

export function clearPrediction(){
  prediction.innerHTML = `Click on Predict to make prediction`
}



