import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuotesModule } from './quotes/quotes.module';
import { config } from './config/config';

@Module({
  imports: [MongooseModule.forRoot(config.mongoURI), QuotesModule],
})
export class AppModule {}
