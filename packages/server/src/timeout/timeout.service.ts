import { Injectable } from '@nestjs/common';

export interface Identifier {
  ip?: string;
  socketId?: string;
  timestamp?: number;
}

@Injectable()
export class TimeoutService {
  timeouts: Identifier[] = [];
  timeout = 3 * 1000; // Minimum delay between allowed draws in milliseconds

  get timeoutDuration() {
    return this.timeout / 1000;
  }

  isTimedOut(identifier: Identifier): boolean {
    // Remove expired timeouts
    this.timeouts = this.timeouts.filter(
      (x) => x.timestamp && x.timestamp + this.timeout > Date.now(),
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

  setTimeout(newTimeout: number): void {
    this.timeout = newTimeout;
  }
}
