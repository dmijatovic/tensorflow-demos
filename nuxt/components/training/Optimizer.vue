<template>
  <section>
    <dv4-select
      title="Optimizer"
      message="Select optimizer"
      :options="getOptimizerOptions"
      :value="optimizer.type"
      missing-option='select one'
      @onChange="setOptimizer"
      >
    </dv4-select>
    <dv4-text-input
      v-for="arg in optimizer.args"
      :key="arg.name"
      :name="`input-${arg.name}`"
      :label="arg.name"
      :message="getArgMessage(arg)"
      :value="getArgValue(arg)"
      @onChange="({target})=>{setArgs({target,item:arg.name,type:arg.type})}"
      >
    </dv4-text-input>
  </section>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import formatValue from "../../utils/formatValue"
export default {
  data(){
    return{
      //local optimizer object
      _optimizer:null
    }
  },
  computed:{
    ...mapState("model/config",[
      'optimizer'
    ]),
    ...mapState("model/options",[
      'optimizers'
    ]),
    ...mapGetters("model/options",[
      'getOptimizerOptions'
    ])
  },
  methods:{
    getArgMessage(arg){
      // debugger
      return `${arg.required ? 'Required parameter' : 'Optional parameter'}`
    },
    getArgValue(arg){
      if (arg.value){
        return arg.value
      } else if (arg.default){
        return arg.default
      } else {
        return null
      }
    },
    setOptimizer({target}){
      //debugger
      if (target.value==="-1"){
        //no answer
        this._optimizer={
          type:null,
          args:[]
        }
        this.addOptimizer(this._optimizer)
      }else{
        const optimizer = this.optimizers.filter(item=>item.type===target.value)
        if (optimizer.length===1){
          this._optimizer = optimizer[0]
          this.addOptimizer(this._optimizer)
        }else{
          console.error("Optimizer not found...", target.value)
        }
      }
    },
    setArgs({target,item,type}){
      // debugger
      const arg = this._optimizer.args.filter(arg=>arg.name===item)
      if (arg.length===1){
        arg[0]['value'] = formatValue(type,target.value)
        this.addOptimizer(this._optimizer)
      }else{
        console.error("Optimizer.setArgs: cannot find arg...", item)
      }
    },
    addOptimizer(optimizer){
      // console.log("Add optimizer to model", this.optimizer)
      this.$emit("onChange", optimizer)
    }
  }
}
</script>

<style>

</style>
