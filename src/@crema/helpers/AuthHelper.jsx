import { authRole } from '@crema/constants/AppConst';

export const getUserFromJwtAuth = (user) => {
  // Asegúrate de que `user` contenga el objeto `usuario`
    const usuario = user?.usuario;
    console.log(user);
    return {
      id: usuario.id || null, // Verificar si `id` existe
      uid: usuario.id || null, // Igual que arriba
      displayName: usuario.nombre || 'Nombre no disponible', // Verificar nombre
      email: usuario.correo_electronico || 'Correo no disponible', // Verificar email
      nombre_usuario: usuario.nombre_usuario || null, // Igual que arriba
      code: usuario.code || null, // Igual que arriba
      pais: usuario.pais || null, // Igual que arriba
      indicativo: usuario.indicativo || null, // Igual que arriba
      web: usuario.web || null, // Igual que arriba
      telefono: usuario.telefono || null, // Igual que arriba
      red_social1: usuario.red_social1 || null, // Igual que arriba
      red_social2: usuario.red_social2 || null, // Igual que arriba
      photoURL: '#', // Esto puedes dejarlo vacío
      role: authRole.User || 'user', // Si `rol` no existe, usar valor por defecto
      permisos: usuario.permisos || [], // Si no hay permisos, devolver un array vacío
      rol: usuario.rol || {}, // Si `rol` es undefined, devolver un objeto vacío
    };

  return null; // Retorna null si `user` no es un objeto válido o no tiene `usuario`
};

  
