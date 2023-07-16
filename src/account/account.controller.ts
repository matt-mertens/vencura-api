import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AccountService } from './account.service';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('Accounts')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @ApiOperation({
    summary: 'Create account',
  })
  @Post('')
  @UsePipes(ValidationPipe)
  create(@GetUser() user): Promise<any> {
    return this.accountService.createAccount(user);
  }

  @ApiOperation({
    summary: 'Get Account Balance',
  })
  @Get('/:accountAddress')
  @UsePipes(ValidationPipe)
  getBalance(@Param('accountAddress') accountAddress: string): Promise<any> {
    return this.accountService.getAccountBalance(accountAddress);
  }

  @ApiOperation({
    summary: 'Get User Accounts',
  })
  @Get()
  @UsePipes(ValidationPipe)
  getAccounts(@GetUser() user): Promise<any> {
    return this.accountService.getUserAccounts(user);
  }

  @ApiOperation({
    summary: 'Sign message',
  })
  @Post('/:accountAddress/signMessage')
  @UsePipes(ValidationPipe)
  createAccountSignedMessage(
    @Param('accountAddress') accountAddress: string,
    @Body('message') message: string,
    @GetUser() user,
  ): Promise<any> {
    return this.accountService.createAccountSignedMessage(
      accountAddress,
      message,
      user,
    );
  }

  @ApiOperation({
    summary: 'Send Transaction',
  })
  @Post('/:accountAddress/sendTransaction')
  @UsePipes(ValidationPipe)
  sendTransaction(
    @Param('accountAddress') accountAddress: string,
    @Body('toAddress') toAddress: string,
    @Body('amount') amount: string,
    @GetUser() user,
  ): Promise<any> {
    return this.accountService.sendAccountTransaction(
      accountAddress,
      toAddress,
      amount,
      user,
    );
  }

  @ApiOperation({
    summary: 'Delete account',
  })
  @Delete('/:accountAddress')
  @UsePipes(ValidationPipe)
  deleteAccount(@Param('accountAddress') accountAddress: string): Promise<any> {
    return this.accountService.deleteAccount(accountAddress);
  }
}
