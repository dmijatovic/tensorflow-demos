<template>
  <PageContent>
    <template #page-title>
      <h1>Linear Regression Model using MSE</h1>
      <nav>
        <!-- <dv4-custom-button
          @click="naiveModel"
          primary>
          Naive model
        </dv4-custom-button> -->
        <dv4-custom-button
          @click="trainModel"
          >
          Train model
        </dv4-custom-button>
        <dv4-custom-button
          @click="chartPanel"
          primary
          :disabled="tfvis===null">
          Chart panel
        </dv4-custom-button>
        <dv4-custom-button
          @click="testModel"
          danger
          :disabled="tfvis===null">
          Test model
        </dv4-custom-button>
      </nav>
    </template>
    <template #page-body>
      <section>
        <p>
          This page demonstrates manually created linear regression model using
          MSE and gradient descent. It supports batchwise weight
          backpropagation (update). If you omit batch size complete sample is processed
          in one go for the number of epochs specified.
        </p>
        <p>
          To train the model cars data with {{carData.length}} records is used.
          <br/>
          The columns in cars data: {{Object.keys(carData[0])}}
          <br/>
          Features used to fit model: {{model.features.toString()}}
          <br>
          Value to be predicted: {{model.labels}}
          <br/>
          Training time (ms): {{training.time}}
        </p>
        <p>
          <dv4-text-input
            class="param-input"
            name="units"
            label="Epochs"
            message="Type nr. of itteractions in the model"
            :value="model.epochs"
            @onChange="setEpochs"
          >
          </dv4-text-input>
          <dv4-text-input
            class="param-input"
            name="batch-size"
            label="Batch size"
            message="Leave it empty to use all data in one batch"
            :value="model.batchSize"
            @onChange="setBatchSize"
          >
          </dv4-text-input>
          <dv4-text-input
            class="param-input"
            name="learn-rate"
            label="Learn rate"
            message="Type the step of gradient descent"
            :value="model.step"
            @onChange="setStep"
          >
          </dv4-text-input>
          <dv4-text-input
            class="test-input"
            name="test-cases"
            label="Test cases"
            message="Type no. of test cases to select"
            :value="testCases"
            @onChange="setTestCases"
          >
          </dv4-text-input>
        </p>
        <p v-if="training.model">
          Model
          <pre>{{JSON.stringify(training.model,null, 2)}}</pre>
        </p>
      </section>
      <dv4-loader-timer
        v-if="loader.show">
          {{loader.message}}
      </dv4-loader-timer>
    </template>
  </PageContent>
</template>

<script>
import PageContent from '@/components/page/PageContent'
import {mapState} from 'vuex'
import {lineChart, toggleVisor} from '../utils/tf-chart'
import trainModel, {predict} from '../utils/tf-regression'
import fitLine from '../utils/gradientDescent'

export default {
  components:{
    PageContent
  },
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
        epochs: 30,
        step: 0.125,
        treshold: 0.0001,
        batchSize: null,
        activation:'mse',
        features:['Horsepower','Weight_in_lbs','Cylinders','YYYY'],
        labels:'Miles_per_Gallon'
      },
      training:{
        time: 0,
        model: null
      },
      testCases:50,
      tfvis: null
    }
  },
  computed:{
    ...mapState("cars",[
      'mpgData',
      'carData',
      'carLabel'
    ])
  },
  methods:{
    setEpochs({target}){
      this.model.epochs = parseInt(target.value)
      console.log("setEpochs...", this.model.epochs)
    },
    setStep({target}){
      this.model.step = parseFloat(target.value)
      console.log("setStep...", this.model.step)
    },
    setBatchSize({target}){
      if (target.value===""){
        this.model.batchSize = null
      }else{
        this.model.batchSize = parseFloat(target.value)
      }
      console.log("setBatchSize...", this.model.batchSize)
    },
    setTestCases({target}){
      this.testCases = parseFloat(target.value)
      console.log("setTestCases...", this.testCases)
    },
    chartPanel(){
      if (!this.tfvis) return false
      this.tfvis.visor().toggle()
    },
    testModel(){
      const {model} = this.training
      if (model) this.testPredictions(model)
    },
    naiveModel(){
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
          // console.log("fitLine reponse...", this.training)
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
    trainModel(){
      const x=[], y=[]
      const {labels, features} = this.model

      this.loader={
        show:true,
        message:"Train the model..."
      }
      this.carData.map(rec=>{
        let fts=[]
        x.push(rec[labels])
        features.map(f=>{
          fts.push(rec[f])
        })
        y.push(fts)
      })
      const options={
        ...this.model,
        features: y,
        labels: x
      }
      //start timer
      const startTime = new Date()

      setTimeout(()=>{
        trainModel(options)
        .then(resp=>{
          this.lineChartMSE(resp.cost)
          delete resp.cost
          this.training={
            time: new Date() - startTime,
            model:{
              ...resp
            }
          }
        })
        .catch(resp=>{
          console.error("fitLine failed...", resp)
          this.training={
            time: new Date() - startTime,
            model:{
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
    },
    lineChartMSE(mse){
      const val = mse.map((v,i)=>{
        return {x:i, y:v}
      })
      //draw line chart
      this.tfvis = lineChart(
        {name:"MSE",tab:"MSE"},
        {values: val},
        {
          xLabel: 'epoch',
          yLabel: 'MSE',
          // height: 300
      })
    },
    selectTestSample(size=10){
      const s = Math.floor(this.carData.length / size)-1
      const {features, labels} = this.model
      const sample=[], l=[]
      let pos=0

      if (s < 0) return null

      for (let i=0; i < size; i++){
        pos+=s
        const rec = features.map(f=>{
          return this.carData[pos][f]
        })
        sample.push(rec)
        l.push(this.carData[pos][labels])
      }
      return {f:sample, l}
    },
    testPredictions({weights, activation}){
      //select test sample
      const {f,l} = this.selectTestSample(this.testCases)
      //make predictions
      const mpg = predict({
        features:f,
        weights,
        activation
      })

      //chart predicted vs actual
      const val = mpg.map((v,i)=>{
        return {
          x:i,
          y:v[0]
        }
      })
      const lbl = l.map((v,i)=>{
        return {
          x:i,
          y:v
        }
      })
      //draw line chart
      this.tfvis = lineChart(
        {name:"Test predictions",tab:"MSE"},
        {
          values: [val,lbl],
          series:['prediction','actual']
        },
        {
          xLabel: 'case',
          yLabel: 'MPG',
          // height: 300
      })
      // console.log("MPG: ", mpg.toString())
    }
  }
}
</script>

<style>
.param-input{
  width:9rem;
}
</style>
