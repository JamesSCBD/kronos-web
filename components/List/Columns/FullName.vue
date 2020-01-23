<template functional>
  <span>
    <strong> {{ props.LastName }} </strong>
    <span v-if="props.FirstName">, {{ props.FirstName }}</span>
    <span v-if="props.Title">, {{ props.Title }}</span>
    <span v-if="props.Designation"> - {{ props.Designation }} </span>
  </span>
</template>
