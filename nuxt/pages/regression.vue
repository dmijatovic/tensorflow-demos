<template>
  <article>
    <header>
      <h1>Regression model</h1>
    </header>
    <section>
      <p>
        carData: {{mpgData.length}}<br/>
        trainingTime: {{training.time}}ms
      </p>
      <p>
        <dv4-text-input
          name="units"
          label="Model units"
          message="Type nr. of itteractions in the model"
          :value="model.units"
          @onChange="setUnits"
        >
        </dv4-text-input>
        <dv4-text-input
          name="learn-rate"
          label="Learn rate"
          message="Type the step of gradient descent"
          :value="model.step"
          @onChange="setStep"
        >
        </dv4-text-input>
      </p>
      <p v-if="training.params">
        Params
        <pre>{{JSON.stringify(training.params,null, 2)}}</pre>
      </p>
    </section>
    <nav>
      <dv4-custom-button
        @click="trainModel"
        primary>
        Train model
      </dv4-custom-button>
      <dv4-custom-button
        @click="makePredictions"
        >
        Make predictions
      </dv4-custom-button>
    </nav>
    <dv4-loader-timer
      v-if="loader.show">
        {{loader.message}}
    </dv4-loader-timer>
  </article>
</template>

<script>
import {mapState} from 'vuex'
import {lineChart} from '../utils/tf'
import fitLine from '../utils/gradientDescent'
import train from '../utils/tf-regression'

export default {
  asyncData(ctx){
    const {dispatch} = ctx.store
    if (dispatch){
      return dispatch("cars/getCarsData")
    } else {
      return {
        carsDataDispatch: false
      }
    }
  },
  data(){
    return {
      loader:{
        show:false,
        message: "Loading..."
      },
      model:{
        units: 100,
        step: 0.00001,
        features:[],
        labels:[]
      },
      training:{
        time: 0,
        params: null
      }
    }
  },
  computed:{
    ...mapState("cars",[
      'mpgData',
      'carLabel'
    ])
  },
  methods:{
    setUnits({target}){
      this.model.units = parseInt(target.value)
      console.log("setUnits...", this.model.units)
    },
    setStep({target}){
      this.model.step = parseFloat(target.value)
      console.log("setStep...", this.model.step)
    },
    trainModel(){
      const x=[],y=[]
      const z = this.mpgData.map(rec=>{
        x.push(rec['mpg'])
        y.push(rec['horsepower'])
        return [[rec['mpg']],[rec['horsepower']]]
      })
      const options={
        ...this.model,
        features: y,
        labels: x
      }
      //start timer
      const startTime = new Date()

      fitLine(options)
        .then(resp=>{
          this.training={
            time: new Date() - startTime,
            params:{
              ...resp
            }
          }
          console.log("fitLine reponse...", this.training)
        })
        .catch(resp=>{
          console.error("fitLine failed...", resp)
          this.training={
            time: new Date() - startTime,
            params:{
              ...resp
            }
          }
        })
    },
    makePredictions(){
      const x=[], y=[]

      this.loader={
        show:true,
        message:"Train the model..."
      }
      //start timer
      const startTime = new Date()

      this.mpgData.map(rec=>{
        x.push(rec['mpg'])
        y.push(rec['horsepower'])
        return [[rec['mpg']],[rec['horsepower']]]
      })

      const options={
        ...this.model,
        features: y,
        labels: x
      }

      setTimeout(()=>{
        train(options)
        .then(resp=>{
          this.training={
            time: new Date() - startTime,
            params:{
              ...resp
            }
          }
          console.log("fitLine reponse...", this.training)
        })
        .catch(resp=>{
          console.error("fitLine failed...", resp)
          this.training={
            time: new Date() - startTime,
            params:{
              ...resp
            }
          }
        })
        .finally(()=>{
          this.loader={
            show:false,
            message:"Done"
          }
        })
      },100)
    }
  }
}
</script>

<style>

</style>
