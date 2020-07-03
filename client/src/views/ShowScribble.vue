<template>
  <div>
    <navbar />
    <b-container>
      <alert v-if='error_loading_scribble' variant='danger'>
        {{ error_loading_scribble }}
      </alert>

      <div v-else-if='!scribble' class='d-flex flex-wrap justify-content-center mb-3'>
        <b-spinner label='Loading...'></b-spinner>
        <div class='font-weight-bolder mt-3 text-center w-100'>
          Loading Scribble...
        </div>
      </div>

      <div v-else class='scribble'>
        <h2 v-html='scribble.title || "<em>No Title</em>"' class='page-title'></h2>
        <b-card class='scribble__content'>
          <b-card-text v-html='content'></b-card-text>
        </b-card>
        <div class='scribble__actions'>
          <router-link v-b-tooltip.hover class='btn btn-outline-primary btn-sm' title='Edit'
                      :to='{ name: "edit_scribble", params: { id: $route.params.id } }'>
            <b-icon icon='pencil-square' scale='1.25'></b-icon>
          </router-link>
          <b-button @click='show_delete = true' v-b-tooltip.hover size='sm' title='Delete'
                     variant='outline-danger'>
            <b-icon icon='trash' scale='1.25'></b-icon>
          </b-button>
        </div>
      </div>
    </b-container>

    <b-modal v-model='show_delete' centered id='delete-scribble' title='Delete Scribble?'>
      <alert v-if='error_deleting_scribble' variant='danger'>
        {{ error_deleting_scribble }}
      </alert>
      <p class='my-2'>Are you sure you want to delete this Scribble?</p>
      <template v-slot:modal-footer>
        <b-button @click='show_delete = false' :disabled='deleting' variant='outline-secondary'>
          <b-icon icon='x-circle'></b-icon> Cancel
        </b-button>
        <b-button @click='deleteScribble' :disabled='deleting' variant='danger'>
          <b-spinner v-if='deleting' label='Deleting' small></b-spinner>
          <span v-else><b-icon icon='trash'></b-icon> Delete</span>
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true,
  typographer: true,
});

export default {
  name: 'show_scribble',
  data() {
    return {
      deleting: false,
      error_loading_scribble: null,
      error_deleting_scribble: 'There was a problem deleting the Scribble',
      scribble: null,
      show_delete: false,
    };
  },
  mounted() {
    this.$http.get(`/api/scribbles/id/${this.$route.params.id}`)
      .then((res) => {
        this.scribble = res.data.content;
        this.$store.commit('setState', { name: 'selected_scribble', value: res.data.content });
      })
      .catch((err) => {
        this.error_loading_scribble = err?.response?.data?.message
          || 'There was a problem loading the Scribble';
      });
  },
  methods: {
    deleteScribble() {
      this.deleting = true;
      this.$http.delete(`/api/scribbles/${this.$route.params.id}`)
        .then(() => {
          this.$router.push({ name: 'dashboard' });
        })
        .catch((err) => {
          this.deleting = false;
          this.error_deleting_scribble = err?.response?.data?.message
            || 'There was a problem deleting the Scribble';
        });
    },
  },
  computed: {
    content() {
      if (!this.scribble || !this.scribble.content) return '';
      if (this.scribble.rich_editor) return this.scribble.content;
      return markdown.render(this.scribble.content);
    },
  },
};
</script>

<style lang='scss'>
.scribble {
  .scribble__content {
    .card-text {
      margin-bottom: 0;

      > *:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
      }
    }
  }

  .scribble__actions {
    margin-top: 1rem;
    text-align: center;

    > *:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
}
</style>
