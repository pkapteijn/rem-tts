import { Logger, Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig } from './config/db-config';
import { SentencesModule } from './sentences/sentences.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerMiddleware } from './logger.middleware';

const dbconfig = new DbConfig();

Logger.log("DB config used: " + dbconfig.log(), 'AppModule'); 
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
      serveRoot: '/frontend/',
    }),
    SentencesModule,
    TypeOrmModule.forRoot({
      type: dbconfig.dbtype,
      host: dbconfig.host,
      port: dbconfig.port,
      username: dbconfig.user,
      password: dbconfig.pwd,
      database: dbconfig.database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
