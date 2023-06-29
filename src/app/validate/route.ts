import assert from 'assert'
import { NextResponse } from 'next/server'
import { Contract, Interface, InfuraProvider } from 'ethers'
import artifacts from '@openzeppelin/contracts/build/contracts/ERC1155.json'
import { verifySignature } from './verifySignature'
import { kv } from '@vercel/kv'

assert(process.env.INFURA_API_KEY, 'Missing INFURA_API_KEY')
const infura = new InfuraProvider(1, process.env.INFURA_API_KEY)

export async function POST(request: Request) {
  const data = await request.json()
  const { signature, owner, address, id } = data
  if (!signature || !owner || !address || !id) {
    return NextResponse.json({ reason: 'Malformed payload' }, { status: 400 })
  }

  const interface1155 = new Interface(artifacts.abi)
  const contract = new Contract(address, interface1155, infura)
  const balanceOf: bigint = await contract.balanceOf(owner, id)
  if (Number(balanceOf) !== 1) {
    return NextResponse.json({ reason: 'Not found' }, { status: 404 })
  }

  try {
    const verifiedOwner = verifySignature(data)
    console.log(verifiedOwner, owner)
    if (verifiedOwner !== owner) {
      return NextResponse.json({ reason: 'Thief!' }, { status: 401 })
    }
  } catch (e) {
    console.warn('Signature verification failed', e)
    return NextResponse.json({ reason: 'Invalid signature' }, { status: 403 })
  }

  const used = await kv.get(`used:${address}/${id}`)
  console.log(used)
  if (used) {
    return NextResponse.json({ reason: 'Already checked in' }, { status: 409 })
  }

  try {
    const result = await kv.set(`used:${address}/${id}`, true)
    if (result !== 'OK') throw new Error('Failed to write')
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    console.warn('KV update failed', e)
    return NextResponse.json({ reason: 'Failed to check in' }, { status: 500 })
  }
}
