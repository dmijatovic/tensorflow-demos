<template>
<section>
  <Paragraph
      v-for="(section, key) in sections"
      :key="key"
      :title="section.title"
      :text="section.text" />
  <section class="grid col-2">
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
import Paragraph from "../../components/page/Paragraph"

export default {
  components:{
    TrainingInfo,
    ModelInfo,
    ModelSummary,
    BottomNav,
    Paragraph
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
          href: 'save',
          disabled: true
        }
      }
    }
  },
  computed:{
    ...mapState('binary',['data']),
    ...mapState("binary",{
      sections:(state)=>{
        return state.sections['train']
      }
    }),
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
.bottom-nav{
  grid-column-start: 1;
  grid-column-end: 3;
}
</style>
