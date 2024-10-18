import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  login() {
    return {
      message: 'Logged in.',
    };
  }

  register() {
    return {
      message: 'Registered.',
    };
  }
}
