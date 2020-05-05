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
import { model } from '@tensorflow/tfjs'
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
      'modelExist','getModelInfo',
      'getTrainingInfo'
    ]),
    ...mapGetters("model/config",[
      'getModelConfig'
    ]),
  },
  watch:{
    getTrainingInfo(value,prev){
      this.enableNext()
    }
  },
  methods:{
    init(){
      this.disableCreate()
      this.enableTrain()
      this.enableNext()
    },
    goPath(path){
      this.$router.push(path)
    },
    disableCreate(){
      //cannot create model from train page - go back
      this.$store.commit("binary/setCreateModelEnabled", false)
    },
    enableTrain(){
      // debugger
      if (this.modelExist){
        this.$store.commit("binary/setTrainModelEnabled",true)
      } else {
        this.$store.commit("binary/setTrainModelEnabled",false)
      }
    },
    enableNext(){
      const {timeSpend} = this.getTrainingInfo
      if (timeSpend){
        //can proceed to next section
        this.nav.next.disabled = false
      }else{
        this.nav.next.disabled = true
      }
    }
  },
  mounted(){
    this.init()
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
