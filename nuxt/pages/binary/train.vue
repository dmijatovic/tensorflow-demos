<template>
<section>
  <div>
    <h3>Model info</h3>
      <ModelInfo :info="getModelInfo"/>
    <h3>
      Training info
    </h3>
    <TrainingInfo :info="getTrainingInfo"/>
  </div>
  <div>
    <h3>
      Model summary
    </h3>
    <ModelSummary :config="getModelConfig" />
  </div>
  <BottomNav
    class="bottom-nav"
    :prev="nav.prev"
    :next="nav.next"
    @goPath="goPath"
  />
</section>
</template>

<script>
import {mapState,mapGetters} from "vuex"
import ModelInfo from "../../components/model/Info"
import ModelSummary from "../../components/model/Summary"
import BottomNav from "../../components/page/BottomNav"
import {modelExist} from "../../utils/tf-model"
import TrainingInfo from "../../components/training/TrainingInfo"
export default {
  components:{
    TrainingInfo,
    ModelInfo,
    ModelSummary,
    BottomNav
  },
  data(){
    return{
       nav:{
        prev:{
          label:'Back',
          href:'create',
          disabled: false
        },
        next:{
          label:'Next',
          href: 'validate',
          disabled: true
        }
      }
    }
  },
  computed:{
    ...mapState('binary',['data']),
    ...mapGetters("model",[
      'getModelInfo','getTrainingInfo'
    ]),
    ...mapGetters("model/config",[
      'getModelConfig'
    ]),
  },
  methods:{
    goPath(path){
      if (path==='train'){
        this.trainModel()
      }else{
        this.$router.push(path)
      }
    },
    trainModel(){
      const {label, features, epochs, batchSize} = this.getModelConfig
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
      this.$store.dispatch(action)
        .then(resp=>{
          if (resp) this.onActionResponse(resp)
        })
        .catch(e=>{
          console.error(e)
          this.$store.commit("setLoader",{
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
    onActionResponse(resp){
      console.log("onActionResponse...", resp)
    }

  },
  mounted(){
    this.nav.next.disabled = !modelExist()
    // this.init()
    console.log("model.mounted...", this.nav.next.disabled)
  },
  beforeUpdate(){
    // debugger
    this.nav.next.disabled = !modelExist()
    console.log("model.beforeUpdate...", this.nav.next.disabled)
  }
}
</script>

<style scoped>
section{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
}
.bottom-nav{
  grid-column-start: 1;
  grid-column-end: 3;
}
</style>
