<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Check if the authenticated user has one of the required roles.
     * Accepts multiple roles separated by pipe (|).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        foreach ($roles as $role) {
            if ($request->user()->role === $role) {
                return $next($request);
            }
        }

        return response()->json([
            'message' => 'Forbidden. You do not have the required role to access this resource.',
        ], 403);
    }
}
