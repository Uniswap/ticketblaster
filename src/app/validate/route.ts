import assert from 'assert'
import { NextResponse } from 'next/server'
import { Contract, Interface, InfuraProvider } from 'ethers'
import artifacts from '@openzeppelin/contracts/build/contracts/ERC1155.json'
import { verifySignature } from './verifySignature'
assert(process.env.INFURA_API_KEY, 'Missing INFURA_API_KEY')
const infura = new InfuraProvider(1, process.env.INFURA_API_KEY)

export async function POST(request: Request) {
  const data = await request.json()
  const { signature, owner, address, id } = data
  if (!signature || !owner || !address || !id) {
    return NextResponse.json({ reason: 'Malformed payload.' }, { status: 403 })
  }

  console.log('signature', signature)
  console.log('owner', owner)
  console.log('address', address)
  console.log('id', id)
  console.log('====================')

  const interface1155 = new Interface(artifacts.abi)
  const contract = new Contract(address, interface1155, infura)
  const balanceOf: bigint = await contract.balanceOf(owner, id)

  if (Number(balanceOf) !== 1) {
    return NextResponse.json({ reason: 'Not found' }, { status: 404 })
  }

  let verifiedAddress = ''
  try {
    verifiedAddress = verifySignature(data)
    console.log('address', address)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ reason: 'Invalid signature' }, { status: 403 })
  }

  // try {
  //   todo: database check
  // } catch (e) {
  //   return NextResponse.json({ reason: 'Already checked in' }, { status: 409 })
  // }

  return NextResponse.json({}, { status: 200 })
}
