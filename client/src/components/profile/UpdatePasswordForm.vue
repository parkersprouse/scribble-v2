<template>
  <b-card no-body>
    <b-card-body>
      <b-form @submit.prevent='submit'>
        <alert v-if='error' variant='danger'>
          {{ error }}
        </alert>

        <b-form-group label='New Password' label-for='password_new'>
          <b-input-group>
            <template v-slot:prepend>
              <b-input-group-text>
                <b-icon icon='lock' />
              </b-input-group-text>
            </template>
            <b-form-input v-model='form.password_new' id='password_new'
                          placeholder='New Password' type='password'>
            </b-form-input>
          </b-input-group>
        </b-form-group>

        <b-form-group label='Confirm New Password' label-for='password_new_confirm'>
          <b-input-group>
            <template v-slot:prepend>
              <b-input-group-text>
                <b-icon icon='lock' />
              </b-input-group-text>
            </template>
            <b-form-input v-model='form.password_new_confirm' id='password_new_confirm'
                          placeholder='Confirm New Password' type='password'>
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
                          placeholder='Current Password' type='password'>
            </b-form-input>
          </b-input-group>
        </b-form-group>

        <b-button block :disabled='submitting' type='submit' variant='primary'>
          <b-spinner v-if='submitting' label='Loading' small></b-spinner>
          <span v-else><b-icon icon='box-arrow-right'></b-icon> Update Password</span>
        </b-button>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'update-password-form',
  data() {
    return {
      error: null,
      form: {
        password_new: '',
        password_new_confirm: '',
        password_current: '',
      },
      submitting: false,
    };
  },
  methods: {
    submit() {
      this.submitting = true;
      this.error = null;

      this.$http.patch('/api/users/password', this.form)
        .then(() => {
          this.$bvToast.toast('Password successfully updated', {
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
            || 'There was an unknown issue when updating your password';
        });
    },
  },
};
</script>
