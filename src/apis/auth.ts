import api from ".";

const KAKAO_AUTH_BASE_URL = "https://kauth.kakao.com/oauth/authorize";
const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const KAKAO_USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

type KakaoUserResponse = {
  id?: number | string;
};

interface KakaoTokenResponse {
  access_token?: string;
}

interface LoginRequestBody {
  socialInfoDto: {
    type: "KAKAO";
    id: string;
  };
  identityToken: string;
  authorizationCode: string;
}

interface LoginTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  id: string;
  createAt: string;
  data: LoginTokens;
}

interface MemberInfoResponse {
  id: string;
  createAt: string;
  data: {
    nickname: string;
    imageId: string | null;
    image: string | null;
  };
}

export interface MemberInfo {
  nickname: string;
  imageId: string | null;
  image: string | null;
}

export function getKakaoLoginUrl() {
  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: "code",
  });

  return `${KAKAO_AUTH_BASE_URL}?${params.toString()}`;
}

async function requestKakaoAccessToken(code: string) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: KAKAO_REDIRECT_URI,
    code,
  });

  const res = await fetch(KAKAO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: params,
  });

  if (!res.ok) {
    throw new Error("카카오 토큰 발급에 실패했습니다.");
  }

  const data = (await res.json()) as KakaoTokenResponse;

  if (!data.access_token) {
    throw new Error("카카오 액세스 토큰이 없습니다.");
  }

  return data.access_token;
}

async function requestKakaoUserId(kakaoAccessToken: string) {
  const res = await fetch(KAKAO_USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${kakaoAccessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  if (!res.ok) {
    throw new Error("카카오 사용자 정보 조회에 실패했습니다.");
  }

  const data = (await res.json()) as KakaoUserResponse;

  if (typeof data.id === "undefined" || data.id === null) {
    throw new Error("카카오 사용자 ID를 찾을 수 없습니다.");
  }

  return String(data.id);
}

export async function loginWithKakaoCode(code: string): Promise<LoginTokens> {
  const kakaoAccessToken = await requestKakaoAccessToken(code);
  const kakaoUserId = await requestKakaoUserId(kakaoAccessToken);

  const requestBody: LoginRequestBody = {
    socialInfoDto: {
      type: "KAKAO",
      id: kakaoUserId,
    },
    identityToken: kakaoAccessToken,
    authorizationCode: "",
  };

  const res = await api.post<LoginResponse>("/members/v2/login", requestBody);
  const { accessToken, refreshToken } = res.data.data;

  if (!accessToken || !refreshToken) {
    throw new Error("서버 응답에서 토큰을 찾을 수 없습니다.");
  }

  return { accessToken, refreshToken };
}

export const getInfo = async (): Promise<MemberInfo> => {
  const res = await api.get<MemberInfoResponse>("/members/v1/info");
  const { nickname, imageId, image } = res.data.data;

  return {
    nickname,
    imageId,
    image,
  };
};
