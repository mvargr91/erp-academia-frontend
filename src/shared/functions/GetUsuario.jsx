import { useAuthUser } from '@crema/hooks/AuthHooks';

const GetUsuario = () => {
  const user = useAuthUser();
  if (user.displayName) {
    return user;
  } else {
    return {
      id: '',
      nombre: '',
      email: '',
      identificacion_usuario: '',
      asociado: {id: '', nombre: '', numero_documento: ''},
      rol: {id: '', nombre: '', tipo: ''},
      permisos: '',
    };
  }
};

export default GetUsuario;
