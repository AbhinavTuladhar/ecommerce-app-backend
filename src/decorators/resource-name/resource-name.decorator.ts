import { SetMetadata } from '@nestjs/common';

export const ResourceName = (...args: string[]) =>
  SetMetadata('resource-name', args);
