<template>
  <div>
    <nuxt />
  </div>
</template>
<script>

export default {
  name: 'Login',
  created,
};

async function created() { // eslint-disable-line 
  const { isAuthenticated } = await this.$getUser();

  if (isAuthenticated) return this.$router.push({ path: '/' });
}
</script>
