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
        stadium: "Unknown",
        name:"Test name",
        createdAt: null
      })
    }
  },
  data(){
    return{
      listDef:[
        {label:"Stadium", prop:'stadium'},
        {label:"Name", prop:'name'},
        {label:"Created at", prop:'createdAt'}
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
