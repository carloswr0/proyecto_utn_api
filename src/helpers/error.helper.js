class ServerError extends Error {
  constructor(errorData) {
    const message = typeof errorData === 'string' ? errorData : errorData.message;
    super(message);
    this.status = typeof errorData === 'string' ? 500 : (errorData.status || 500);
    this.ok = typeof errorData === 'string' ? false : (errorData.ok !== undefined ? errorData.ok : false);
  }
}

export default ServerError;