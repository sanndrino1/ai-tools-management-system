import { NextResponse } from 'next/server'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'nextjs-frontend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'unknown',
    checks: {
      api: 'ok',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  }

  return NextResponse.json(health, { status: 200 })
}