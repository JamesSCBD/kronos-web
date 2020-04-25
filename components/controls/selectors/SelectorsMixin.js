import _ from 'lodash';

const methods = { asArray };

export default {
  methods,
  props: {
    multiple: {
      type   : Boolean,
      default: true,
    },
  },
};

function asArray(data) {
  return _([ data ])
    .flatten()
    .compact()
    .value();
}
