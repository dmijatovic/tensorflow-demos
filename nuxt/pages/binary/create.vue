<template>
<section class="grid col-2">
  <div>
    <h3>Model info</h3>
    <ModelInfo :info="getModelInfo"/>
  </div>
  <div>
    <h3>Model summary</h3>
    <ModelSummary :config="getModelConfig" />
  </div>
    <BottomNav
      :prev="nav.prev"
      :next="nav.next"
      @goPath="goPath"
    />
</section>
</template>

<script>
import {mapState, mapGetters} from "vuex"
import ModelSummary from "../../components/model/Summary"
import ModelInfo from "../../components/model/Info"
import BottomNav from "../../components/page/BottomNav"
export default {
  components:{
    ModelSummary,
    ModelInfo,
    BottomNav
  },
  data(){
    return{
       nav:{
        prev:{
          label:'Back',
          href:'layers',
          disabled:false
        },
        next:{
          label:'Next',
          href:'train',
          disabled:false
        }
      }
    }
  },
  computed:{
    ...mapGetters("model",[
      'modelExist', 'getModelInfo'
    ]),
    ...mapGetters("model/config",[
      'getModelConfig','canCreateModel'
    ]),
  },
  watch:{
    getModelInfo(value,prev){
      this.enableCreate()
      this.enableNext()
    }
  },
  methods:{
    init(){
      this.enableCreate()
      this.enableNext()
      this.disableTrain()
    },
    goPath(path){
      this.$router.push(path)
    },
    enableCreate(){
      const {layers} = this.getModelConfig
      //go another step back
      if (layers.length===0){
        this.$router.push("layers")
      }else{
        this.$store.commit("binary/setCreateModelEnabled",true)
      }
    },
    enableNext(){
      // const {stadium} = this.getModelInfo
      if (this.modelExist){
        this.nav.next.disabled = false
      } else {
        this.nav.next.disabled = true
      }
    },
    disableTrain(){
      this.$store.commit("binary/setTrainModelEnabled",false)
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
