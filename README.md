# Ticketblaster

Ticketblaster is a proof of concept lightweight NFT ticketing software. It allows any NFT to be used as a ticket to a meatspace event.

This Next.js web app verifies signatures from NFT holders via a scanned QR code. It is intended to be run by a door attendant with any mobile device. Scanned signatures are verified with `ethers#verifyTypedData`. In this case, verified signatures are marked as redeemed in a venue-managed database. (NFT redemption, event access, and marking of token IDs as `redeemed` is left to the venue.)

An external application on a "ticket holder"'s device must generate a ticket claim implementing the following interface:

```ts
interface PayloadData {
  signature: string
  owner: string
  address: string
  id: string
}
```

`signature` is the EIP-712 signature of the other fields
`owner` is the owner of the NFT
`address` is the NFT address
`id` is the token id the owner is claiming to possess
