<template>
  <b-card no-body>
    <b-card-body>
      <b-form @submit.prevent=''>
        <b-form-group label='Password' label-for='password'>
          <b-input-group>
            <template v-slot:prepend>
              <b-input-group-text>
                <b-icon icon='lock' />
              </b-input-group-text>
            </template>
            <b-form-input v-model='form.pass' id='password' placeholder='Password'
                          type='password'>
            </b-form-input>
          </b-input-group>
        </b-form-group>

        <b-form-group label='Confirm Password' label-for='pass_confirm'>
          <b-input-group>
            <template v-slot:prepend>
              <b-input-group-text>
                <b-icon icon='lock' />
              </b-input-group-text>
            </template>
            <b-form-input v-model='form.pass_confirm' id='pass_confirm'
                          placeholder='Confirm Password' type='password'>
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
        pass: '',
        pass_confirm: '',
      },
      submitting: false,
    };
  },
};
</script>
