import * as crypto from 'crypto';

export class ACRCloudUtil {
  /**
   * Generate HMAC signature for ACRCloud API request
   * @param accessKey - ACRCloud access key
   * @param accessSecret - ACRCloud access secret
   * @param httpMethod - HTTP method (POST)
   * @param httpUri - API URI path (/v1/identify)
   * @param timestamp - Unix timestamp in seconds
   * @returns Signature string for Authorization header
   */
  static generateSignature(
    accessKey: string,
    accessSecret: string,
    httpMethod: string,
    httpUri: string,
    timestamp: number,
  ): string {
    const stringToSign = [httpMethod, httpUri, accessKey, 'audio', '1', timestamp.toString()].join('\n');
    
    const signature = crypto
      .createHmac('sha1', accessSecret)
      .update(Buffer.from(stringToSign, 'utf-8'))
      .digest()
      .toString('base64');

    return signature;
  }

  /**
   * Build ACRCloud form data for audio recognition
   * @param audioBuffer - Audio file buffer
   * @param accessKey - ACRCloud access key
   * @param signature - Generated signature
   * @param timestamp - Unix timestamp in seconds
   * @returns FormData ready to send to ACRCloud
   */
  static buildFormData(
    audioBuffer: Buffer,
    accessKey: string,
    signature: string,
    timestamp: number,
  ): any {
    const FormData = require('form-data');
    const formData = new FormData();

    formData.append('sample', audioBuffer, {
      filename: 'audio.wav',
      contentType: 'audio/wav',
    });
    formData.append('access_key', accessKey);
    formData.append('data_type', 'audio');
    formData.append('signature_version', '1');
    formData.append('signature', signature);
    formData.append('sample_bytes', audioBuffer.length.toString());
    formData.append('timestamp', timestamp.toString());

    return formData;
  }
}
