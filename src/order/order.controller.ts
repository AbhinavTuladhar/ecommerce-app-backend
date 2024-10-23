import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ResourceName } from 'src/decorators/resource-name/resource-name.decorator';

import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('/:id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderService.getById(id);
  }

  @Post()
  @ResourceName('Order')
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Patch('/:id')
  @ResourceName('Order')
  updateStatus(
    @Body() dto: UpdateOrderStatusDto,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    return this.orderService.updateStatus(id, dto);
  }

  @Delete('/:id')
  @ResourceName('Order')
  deleteOrder(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderService.deleteOrder(id);
  }
}
