import { Address, AddressState } from '@shopu/types-store/types';
export declare const fetchAddresses: import('@reduxjs/toolkit').AsyncThunk<
  any,
  void,
  import('@reduxjs/toolkit').AsyncThunkConfig
>;
export declare const addAddress: import('@reduxjs/toolkit').AsyncThunk<
  any,
  Address,
  import('@reduxjs/toolkit').AsyncThunkConfig
>;
export declare const updateAddress: import('@reduxjs/toolkit').AsyncThunk<
  any,
  {
    id: string;
    address: Address;
  },
  import('@reduxjs/toolkit').AsyncThunkConfig
>;
export declare const deleteAddress: import('@reduxjs/toolkit').AsyncThunk<
  string,
  string,
  import('@reduxjs/toolkit').AsyncThunkConfig
>;
export declare const setSelectedAddress: import('@reduxjs/toolkit').ActionCreatorWithPayload<
    string | null,
    'address/setSelectedAddress'
  >,
  clearAddresses: import('@reduxjs/toolkit').ActionCreatorWithoutPayload<'address/clearAddresses'>;
declare const _default: import('@reduxjs/toolkit').Reducer<AddressState>;
export default _default;
//# sourceMappingURL=addressSlice.d.ts.map
