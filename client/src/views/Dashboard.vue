<template>
  <div>
    <navbar />
    <b-container>
      <h2 class='page-title'>Scribbles</h2>
      <scribble-list />
    </b-container>
  </div>
</template>

<script>
import ScribbleList from '@/components/dashboard/ScribbleList.vue';

export default {
  name: 'dashboard',
  components: {
    ScribbleList,
  },
};
</script>
