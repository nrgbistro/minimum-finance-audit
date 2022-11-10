const { ethers } = require("hardhat");
const { expect } = require("chai");

const { deployVaultAndStrategy } = require("../../utils/deployUtils.ts");

const { FHM_STAKER, FHM_STAKE_MANAGER } = require("../../constants.js");
const { addressBook } = require("blockchain-addressbook");

const { spookyswap } = addressBook.fantom.platforms;

describe("Basic contract interaction", function () {
	let deployer, attacker, dev, keeper;

	const contractNames = {
		vault: "MinimumVault",
		strategy: "StrategyFantOHM",
	};

	const vaultConfig = {
		name: "Minimum FantOHM",
		symbol: "minFHM",
		stratApprovalDelay: 21600,
		wantCap: ethers.utils.parseUnits("6000", 9),
	};

	before(async function () {
		[deployer, keeper, dev, attacker] = await ethers.getSigners();

		const stratConfig = {
			rebaseStaker: FHM_STAKER,
			stakeManager: FHM_STAKE_MANAGER,
			keeper: keeper.address,
			unirouter: spookyswap.router,
			serviceFeeRecipient: dev.address,
			minDeposit: 100,
			discordLink: "https://discord.gg/fS5ZUwDtVK",
		};

		ret = await deployVaultAndStrategy(
			contractNames,
			vaultConfig,
			stratConfig,
			deployer
		);
		this.vault = ret.vault;
		this.strategy = ret.strategy;
		this.fhm = await ethers.getContractAt(
			"@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
			await this.vault.output()
		);
		this.want = await ethers.getContractAt("sFantohm", await this.vault.want());
		await this.want.

		await ethers.provider.send("hardhat_setBalance", [
			attacker.address,
			"0x1158e460913d00000", // 20 ETH
		]);
		console.log(await this.want.balanceOf(deployer.address));
		await this.want.transfer(
			attacker.address,
			ethers.utils.parseUnits("1000", 9)
		);
	});

	it("Exploit", async function () {
		console.log(await this.want.balanceOf(attacker.address));
		await this.vault.connect(attacker).depositAll();

		expect(await this.vault.balanceOf(attacker.address)).to.be.gt(0);
	});
});
