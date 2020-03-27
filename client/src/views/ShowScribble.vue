<template>
  <div>
    <navbar />
    <b-container>
      <b-alert v-if='error' show variant='danger'>
        {{ error }}
      </b-alert>

      <div v-else-if='!scribble' class='d-flex flex-wrap justify-content-center mb-3'>
        <b-spinner label="Loading..."></b-spinner>
        <div class='font-weight-bolder mt-3 text-center w-100'>
          Loading Scribble...
        </div>
      </div>

      <div v-else class='scribble'>
        <h2 v-html='scribble.title || "<em>No Title</em>"'
            class='border-bottom font-weight-bold mb-4 pb-2'></h2>
        <b-card class='scribble__content'>
          <b-card-text v-html='content'></b-card-text>
        </b-card>
        <div class='scribble__actions'>
          <b-button variant='info'><b-icon icon='pencil'></b-icon></b-button>
          <b-button variant='danger'><b-icon icon='trash'></b-icon></b-button>
        </div>
      </div>
    </b-container>
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
      error: null,
      scribble: null,
    };
  },
  mounted() {
    this.$http.get(`/api/scribbles/id/${this.$route.params.id}`)
      .then((res) => {
        this.scribble = res.data.content;
      })
      .catch((err) => {
        this.error = err.response.data.message;
      });
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
}
</style>
