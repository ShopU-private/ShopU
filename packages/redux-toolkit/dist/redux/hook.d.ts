import { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../index.js';
export declare const useAppDispatch: () => import('@reduxjs/toolkit').ThunkDispatch<
  {
    auth: import('@shopu/types-store/types').AuthState;
    address: import('@shopu/types-store/types').AddressState;
    user: import('@shopu/types-store/types').UserState;
  },
  undefined,
  import('@reduxjs/toolkit').UnknownAction
> &
  import('@reduxjs/toolkit').Dispatch<import('@reduxjs/toolkit').UnknownAction>;
export declare const useAppSelector: TypedUseSelectorHook<RootState>;
//# sourceMappingURL=hook.d.ts.map
