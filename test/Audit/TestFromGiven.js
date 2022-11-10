const { expect } = require("chai");
const {
	beforeHook,
	beforeEachHook,
	timeTravelBlocks,
	swapNativeForToken,
	forceHighMaxDebt,
	forceFHMBondPositive,
} = require("../../utils/testUtils.ts");
const { addressBook } = require("blockchain-addressbook");
const {
	FHM,
	FHM_STAKER,
	STAKED_FHM,
	FHM_STAKE_MANAGER,
	BOGUS_ADDR_1,
	BOGUS_ADDR_2,
	WFTM,
	DAI,
	FHM_DAI_BOND,
	FHM_DAI_ROUTE,
	TEST_TIMEOUT,
	SLOW_TEST_FLAG,
	FANTOHM_TEST_FLAG,
	FHM_WFTM_BOND,
	FHM_DAI_LP_BOND,
	FHM_BOND_CALCULATOR,
	FHM_WHALES,
	FHM_TREASURY,
	REBASE_PERIOD_BLOCKS,
	FHM_CIRCULATING_SUPPLY,
} = require("../../constants.js");
const { ethers } = require("hardhat");

const { spookyswap } = addressBook.fantom.platforms;
const devAddress = BOGUS_ADDR_2;

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

const stratConfig = {
	rebaseStaker: FHM_STAKER,
	stakeManager: FHM_STAKE_MANAGER,
	keeper: BOGUS_ADDR_1,
	unirouter: spookyswap.router,
	serviceFeeRecipient: devAddress,
	minDeposit: 100,
	discordLink: "https://discord.gg/fS5ZUwDtVK",
};

describe(FANTOHM_TEST_FLAG + " Strategy Control Functions", function () {
	let vault,
		strategy,
		unirouter,
		fhm,
		stakedFhm,
		deployer,
		keeper,
		other,
		whale,
		daiBondDepository,
		wftmBondDepository,
		fhmDaiBondDepository,
		stakeManager,
		stakingHelper,
		daiWftmPair,
		rebaseTokenBalStart,
		daiValueInitial,
		unirouterData,
		dai,
		fhmCirculatingSupply;

	this.slow(20000);

	beforeEach(async () => {
		({
			rebaseToken: fhm,
			stakedRebaseToken: stakedFhm,
			stakingHelper,
			unirouter,
			unirouterData,
			whale,
			daiBondDepository,
			wftmBondDepository,
			daiLPBondDepository: fhmDaiBondDepository,
			daiWftmPair,
			stakeManager,
			dai,
			circulatingSupply: fhmCirculatingSupply,
		} = await beforeHook({
			provider: ethers.provider,
			stratConfig,
			rebaseTokenAddr: FHM,
			stakedRebaseTokenAddr: STAKED_FHM,
			daiBondAddr: FHM_DAI_BOND,
			wftmBondAddr: FHM_WFTM_BOND,
			daiLPBondAddr: FHM_DAI_LP_BOND,
			lpBondCalculatorAddr: FHM_BOND_CALCULATOR,
			stakeManagerAddr: FHM_STAKE_MANAGER,
			whales: FHM_WHALES,
			whaleToken: STAKED_FHM,
			treasuryAddr: FHM_TREASURY,
			fundStaked: true,
			stakingHelperAddr: FHM_STAKER,
			circulatingSupplyAddr: FHM_CIRCULATING_SUPPLY,
		}));
		({
			vault,
			strategy,
			rebaseTokenBalStart,
			daiValueInitial,
			deployer,
			keeper,
			other,
		} = await beforeEachHook({
			contractNames,
			vaultConfig,
			stratConfig,
			unirouter,
			rebaseToken: fhm,
			whale,
			stakedRebaseToken: stakedFhm,
			fundStaked: true,
		}));
	});

	it("Exploit", async function () {
		await vault.depositAll();
		console.log(
			ethers.utils.formatEther(await vault.balanceOf(deployer.address))
		);
		console.log(
			"vault bal in sFHM: " + ethers.utils.formatUnits(await vault.balance(), 9)
		);
	});
});
