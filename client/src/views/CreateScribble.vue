<template>
  <div>
    <navbar />
    <b-container>
      <h2 class='page-title'>Create Scribble</h2>
      <b-card no-body>
        <b-tabs card>
          <b-tab title='Edit' active>
            <b-card-text>
              <b-alert v-if='error' show variant='danger'>
                <b-icon icon='x-circle-fill'></b-icon>
                {{ error }}
              </b-alert>

              <div class='text-center mb-3'>
                <b-form-checkbox v-model='is_public' switch>
                  Scribble will be <strong>{{ is_public ? 'public' : 'private' }}</strong>
                </b-form-checkbox>
              </div>

              <b-input-group class='mb-3'>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <b-icon icon='chat' />
                  </b-input-group-text>
                </template>
                <b-form-input v-model='title' placeholder='Title'></b-form-input>
              </b-input-group>

              <quill-editor v-if='rich_editor' v-model='html_content' :options='editor_options'>
              </quill-editor>
              <b-form-textarea v-else v-model='text_content' max-rows='20'
                               placeholder='Scribble Content' rows='6' style='overflow-y: auto;'>
              </b-form-textarea>

              <p class='mb-4 mt-0 text-right switch-editor-type'>
                <span v-if='rich_editor' @click='rich_editor = false'>
                  Switch to Markdown
                </span>
                <span v-else @click='rich_editor = true'>
                  Switch to Fancy Editor
                </span>
              </p>

              <b-form-tags v-model='tags' placeholder='Tags'></b-form-tags>

              <p class='mb-0 mt-4 text-center'>
                <b-button block @click='submit' :disabled='submitting' variant='primary'>
                  <b-spinner v-if='submitting' label='Creating' small></b-spinner>
                  <span v-else><b-icon icon='plus-circle'></b-icon> Create</span>
                </b-button>
              </p>
            </b-card-text>
          </b-tab>
          <b-tab title='Preview'>
            <b-card-text v-html='preview_content'></b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import { quillEditor } from 'vue-quill-editor';

import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true,
  typographer: true,
});

export default {
  name: 'create_scribble',
  components: {
    quillEditor,
  },
  data() {
    return {
      editor_options: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
        },
        placeholder: 'Scribble Content',
        theme: 'snow',
      },
      error: null,
      html_content: '',
      is_public: false,
      rich_editor: true,
      submitting: false,
      tags: [],
      text_content: '',
      title: '',
    };
  },
  methods: {
    submit() {
      this.error = null;
      this.submitting = true;

      this.$http.post('/api/scribbles', {
        content: this.rich_editor ? this.html_content : this.text_content,
        public: this.is_public,
        rich_editor: this.rich_editor,
        tags: this.tags,
        title: this.title,
      })
        .then((res) => {
          this.$router.push({ name: 'show_scribble', params: { id: res.data.content.id } });
        })
        .catch((err) => {
          this.error = err?.response?.data?.message || 'Failed to create scribble';
          this.submitting = false;
        });
    },
  },
  computed: {
    preview_content() {
      if (!this.html_content && !this.text_content) return '';
      if (this.rich_editor) return this.html_content;
      return markdown.render(this.text_content);
    },
  },
};
</script>

<style lang='scss'>
.quill-editor {
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;

  .ql-container {
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;

    .ql-editor {
      border-bottom-left-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
      min-height: 150px;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

      &:focus {
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
    }
  }
}

.switch-editor-type {
  > * {
    cursor: pointer;
    font-size: 0.75rem;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
