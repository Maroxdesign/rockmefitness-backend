import * as AWS from 'aws-sdk';
import { Provider } from '@nestjs/common';
import { environment } from 'src/common/config/environment';

// Unique identifier of the service in the dependency injection layer
export const DoSpacesServiceLib = 'lib:do-spaces-service';

// Creation of the value that the provider will always be returning.
// An actual AWS.S3 instance https://batata-cdn.fra1.digitaloceanspaces.com
const spacesEndpoint = new AWS.Endpoint(environment.DOS.SPACE_LINK);

const S3 = new AWS.S3({
  endpoint: spacesEndpoint,
  credentials: new AWS.Credentials({
    accessKeyId: environment.DOS.KEY_ID,
    secretAccessKey: environment.DOS.SECRET,
  }),
});

// Now comes the provider
export const DoSpacesProvider: Provider<AWS.S3> = {
  provide: DoSpacesServiceLib,
  useValue: S3,
};

// This is just a simple interface that represents an uploaded file object
export interface IUploadedMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
