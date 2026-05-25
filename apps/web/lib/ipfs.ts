'use client';

const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? 'https://gateway.pinata.cloud/ipfs';
const PINATA_JWT = process.env.PINATA_JWT ?? '';

export interface IpfsUploadResult {
  cid: string;
  url: string;
  size: number;
}

export async function uploadFileToPinata(file: File): Promise<IpfsUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('pinataMetadata', JSON.stringify({ name: file.name }));
  formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pinata upload failed: ${text}`);
  }

  const data = await res.json();
  const cid = data.IpfsHash as string;
  return { cid, url: ipfsToHttp(cid), size: file.size };
}

export async function uploadJsonToPinata(json: unknown, name: string): Promise<IpfsUploadResult> {
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: json,
      pinataMetadata: { name },
      pinataOptions: { cidVersion: 1 },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pinata JSON upload failed: ${text}`);
  }

  const data = await res.json();
  const cid = data.IpfsHash as string;
  const bytes = new TextEncoder().encode(JSON.stringify(json)).length;
  return { cid, url: ipfsToHttp(cid), size: bytes };
}

export function ipfsToHttp(cid: string): string {
  if (!cid) return '';
  if (cid.startsWith('http')) return cid;
  const cleanCid = cid.replace('ipfs://', '');
  return `${PINATA_GATEWAY}/${cleanCid}`;
}

export async function buildNftMetadata(data: {
  castId: number;
  content: string;
  authorUsername: string;
  imageUrl?: string;
  edition: number;
  maxEdition: number;
}): Promise<IpfsUploadResult> {
  const metadata = {
    name: `StackX Cast NFT #${data.castId}`,
    description: data.content,
    image: data.imageUrl ?? '',
    external_url: `https://stackx.app/cast/${data.castId}`,
    attributes: [
      { trait_type: 'Author', value: `@${data.authorUsername}` },
      { trait_type: 'Edition', value: `${data.edition}/${data.maxEdition}` },
      { trait_type: 'Cast ID', value: data.castId.toString() },
      { trait_type: 'Platform', value: 'StackX' },
    ],
  };

  return uploadJsonToPinata(metadata, `cast-nft-${data.castId}.json`);
}
