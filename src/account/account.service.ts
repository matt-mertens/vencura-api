import { Injectable, Scope } from '@nestjs/common';
import { ethers } from 'ethers';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async createAccount(user): Promise<any> {
    const wallet = ethers.Wallet.createRandom();

    const account = new Account();
    account.ownerId = user.claims.sub.toLowerCase();
    account.privateKey = wallet.privateKey;
    account.address = wallet.address.toLowerCase();
    await account.save();

    return { ...wallet };
  }

  async getUserAccounts(user): Promise<any> {
    const accounts = await this.accountRepository.find({
      where: { ownerId: user.claims.sub },
    });
    return accounts;
  }

  async getAccountBalance(accountAddress: string): Promise<any> {
    const provider = new ethers.InfuraProvider(
      'goerli',
      '91de7ed3c17344cc95f8ea31bf6b3adf',
    );
    const rawBalance = await provider.getBalance(accountAddress);
    const balance = ethers.formatEther(rawBalance);

    return { rawBalance: rawBalance.toString(), balance };
  }

  async createAccountSignedMessage(
    accountAddress: string,
    message: string,
    user,
  ): Promise<any> {
    const account = await this.accountRepository.findOne({
      where: {
        ownerId: user.claims.sub.toLowerCase(),
        address: accountAddress.toLowerCase(),
      },
    });
    if (account) {
      const wallet = new ethers.Wallet(account.privateKey);
      const signedMessage = await wallet.signMessage(message);

      return { signedMessage, message };
    }
    return { message: 'request error' };
  }

  async sendAccountTransaction(
    accountAddress: string,
    toAddress: string,
    amount: string,
    user,
  ): Promise<any> {
    const account = await this.accountRepository.findOne({
      where: {
        ownerId: user.claims.sub.toLowerCase(),
        address: accountAddress.toLowerCase(),
      },
    });
    if (account) {
      const provider = new ethers.InfuraProvider(
        'goerli',
        '91de7ed3c17344cc95f8ea31bf6b3adf',
      );
      const wallet = new ethers.Wallet(account.privateKey, provider);
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
      });

      return { transactionHash: tx.hash };
    }
    return { message: 'request error' };
  }

  async deleteAccount(id: string): Promise<any> {
    const deleted = await this.accountRepository.delete(id);
    return deleted;
  }
}
