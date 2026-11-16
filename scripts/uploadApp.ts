import fs from 'node:fs';
import path from 'node:path';
import { requireEnv } from '../config/env';

/**
 * Upload an .apk to the Perfecto repository and print the repository key.
 *
 *   npm run upload -- apps/WikipediaSample.apk
 *
 * Copy the printed key into PERFECTO_ANDROID_APP in .env.
 * The app is stored as PRIVATE:<file name>, so only your user can see it.
 * Uploading the same file name again replaces the previous copy.
 */
async function main(): Promise<void> {
  const filePath = process.argv[2];
  if (!filePath) {
    throw new Error('Usage: npm run upload -- <path to .apk>');
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const cloud = requireEnv('PERFECTO_CLOUD_NAME');
  const token = requireEnv('PERFECTO_SECURITY_TOKEN');
  const fileName = path.basename(filePath);
  const repositoryKey = `PRIVATE:${fileName}`;

  const metadata = {
    artifactLocator: repositoryKey,
    artifactType: fileName.toLowerCase().endsWith('.ipa') ? 'IOS' : 'ANDROID',
    override: true,
  };

  const form = new FormData();
  form.append(
    'inputStream',
    new Blob([fs.readFileSync(filePath)], { type: 'application/octet-stream' }),
    fileName,
  );
  form.append('requestPart', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

  const response = await fetch(`https://${cloud}.app.perfectomobile.com/repository/api/v1/artifacts`, {
    method: 'POST',
    headers: { 'Perfecto-Authorization': token },
    body: form,
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Upload failed (${response.status}): ${body}`);
  }

  console.log(`Uploaded ${fileName}`);
  console.log(`Repository key: ${repositoryKey}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
