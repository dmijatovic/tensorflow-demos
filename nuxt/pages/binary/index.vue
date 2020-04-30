<template>
<section>
  <h3>Training subpage</h3>
  <Epochs
    :epochs="epochs"
    :batchSize="batchSize"
    @onChange="setEpochs"
  />
  <Optimizer
    @onChange="setOptimizer"
  />
  <Loss
    @onChange="setLoss"
  />
  <BottomNav
    :prev="nav.prev"
    :next="nav.next"
    @goPath="goPath"
  />
</section>
</template>

<script>
import {mapState} from "vuex"
import Epochs from "../../components/training/Epochs"
import Optimizer from "../../components/training/Optimizer"
import Loss from "../../components/training/Loss"
import BottomNav from "../../components/page/BottomNav"
export default {
  data(){
    return{
      nav:{
        prev:{
          label:'Back',
          href:'',
          disabled: true
        },
        next:{
          label:'Next',
          href:'binary/layers',
          disabled: true
        }
      }
    }
  },
  components:{
    Epochs,
    Optimizer,
    Loss,
    BottomNav
  },
  computed:{
    ...mapState("model/config",[
      'epochs','batchSize',
      'optimizer', 'loss'
    ])
  },
  methods:{
    init(){
      // debugger
      this.nav.next.disabled = this.disableNextBtn()
      //set if button create should be active
      this.$store.commit("binary/setCreateModelEnabled",false)
      this.$store.commit("binary/setTrainModelEnabled",false)
    },
    disableNextBtn(){
      // debugger
      if (this.epochs===null) return true
      if (this.batchSize===null) return true
      if (this.optimizer.type===null) return true
      if (this.loss.type===null) return true
      return false
    },
    setEpochs(data){
      // this.epochs = data
      this.$store.commit("model/config/setEpochs", data.epochs)
      this.$store.commit("model/config/setBatchSize", data.batchSize)
      this.nav.next.disabled = this.disableNextBtn()
      // console.log("setEpochs...", data)
    },
    setOptimizer(data){
      // this.optimizer = data
      //save optimizer
      this.$store.commit("model/config/setOptimizer", data)
      this.nav.next.disabled = this.disableNextBtn()
      // console.log("setOptimizer...", data)
    },
    setLoss(data){
      // this.loss = data
      //save loss
      this.$store.commit("model/config/setLoss", data)
      this.nav.next.disabled = this.disableNextBtn()
      // console.log("setLoss...", data)
    },
    goPath(path){
      if (this.nav.next.disabled) return
      //save first all things
      this.$router.push(path)
    }
  },
  mounted(){
    // debugger
    this.init()
  }
}
</script>

<style scoped>
dv4-custom-button{
  width:8rem;
  text-align: center;
}

</style>
