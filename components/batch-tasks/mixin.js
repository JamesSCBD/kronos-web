export default {
  props: {
    selectedResult: {
      type   : Object,
      default: () => ({}),
    },
    show: {
      type    : Boolean,
      required: false,
      default : false,
    },
  },
};
