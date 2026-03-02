import { AuthState, VerifyOtpData } from '@shopu/types-store/types';
export declare const verifyOtp: import('@reduxjs/toolkit').AsyncThunk<
  any,
  VerifyOtpData,
  import('@reduxjs/toolkit').AsyncThunkConfig
>;
export declare const logoutUser: import('@reduxjs/toolkit').AsyncThunk<
  any,
  void,
  import('@reduxjs/toolkit').AsyncThunkConfig
>;
export declare const checkAuthStatus: import('@reduxjs/toolkit').AsyncThunk<
  | {
      loggedIn: boolean;
      id: any;
      name: any;
      email: any;
      phoneNumber: any;
      role: any;
      userDetails: any;
    }
  | {
      loggedIn: boolean;
      userDetails: null;
      id?: undefined;
      name?: undefined;
      email?: undefined;
      phoneNumber?: undefined;
      role?: undefined;
    },
  void,
  import('@reduxjs/toolkit').AsyncThunkConfig
>;
export declare const clearAuth: import('@reduxjs/toolkit').ActionCreatorWithoutPayload<'auth/clearAuth'>;
declare const _default: import('@reduxjs/toolkit').Reducer<AuthState>;
export default _default;
//# sourceMappingURL=authSlice.d.ts.map
