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
            :dataInfo="dataInfo"
          />
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
        disabled: !this.createModelEnabled
      },{
        label:"Train model",
        action:{
          type:"model/trainModel",
          payload:{}
        },
        disabled: !this.trainModelEnabled
      }]
    }
  },
  computed:{
    ...mapState([
      'loader'
    ]),
    ...mapState('binary',[
      'data','createModelEnabled',
      'trainModelEnabled'
    ]),
    ...mapGetters('binary',[
      'dataInfo'
    ]),
    ...mapGetters('model/config',[
      'getModelConfig'
    ])
  },
  watch:{
    createModelEnabled(value, previous){
      // debugger
      console.log("watch.createModelEnabled...changed")
      this.nav[1].disabled = !value
    },
    trainModelEnabled(value, previous){
      // debugger
      console.log("watch.trainModelEnabled...changed")
      this.nav[2].disabled = !value
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
        // this.enableCreateModel()
        // this.enableTrainModel()
      })
    },
    navClick(action){
      // console.log("navClick...action...", action)
      switch(action.type){
        case "model/createSequentialModel":
          this.createModel()
          break;
        case "model/trainModel":
          // action.payload = this.getTrainModelActionPayload()
          this.trainModel()
          break;
        default:
          this.$store.dispatch(action)
      }
    },
    createModel(){
      const {layers, optimizer,loss,features} = this.getModelConfig
      const {dispatch,commit} = this.$store
      // debugger
      dispatch({
        type:"model/createSequentialModel",
        payload:{
          name:'Binary classification',
          layersDef: layers,
          optimizerDef: optimizer,
          lossDef: loss,
          metrics: ['accuracy'],
          inputShape:[features.length]
        }
      }).then(model=>{
        commit("model/saveModel", {
          name:"Binary model",
          model
        })
        commit("binary/setTrainModelEnabled",true)
      }).catch(e=>{
        console.error(e)
        commit("binary/setTrainModelEnabled",false)
      })
    },
    trainModel(){
      const {label, features, epochs, batchSize} = this.getModelConfig
      const {dispatch,commit} = this.$store
      const action={
        type: "model/trainModel",
        payload:{
          label,
          features,
          data: this.data,
          args:{
            epochs,
            batchSize,
            callbacks:{
              onEpochEnd: this.onEpochEnd,
              onTrainEnd: this.onTrainEnd
            }
          }
        }
      }
      commit("setLoader", {show:true,message:"Training..."},{ root: true })
      dispatch(action)
        .then(stats =>{
          const {history} = stats
          commit("model/setTrainingStats", stats)
          commit("model/setModelStadium", "trained")
          dispatch({
            type: "model/visor/plotTrainingLoss",
            payload: {
              ...history,
              name:"Model loss",
              tab:"Model"
            }
          })
        })
        .catch(e=>{
          console.error(e)
        })
        .finally(()=>{
          commit("setLoader",{
            show:false,
            message:''
          })
        })
    },
    onEpochEnd(epoch,logs){
      // console.log("onEpochEnd...", epoch, logs)
      const {epochs} = this.getModelConfig
      // debugger
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
    // enableCreateModel(){
    //   debugger
    //   if (this.canCreateModel){
    //     this.nav[1].disabled = false
    //   } else {
    //     this.nav[1].disabled = true
    //   }
    // },
    // enableTrainModel(){
    //   // debugger
    //   this.nav[2].disabled = true
    //   // if (this.model){
    //   //   this.nav[2].disabled = false
    //   // } else {
    //   //   this.nav[2].disabled = true
    //   // }
    // },
    // getTrainModelActionPayload(){
    //   debugger
    //   const {dataInfo, label, features,
    //     data, epochs, batchSize } = this
    //   const payload={
    //     label,
    //     features,
    //     data,
    //     args:{
    //       epochs,
    //       batchSize,
    //       callbacks:{
    //         onEpochEnd: this.onEpochEnd,
    //         onTrainEnd: this.onTrainEnd
    //       }
    //     }
    //   }
    //   return payload
    // },
    // onEpochEnd(epoch,logs){
    //   // console.log("onEpochEnd...", epoch, logs)
    //   const {epochs} = this.training
    //   this.$store.commit("setLoader",{
    //     show: true,
    //     message: `Epoch...${epoch+1}/${epochs}`
    //   })
    // },
    // onTrainEnd(logs){
    //   console.log("onTrainEnd...", logs)
    //   // debugger
    //   this.$store.commit("setLoader",{
    //     show:false,
    //     message:''
    //   })
    // },
    // onActionResponse(resp){
    //   console.log("onActionResponse...", resp)
    // }
  }
}
</script>
<style>

</style>
