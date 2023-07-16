import { Test } from '@nestjs/testing';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ethers } from 'ethers';

const mockUser = { id: 1, email: 'test@gmail.com', claims: { sub: 'test' } };

const testAccount: any = {
  id: 1,
  address: '0x283e986fA975901c46b8bff2a1E40A9FEaC1Ff8A',
  createdAt: '2023-07-16T15:19:53.000Z',
  ownerId: 'test',
  updtedAt: '2023-07-16T15:19:53.000Z',
  privateKey:
    '0x63fdd4977399a62fcc215f90a4514627a523a9778ff6d6ab12130496471b0947',
};

describe('AccountService', () => {
  let accountService: AccountService;
  let accountRespository: Repository<Account>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useClass: Repository,
        },
      ],
    }).compile();

    accountService = await module.resolve<AccountService>(AccountService);
    accountRespository = module.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
  });

  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });

  describe('getUserAccounts', () => {
    it('get user accounts', async () => {
      jest
        .spyOn(accountRespository, 'find')
        .mockResolvedValueOnce([testAccount]);

      expect(await accountService.getUserAccounts(mockUser)).toEqual([
        testAccount,
      ]);
    });
  });

  describe('signMessage', () => {
    it('sign message', async () => {
      jest
        .spyOn(accountRespository, 'findOne')
        .mockResolvedValueOnce(testAccount);

      const testMessage = 'test message';
      const wallet = new ethers.Wallet(testAccount.privateKey);
      const signedMessage = await wallet.signMessage(testMessage);

      expect(
        await accountService.createAccountSignedMessage(
          testAccount.address,
          testMessage,
          mockUser,
        ),
      ).toEqual({ message: testMessage, signedMessage });
    });
  });

  describe('sendAccountTransaction', () => {
    it('send transaction', async () => {
      jest
        .spyOn(accountRespository, 'findOne')
        .mockResolvedValueOnce(testAccount);

      const toAddress = '0x1a3f077e0711d5a1b87022021e26fa0a7bb3a1d1';
      const amount = '0.1';

      jest
        .spyOn(accountService, 'sendAccountTransaction')
        .mockResolvedValueOnce({ transactionHash: '0x0' } as any);

      expect(
        await accountService.sendAccountTransaction(
          testAccount.address,
          toAddress,
          amount,
          mockUser,
        ),
      ).toEqual({ transactionHash: '0x0' });
    });
  });
});
