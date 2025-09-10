import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
      };

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createUserDto.name);
      expect(result.username).toBe(createUserDto.username);
      expect(result.email).toBe(createUserDto.email);
      expect(result.id).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const result = await service.findOne(userId);

      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
    });

    it('should throw error for non-existent user', async () => {
      const nonExistentId = 999999;

      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const result = await service.update(userId, updateUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
      expect(result.name).toBe(updateUserDto.name);
      expect(result.email).toBe(updateUserDto.email);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
      };

      const user = await service.create(createUserDto);
      const result = await service.remove(user.id);

      expect(result.message).toContain('deleted successfully');
    });
  });
});
