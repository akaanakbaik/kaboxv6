declare module 'b2-cloud-storage' {
  interface B2Options {
    applicationKeyId: string;
    applicationKey: string;
  }

  interface AuthorizeResponse {
    data: {
      authorizationToken: string;
      uploadUrl: string;
    };
  }

  class B2 {
    constructor(options: B2Options);
    authorize(): Promise<void>;
    getUploadUrl(options: { bucketId: string }): Promise<AuthorizeResponse>;
    uploadFile(options: {
      uploadUrl: string;
      uploadAuthToken: string;
      fileName: string;
      data: Buffer;
      mimeType: string;
    }): Promise<any>;
  }

  export default B2;
}
