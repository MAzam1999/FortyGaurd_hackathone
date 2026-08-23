export class FortyGuardError extends Error {}

export class FortyGuardApiError extends FortyGuardError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
  }
}

export class FortyGuardTimeoutError extends FortyGuardError {}
