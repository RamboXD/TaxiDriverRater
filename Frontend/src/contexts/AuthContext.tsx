import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import axios, { AxiosResponse } from 'axios';
import useLogin from 'hooks/auth/useLogin';
import useRegister from 'hooks/auth/useRegister';
import useCompanyProfile from 'hooks/company/useCompanyProfile';
import useFarmerProfile from 'hooks/farmer/useFarmerProfile';
import useOwnerProfile from 'hooks/owner/useOwnerProfile';
import useUserProfile from 'hooks/user/useUserProfile';
import { UserLogin, UserRegistration } from 'types/generated';
import { BACKEND_API_URL } from 'utils/consts';
import { showErrorNotification } from 'utils/notifications';
import { axiosUnauthorizedInstance } from 'utils/request';
import { clearTokens, getTokens, setTokens } from 'utils/storage-helper';

const AuthContext = createContext({});

function AuthProvider(props: any): JSX.Element {
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const { access: initialAccessToken } = getTokens();
  const [token, setToken] = useState(initialAccessToken);

  const handleSetTokens = ({ access }: { access: string }): void => {
    setToken(access);
  };

  const handleLogin = (payload: UserLogin) => {
    loginMutation.mutate(payload, {
      onSuccess: (response) => {
        handleSetTokens({
          access: response.data.token,
        });
        setTokens(response.data.token);
        window.location.replace('/');
      },
      onError: (error) => {
        showErrorNotification(error.response?.data.error || error.message);
      },
    });
  };

  const handleRegister = (payload: UserRegistration): void => {
    registerMutation.mutate(payload, {
      onSuccess: (res) => {
        handleSetTokens({
          access: res.data.accessToken,
        });
        window.location.replace('/');
      },
      onError: (error) => {
        showErrorNotification(error.response?.data.message || error.message);
      },
    });
  };

  const {
    data: userProfileData,
    isLoading: isUserProfileLoading,
    isSuccess: isUserProfileSuccess,
  } = useUserProfile({
    enabled: !!token,
  });
  const isUserRoleProfileSuccess = useMemo(() => {
    if (isUserProfileSuccess && !!userProfileData?.data) {
      return true;
    }

    return false;
  }, [isUserProfileSuccess, userProfileData?.data]);

  const logout = () => {
    clearTokens();
    setToken(null);
    window.location.replace('/');
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        setToken,
        handleLogin,
        handleRegister,
        profile: userProfileData?.data,
        isAuthenticated: !!token && isUserRoleProfileSuccess,
        isLoginLoading: loginMutation.isLoading || registerMutation.isLoading,
        isLoading: isUserProfileLoading,
      }}
      {...props}
    />
  );
}

function useAuth(): any {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

function useClient() {
  const { access: accessToken } = getTokens();

  return useCallback(() => {
    const cl = axios.create({
      baseURL: BACKEND_API_URL,
    });

    cl.interceptors.request.use((config) => {
      config.headers.set(
        'Authorization',
        accessToken ? `Bearer ${accessToken}` : null,
      );

      return config;
    });

    return cl;
  }, [accessToken])();
}

export { AuthProvider, useAuth, useClient };
