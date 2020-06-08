export default function hasRole(role) {
  return hasRole[role] || (hasRole[role] = function(req, res, next) {
    if (!req.user.roles.includes(role)) res.status(401);
    else next();
  });
}