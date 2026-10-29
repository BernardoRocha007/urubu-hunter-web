import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5033';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || 'urubu_live_1030229af00cec3184cf49ff05d46b367451d602956dd470';

async function proxyRequest(request: NextRequest, params: { path?: string[] }) {
  const path = params.path ? params.path.join('/') : '';
  const search = request.nextUrl.search;
  const targetUrl = `${BACKEND_API_URL}/api/${path}${search}`;

  const headers = new Headers();
  
  // Repassar headers relevantes do cliente
  const forwardHeaderList = ['content-type', 'authorization', 'accept', 'user-agent'];
  for (const headerName of forwardHeaderList) {
    const val = request.headers.get(headerName);
    if (val) headers.set(headerName, val);
  }

  // Injetar a chave secreta da API (lado do servidor, nunca exposta ao browser)
  if (BACKEND_API_KEY) {
    headers.set('X-Api-Key', BACKEND_API_KEY);
  }

  const method = request.method;
  let body: BodyInit | undefined = undefined;

  if (method !== 'GET' && method !== 'HEAD') {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.text();
    } else {
      body = await request.arrayBuffer();
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      // Evitar cache no proxy para dados dinâmicos
      cache: 'no-store'
    });

    const responseBody = await response.arrayBuffer();
    const responseHeaders = new Headers();

    // Copiar content-type e status
    const respContentType = response.headers.get('content-type');
    if (respContentType) {
      responseHeaders.set('content-type', respContentType);
    }

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error(`[API Proxy Error] Falha ao encaminhar requisição para ${targetUrl}:`, error);
    return NextResponse.json(
      { error: 'Falha de comunicação com o backend.', details: String(error) },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}
