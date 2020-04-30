<template>
  <section>
    <div>
      <h3>Model configuration</h3>
      <ModelSummary :config="getModelConfig" />
    </div>
    <div>
      <h3>Model info</h3>
      <ModelInfo :info="getModelInfo"/>
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
  methods:{
    init(){
      //if layers are note defined
      const {layers} = this.getModelConfig
      //go another step back
      if (layers.length===0){
        this.$router.push("layers")
      } else {
        //set if button create should be active
        this.$store.commit("binary/setCreateModelEnabled",this.canCreateModel)
      }
    },
    goPath(path){
      this.$router.push(path)
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
