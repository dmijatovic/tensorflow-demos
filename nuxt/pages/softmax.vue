<template>
  <PageContent>
    <template #page-title>
      <h1>Logistic regression with Softmax</h1>
      <nav>
        <!-- <dv4-custom-button
          @click="selectModel('Low_CO2_Emission')"
          >
          Emission model
        </dv4-custom-button> -->
        <dv4-custom-button
          @click="selectModel('Fuel_Efficiency')"
          >
          Fuel eff. model
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
      <p>
        This example of logistical regression uses softmax function to produce
        outcomes that map to categorical values. The priniciple of calculation is:
        <ul>
          <li>All variable categories are broken to binomial (true/false) values</li>
          <li>For cost calculation we use cross entropy function</li>
          <li>The weights are calculated per catgory</li>
          <li>For final outcome we apply softmax that will provide weighted changes for each of categories</li>
        </ul>
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
          <!-- <dv4-text-input
            class="param-input"
            name="sigmoid-treshold"
            label="Sigmoid Treshold"
            message="Value between 0.1 and 0.9"
            :value="model.sigmoidTreshold"
            @onChange="setTreshold"
          >
          </dv4-text-input> -->
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
import {lineChart, scatterPlot, toggleVisor} from '../utils/tf-chart'
import trainModel, {predict} from '../utils/tf-regression'

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
        epochs: 10,
        step: 0.125,
        treshold: 0.002,
        batchSize: 50,
        activation:'softmax',
        features:['Horsepower','Weight_in_lbs','Cylinders','YYYY'],
        labels:'Fuel_Efficiency'
      },
      training:{
        time: 0,
        model: null
      },
      testCases:10,
      tfvis: null
    }
  },
  computed:{
    ...mapState("cars",[
      'carData'
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
    setTreshold({target}){
      this.model.sigmoidTreshold = parseFloat(target.value)
      console.log("setTreshold...", this.model.sigmoidTreshold)
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
      if (model) this.testPredictions()
    },
    selectModel(target){
      const x=[], y=[]
      const {features} = this.model
      this.model.labels = target
      // debugger
      this.carData.map(rec=>{
        let fts=[]
        x.push(rec[target])
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
      //we use softmax in this case
      if (target==='Fuel_Efficiency'){
        options['activation']='softmax'
      }
      this.trainModel(options)
    },
    trainModel(options){
      this.loader={
        show:true,
        message:"Train the model..."
      }
      //start timer
      const startTime = new Date()
      //set timeout to show loader without freezing
      setTimeout(()=>{
        trainModel(options)
        .then(resp=>{
          debugger
          this.lineChartCostFn(resp.cost, options['activation'])
          delete resp.cost
          this.training={
            time: new Date() - startTime,
            model:{
              ...resp
            }
          }
          // console.log("fitLine reponse...", this.training)
        })
        .catch(resp=>{
          console.error("trainModel failed...", resp)
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
    lineChartCostFn(cost, activation){
      const val = cost.map((v,i)=>{
        return {x:i, y:v}
      })
      //draw line chart
      this.tfvis = lineChart(
        {name:"Cost",tab:activation},
        {values: val},
        {
          xLabel: 'epoch',
          yLabel: 'Cross Entropy',
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
    testPredictions(){
      // debugger
      const { activation } = this.model
      const { weights } = this.training.model
      // const s = weights.slopes.map(i=>i[0])
      // const w = [weights.const, ...s]

      const {f,l} = this.selectTestSample(this.testCases)

      //make predictions
      debugger
      const prediction = predict({
        features:f,
        weights,
        activation
      })

      this.scatterPlotPrediction({
        prediction,
        actual:l
      })
      // console.log("MPG: ", mpg.toString())
    },
    scatterPlotPrediction({prediction, actual}){
      //chart predicted vs actual
      debugger
      const val = prediction.map((v,i)=>{
        return {
          x:i,
          y:v[0]
        }
      })
      const lbl = actual.map((v,i)=>{
        return {
          x:i,
          y:v
        }
      })
      //draw scatterplot
      scatterPlot(
        {name:"Test predictions",tab:"Softmax"},
        {
          values: [val,lbl],
          series:['prediction','actual']
        },
        {
          xLabel: 'case',
          yLabel: this.model.labels,
          // height: 300
      })
    }
  }
}
</script>

<style>
.param-input{
  width:9rem;
}
</style>
