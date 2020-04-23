<template>
  <PageContent>
    <template #page-title>
      <h1>Cars</h1>
    </template>
    <template #page-body>
      <nav class="side-panel">
         <dv4-custom-button
          @click="chartPanel"
          >
          Chart panel
        </dv4-custom-button>
        <dv4-custom-button
          @click="drawScatterplot">
          Scatter
        </dv4-custom-button>
        <dv4-custom-button
          @click="createModel"
        >
          Create model
        </dv4-custom-button>
        <dv4-custom-button
          @click="trainModel"
          :disabled="tf.model===null">
          Train model
        </dv4-custom-button>
        <dv4-custom-button
          @click="saveModel"
          :disabled="tf.model===null">
          Save model
        </dv4-custom-button>
        <dv4-custom-button
          @click="loadModel"
          >
          Load model
        </dv4-custom-button>
        <dv4-custom-button
          @click="testModel"
          :disabled="tf.model===null"
          >
          Test model
        </dv4-custom-button>
        <dv4-custom-button
          @click="makePredictions"
          :disabled="tf.model===null">
          Make predictions
        </dv4-custom-button>
      </nav>
      <article class="page-content">
        <p>
          carData: {{carData.length}}<br/>
          trainingTime: {{training.time}}ms
        </p>
        <h3>Training options</h3>
        <div>
          <dv4-text-input
            name="epochs"
            label="Epochs"
            message="Type nr. of epochs"
            :value="options.epochs"
            @onChange="({target})=>{setOption({target,item:'epochs',type:'int'})}"
          >
          </dv4-text-input>
          <dv4-text-input
            name="batch-size"
            label="Batch size"
            message="Batch size to split sample in"
            :value="options.batchSize"
            @onChange="({target})=>{setOption({target,item:'batchSize',type:'int'})}"
          >
          </dv4-text-input>
        </div>
        <h3>Model options</h3>
        <div>
          <dv4-select
            title="Activation"
            message="Select activaction function"
            :options="select.activation.toString()"
            :value="options.activation"
            @onChange="({target})=>{setOption({target,item:'activation',type:'string'})}"
            >
          </dv4-select>
          <dv4-select
            title="Optimization"
            message="Select optimization method"
            :options="select.optimization.toString()"
            :value="options.optimization"
            @onChange="({target})=>{setOption({target,item:'optimization',type:'string'})}"
            >
          </dv4-select>
          <dv4-text-input
            v-if="options.optimization!=='sigmoid'"
            name="learning-rate"
            label="Learning rate"
            message="Correction to use during optimization"
            :value="options.learningRate"
            @onChange="({target})=>{setOption({target,item:'learningRate',type:'float'})}"
          >
          </dv4-text-input>
        </div>
        <h3>Model parameters</h3>
        <table>
          <tr>
            <td class="col-label">Loss function</td>
            <td class="col-value">{{options.loss}}</td>
          </tr>
        </table>
        <div v-if="training.params">
          <h3>Training info</h3>
          <pre>{{JSON.stringify(training.params,null, 2)}}</pre>
        </div>
        <div v-if="tf.info">
          <h3>Model info</h3>
          <pre>{{JSON.stringify(tf.info,null, 2)}}</pre>
        </div>
      </article>
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
import {lineChart, scatterPlot, visModel,visLayer, toggleVisor} from '../utils/tf-chart'
// import {
//   createLinearModel,
//   convertToTensor,trainModel, testModel,
//   makePrediction
// } from '../utils/tf'
import { createSequentialModel,
  createDenseLayer,createOptimizer } from "../utils/tf-cars"
import { minMaxNormalization,standardizeValues,
  saveModelToLS, loadModelFromLS, rSquared } from '../utils/tf-data'
import { create2DTensor } from '../utils/tf-utils'

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
      select:{
        activation:['linear','sigmoid','softmax'],
        optimization:['sgd','adam'],
        loss:['meanSquaredError','binaryCrossentropy','categoricalCrossentropy']
      },
      options:{
        epochs: 20,
        batchSize: 64,
        activation:'sigmoid',
        optimization:'sgd',
        learningRate: 0.125,
        loss:"meanSquaredError",
        validation: 0.2,
        features:['Horsepower','Weight_in_lbs','Cylinders','YYYY'],
        // features:['Horsepower'],
        // labels:'Miles_per_Gallon'
        labels:'Low_CO2_Emission'
      },
      training:{
        time: 0,
        params: null
      },
      tf:{
        info:null,
        model:null,
        loss:[]
      },
      tfvis:null
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
    chartPanel(){
      // if (!this.tfvis) return false
      // this.tfvis.visor().toggle()
      toggleVisor()
    },
    drawScatterplot(){
      this.tfvis = scatterPlot({
        name:"Horsepower v MPG",
        tab:"Cars"
      },{
        values: [this.plotData],
        series: ['Cars']
      },{
        xLabel: 'HP',
        yLabel: 'MPG',
        height: 300
      })
    },
    setOption({target,item, type}){
      if (target.value===""){
        this.options[item] =  null
      }else{
        if (type==='int'){
          this.options[item] = parseInt(target.value)
        } else if(type==='float'){
          this.options[item] = parseFloat(target.value)
        } else {
          this.options[item] = target.value
        }
      }
      console.log("setOption..", item, this.options[item])
    },
    createModel(){
      const {optimization, learningRate, loss } = this.options
      // create model layers
      const layers = this.createLayers()
      // create model with layers
      const model = createSequentialModel(layers)
      //add optimizer
      const optimizer = createOptimizer({
        name: optimization,
        learningRate
      })
      //compile model
      //https://js.tensorflow.org/api/latest/#tf.LayersModel.compile
      model.compile({
        optimizer,
        loss
      })
      //save model in memory
      this.tf.model = model
      //visualize input layer
      this.visualizeLayer(layers[0])
    },
    createLayers(){
      const {activation, features} = this.options
      const inputLayer = createDenseLayer({
        name:"input_Layer",
        // how many input features we have
        inputDim: features.length,
        //how many neurons are in layer
        units: 1,
        activation: activation,
        //we use b constant (mx + b)
        useBias: true
      })
      return [
        inputLayer
      ]
    },
    visualizeModel(){
      if (this.tf.model){
        // debugger
        visModel({
          model:this.tf.model,
          name:"Model summary",
          tab:"Cars"
        })
      }
    },
    visualizeLayer(layer){
      if (this.tf.model){
        // debugger
        visLayer({
          layer,
          name:"Layer info",
          tab:"Cars"
        })
      }
    },
    getTensors(){
      const f=[], l=[]
      const {labels, features} = this.options
      // debugger
      this.carData.map(rec=>{
        let fts=[]
        l.push(rec[labels])
        features.map(fld=>{
          fts.push(rec[fld])
        })
        f.push(fts)
      })

      const ft = standardizeValues(f)
      const lb = create2DTensor(l)

      return {
        features: ft,
        labels: lb
      }
    },
    trainModel(){
      if (this.tf.model===null) return
      const {epochs, batchSize, step, validation} = this.options

      this.tf.loss=[]

      this.loader={
        show:true,
        message:"Train the model..."
      }

      const {features, labels} = this.getTensors()

      this.tf.model.fit(features,labels,{
        epochs,
        learningRate: step,
        batchSize,
        //shuffle data on each epoch
        shuffle: true,
        validation,
        callbacks:{
          onEpochEnd: (epoch,logs) =>{
            console.log("onEpochEnd...", epoch, logs)
            this.loader.message = `Epoch...${epoch+1}/${epochs}`
            this.tf.loss.push({
              x: epoch,
              y: logs.loss
            })
          },
          // onBatchEnd: (batch, logs) => {
          //   // debugger
          //   console.log("onBatchEnd...", batch, logs)
          // },
          onTrainEnd:(logs)=>{
            this.loader={
              show:false
            }
            const layer = this.tf.model.getLayer(undefined, 0)
            this.visualizeLayer(layer)
            this.showLossChart()
            // console.log("onTrainEnd...", logs)
          }
        }
      }).then(stats=>{
        const {params, history} = stats
        this.training.params = params
        this.tf.loss = history.loss
      }).catch(e=>{
        this.training.params = {
          err: e.message,
          ...this.options
        }
      })
    },
    saveModel(){
      const name = 'cars-ls-linear-model'
      saveModelToLS(name, this.tf.model)
        .then(resp=>{
          debugger
          console.log("Saved model...", resp)
          const info = {
            ...this.training.params,
            ...resp
          }
        })
        .catch(e=>console.error(e))
    },
    loadModel(){
      const name = 'cars-ls-linear-model'
      loadModelFromLS(name)
        .then(resp =>{
          this.tf.model = resp.model
          this.tf.info = resp.info
        })
        .catch(e=>console.error(e))
    },
    showLossChart(){
      lineChart({
        name:"Loss",
        tab:'Cars'
      },{
        values: this.tf.loss,
        categories:['Loss']
      },{
        xLabel:'epoch',
        yLabel:'loss'
      })
    },
    testModel(){
      if (this.tf.model===null) return false
      const {features, labels} = this.getTensors()
      debugger
      const predictions = this.tf.model.predict(features)
      const Rsq = rSquared(predictions, labels)
      //show Rsquared
      this.tf.info={
        ...this.tf.info,
        Rsq
      }
      const p = predictions.dataSync()
      const l = labels.dataSync()
      const pData=[], lData=[]
      p.forEach((val,i)=>{
        pData.push({
          x: i,
          y: val
        })
        lData.push({
          x: i,
          y: l[i]
        })
      })
      // console.log("Predictions...", Rsq)
    },
    makePredictions(){
      if (this.tf.model===null) return false
      const {features, labels} = this.getTensors()
      console.log("TODO!...makePredictions")
    }
  },
  mounted(){
    // debugger
    // console.log("store...", this.$store)
    // console.log("computed...", this.computed)
    // setTimeout(()=>{
    //   this.init()
    // },100)
  }
}
</script>

<style>
.col-label{
  color:var(--color-primary, red);
}
.col-value{
  color:var(--color-accent, green);
}

</style>
