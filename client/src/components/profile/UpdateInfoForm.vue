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
                <b-icon icon='tag' />
              </b-input-group-text>
            </template>
            <b-form-input v-model='form.name' id='name' placeholder='Name' type='text'>
            </b-form-input>
          </b-input-group>
        </b-form-group>

        <b-form-group label='Current Password' label-for='password_current'>
          <b-input-group>
            <template v-slot:prepend>
              <b-input-group-text>
                <b-icon icon='lock' />
              </b-input-group-text>
            </template>
            <b-form-input v-model='form.password_current' id='password_current'
                          placeholder='Current Password' type='password' required>
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
        password_current: '',
      },
      submitting: false,
    };
  },
  methods: {
    submit() {
      this.submitting = true;
      this.error = null;

      this.$http.patch('/api/users', this.form)
        .then(() => {
          this.$bvToast.toast('Info successfully updated', {
            autoHideDelay: 3000,
            solid: true,
            title: 'Success',
            variant: 'success',
          });
          this.submitting = false;
        })
        .catch((err) => {
          this.submitting = false;
          this.error = err?.response?.data?.message
            || 'There was an unknown issue when updating your info';
        });
    },
  },
};
</script>
