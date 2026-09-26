// ForJWT Auth
import {getUserFromJwtAuth} from '@crema/helpers/AuthHelper';
import {
  useJWTAuth,
  useJWTAuthActions,
} from '@crema/services/auth/jwt-auth/JWTAuthProvider';

export const useAuthUser = () => {
  const {user, isAuthenticated, isLoading} = useJWTAuth();
  return {
    isLoading,
    isAuthenticated,
    user: user,
  };
};

export const useAuthMethod = () => {
  const {signInUser, signUpUser, logout} = useJWTAuthActions();

  return {
    signInUser,
    logout,
    signUpUser,
  };
};

