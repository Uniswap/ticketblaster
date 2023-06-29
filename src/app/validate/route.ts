import assert from 'assert'
import { NextResponse } from 'next/server'
import { Contract, InfuraProvider } from 'ethers'

assert(process.env.INFURA_API_KEY, 'Missing INFURA_API_KEY')
const infura = new InfuraProvider(1, process.env.INFURA_API_KEY)

// https://eips.ethereum.org/EIPS/eip-1155#specification
const abi = [
  'function balanceOf(address _owner, uint256 _id) external view returns (uint256)',
]

export async function POST(request: Request) {
  const { signature, owner, address, id } = await request.json()

  const contract = new Contract(address, abi, infura)
  console.log(owner, id)
  const balanceOf: bigint = await contract.balanceOf(owner, id)
  if (Number(balanceOf) !== 1) {
    return NextResponse.json({ reason: 'Not found' }, { status: 404 })
  }

  // TODO: ecrecover to verify signature is from owner
  // return NextResponse.json({ reason: 'Invalid signature' }, { status: 403 })

  // TODO: check against database
  // return NextResponse.json({ reason: 'Already checked in' }, { status: 409 })

  return NextResponse.json({}, { status: 200 })
}
