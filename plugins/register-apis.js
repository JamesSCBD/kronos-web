import KronosApi from '~/api/kronos';

export default ({ store }, inject) => {
  const kronosApi = new KronosApi(() => (store.$ssoScbd.auth || {}).token);

  inject('kronosApi', kronosApi);
};
