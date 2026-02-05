import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

/**
 * MySQL 연결 풀 생성 및 반환
 */
export function getMySQLPool(): mysql.Pool {
  if (pool) {
    return pool;
  }

  const host = process.env.MYSQL_HOST || "localhost";
  const port = parseInt(process.env.MYSQL_PORT || "3306", 10);
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "daeri_db";

  if (!password) {
    throw new Error("Missing env MYSQL_PASSWORD");
  }
  if (!database) {
    throw new Error("Missing env MYSQL_DATABASE");
  }

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
    timezone: "+09:00", // 한국 시간
  });

  return pool;
}

/**
 * MySQL 쿼리 실행 헬퍼
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const connection = await getMySQLPool().getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T[];
  } finally {
    connection.release();
  }
}

/**
 * MySQL 단일 행 조회
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}
