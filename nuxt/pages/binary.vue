<template>
  <PageContent>
    <template #page-title>
      <h1>Binary classification</h1>
    </template>
    <template #page-body>
      <SidePanel
        :nav="nav"
        @navClick="navClick"/>
      <article class="page-content">
        <p>
          On this page we demonstrate binary classification approach with tensorflow.
          You can use multiple layers with different number of NODES BUT the FINAL LAYER
          should have 1 node as output.
        </p>
        <p>
        <div>
          <DataInfo
            v-if="data"
            :dataInfo="dataInfo"/>
        </div>
        <section>
          <nuxt-child/>
        </section>
      </article>
      <dv4-loader-timer
        overlay="true"
        v-if="loader.show">
          {{loader.message}}
      </dv4-loader-timer>
    </template>
  </PageContent>
</template>

<script>

import PageContent from '@/components/page/PageContent'
import { mapState, mapGetters } from 'vuex'
import SidePanel from "../components/page/SidePanel"
import DataInfo from "../components/DataInfo"

export default {
  components:{
    PageContent,
    SidePanel,
    DataInfo
  },
  data(){
    return{
      nav:[{
        label:"Toggle visor",
        action:{type:"model/visor/toggleVisor"},
        disabled: false
      },{
        label:"Create model",
        action:{
          type:'model/createSequentialModel',
          payload:{
            name:'binary-cars-model',
            inputShape:[1]
          }
        },
        disabled: true
      },{
        label:"Train model",
        action:{
          type:"model/trainModel",
          payload:{}
        },
        disabled: true
      }]
    }
  },
  computed:{
    ...mapState([
      'loader'
    ]),
    ...mapState('binary',[
      'label',
      'features',
      'data'
    ]),
    ...mapGetters('binary',[
      'dataInfo'
    ]),
    ...mapState('model/options',[
      'training',
      'activations',
      'optimizers',
      'losses'
    ]),
    ...mapState('model/config',[
      'layers'
    ]),
    ...mapState('model',[
      'model',
      'trainingStats'
    ])
  },
  watchers:{
    trainingStats(){
      console.log("Training stats...changed", this.trainingStats)
    }
  },
  mounted(){
    this.init()
    // console.log("model/options", this.training)
  },
  methods:{
    init(){
      this.$store.dispatch('binary/getCarsData')
      .then(res=>{
        console.log("Data loaded...")
        this.enableCreateModel()
        this.enableTrainModel()
      })
    },
    setOptions({target,item, value}){
      switch(target){
        case "training":
          this.$store.commit("model/options/setTrainingOptions",{item,value})
          break;
        case "activation":
          debugger
          this.$store.commit("setTrainingOptions",{item,value})
      }
      console.log("setOption..", target, item, value)
    },
    addDenseLayer(layer){
      const {featuresList} = this.dataInfo
      const args = {
        ...layer,
        useBias:true
      }
      this.$store.commit("model/addLayerDef", args)
      this.enableCreateModel()
    },
    deleteLayer(pos){
      this.$store.commit("model/deleteLayerDef", pos)
      this.enableCreateModel()
    },
    navClick(action){
      const {dataInfo, label, features, data, training} = this
      // console.log("navClick...action...", action)
      switch(action.type){
        case "model/createSequentialModel":
          action.payload = {
            name:'binary-cars-model',
            inputShape: [dataInfo.featuresList.length]
          }
          break;
        case "model/trainModel":
          action.payload={
            label: label.target,
            features: dataInfo.featuresList,
            data,
            args:{
              epochs: training.epochs,
              batchSize: training.batchSize,
              callbacks:{
                onEpochEnd: this.onEpochEnd,
                onTrainEnd: this.onTrainEnd
              }
            }
          }
          break;
      }
      this.$store.dispatch(action)
        .then(resp=>{
          if (resp) this.onActionResponse(resp)
          this.enableCreateModel()
          this.enableTrainModel()
        })
        .catch(e=>{
          console.error(e)
          this.$store.commit("setLoader",{
            show:false,
            message:''
          })
        })
    },
    enableCreateModel(){
      const {layers, dataInfo} = this
      // debugger
      if (layers && layers.length > 0){
        this.nav[1].disabled = false
      } else {
        this.nav[1].disabled = true
      }
    },
    enableTrainModel(){
      // debugger
      if (this.model){
        this.nav[2].disabled = false
      } else {
        this.nav[2].disabled = true
      }
    },
    onEpochEnd(epoch,logs){
      // console.log("onEpochEnd...", epoch, logs)
      const {epochs} = this.training
      this.$store.commit("setLoader",{
        show: true,
        message: `Epoch...${epoch+1}/${epochs}`
      })
    },
    onTrainEnd(logs){
      console.log("onTrainEnd...", logs)
      // debugger
      this.$store.commit("setLoader",{
        show:false,
        message:''
      })
    },
    onActionResponse(resp){
      console.log("onActionResponse...", resp)
    }
  }
}
</script>
<style>

</style>
