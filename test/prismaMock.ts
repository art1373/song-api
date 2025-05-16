// test/prisma.service.mock.ts
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../src/prisma/prisma.service';

export const prismaServiceMock = mockDeep<PrismaService>();
export type PrismaServiceMock = DeepMockProxy<PrismaService>;
