/**
 * Create set of distinct values and return it as array.
 * @param {Array} array
 */
function distinct(array=[]){
  const d = [...new Set(array)]
  return d
}

export default distinct
