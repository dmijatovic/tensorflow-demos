import Dv4ClimbingDot from "@dv4all/loaders/lib/climbing-dot"

// init loader
const loaderSection = document.getElementById('loader-area')

/**
 * Add loader to loader-area section
 * @param {String} type custom element type (loader type)
 */
function addLoader(){
  const el = new Dv4ClimbingDot()
  //create loader element
  // let el = document.createElement(type)
  //add overlay
  // el.setAttribute('overlay', true)
  el.setAttribute('overlay', true)
  //set Loading... text
  el.innerText = 'Initializing...'
  //listen to destroy
  // el.addEventListener('click', clearLoader)
  //add no scroll
  // body.classList.toggle("noscroll")
  //append to loader section
  loaderSection.appendChild(el)
}

/**
 * Remove elements from loader-area section
 */
function clearLoader(){
  // body.classList.toggle('noscroll')
  loaderSection.innerHTML = ""
}

export {
  addLoader,
  clearLoader
}