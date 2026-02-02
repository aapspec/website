/**
 * API route to serve AAP schemas
 * GET /api/schemas
 */

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const schemasDir = path.join(process.cwd(), 'public', 'schemas');
    const schemaFiles = await fs.readdir(schemasDir);

    const schemas: Record<string, object> = {};
    for (const file of schemaFiles) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(schemasDir, file), 'utf-8');
        schemas[file] = JSON.parse(content);
      }
    }

    return NextResponse.json({
      success: true,
      schemas,
      count: Object.keys(schemas).length
    });

  } catch (error) {
    console.error('Failed to load schemas:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load schemas'
      },
      { status: 500 }
    );
  }
}
