<template>
  <section>
    <dv4-select
      title="Loss function"
      message="Select loss fn"
      :options="getLossOptions"
      :value="loss.type"
      missing-option='select one'
      @onChange="setLoss"
      >
    </dv4-select>
    <dv4-text-input
      v-for="arg in losses.args"
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
export default {
  data(){
    return {
      _loss:{
        type:null,
        args:[]
      }
    }
  },
  computed:{
    ...mapState("model/config",[
      'loss'
    ]),
    ...mapState("model/options",[
      'losses'
    ]),
    ...mapGetters("model/options",[
      'getLossOptions'
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
    setLoss({target}){
      if (target.value==="-1"){
        this._loss = {
          type:null,
          args:[]
        }
        this.addLoss(this._loss)
      }else{
        // debugger
        const loss = this.losses.filter(item=>item.type===target.value)
        if (loss.length>0){
          this._loss = loss[0]
          this.addLoss(this._loss)
        }else{
          console.error("Loss not found...", target.value)
        }
      }
    },
    setArgs({target,item,type}){
      // console.log("TODO! Set argument...", item,value)
      const arg = this._loss.args.filter(arg=>arg.name===item)
      if (arg.length===1){
        arg[0]['value'] = formatValue(type,target.value)
        this.addLoss(this._loss)
      }else{
        console.error("Loss.setArgs: cannot find arg...", item)
      }
    },
    addLoss(loss){
      // console.log("Add loss function", this.loss)
      this.$emit("onChange", loss)
    }
  }
}
</script>

<style>

</style>
