export class DbConfig {
  dbtype: any = 'postgres';
  host: string = process.env.NODE_ENV==='prod' ? 'pauls-postgres': 'localhost';
  port: number = 5432;
  database: string = 'paulsdb';
  user: string = 'postgres';
  pwd: string = process.env.POSTGRES_PWD;
}
