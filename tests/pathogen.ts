import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import * as assert from "assert";
import { Pathogen } from "../target/types/pathogen";

describe("pathogen", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Pathogen as Program<Pathogen>;

  describe("create_pathogen", () => {
    it("should create a pathogen", async () => {
      const pathogen = anchor.web3.Keypair.generate();
      await program.methods
        .createPathogen("Coronavirus disease 2019", "covid-19")
        .accounts({
          pathogen: pathogen.publicKey,
          creator: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([pathogen])
        .rpc();

      // Fetch the account details of the created tweet.
      const pathogenAccount = await program.account.pathogen.fetch(
        pathogen.publicKey
      );

      assert.equal(
        pathogenAccount.creator.toBase58(),
        provider.wallet.publicKey.toBase58()
      );
      assert.equal(pathogenAccount.name, "Coronavirus disease 2019");
      assert.equal(pathogenAccount.code, "covid-19");
      assert.equal(pathogenAccount.totalProfiles, 0);
      assert.ok(pathogenAccount.createdAt);
    });

    it("cannot create a pathogen without a name", async () => {
      try {
        const pathogen = anchor.web3.Keypair.generate();
        await program.methods
          .createPathogen("", "covid-19")
          .accounts({
            pathogen: pathogen.publicKey,
            creator: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([pathogen])
          .rpc();
      } catch (error) {
        assert.equal(error.error.errorMessage, "The provided name is empty.");
        return;
      }
      assert.fail("The instruction should have failed without a name.");
    });

    it("cannot create a pathogen without a code", async () => {
      try {
        const pathogen = anchor.web3.Keypair.generate();
        await program.methods
          .createPathogen("Coronavirus disease 2019", "")
          .accounts({
            pathogen: pathogen.publicKey,
            creator: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([pathogen])
          .rpc();
      } catch (error) {
        assert.equal(error.error.errorMessage, "The provided code is empty.");
        return;
      }
      assert.fail("The instruction should have failed without a code.");
    });

    it("cannot create a pathogen with a name greater than 50 characters", async () => {
      const name = "x".repeat(51);
      try {
        const pathogen = anchor.web3.Keypair.generate();
        await program.methods
          .createPathogen(name, "covid-19")
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
          "The provided name should be 50 characters long maximum."
        );
        return;
      }
      assert.fail("The instruction should have failed with a long name.");
    });

    it("cannot create a pathogen with a code greater than 25 characters", async () => {
      const code = "x".repeat(26);
      try {
        const pathogen = anchor.web3.Keypair.generate();
        await program.methods
          .createPathogen("Coronavirus disease 2019", code)
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
          "The provided code should be 25 characters long maximum."
        );
        return;
      }
      assert.fail("The instruction should have failed with a long code.");
    });
  });
});
