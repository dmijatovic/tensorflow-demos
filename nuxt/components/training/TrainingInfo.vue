<template>
  <table>
    <tr v-for="item in listDef"
      :key="item.prop">
      <td>{{item.label}}</td>
      <td>{{itemValue(info[item.prop])}}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props:{
    info:{
      type:Object,
      default:()=>({
        timeSpend: null,
        maxAccuracy: null,
        finalLoss: null
      })
    }
  },
  data(){
    return{
      listDef:[
        {label:"Training time", prop:'timeSpend'},
        {label:"Max accuracy", prop:'maxAccuracy'},
        {label:"Loss range", prop:'lossRange'},
      ]
    }
  },
  methods:{
    itemValue(item){
      // debugger
      if (item===null) return ""
      if (typeof item === "object"){
        let value=""
        if (item instanceof Date){
          value = item.toLocaleString()
        }else if (Array.isArray(item)){
          value = item.toString().replace(","," - ")
        }else{
          Object.keys(item).forEach(key=>{
            value+=`${key}: ${item[key]} `
          })
        }
        return value
      } else {
        return item
      }
    }
  }
}
</script>

<style>

</style>
