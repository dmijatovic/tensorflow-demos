<template>
  <article>
    <section
      id="image-section"
      >
    </section>
    <section
      class="prediction">
      <div
        v-for="p in prediction"
        :key="p['className']">
        {{p['className']}}
        {{probability(p)}}
      </div>
    </section>

    <nav>
      <input
        id="file-input"
        type="file"
        @change="loadFile" />

      <dv4-custom-button
        @click="browseFile">
        Browse
      </dv4-custom-button>

      <dv4-custom-button
        primary
        @click="predict">
        Predict
      </dv4-custom-button>
    </nav>
  </article>
</template>

<script>
import '@dv4all/web-components'
import * as tfjs from "@tensorflow/tfjs"
import * as net from "@tensorflow-models/mobilenet"

export default {
  data(){
    return {
      image:"",
      model: null,
      prediction:[]
    }
  },
  methods:{
    browseFile(){
      const input = document.getElementById("file-input")
      input.click()
    },
    loadFile({target}){
      if (target.files.length===0) return
      const reader = new FileReader()
      reader.onload = ()=>{
        let dataUrl = reader.result
        this.addImage(dataUrl)
      }
      const file = target.files[0]
      reader.readAsDataURL(file)
    },
    addImage(dataUrl){
      const imgSection = document.getElementById("image-section")
      if (imgSection){
        //clear previous
        imgSection.innerHTML=""
        //create new image
        const el = document.createElement('img')
        el.setAttribute("src", dataUrl)
        el.setAttribute("id","img-predict")
        el.classList.add("image")
        imgSection.appendChild(el)
      }
    },
    predict(){
      const image = document.getElementById("img-predict")
      console.log("Make prediction")
      this.model.classify(image)
        .then(resp=>{
          console.log("prediction...", resp)
          this.prediction = resp
        })
    },
    probability(p){
      const val = Math.round(p['probability']*1000)/10
      return `${val}%`
    }
  },
  mounted(){
    net.load()
      .then(m=>{
        console.log("Model loaded...", m)
        this.model = m
      })
  }
}
</script>

<style>

article{
  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;
}

section{
  margin:0;
  padding:0;
  height:25rem;
}

#image-section{
  background-color: aqua;
}
.image{
  height:100%;
}

.prediction{
  background-color: #333;
  color: #fff;
  padding: 1rem;
}
nav{
  padding: 2rem 0rem;
}


#file-input{
  position: absolute;
  opacity: 0;
  z-index: -1;
}

</style>
