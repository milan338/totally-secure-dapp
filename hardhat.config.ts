import * as dotenv from 'dotenv';
import { HardhatUserConfig, task, types } from 'hardhat/config';
import { deploy } from './scripts/deploy';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

task('deploy', 'Deploy a number of instances of the contract')
    .addOptionalParam('instances', 'Number of contract instances to deploy', 1, types.int)
    .setAction(deploy);

const config: HardhatUserConfig = {
    solidity: '0.4.24',
    networks: {
        ropsten: {
            url: process.env.ROPSTEN_URL || '',
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: 'AUD',
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
};

export default config;
