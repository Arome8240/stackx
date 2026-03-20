import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

// In-memory store — replace with a DB (Prisma/TypeORM) later
const users: User[] = [];

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | undefined> {
    return users.find((u) => u.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return users.find((u) => u.id === id);
  }

  async create(username: string, email: string, password: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash,
    };
    users.push(user);
    return user;
  }
}
