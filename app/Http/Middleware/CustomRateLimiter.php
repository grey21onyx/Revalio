<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Symfony\Component\HttpFoundation\Response;

class CustomRateLimiter
{
    /**
     * The rate limiter instance.
     *
     * @var \Illuminate\Cache\RateLimiter
     */
    protected $limiter;

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Cache\RateLimiter  $limiter
     * @return void
     */
    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $type
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Illuminate\Http\Exceptions\ThrottleRequestsException
     */
    public function handle(Request $request, Closure $next, $type = 'api'): Response
    {
        $config = $this->getRateLimitConfig($type);
        
        $key = $this->resolveRequestSignature($request, $type);
        
        if ($this->limiter->tooManyAttempts($key, $config['maxAttempts'])) {
            return $this->buildResponseWhenTooManyAttempts($key, $config);
        }

        $this->limiter->hit($key, $config['decayMinutes'] * 60);

        $response = $next($request);

        return $this->addRateLimitHeaders(
            $response, $config['maxAttempts'],
            $this->limiter->retriesLeft($key, $config['maxAttempts']),
            $this->limiter->availableIn($key)
        );
    }

    /**
     * Mendapatkan konfigurasi rate limit berdasarkan tipe
     *
     * @param  string  $type
     * @return array
     */
    protected function getRateLimitConfig($type)
    {
        $configs = [
            'api' => [
                'maxAttempts' => 60, // 60 request per menit 
                'decayMinutes' => 1,
            ],
            'auth' => [
                'maxAttempts' => 5, // 5 request per menit untuk auth endpoints 
                'decayMinutes' => 1,
            ],
            'heavy' => [
                'maxAttempts' => 10, // 10 request per menit untuk heavy endpoints
                'decayMinutes' => 1,
            ],
        ];

        return $configs[$type] ?? $configs['api'];
    }

    /**
     * Membuat rate limiter key dari request
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $type
     * @return string
     */
    protected function resolveRequestSignature($request, $type)
    {
        // Jika user terautentikasi, gunakan ID user
        if ($request->user()) {
            return $type . '|user|' . $request->user()->id;
        }
        
        // Jika tidak, gunakan IP address
        return $type . '|ip|' . $request->ip();
    }

    /**
     * Membuat response untuk rate limit yang terlampaui
     *
     * @param  string  $key
     * @param  array  $config
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Illuminate\Http\Exceptions\ThrottleRequestsException
     */
    protected function buildResponseWhenTooManyAttempts($key, array $config)
    {
        $retryAfter = $this->limiter->availableIn($key);

        $headers = [
            'Retry-After' => $retryAfter,
            'X-RateLimit-Limit' => $config['maxAttempts'],
            'X-RateLimit-Remaining' => 0,
            'X-RateLimit-Reset' => now()->addSeconds($retryAfter)->getTimestamp(),
        ];

        $message = json_encode([
            'error' => [
                'message' => 'Rate limit terlampaui. Silakan coba lagi dalam ' . ceil($retryAfter / 60) . ' menit.',
                'retry_after' => $retryAfter,
                'limit' => $config['maxAttempts'],
            ]
        ]);

        return new Response($message, 429, array_merge($headers, [
            'Content-Type' => 'application/json',
        ]));
    }

    /**
     * Menambahkan header rate limit ke response
     *
     * @param  \Symfony\Component\HttpFoundation\Response  $response
     * @param  int  $maxAttempts
     * @param  int  $remainingAttempts
     * @param  int|null  $retryAfter
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function addRateLimitHeaders($response, $maxAttempts, $remainingAttempts, $retryAfter = null)
    {
        $response->headers->add([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => $remainingAttempts,
        ]);

        if ($retryAfter !== null) {
            $response->headers->add([
                'X-RateLimit-Reset' => now()->addSeconds($retryAfter)->getTimestamp(),
            ]);
        }

        return $response;
    }
} 