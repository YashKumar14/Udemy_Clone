/// <reference types="vite/client" />

// -------------------------
// useToken.js
// -------------------------
declare module "@/utils/useToken.js" {
  import type { Ref } from "vue";

  export function useToken(): {
    token: Ref<string | null>;
    email: Ref<string>;
    isTokenAvailable: () => void;
    setToken: (newToken: string) => void;
    removeToken: () => void;
    startTokenExpirationCheck: () => void;
    stopTokenExpirationCheck: () => void;
  };
}

// -------------------------
// vueStore.js
// -------------------------
declare module "@/utils/vueStore.js" {
  import type { Store } from "vuex";
  const store: Store<any>;
  export default store;
}
