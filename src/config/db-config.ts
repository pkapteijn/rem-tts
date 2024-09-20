export class DbConfig {
    dbtype: any = "postgres"; 
    host: string = "localhost";  
    port: number = 5432; 
    database: string = "paulsdb";  
    user: string = "postgres"; 
    pwd: string = process.env.POSTGRES_PWD; 
}