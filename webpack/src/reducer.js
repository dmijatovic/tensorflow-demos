
export function Reducer({data}){
  const {type, action} = data
  // console.log("Reducer...", type)
  switch(type){
    case "MODEL_LOADED":
      // clearLoader()
      break;
    case "CLASSIFIED":
      showPrediction(action.payload)
      break;
    default:
      console.error(`Reducer...${type}...NOT SUPPORTED!`)
  }
}