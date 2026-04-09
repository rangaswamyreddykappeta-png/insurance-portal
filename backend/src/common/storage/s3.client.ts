import { S3Client } from '@aws-sdk/client-s3';

console.log('S3 CLIENT ENV', {
  region: process.env.AWS_REGION,
  accessKeyPrefix: process.env.AWS_ACCESS_KEY_ID?.slice(0, 4),
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
});

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});