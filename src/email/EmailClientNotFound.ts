export class EmailClientNotFound extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'EmailClientNotFound';
    Object.setPrototypeOf(this, EmailClientNotFound.prototype);
  }
}
