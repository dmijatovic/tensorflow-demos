<template>
  <PageContent>
    <template #page-title>
      <h1>Tensorflow demo</h1>
    </template>
    <template #page-body>
      <p>Welcome to tensorflow demo site with NuxtJS.
      </p>
    </template>
  </PageContent>
</template>

<script>

import PageContent from '@/components/page/PageContent'
import { mapState } from 'vuex'

export default {
  components:{
    PageContent
  },
  computed:{
    ...mapState([
      'loading'
    ])
  },
  data(){
    return{
      hello:"World"
    }
  },
  mounted(){
    // debugger
  }
}
</script>
<style>

</style>
