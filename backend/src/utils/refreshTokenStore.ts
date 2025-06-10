const refreshTokens = new Map<string, string>(); // userId -> refreshToken

export const refreshTokenStore = {
  add(userId: string, token: string) {
    refreshTokens.set(userId, token);
  },
  remove(userId: string) {
    refreshTokens.delete(userId);
  },
  verify(userId: string, token: string) {
    return refreshTokens.get(userId) === token;
  },
  rotate(userId: string, newToken: string) {
    refreshTokens.set(userId, newToken);
  },
}; 