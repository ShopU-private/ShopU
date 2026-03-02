export declare const store: import('@reduxjs/toolkit').EnhancedStore<
  {
    auth: import('@shopu/types-store/types').AuthState;
    address: import('@shopu/types-store/types').AddressState;
    user: import('@shopu/types-store/types').UserState;
  },
  import('@reduxjs/toolkit').UnknownAction,
  import('@reduxjs/toolkit').Tuple<
    [
      import('@reduxjs/toolkit').StoreEnhancer<{
        dispatch: import('@reduxjs/toolkit').ThunkDispatch<
          {
            auth: import('@shopu/types-store/types').AuthState;
            address: import('@shopu/types-store/types').AddressState;
            user: import('@shopu/types-store/types').UserState;
          },
          undefined,
          import('@reduxjs/toolkit').UnknownAction
        >;
      }>,
      import('@reduxjs/toolkit').StoreEnhancer,
    ]
  >
>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//# sourceMappingURL=index.d.ts.map
