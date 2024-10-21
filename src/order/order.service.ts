import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderItem } from 'src/entities/order.entity';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';

import { CreateOrderDto } from './dto';
import { OrderItemDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly productService: ProductService,
    private readonly userService: UserService
  ) {}

  async getById(id: string) {
    return this.findById(id);
  }

  async findAll() {
    return this.orderRepo.find({
      relations: ['items', 'user', 'items.product'],
    });
  }

  async create(dto: CreateOrderDto) {
    const { userId, items } = dto;

    const user = await this.userService.findById(userId);
    const orderItems = await this.createOrderItems(items);
    const total = this.calculateTotal(orderItems);

    const order = this.orderRepo.create({
      user,
      status: 'placed',
      total,
      items: orderItems,
    });

    return this.orderRepo.save(order);
  }

  async findById(id: string) {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  private async createOrderItems(items: OrderItemDto[]) {
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productService.findById(item.productId);
      const orderItem = this.orderItemRepo.create({
        product,
        quantity: item.quantity,
        price: product.price * item.quantity,
      });
      orderItems.push(orderItem);
    }
    return orderItems;
  }

  private calculateTotal(items: OrderItem[]) {
    return items.reduce((total, item) => total + item.price, 0);
  }
}
