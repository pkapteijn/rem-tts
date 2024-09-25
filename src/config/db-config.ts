export class DbConfig {
  dbtype: any = 'postgres';
  host: string = process.env.POSTGRES_HOST || 'localhost';
  port: number = parseInt(process.env.POSTGRES_PORT) || 5432;
  database: string = process.env.POSTGRES_DB || 'postgres';
  user: string = process.env.POSTGRES_USER || 'postgres';
  pwd: string = process.env.POSTGRES_PWD;

  log(): string {
    let dbconfigLog = structuredClone(this); 
    dbconfigLog["pwd"] = "*********";
    delete dbconfigLog["log"] ; 
    return JSON.stringify(dbconfigLog); 
  }
}
