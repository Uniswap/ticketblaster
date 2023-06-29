import { verifyTypedData } from 'ethers'

interface PayloadData {
  signature: string
  owner: string
  address: string
  id: string
}

export function verifySignature(payload: PayloadData) {
  const Ticket_Domain = {
    name: 'NFT_COLLECTION_TICKET',
    version: '1',
    chainId: '1',
  }
  const Ticket_PermitTypes = {
    Ticket: [
      {
        name: 'ownerAddress',
        type: 'string',
      },
      {
        name: 'collectionAddress',
        type: 'string',
      },
      {
        name: 'tokenId',
        type: 'string',
      },
    ],
  }
  const value = {
    ownerAddress: payload.owner,
    collectionAddress: payload.address,
    tokenId: payload.id,
  }

  const recoveredData = verifyTypedData(
    Ticket_Domain,
    Ticket_PermitTypes,
    value,
    payload.signature, // this is the sig
  )
  console.log('recoveredData', recoveredData)
  return recoveredData
}
