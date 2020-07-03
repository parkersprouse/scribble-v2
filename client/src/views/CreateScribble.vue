<template>
  <div>
    <navbar />
    <b-container>
      <h2 class='page-title'>Create Scribble</h2>
      <scribble-editor v-if='!$store.state.selected_scribble' />
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
  mounted() {
    this.$store.commit('setState', { name: 'selected_scribble', value: null });
  },
};
</script>
