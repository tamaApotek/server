export class ErrorCode extends Error {
  constructor(public code: any, public message: string) {
    super(message);
    this.code = code;
  }
}
