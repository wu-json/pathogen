import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as assert from 'assert';
import { BN } from 'bn.js';
import { Pathogen } from '../target/types/pathogen';

describe('pathogen', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Pathogen as Program<Pathogen>;

  async function getAccountBalance(pubkey: anchor.web3.PublicKey) {
    let account = await provider.connection.getAccountInfo(pubkey);
    return account?.lamports ?? 0;
  }

  describe('create_pathogen', () => {
    it('can create a pathogen', async () => {
      const startingBalance = await getAccountBalance(
        provider.wallet.publicKey,
      );

      const pathogen = anchor.web3.Keypair.generate();
      await program.methods
        .createPathogen(
          'covid-19',
          'Coronavirus disease 2019',
          new BN(200 * LAMPORTS_PER_SOL),
          new BN(2),
        )
        .accounts({
          pathogen: pathogen.publicKey,
          creator: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([pathogen])
        .rpc();

      const pathogenAccount = await program.account.pathogen.fetch(
        pathogen.publicKey,
      );

      const endingBalance = await getAccountBalance(provider.wallet.publicKey);

      assert.ok(startingBalance - endingBalance > 200 * LAMPORTS_PER_SOL);
      assert.ok(
        (await getAccountBalance(pathogen.publicKey)) > 200 * LAMPORTS_PER_SOL,
      );
      assert.equal(
        pathogenAccount.creator.toBase58(),
        provider.wallet.publicKey.toBase58(),
      );
      assert.equal(pathogenAccount.code, 'covid-19');
      assert.equal(pathogenAccount.name, 'Coronavirus disease 2019');
      assert.equal(pathogenAccount.totalProfiles, 0);
      assert.equal(pathogenAccount.rewardPerProfile, 2);
      assert.ok(pathogenAccount.createdAt);
    });

    it('can create a pathogen from a different creator', async () => {
      const otherUser = anchor.web3.Keypair.generate();
      const signature = await program.provider.connection.requestAirdrop(
        otherUser.publicKey,
        50 * LAMPORTS_PER_SOL,
      );
      await program.provider.connection.confirmTransaction(signature);

      const startingBalance = await getAccountBalance(otherUser.publicKey);

      const pathogen = anchor.web3.Keypair.generate();
      await program.methods
        .createPathogen(
          'ebola',
          'Ebola virus disease',
          new BN(5 * LAMPORTS_PER_SOL),
          new BN(2),
        )
        .accounts({
          pathogen: pathogen.publicKey,
          creator: otherUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([otherUser, pathogen])
        .rpc();

      const pathogenAccount = await program.account.pathogen.fetch(
        pathogen.publicKey,
      );

      const endingBalance = await getAccountBalance(otherUser.publicKey);

      assert.ok(startingBalance - endingBalance > 5 * LAMPORTS_PER_SOL);
      assert.ok(
        (await getAccountBalance(pathogen.publicKey)) > 5 * LAMPORTS_PER_SOL,
      );
      assert.equal(
        pathogenAccount.creator.toBase58(),
        otherUser.publicKey.toBase58(),
      );
      assert.equal(pathogenAccount.code, 'ebola');
      assert.equal(pathogenAccount.name, 'Ebola virus disease');
      assert.equal(pathogenAccount.totalProfiles, 0);
      assert.equal(pathogenAccount.rewardPerProfile, 2);
      assert.ok(pathogenAccount.createdAt);
    });

    it('can fetch all pathogens', async () => {
      const pathogenAccounts = await program.account.pathogen.all();
      assert.equal(pathogenAccounts.length, 2);
    });

    it('can filter pathogens by creator', async () => {
      const creatorPublicKey = provider.wallet.publicKey;
      const pathogenAccounts = await program.account.pathogen.all([
        {
          memcmp: {
            offset: 8, // Discriminator
            bytes: creatorPublicKey.toBase58(),
          },
        },
      ]);
      assert.equal(pathogenAccounts.length, 1);
    });

    it('can filter pathogens by code', async () => {
      const pathogenAccounts = await program.account.pathogen.all([
        {
          memcmp: {
            offset:
              8 + // Discriminator
              32 + // Public key
              4, // String prefix
            bytes: bs58.encode(Buffer.from('covid-19')),
          },
        },
      ]);
      assert.equal(pathogenAccounts.length, 1);
    });

    it('cannot create a pathogen without a name', async () => {
      try {
        const pathogen = anchor.web3.Keypair.generate();
        await program.methods
          .createPathogen('covid-19', '', new BN(100), new BN(2))
          .accounts({
            pathogen: pathogen.publicKey,
            creator: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([pathogen])
          .rpc();
      } catch (error) {
        assert.equal(error.error.errorMessage, 'The provided name is empty.');
        return;
      }
      assert.fail('The instruction should have failed without a name.');
    });

    it('cannot create a pathogen without a code', async () => {
      try {
        const pathogen = anchor.web3.Keypair.generate();
        await program.methods
          .createPathogen(
            '',
            'Coronavirus disease 2019',
            new BN(100),
            new BN(2),
          )
          .accounts({
            pathogen: pathogen.publicKey,
            creator: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([pathogen])
          .rpc();
      } catch (error) {
        assert.equal(error.error.errorMessage, 'The provided code is empty.');
        return;
      }
      assert.fail('The instruction should have failed without a code.');
    });

    it('cannot create a pathogen with a name greater than 50 characters', async () => {
      const name = 'x'.repeat(51);
      try {
        const pathogen = anchor.web3.Keypair.generate();
        await program.methods
          .createPathogen('covid-19', name, new BN(100), new BN(2))
          .accounts({
            pathogen: pathogen.publicKey,
            creator: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([pathogen])
          .rpc();
      } catch (error) {
        assert.equal(
          error.error.errorMessage,
          'The provided name should be 50 characters long maximum.',
        );
        return;
      }
      assert.fail('The instruction should have failed with a long name.');
    });

    it('cannot create a pathogen with a code greater than 25 characters', async () => {
      const code = 'x'.repeat(26);
      try {
        const pathogen = anchor.web3.Keypair.generate();
        await program.methods
          .createPathogen(
            code,
            'Coronavirus disease 2019',
            new BN(100),
            new BN(2),
          )
          .accounts({
            pathogen: pathogen.publicKey,
            creator: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([pathogen])
          .rpc();
      } catch (error) {
        assert.equal(
          error.error.errorMessage,
          'The provided code should be 25 characters long maximum.',
        );
        return;
      }
      assert.fail('The instruction should have failed with a long code.');
    });
  });

  describe('create_profile', () => {
    const pathogen = anchor.web3.Keypair.generate();

    before(async () => {
      await program.methods
        .createPathogen(
          'covid-19',
          'Coronavirus disease 2019',
          new BN(100),
          new BN(2),
        )
        .accounts({
          pathogen: pathogen.publicKey,
          creator: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([pathogen])
        .rpc();
    });

    it('can create a profile', async () => {
      const profile = anchor.web3.Keypair.generate();
      const testDate = new Date('2022-02-03');

      await program.methods
        .createProfile('Positive', new BN(testDate.getTime()), 21)
        .accounts({
          pathogen: pathogen.publicKey,
          profile: profile.publicKey,
          creator: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([profile])
        .rpc();

      const profileAccount = await program.account.profile.fetch(
        profile.publicKey,
      );

      assert.equal(
        profileAccount.creator.toBase58(),
        provider.wallet.publicKey.toBase58(),
      );
      assert.equal(profileAccount.pathogen.toBase58(), pathogen.publicKey);
      assert.equal(profileAccount.latestTestResult, 'Positive');
      assert.equal(
        profileAccount.latestTestResultDate.toNumber(),
        testDate.getTime(),
      );
      assert.equal(profileAccount.age, 21);

      const pathogenAccount = await program.account.pathogen.fetch(
        pathogen.publicKey,
      );

      assert.equal(pathogenAccount.totalProfiles, 1);
    });

    it('can create a profile from a different creator', async () => {
      const otherUser = anchor.web3.Keypair.generate();
      const signature = await program.provider.connection.requestAirdrop(
        otherUser.publicKey,
        1000000000,
      );
      await program.provider.connection.confirmTransaction(signature);

      const profile = anchor.web3.Keypair.generate();
      const testDate = new Date('2022-02-03');

      await program.methods
        .createProfile('Positive', new BN(testDate.getTime()), 21)
        .accounts({
          pathogen: pathogen.publicKey,
          profile: profile.publicKey,
          creator: otherUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([profile, otherUser])
        .rpc();

      const profileAccount = await program.account.profile.fetch(
        profile.publicKey,
      );

      assert.equal(
        profileAccount.creator.toBase58(),
        otherUser.publicKey.toBase58(),
      );
      assert.equal(profileAccount.pathogen.toBase58(), pathogen.publicKey);
      assert.equal(profileAccount.latestTestResult, 'Positive');
      assert.equal(
        profileAccount.latestTestResultDate.toNumber(),
        testDate.getTime(),
      );
      assert.equal(profileAccount.age, 21);

      const pathogenAccount = await program.account.pathogen.fetch(
        pathogen.publicKey,
      );

      assert.equal(pathogenAccount.totalProfiles, 2);
    });

    it('can fetch all profiles', async () => {
      const profileAccounts = await program.account.profile.all();
      assert.equal(profileAccounts.length, 2);
    });

    it('can filter profiles by pathogen', async () => {
      const profileAccounts = await program.account.profile.all([
        {
          memcmp: {
            offset:
              8 + // Discriminator
              32, // Creator public key
            bytes: pathogen.publicKey.toBase58(),
          },
        },
      ]);
      assert.equal(profileAccounts.length, 2);
    });

    it('cannot create a profile with a test result greater than 25 characters', async () => {
      const testResult = 'x'.repeat(26);
      try {
        const profile = anchor.web3.Keypair.generate();
        const testDate = new Date('2022-02-03');

        await program.methods
          .createProfile(testResult, new BN(testDate.getTime()), 21)
          .accounts({
            pathogen: pathogen.publicKey,
            profile: profile.publicKey,
            creator: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([profile])
          .rpc();
      } catch (error) {
        assert.equal(
          error.error.errorMessage,
          'The provided test result should be 25 characters long maximum.',
        );
        return;
      }
      assert.fail(
        'The instruction should have failed with a long test result.',
      );
    });

    it('cannot create a profile with an empty test result', async () => {
      try {
        const profile = anchor.web3.Keypair.generate();
        const testDate = new Date('2022-02-03');

        await program.methods
          .createProfile('', new BN(testDate.getTime()), 21)
          .accounts({
            pathogen: pathogen.publicKey,
            profile: profile.publicKey,
            creator: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([profile])
          .rpc();
      } catch (error) {
        assert.equal(
          error.error.errorMessage,
          'The provided test result is empty.',
        );
        return;
      }
      assert.fail(
        'The instruction should have failed with an empty test result.',
      );
    });
  });
});
