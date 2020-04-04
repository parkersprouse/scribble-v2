<template>
  <div>
    <navbar />
    <b-container>
      <b-alert v-if='error' show variant='danger'>
        {{ error }}
      </b-alert>

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
          <b-button v-b-tooltip.hover size='sm' title='Edit' variant='outline-primary'>
            <svg class='bi b-icon bi-pencil-square' width='1em' height='1em' viewBox='0 0 16 16'
                 fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
              <path d='M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707
                       0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805
                       2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z' />
              <path clip-rule='evenodd' fill-rule='evenodd' d='M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5
                                                               0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0
                                                               01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5
                                                               0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5
                                                               0 001 2.5v11z' />
            </svg>
          </b-button>
          <b-button v-b-tooltip.hover size='sm' title='Delete' variant='outline-danger'>
            <b-icon icon='trash' scale='1.25'></b-icon>
          </b-button>
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

  .scribble__actions {
    margin-top: 1rem;
    text-align: center;

    > *:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
}
</style>
