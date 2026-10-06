// Simples Rate Limiter em memória (Para Vercel Serverless/Node puro)
// IMPORTANTE: Para escalar em multicluster no futuro, troque por @upstash/ratelimit (Redis)

const rateLimitMap = new Map();

export default function rateLimit({ interval, uniqueTokenPerInterval }: { interval: number, uniqueTokenPerInterval: number }) {
  return {
    check: (limit: number, token: string) => {
      const now = Date.now();
      const tokenRecord = rateLimitMap.get(token);

      if (tokenRecord) {
        // Limpar registro expirado
        if (now - tokenRecord.timestamp > interval) {
          rateLimitMap.set(token, { count: 1, timestamp: now });
          return Promise.resolve();
        }

        // Se ultrapassou o limite
        if (tokenRecord.count >= limit) {
          return Promise.reject('Rate Limit Exceeded');
        }

        // Incrementar
        tokenRecord.count += 1;
        rateLimitMap.set(token, tokenRecord);
        return Promise.resolve();
      }

      // Se o mapa ficar muito grande (ataque massivo de IPs diferentes), limpar tudo para não estourar a memória RAM do servidor
      if (rateLimitMap.size > uniqueTokenPerInterval) {
        rateLimitMap.clear();
      }

      rateLimitMap.set(token, { count: 1, timestamp: now });
      return Promise.resolve();
    },
  };
}
