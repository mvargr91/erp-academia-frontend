export const checkPermission = (routeRole, userRole) => {
  // Si no hay roles de ruta definidos, se permite el acceso
  if (!routeRole) return true;

  // Si routeRole es un array, verificamos si alguno de los roles coincide con el rol del usuario
  if (Array.isArray(routeRole)) {
    // Si el rol de usuario también es un array, buscamos alguna coincidencia
    if (Array.isArray(userRole)) {
      return routeRole.some(role => userRole.includes(role));
    }
    // Si el rol de usuario no es un array, verificamos si está incluido en los roles permitidos
    return routeRole.includes(userRole);
  }

  // Si routeRole no es un array, verificamos si el rol del usuario coincide
  if (Array.isArray(userRole)) {
    return userRole.includes(routeRole);
  }

  // Verificamos si los roles coinciden
  return routeRole === userRole;
};
