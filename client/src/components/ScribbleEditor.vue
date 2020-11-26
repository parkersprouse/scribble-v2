<template>
  <b-card no-body>
    <b-tabs card>
      <b-tab title='Edit' active>
        <b-card-text>
          <alert v-if='error' variant='danger'>
            {{ error }}
          </alert>

          <div class='text-center mb-3'>
            <b-form-checkbox v-model='is_public' switch>
              Scribble will be <strong>{{ is_public ? 'public' : 'private' }}</strong>
            </b-form-checkbox>
          </div>

          <b-input-group class='mb-3'>
            <template v-slot:prepend>
              <b-input-group-text>
                <b-icon icon='pencil' />
              </b-input-group-text>
            </template>
            <b-form-input v-model='title' placeholder='Title'></b-form-input>
          </b-input-group>

          <quill-editor v-if='rich_editor' v-model='html_content' :options='editor_options'>
            <div id='editor_toolbar' slot='toolbar'>
              <span class='ql-formats'>
                <button v-b-tooltip.hover title='Bold' class='ql-bold' type='button'></button>
                <button v-b-tooltip.hover title='Italics' class='ql-italic' type='button'>
                </button>
                <button v-b-tooltip.hover title='Underline' class='ql-underline' type='button'>
                </button>
                <button v-b-tooltip.hover title='Strike-through' class='ql-strike'
                        type='button'></button>
              </span>
              <span class='ql-formats'>
                <button v-b-tooltip.hover title='Numbered List' class='ql-list' type='button'
                        value='ordered'></button>
                <button v-b-tooltip.hover title='Bulleted List' class='ql-list' type='button'
                        value='bullet'></button>
              </span>
              <span class='ql-formats'>
                <select class='ql-header' id='ql-header'>
                  <option value='1'></option>
                  <option value='2'></option>
                  <option value='3'></option>
                  <option value='4'></option>
                  <option value='5'></option>
                  <option value='6'></option>
                  <option selected='selected'></option>
                </select>
                <b-tooltip target='ql-header' triggers='hover'>
                  Header
                </b-tooltip>
              </span>
              <span class='ql-formats'>
                <select class='ql-color' id='ql-color'></select>
                <b-tooltip target='ql-color' triggers='hover'>
                  Text Color
                </b-tooltip>
                <select class='ql-background' id='ql-background'></select>
                <b-tooltip target='ql-background' triggers='hover'>
                  Background Color
                </b-tooltip>
              </span>
              <span class='ql-formats'>
                <select class='ql-align' id='qa-align'></select>
                <b-tooltip target='qa-align' triggers='hover'>
                  Align
                </b-tooltip>
              </span>
              <span class='ql-formats'>
                <button v-b-tooltip.hover title='Insert Link' class='ql-link' type='button'>
                </button>
                <button v-b-tooltip.hover title='Insert Image' class='ql-image' type='button'>
                </button>
                <button v-b-tooltip.hover title='Insert Video' class='ql-video' type='button'>
                </button>
              </span>
              <span class='ql-formats'>
                <button v-b-tooltip.hover title='Clear Formatting' class='ql-clean'
                        type='button'></button>
              </span>
            </div>
          </quill-editor>
          <b-form-textarea v-else v-model='text_content' class='markdown-text-editor' max-rows='20'
                           placeholder='Scribble Content' rows='6'>
          </b-form-textarea>

          <p class='mb-4 mt-0 text-right switch-editor-type'>
            <span v-if='rich_editor' @click='rich_editor = false'>
              Switch to Markdown
            </span>
            <span v-else @click='rich_editor = true'>
              Switch to Fancy Editor
            </span>
          </p>

          <b-form-tags v-model='tags' no-outer-focus class='mb-3'>
            <template v-slot='{ duplicateTags, tags, inputAttrs, inputHandlers, tagVariant, addTag,
                                removeTag }'>
              <form class='mb-2' @submit.prevent='addNewTag(addTag, new_tag)'>
                <b-input-group>
                  <v-typeahead v-model='new_tag' class='w-100' :data='tag_options'
                              :minMatchingChars='1' placeholder='Enter Tag' :showOnFocus='true'>
                    <template slot='prepend'>
                      <b-input-group-text>
                        <b-icon icon='tag' />
                      </b-input-group-text>
                    </template>
                    <template slot='append'>
                      <b-button :disabled='!new_tag' variant='outline-secondary' type='submit'>
                        Add
                      </b-button>
                    </template>
                  </v-typeahead>
                </b-input-group>
              </form>
              <div v-if='duplicateTags.length > 0' class='mb-2 mt-n2 text-muted small'>
                Duplicate tag: {{ duplicateTags.join(',') }}
              </div>
              <div class='d-inline-block'>
                <b-form-tag v-for='tag in tags' class='mr-1' :key='tag' @remove='removeTag(tag)'>
                  {{ tag }}
                </b-form-tag>
              </div>
            </template>
          </b-form-tags>

          <p class='mb-0 mt-4 text-center'>
            <b-button block @click='submit' :disabled='submitting || !preview_content'
                      variant='primary'>
              <b-spinner v-if='submitting' label='Creating' small></b-spinner>
              <span v-else>
                <b-icon :icon='editor_config.submit_icon'></b-icon>
                {{ editor_config.submit_action }}
              </span>
            </b-button>
          </p>
        </b-card-text>
      </b-tab>
      <b-tab title='Preview' class='scribble__content'>
        <b-card-text v-html='preview_content'></b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
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
          toolbar: '#editor_toolbar',
        },
        placeholder: 'Scribble Content',
        theme: 'snow',
      },
      error: null,
      html_content: '',
      is_public: false,
      new_tag: '',
      rich_editor: true,
      submitting: false,
      tag_options: [],
      tags: [],
      text_content: '',
      title: '',
    };
  },
  mounted() {
    if (this.existing_scribble) {
      this.rich_editor = this.existing_scribble.rich_editor;
      this.tags = this.existing_scribble.tags;
      this.title = this.existing_scribble.title;
      this.is_public = this.existing_scribble.public;
      if (this.existing_scribble.rich_editor) {
        this.html_content = this.existing_scribble.content;
      } else {
        this.text_content = this.existing_scribble.content;
      }
    }

    this.$http.get('/api/scribbles/tags')
      .then((res) => {
        this.tag_options = res.data.content;
      })
      .catch(() => {});
  },
  methods: {
    // We use a wrapper so that we can let the Bootstrap-Vue tag form use its own `addTag` logic
    // while adding our own logic on top of it, specifically to clear the autocomplete field
    // after a new tag has been added.
    addNewTag(callback, tag) {
      callback(tag);
      if (!this.tags.includes(tag)) this.new_tag = '';
    },
    submit() {
      this.error = null;
      this.submitting = true;

      this.editor_config.method(this.editor_config.endpoint, {
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
          this.error = err?.response?.data?.message
            || `Failed to ${this.editor_config.submit_action.toLowerCase()} Scribble`;
          this.submitting = false;
        });
    },
  },
  computed: {
    editor_config() {
      return {
        endpoint: this.existing_scribble ? `/api/scribbles/${this.existing_scribble.id}`
          : '/api/scribbles',
        method: this.existing_scribble ? this.$http.patch : this.$http.post,
        submit_icon: this.existing_scribble ? 'check2-circle' : 'plus-circle',
        submit_action: this.existing_scribble ? 'Update' : 'Create',
      };
    },
    existing_scribble() {
      return this.$store.state.selected_scribble || null;
    },
    preview_content() {
      if (!this.html_content && !this.text_content) return '';
      if (this.rich_editor) return this.html_content;
      return markdown.render(this.text_content);
    },
  },
};
</script>

<style lang='scss'>
.switch-editor-type {
  > * {
    cursor: pointer;
    font-size: 0.75rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

.markdown-text-editor {
  overflow-y: auto !important;
}
</style>
