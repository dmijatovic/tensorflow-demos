
export function formatValue(type, value){
  switch(type){
    case "int":
      if (value===""){
        return null
      } else {
        return parseInt(value)
      }
    case "long":
    case "double":
    case "float":
      if (value===""){
        return null
      } else {
        return parseFloat(value)
      }
    case "boolean":
      if (value===""){
        return null
      } else {
        return value === "true"
      }
    case "string":
      return value
    default:
      if (value===""){
        return null
      } else {
        return value
      }
  }
}

export default formatValue
