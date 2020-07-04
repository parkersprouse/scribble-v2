<template>
  <div>
    <navbar />
    <b-container>
      <h2 class='page-title'>Edit Scribble</h2>
      <div class='mb-3' style='margin-top: -0.5rem;'>
        <router-link :to='{ name: "show_scribble", params: { id: this.$route.params.id } }'>
          <b-icon icon='chevron-double-left' scale='0.75'></b-icon> Back to Scribble
        </router-link>
      </div>

      <scribble-editor v-if='$store.state.selected_scribble' />

      <alert v-else-if='error' variant='danger'>
        {{ error }}
      </alert>

      <div v-else class='d-flex flex-wrap justify-content-center mb-3'>
        <b-spinner label='Loading...'></b-spinner>
        <div class='font-weight-bolder mt-3 text-center w-100'>
          Loading Scribble...
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import ScribbleEditor from '@/components/ScribbleEditor.vue';

export default {
  name: 'edit_scribble',
  components: {
    ScribbleEditor,
  },
  data() {
    return {
      error: null,
    };
  },
  mounted() {
    if (!this.$store.state.selected_scribble) {
      this.$http.get(`/api/scribbles/id/${this.$route.params.id}`)
        .then((res) => {
          this.$store.commit('setState', { name: 'selected_scribble', value: res.data.content });
        })
        .catch((err) => {
          this.error = err?.response?.data?.message
            || 'There was a problem loading the Scribble';
        });
    }
  },
};
</script>
