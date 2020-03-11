<template>
  <b-form @submit.prevent='login'>
    <b-form-group label='Email' label-for='email'>
      <b-form-input v-model='form.email' id='email' placeholder='Email' required type='email'>
      </b-form-input>
    </b-form-group>

    <b-form-group label='Password' label-for='password'>
      <b-form-input v-model='form.password' id='password' placeholder='Password' required
                    type='password'>
      </b-form-input>
    </b-form-group>

    <b-button block :class='{ loading: submitting }' :disabled='submitting' type='submit'
              variant='primary'>
      Login
    </b-button>
  </b-form>
</template>

<script>
export default {
  name: 'login_form',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      submitting: false,
    };
  },
  methods: {
    login() {
      this.submitting = true;

      this.$http.post('/api/login', this.form)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          this.submitting = false;
          console.log(err);
        });
    },
  },
};
</script>
