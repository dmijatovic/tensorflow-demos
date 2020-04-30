<template>
<section>
  <h3>Layers subpage</h3>

  <CreateLayer
    @addLayer="addLayer"/>

  <LayerList
    :layersInfo="layers"
    @deleteLayer="deleteLayer"/>

  <BottomNav
    :prev="nav.prev"
    :next="nav.next"
    @goPath="goPath"
  />

</section>
</template>

<script>
import {mapState, mapGetters} from "vuex"
import CreateLayer from "../../components/layers/CreateLayer"
import LayerList from "../../components/layers/LayerList"
import BottomNav from "../../components/page/BottomNav"

export default {
  components:{
    CreateLayer,
    LayerList,
    BottomNav
  },
  data(){
    return{
      showCreate:true,
      nav:{
        prev:{
          label:'Back',
          href:'/binary',
          disabled: false
        },
        next:{
          label:'Next',
          href:'create',
          disabled:false
        }
      }
    }
  },
  computed:{
    ...mapState("model/config",[
      'layers'
    ]),
    ...mapGetters("binary",[
      'dataInfo'
    ])
  },
  methods:{
    init(){
      this.enableNext()
      //set if button create should be active
      this.$store.commit("binary/setCreateModelEnabled",false)
      this.$store.commit("binary/setTrainModelEnabled",false)
    },
    addLayer(layer){
      this.$store.commit("model/config/addLayerDef", layer)
      this.enableNext()
    },
    deleteLayer(pos){
      this.$store.commit("model/config/deleteLayerDef",pos)
      this.enableNext()
    },
    goPath(path){
      this.$router.push(path)
    },
    saveFeaturesAndLabel(dataInfo){
      // debugger
      const {featuresList, labelTarget} = dataInfo
      this.$store.commit("model/config/setFeatures", featuresList)
      this.$store.commit("model/config/setLabel", labelTarget)
    },
    enableNext(){
      const d = this.layers.length === 0
      this.nav.next.disabled = d
    }
  },
  mounted(){
    this.init()
  },
  beforeDestroy(){
    this.saveFeaturesAndLabel(this.dataInfo)
  }
}
</script>

<style>

</style>
