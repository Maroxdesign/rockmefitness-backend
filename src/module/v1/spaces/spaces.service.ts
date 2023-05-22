import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DoSpacesServiceLib } from './config';
import { generateIdentifier } from '../../../common/utils/uniqueId';
import { environment } from 'src/common/config/environment';

// Typical nestJs service
@Injectable()
export class SpacesService {
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

  /**
   * The method upload file to space 2228704061
   * @param file
   * @returns
   */
  async uploadFile(file) {
    if (!file) return null;
    // Precaution to avoid having 2 files with the same name
    const fileName = `${generateIdentifier()}-${file.originalname}`;

    // Return a promise that resolves only when the file upload is complete
    return new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: environment.DOS.BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve(
              `https://${environment.DOS.BUCKET_NAME}.${environment.DOS.SPACE_LINK}/${fileName}`,
            );
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  async uploadBase64(data) {
    if (!data) return null;

    const buf = Buffer.from(
      data.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    const type = data.split(';')[0].split('/')[1];
    const filekey = generateIdentifier();

    const params = {
      Bucket: environment.DOS.BUCKET_NAME,
      Key: filekey,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
      ACL: 'public-read',
    };

    try {
      await this.s3.putObject(params).promise();
      return `https://${environment.DOS.BUCKET_NAME}.${environment.DOS.SPACE_LINK}/${filekey}`;
    } catch (err) {
      if (err) return null;
    }
  }

  /**
   * The method remove file from space
   * @param file
   * @returns
   */
  async deleteFile(file) {
    const fileName = file.split(`${environment.DOS.SPACE_LINK}/`);

    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: environment.DOS.BUCKET_NAME,
          Key: fileName[1],
          // Key: fileName[1].split('.')[0],
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve('yes');
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  async uploadPathFile(file, filename) {
    return new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: environment.DOS.BUCKET_NAME,
          Key: filename,
          Body: file,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve(
              `https://${environment.DOS.BUCKET_NAME}.${environment.DOS.SPACE_LINK}/${filename}`,
            );
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }
}
