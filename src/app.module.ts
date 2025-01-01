import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './database/database.module';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    ImageUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
