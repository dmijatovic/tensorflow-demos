<template>
<section class="grid col-2">
  <div>
    <h3>Training</h3>
    <Epochs
    class="grid col-2"
    :epochs="epochs"
    :batchSize="batchSize"
    @onChange="setEpochs"
    />
    <Loss
      class="grid col-2"
      @onChange="setLoss"
    />
    <Optimizer
      class="grid col-2"
      @onChange="setOptimizer"
    />
  </div>
  <div>
    <h3>Data info</h3>
    <DataInfo
      v-if="dataInfo"
      :dataInfo="dataInfo"
    />
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
import Epochs from "../../components/training/Epochs"
import Optimizer from "../../components/training/Optimizer"
import Loss from "../../components/training/Loss"
import DataInfo from "../../components/DataInfo"
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
    DataInfo,
    BottomNav
  },
  computed:{
    ...mapState("model/config",[
      'epochs','batchSize',
      'optimizer', 'loss'
    ]),
    ...mapGetters('binary',[
      'dataInfo'
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

.bottom-nav{
  grid-column-start: 1;
  grid-column-end: 3;
}

</style>
