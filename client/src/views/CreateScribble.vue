<template>
  <div>
    <navbar />
    <b-container>
      <h2 class='page-title'>Create Scribble</h2>
      <scribble-editor />
    </b-container>
  </div>
</template>

<script>
import ScribbleEditor from '@/components/ScribbleEditor.vue';

export default {
  name: 'create_scribble',
  components: {
    ScribbleEditor,
  },
};
</script>
