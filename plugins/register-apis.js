import KronosApi from '~/api/kronos';

export default ({ store }, inject) => {
  const kronosApi = new KronosApi(() => (store.state.auth || {}).token);

  inject('kronosApi', kronosApi);
};
