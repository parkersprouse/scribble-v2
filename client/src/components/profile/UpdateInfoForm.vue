<template>
  <b-card no-body>
    <b-card-body>
      <b-form @submit.prevent='submit'>
        <alert v-if='error' variant='danger'>
          {{ error }}
        </alert>

        <b-form-group label='Email' label-for='email'>
          <b-input-group>
            <template v-slot:prepend>
              <b-input-group-text>
                <b-icon icon='envelope' />
              </b-input-group-text>
            </template>
            <b-form-input v-model='form.email' id='email' placeholder='Email' required type='email'>
            </b-form-input>
          </b-input-group>
        </b-form-group>

        <b-form-group label='Name' label-for='name'>
          <b-input-group>
            <template v-slot:prepend>
              <b-input-group-text>
                <b-icon icon='envelope' />
              </b-input-group-text>
            </template>
            <b-form-input v-model='form.name' id='name' placeholder='Name' type='text'>
            </b-form-input>
          </b-input-group>
        </b-form-group>

        <b-button block :disabled='submitting' type='submit' variant='primary'>
          <b-spinner v-if='submitting' label='Loading' small></b-spinner>
          <span v-else><b-icon icon='box-arrow-right'></b-icon> Update Info</span>
        </b-button>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'update-info-form',
  data() {
    return {
      error: null,
      form: {
        email: this.$store.state.current_user.email || '',
        name: this.$store.state.current_user.name || '',
      },
      submitting: false,
    };
  },
  methods: {
    submit() {
      this.submitting = true;
      this.error = 'Broked';
    },
  },
};
</script>
