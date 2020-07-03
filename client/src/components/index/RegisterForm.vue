<template>
  <b-form @submit.prevent='register'>
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

    <b-form-group label='Password' label-for='password'>
      <b-input-group>
        <template v-slot:prepend>
          <b-input-group-text>
            <b-icon icon='lock' />
          </b-input-group-text>
        </template>
        <b-form-input v-model='form.password' id='password' placeholder='Password' required
                      type='password'>
        </b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group label='Confirm Password' label-for='confirm_password'>
      <b-input-group>
        <template v-slot:prepend>
          <b-input-group-text>
            <b-icon icon='lock' />
          </b-input-group-text>
        </template>
        <b-form-input v-model='form.confirm_password' id='confirm_password'
                      placeholder='Confirm Password' required type='password'>
        </b-form-input>
      </b-input-group>
    </b-form-group>

    <b-button block :disabled='submitting' type='submit' variant='primary'>
      <b-spinner v-if='submitting' label='Loading' small></b-spinner>
      <span v-else><b-icon icon='person-plus'></b-icon> Register</span>
    </b-button>
  </b-form>
</template>

<script>
export default {
  name: 'register_form',
  data() {
    return {
      error: null,
      form: {
        confirm_password: '',
        email: '',
        password: '',
      },
      submitting: false,
    };
  },
  methods: {
    register() {
      this.error = null;
      this.submitting = true;

      this.$http.post('/api/register', this.form)
        .then(() => {
          this.$router.push({ name: 'dashboard' });
        })
        .catch((err) => {
          this.submitting = false;
          this.error = err.response.data.message;
        });
    },
  },
};
</script>
