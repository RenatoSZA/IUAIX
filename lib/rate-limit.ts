// Simples Rate Limiter em memória (Para Vercel Serverless/Node puro)
// IMPORTANTE: Para escalar em multicluster no futuro, troque por @upstash/ratelimit (Redis)

const rateLimitMap = new Map();

export default function rateLimit({ interval, uniqueTokenPerInterval }: { interval: number, uniqueTokenPerInterval: number }) {
  return {
    check: (limit: number, token: string) => {
      // --- RATE LIMIT EM STANDBY ---
      // Desativado para a apresentação não ser bloqueada caso ocorram vários testes de cadastro/login seguidos.
      return Promise.resolve();
    },
  };
}
