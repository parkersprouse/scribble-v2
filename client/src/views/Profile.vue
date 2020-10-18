<template>
  <div>
    <navbar />
    <b-container>
      <h2 class='page-title'>Profile</h2>
      <b-row align-h='center'>
        <b-col md='6'>
          <update-info-form />
        </b-col>
        <b-col md='6'>
          <update-password-form />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import UpdateInfoForm from '@/components/profile/UpdateInfoForm.vue';
import UpdatePasswordForm from '@/components/profile/UpdatePasswordForm.vue';

export default {
  name: 'profile',
  components: {
    UpdateInfoForm,
    UpdatePasswordForm,
  },
};
</script>
