import { Address, BigInt } from '@graphprotocol/graph-ts';
import { afterAll, beforeAll, clearStore, describe } from 'matchstick-as';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
  beforeAll(() => {
    let owner = Address.fromString('0x0000000000000000000000000000000000000001');
    let approved = Address.fromString('0x0000000000000000000000000000000000000001');
    let tokenId = BigInt.fromI32(234);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test
});
