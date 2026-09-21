import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'db_rz', 
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM produk');
    
    await connection.end();
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Gagal koneksi database:", error);
    return NextResponse.json({ error: "Gagal mengambil data database" }, { status: 500 });
  }
}