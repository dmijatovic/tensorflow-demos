<template>
  <article>
    <header>
      <h1>Cars</h1>
    </header>
    <section>
      <p>
        carData: {{carData.length}}<br/>
        plotData: {{plotData.length}}<br/>
        trainingTime: {{training.time}}
      </p>
      <p v-if="training.params">
        Params
        <pre>{{JSON.stringify(training.params,null, 2)}}</pre>
      </p>
    </section>
    <nav>
      <dv4-custom-button
        @click="visualizeModel">
        Model summary
      </dv4-custom-button>
      <dv4-custom-button
        @click="trainModel"
        primary>
        Train model
      </dv4-custom-button>
      <dv4-custom-button
        @click="testModel"
        danger>
        Test predictions
      </dv4-custom-button>
      <dv4-custom-button
        @click="testPrediction"
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
import {Dv4LoaderTimer} from '@dv4all/loaders'
import {Dv4CustomButton} from '@dv4all/web-components'
import {
  drawScatterplot, visModel, createLinearModel,
  convertToTensor,trainModel, testModel,
  makePrediction, lineChart
} from '../utils/tf'

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
      model: null,
      tensorData: null,
      loader:{
        show:false,
        message: "Loading..."
      },
      training:{
        time: null,
        params: null
      }
    }
  },
  computed:{
    ...mapState("cars",[
      'carData',
      'mpgData',
      'plotData',
      'carLabel'
    ])
  },
  methods:{
    init(){
      drawScatterplot({
        name:"Horsepower v MPG",
        tab:"Scatter",
        values: [this.plotData],
        series: ['Cars']
      },{
        xLabel: 'HP',
        yLabel: 'MPG',
        height: 300
      })
      this.model = createLinearModel()
    },
    visualizeModel(){
      if (this.model){
        visModel(this.model)
      }
    },
    trainModel(){
      this.loader={
        show:true,
        message:"Train the model..."
      }
      setTimeout(()=>{
        //convert data to tensors
        this.tensorData = convertToTensor(this.mpgData)
        //start timer
        const startTime = new Date()
        //train model
        trainModel(this.model,this.tensorData)
          .then(resp => {

            this.training={
              time: new Date() - startTime,
              ...resp
            }
            console.log("Training reponse...", this.training)

            const values = Array
              .from(resp.epoch)
              .map((e,i)=>{
                return {
                  x: e,
                  y: resp.history.mse[i]
                }
              })

            lineChart({
              name:"Training stats",
            },{
              values:[values],
              series:['MSE'],
            },
            {
              xLabel: 'Epoch',
              yLabel: 'MSE loss',
              height: 300
            })
            this.loader={
              show:false,
              message:""
            }
          })
          .catch(e=>console.error(e))
      },100)
    },
    testPrediction(){
      debugger
      if (this.model && this.tensorData){
        const predicted = makePrediction(this.model,this.tensorData)
        debugger
        drawScatterplot({
          name:"Predictions MPG",
          tab:"Scatter",
          values:[predicted],
          series: ['Predictions']
        },{
          xLabel: 'HP',
          yLabel: 'MPG',
          height: 300
        })
      }
    },
    testModel(){
      if (this.model && this.tensorData){
        testModel(this.model,this.mpgData,this.tensorData)
      }
    }
  },
  mounted(){
    // debugger
    // console.log("store...", this.$store)
    // console.log("computed...", this.computed)
    setTimeout(()=>{
      this.init()
    },100)
  }
}
</script>

<style>

</style>
