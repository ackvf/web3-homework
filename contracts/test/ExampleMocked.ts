import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { deployContract, deployMockContract, MockProvider, solidity } from 'ethereum-waffle'
import { parseEther } from 'ethers/lib/utils'

import { IERC20, IERC20__factory, Savings, Savings__factory } from '../typings'

chai.use(solidity)
chai.use(chaiAsPromised)
const { expect } = chai

/**
 * This test suite is implemented using Waffle and uses mock for one of two contracts.
 */

describe('ExampleMocked:Contract interaction', () => {
  let savingsContract: Savings
  let mockedERC20: MockContract<IERC20>

  const TARGET = parseEther('1000000')
  const HIGH = parseEther('1000001')
  const LOW = parseEther('999999')

  beforeEach(async () => {
    const [wallet] = new MockProvider().getWallets()

    mockedERC20 = await deployMockContract(wallet, IERC20__factory.abi) as MockContract<IERC20>
    savingsContract = await deployContract(wallet, Savings__factory, [mockedERC20.address, TARGET]) as Savings
  })

  describe('Interact with external mocked contract', async () => {

    it('Mocked balance should match', async () => {
      await mockedERC20.mock.balanceOf.returns(TARGET)
      const balance = await savingsContract.functions.balance()
      expect(balance[0]).to.be.equal(TARGET)
    })

    it('Mocked balance should be higher', async () => {
      await mockedERC20.mock.balanceOf.returns(HIGH)
      const didReachTarget = await savingsContract.functions.check()
      expect(didReachTarget[0]).to.be.equal(true)
    })

    it('Mocked balance should be lower', async () => {
      await mockedERC20.mock.balanceOf.returns(LOW)
      const didReachTarget = await savingsContract.functions.check()
      expect(didReachTarget[0]).to.be.equal(false)
    })

  })

})
