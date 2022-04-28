import { Injectable } from '@nestjs/common';

export interface Identifier {
  ip?: string;
  socketId?: string;
  timestamp?: number;
}

@Injectable()
export class TimeoutService {
  timeouts: Identifier[] = [];
  _timeout = 3; // Minimum delay between allowed draws in seconds

  get timeout() {
    return this._timeout;
  }

  set timeout(value: number) {
    this._timeout = value;
  }

  isTimedOut(identifier: Identifier): boolean {
    // Remove expired timeouts
    this.timeouts = this.timeouts.filter(
      (x) => x.timestamp && x.timestamp + this._timeout * 1000 > Date.now(),
    );

    const timeout = this.timeouts.find((x) => {
      return identifier.ip === x.ip || identifier.socketId === x.socketId;
    });

    return timeout !== undefined;
  }

  add(identifier: Identifier): void {
    if (!identifier.ip && !identifier.socketId) return;

    identifier.timestamp = Date.now();
    this.timeouts.push(identifier);
  }
}
