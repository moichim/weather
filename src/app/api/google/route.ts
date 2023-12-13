import { GoogleSheetsProvider } from '@/graphql/googleProvider/googleProvider';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest
) {

  const sheets = await GoogleSheetsProvider.range(
    {scope: "core", from: "abc", to: "xyz"}
  );


  const response = NextResponse.json({
    google: sheets
  });

  response.headers.set( "status", "200" )

  return response;
}