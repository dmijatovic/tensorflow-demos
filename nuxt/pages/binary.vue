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
        <nuxt-child/>
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

export default {
  asyncData(ctx){
    // debugger
    const {commit} = ctx.store
    return fetch("/data/binary/sections.json")
      .then(resp=>resp.json())
      .then(data=>{
        if (data){
          commit("binary/setSections",data)
        }
      })
  },
  components:{
    PageContent,
    SidePanel
  },
  computed:{
    ...mapState([
      'loader'
    ]),
    ...mapState('binary',[
      'nav', 'data',
      'createModelEnabled',
      'trainModelEnabled'
    ]),
    ...mapGetters('binary',[
      'dataInfo'
    ]),
    ...mapGetters('model/config',[
      'getModelConfig'
    ])
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
            type: "model/visor/plotTraining",
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
  }
}
</script>
<style>

</style>
