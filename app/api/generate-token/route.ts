/**
 * API route for generating AAP JWT tokens
 * POST /api/generate-token
 */

import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'nodejs';

interface GenerateTokenRequest {
  payload: object;
  secret?: string;
  algorithm?: 'HS256' | 'HS384' | 'HS512';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateTokenRequest;
    const {
      payload,
      secret = 'demo-secret-key-change-in-production',
      algorithm = 'HS256'
    } = body;

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Payload is required' },
        { status: 400 }
      );
    }

    // Validate that payload has required JWT claims
    const tokenPayload = payload as Record<string, unknown>;
    if (!tokenPayload.iss || !tokenPayload.sub || !tokenPayload.aud) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required claims: iss, sub, aud are required'
        },
        { status: 400 }
      );
    }

    // Sign JWT using jose
    const secretKey = new TextEncoder().encode(secret);

    const jwt = await new jose.SignJWT(payload as jose.JWTPayload)
      .setProtectedHeader({ alg: algorithm, typ: 'JWT' })
      .sign(secretKey);

    // Decode to verify it worked
    const decoded = jose.decodeJwt(jwt);

    return NextResponse.json({
      success: true,
      token: jwt,
      decoded: {
        header: jose.decodeProtectedHeader(jwt),
        payload: decoded
      }
    });

  } catch (error) {
    console.error('Token generation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate token'
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
