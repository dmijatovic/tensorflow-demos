<template>
  <section>
    <dv4-text-input
      name="epochs"
      label="Epochs"
      message="Type nr. of epochs"
      :value="epochs"
      @onChange="({target})=>{setOption({target,item:'epochs',type:'int'})}"
    >
    </dv4-text-input>
    <dv4-text-input
      name="batch-size"
      label="Batch size"
      message="Batch size to split sample in"
      :value="batchSize"
      @onChange="({target})=>{setOption({target,item:'batchSize',type:'int'})}"
    >
    </dv4-text-input>
  </section>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import formatValue from "../../utils/formatValue"
export default {
  props:{
    epochs:{
      type:Number,
      default:null
    },
    batchSize:{
      type:Number,
      default:null
    }
  },
  methods:{
    setOption({target,item,type}){
      const {epochs, batchSize} = this
      const data={
        epochs,
        batchSize
      }
      data[item] = formatValue(type,target.value)
      this.emitChange(data)
    },
    emitChange(data){
      this.$emit("onChange",data)
    }
  }
}
</script>

<style>

</style>
