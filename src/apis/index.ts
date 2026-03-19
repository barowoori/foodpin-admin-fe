import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../stores";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

type ApiRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

interface ReissueTokenResponse {
  id: string;
  createAt: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshTokenPromise: Promise<ReissueTokenResponse["data"]> | null = null;

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  const headers = AxiosHeaders.from(config.headers);

  if (accessToken) {
    headers.set("Authorization", accessToken);
  } else {
    headers.delete("Authorization");
  }

  config.headers = headers;
  return config;
});

async function reissueTokens() {
  const { refreshToken, setTokens } = useAuthStore.getState();

  if (!refreshToken) {
    throw new Error("Refresh token is missing.");
  }

  const res = await refreshApi.get<ReissueTokenResponse>(
    "/members/v1/reissued-token",
    {
      headers: {
        Authorization: refreshToken,
      },
    },
  );

  const { accessToken, refreshToken: nextRefreshToken } = res.data.data;

  if (!accessToken || !nextRefreshToken) {
    throw new Error("Failed to parse reissued tokens.");
  }

  setTokens(accessToken, nextRefreshToken);

  return {
    accessToken,
    refreshToken: nextRefreshToken,
  };
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as ApiRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalConfig || status !== 401 || originalConfig._retry) {
      return Promise.reject(error);
    }

    if (
      typeof originalConfig.url === "string" &&
      originalConfig.url.includes("/members/v1/reissued-token")
    ) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    try {
      if (!refreshTokenPromise) {
        refreshTokenPromise = reissueTokens().finally(() => {
          refreshTokenPromise = null;
        });
      }

      const { accessToken } = await refreshTokenPromise;
      const headers = AxiosHeaders.from(originalConfig.headers);
      headers.set("Authorization", accessToken);
      originalConfig.headers = headers;

      return api(originalConfig);
    } catch (refreshError) {
      useAuthStore.getState().clearTokens();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;

export * from "./auth";
export * from "./truck";
export * from "./event";
