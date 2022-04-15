import { Injectable } from '@nestjs/common';

export interface Identifier {
  ip?: string;
  socketId?: string;
  timestamp?: number;
}

const TIMEOUT = 3 * 1000; // Minimum delay between allowed draws in milliseconds

@Injectable()
export class TimeoutService {
  timeouts: Identifier[] = [];

  get timeoutDuration() {
    return TIMEOUT / 1000;
  }

  isTimedOut(identifier: Identifier): boolean {
    // Remove expired timeouts
    this.timeouts = this.timeouts.filter(
      (x) => x.timestamp && x.timestamp + TIMEOUT > Date.now(),
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
