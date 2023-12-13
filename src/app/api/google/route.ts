import { GoogleSheetsProvider, _getGoogleSheetClient, _readGoogleSheet } from '@/graphql/googleProvider/connect';
import { NextRequest, NextResponse } from 'next/server';


const sheetId = "1YNjQNCUYUlw96uaQ6RYTq4MG5zUzhHwW-XM-chJWkjE";
const tabName = "Config";
const range = "A:E";

export async function GET(
  request: NextRequest
) {

  const sheets = await GoogleSheetsProvider.getData();


  const response = NextResponse.json({
    ano: true,
    request: request.nextUrl,
    google: sheets
  });

  response.headers.set( "status", "200" )

  return response;
}