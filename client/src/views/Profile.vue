<template>
  <div>
    <navbar />
    <b-container>
      <h2 class='page-title'>Profile</h2>
      <b-card no-body>
        <b-card-body>
          <b-form @submit.prevent=''>
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
                <b-form-input v-model='email' id='email' placeholder='Email' required type='email'>
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
                <b-form-input v-model='name' id='name' placeholder='Name' type='text'>
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
                <b-form-input v-model='pass' id='password' placeholder='Password'
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
                <b-form-input v-model='pass_confirm' id='pass_confirm'
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
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'profile',
  data() {
    return {
      error: null,
      email: this.$store.state.current_user.email || '',
      name: this.$store.state.current_user.name || '',
      pass: '',
      pass_confirm: '',
      submitting: false,
    };
  },
};
</script>
