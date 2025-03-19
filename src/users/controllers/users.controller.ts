import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Delete, 
    Patch, 
    UseGuards 
  } from "@nestjs/common";
  import { UsersService } from "../services/users.service";
  import { CreateUserDto } from "../dto/create-user.dto";
  import { UpdateUserDto } from "../dto/update-user.dto";
  import { AuthGuard } from "@nestjs/passport";
  
  @UseGuards(AuthGuard("jwt")) // Proteção JWT aplicada ao controller inteiro
  @Controller("users")
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      return await this.usersService.create(createUserDto);
    }
  
    @Get()
    async findAll() {
      return await this.usersService.findAll();
    }
  
    @Get(":id")
    async findOne(@Param("id") id: string) {
      return await this.usersService.findOne(id);
    }
  
    @Patch(":id")
    async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
      return await this.usersService.update(id, updateUserDto);
    }
  
    @Delete(":id")
    async remove(@Param("id") id: string) {
      return await this.usersService.remove(id);
    }
  }
  