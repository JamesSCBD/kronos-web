// https://github.com/vaso2/nuxt-fontawesome#readme
// https://fontawesome.com/icons?d=gallery&m=free
const imports = [
  {
    set  : '@fortawesome/free-solid-svg-icons',
    icons: [
      'faPaperPlane', 'faPassport', 'faCircleNotch', 'faTachometerAlt', 'faEdit', 'faTrashAlt', 'faFilter', 'faSort',
      'faUser', 'faUsers', 'faUserFriends', 'faEllipsisH', 'faEllipsisV', 'faHome', 'faLock', 'faSignOutAlt', 'faPlus',
      'faPhoneAlt', 'faAddressBook', 'faTh', 'faFax', 'faEnvelope', 'faLongArrowAltLeft', 'faLongArrowAltRight', 'faInfoCircle',
      'faTimes', 'faUserCircle', 'faFileExport',
    ],
  },
  {
    set  : '@fortawesome/free-regular-svg-icons',
    icons: [ 'faAddressBook', 'faIdBadge', 'faAddressCard', 'faListAlt', 'faQuestionCircle', 'faBuilding' ],
  },
];

export default {
  component: 'fa',
  imports,
};
