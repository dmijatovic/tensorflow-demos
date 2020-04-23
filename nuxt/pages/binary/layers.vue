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
import {mapState} from "vuex"
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
       nav:{
        prev:{
          label:'Previous',
          href:'/binary',
          disabled: false
        },
        next:{
          label:'Next',
          href:'view',
          disabled:false
        }
      }
    }
  },
  computed:{
    ...mapState("model/config",[
      'layers'
    ])
  },
  methods:{
    addLayer(layer){
      this.$store.commit("model/config/addLayerDef", layer)
    },
    deleteLayer(pos){
      this.$store.commit("model/config/deleteLayerDef",pos)
    },
    goPath(path){
      this.$router.push(path)
    }
  }
}
</script>

<style>

</style>
