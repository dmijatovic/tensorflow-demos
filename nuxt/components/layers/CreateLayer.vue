<template>
  <section>
    <h4>Create model layer</h4>
    <div class="layer-row">
      <dv4-select
        title="Activation"
        message="Select activaction function"
        :options="getActivationOptions"
        :value="layer.activation"
        missing-option='select one'
        @onChange="({target})=>{setOption({target,item:'activation',type:'string'})}"
        >
      </dv4-select>
      <dv4-text-input
          name="layer-units"
          label="Units"
          message="Dimensionality of the output space"
          :value="layer.units"
          @onChange="({target})=>{setOption({target,item:'units',type:'int'})}"
      >
      </dv4-text-input>
      <div class="layer-checkbox">
        <input
          type="checkbox"
          id="useBias"
          name="useBias"
          :value="layer.useBias"
          @change="toggleBias"
          />
        <label for="useBias">
          Use bias
        </label>
      </div>
      <div class="layer-nav">
        <dv4-custom-button
          @click="addLayer"
          :disabled="disableAddBtn"
          primary>
          Add layer
        </dv4-custom-button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import formatValue from "../../utils/formatValue"
export default {
  data(){
    return {
      layer:{
        //Activation function to use.
        activation:null,
        // Positive integer, dimensionality of the output space.
        units: null,
        // Whether to apply a bias.
        useBias:true
      }
    }
  },
  computed:{
    ...mapGetters("model/options",[
      'getActivationOptions'
    ]),
    disableAddBtn(){
      if (!this.layer.activation) return true
      if (!this.layer.units) return true
      return false
    }
  },
  methods:{
    setOption({target,item, type}){
      this.layer[item] = formatValue(type,target.value)
    },
    toggleBias({target}){
      // debugger
      // console.log("toggleBias...", target.value)
      this.layer.useBias = formatValue("boolean",target.value)
    },
    addLayer(){
      // console.log("Add layer to model", this.layer)
      const layer={
        ...this.layer
      }
      this.resetData()
      this.$emit("addLayer", layer)
    },
    resetData(){
      this.layer.activation="select one"
      this.layer.units = null
      this.layer.useBias = false
    }
  }
}
</script>

<style scoped>
.layer-row{
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
}
.layer-checkbox{
  display:flex;
  padding: 1rem;
}
.layer-nav{
  flex:1;
}

</style>
