<template>
  <section>
    <h3>Overview</h3>

    <BottomNav
      :prev="nav.prev"
      :next="nav.next"
      @goPath="goPath"
    />
  </section>
</template>

<script>
import BottomNav from "../../components/page/BottomNav"
export default {
  components:{
    BottomNav
  },
  data(){
    return{
       nav:{
        prev:{
          label:'Previous',
          href:'layers',
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
  methods:{
    goPath(path){
      this.$router.push(path)
    }
  }
}
</script>

<style>

</style>
