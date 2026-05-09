/**
 * IPFS Client for StackX Social Platform
 * Handles file uploads and retrieval from IPFS
 */

export interface IPFSUploadResult {
  cid: string;
  url: string;
}

export class IPFSClient {
  private pinataApiKey: string;
  private pinataSecretKey: string;
  private gateway: string;

  constructor() {
    this.pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
    this.pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '';
    this.gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  }

  /**
   * Upload file to IPFS via Pinata
   */
  async uploadFile(file: File): Promise<IPFSUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        platform: 'stackx',
        type: 'media',
        timestamp: Date.now().toString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.pinataApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        cid: data.IpfsHash,
        url: `${this.gateway}${data.IpfsHash}`,
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  /**
   * Upload JSON data to IPFS
   */
  async uploadJSON(data: any): Promise<IPFSUploadResult> {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const file = new File([blob], 'data.json', { type: 'application/json' });
    return this.uploadFile(file);
  }

  /**
   * Upload multiple files to IPFS
   */
  async uploadMultipleFiles(files: File[]): Promise<IPFSUploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Get IPFS URL from CID
   */
  getIPFSUrl(cid: string): string {
    return `${this.gateway}${cid}`;
  }

  /**
   * Pin existing IPFS hash
   */
  async pinByCID(cid: string, name?: string): Promise<void> {
    const body = {
      hashToPin: cid,
      pinataMetadata: {
        name: name || cid,
        keyvalues: {
          platform: 'stackx',
          pinned: 'true',
        },
      },
    };

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.pinataApiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Pin by CID failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error pinning CID:', error);
      throw error;
    }
  }

  /**
   * Unpin file from IPFS
   */
  async unpin(cid: string): Promise<void> {
    try {
      const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.pinataApiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unpin failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error unpinning:', error);
      throw error;
    }
  }

  /**
   * Get pinned files list
   */
  async getPinnedFiles(limit: number = 10): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.pinataApiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Get pinned files failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.rows || [];
    } catch (error) {
      console.error('Error getting pinned files:', error);
      throw error;
    }
  }

  /**
   * Test IPFS connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        headers: {
          Authorization: `Bearer ${this.pinataApiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('IPFS connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
let ipfsClient: IPFSClient | null = null;

export function getIPFSClient(): IPFSClient {
  if (!ipfsClient) {
    ipfsClient = new IPFSClient();
  }
  return ipfsClient;
}

// Helper functions for common operations

export async function uploadImage(file: File): Promise<string> {
  const client = getIPFSClient();
  const result = await client.uploadFile(file);
  return result.cid;
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const client = getIPFSClient();
  const results = await client.uploadMultipleFiles(files);
  return results.map((r) => r.cid);
}

export function getImageUrl(cid: string): string {
  const client = getIPFSClient();
  return client.getIPFSUrl(cid);
}
