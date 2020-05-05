<template>
<section>
  <Paragraph
    v-for="(section, key) in sections"
    :key="key"
    :title="section.title"
    :text="section.text" />
  <section class="grid col-2">
    <div>
      <h3>Create new layer</h3>
      <CreateLayer
        @addLayer="addLayer"/>
    </div>
    <div>
      <h3>Layers</h3>
      <LayerList
        :layersInfo="layers"
        @deleteLayer="deleteLayer"/>
    </div>
    <BottomNav
      :prev="nav.prev"
      :next="nav.next"
      @goPath="goPath"
    />
  </section>
</section>
</template>

<script>
import {mapState, mapGetters} from "vuex"
import CreateLayer from "../../components/layers/CreateLayer"
import LayerList from "../../components/layers/LayerList"
import BottomNav from "../../components/page/BottomNav"
import Paragraph from "../../components/page/Paragraph"

export default {
  components:{
    CreateLayer,
    LayerList,
    BottomNav,
    Paragraph
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
    ...mapState("binary",{
      sections:(state)=>{
        return state.sections['layers']
      }
    }),
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

<style scoped>
.bottom-nav{
  grid-column-start: 1;
  grid-column-end: 3;
}
</style>
