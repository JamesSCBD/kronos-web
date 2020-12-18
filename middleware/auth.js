const routeRoles = ({ route }) => (route.matched[0] ? route.matched[0].components.default.options.auth : false);
const user       = ({ store }) => store.$ssoScbd.me;
const userRoles  = ({ store }) => store.$ssoScbd.me.roles || [];
const authorized = (ctx) => !routeRoles(ctx) || Boolean(routeRoles(ctx).filter((x) => userRoles(ctx).includes(x)).length);
const error403   = (ctx) => ctx.error({ statusCode: 403, message: `Forbidden: ${user(ctx).name} do not have permission to view the URI` });

export default  (ctx) => {
  if (!user(ctx).isAuthenticated) return;

  if (!authorized(ctx)) error403(ctx);
};
