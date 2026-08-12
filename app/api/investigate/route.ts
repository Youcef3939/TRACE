import { NextResponse } from 'next/server';
import { runInvestigation } from '@/lib/pipeline/runInvestigation';

export async function POST(req: Request) {
  try {
    const { input, language = 'en' } = await req.json();

    if (!input || typeof input !== 'string' || !input.trim()) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const investigation = await runInvestigation(input, language);
    return NextResponse.json(investigation);
  } catch (error) {
    console.error('Investigation API error:', error);
    return NextResponse.json({ error: 'Failed to process investigation' }, { status: 500 });
  }
}
