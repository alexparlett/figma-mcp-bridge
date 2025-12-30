import { EventEmitter } from "events";
import type { Command } from "../types/commands.js";
import type { CommandResult, TaggedCommand } from "../types/messages.js";

export type { TaggedCommand };

export interface CommandSubmission {
  cmdId: string;
  promise: Promise<CommandResult>;
}

export interface QueueStatus {
  pendingCount: number;
  isConnected: boolean;
}

interface PendingResolver {
  resolve: (result: CommandResult) => void;
  reject: (error: Error) => void;
  timeoutId: NodeJS.Timeout;
}

const COMMAND_TIMEOUT_MS = 120000;

export class CommandQueue extends EventEmitter {
  private commandIdCounter = 0;
  private pendingResolvers = new Map<string, PendingResolver>();
  private connected = false;

  submit(command: Command): CommandSubmission {
    const cmdId = `${++this.commandIdCounter}`;
    const taggedCommand: TaggedCommand = { ...command, _cmdId: cmdId };

    const promise = new Promise<CommandResult>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingResolvers.delete(cmdId);
        reject(new Error("Timeout waiting for Figma response"));
      }, COMMAND_TIMEOUT_MS);

      this.pendingResolvers.set(cmdId, { resolve, reject, timeoutId });
      this.emit("command", taggedCommand);
    });

    return { cmdId, promise };
  }

  submitBatch(commands: Command[]): Promise<CommandResult[]> {
    const batchId = ++this.commandIdCounter;
    const taggedCommands: TaggedCommand[] = [];
    const promises: Promise<CommandResult>[] = [];

    console.error(`[Queue] submitBatch called with ${commands.length} commands, connected=${this.connected}`);

    commands.forEach((cmd, index) => {
      const cmdId = `${batchId}-${index}`;
      const taggedCommand: TaggedCommand = { ...cmd, _cmdId: cmdId };
      taggedCommands.push(taggedCommand);
      console.error(`[Queue] Created tagged command: ${cmdId}, type=${cmd.type}`);

      const promise = new Promise<CommandResult>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          this.pendingResolvers.delete(cmdId);
          reject(new Error("Timeout waiting for Figma response"));
        }, COMMAND_TIMEOUT_MS);

        this.pendingResolvers.set(cmdId, { resolve, reject, timeoutId });
      });

      promises.push(promise);
    });

    console.error(`[Queue] Emitting commands-batch event with ${taggedCommands.length} commands`);
    this.emit("commands-batch", taggedCommands);
    return Promise.all(promises);
  }

  resolveCommand(cmdId: string, result: CommandResult): void {
    const pending = this.pendingResolvers.get(cmdId);
    if (pending) {
      clearTimeout(pending.timeoutId);
      pending.resolve(result);
      this.pendingResolvers.delete(cmdId);
    } else {
      console.error(`[Queue] No resolver for command: ${cmdId}`);
    }
  }

  setConnected(isConnected: boolean): void {
    const wasConnected = this.connected;
    this.connected = isConnected;

    if (wasConnected !== isConnected) {
      this.emit("connection-change", isConnected);
    }

    if (!isConnected && wasConnected) {
      this.rejectAllPending("Figma plugin disconnected");
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  getStatus(): QueueStatus {
    return {
      pendingCount: this.pendingResolvers.size,
      isConnected: this.connected,
    };
  }

  private rejectAllPending(reason: string): void {
    for (const [cmdId, pending] of this.pendingResolvers) {
      clearTimeout(pending.timeoutId);
      pending.reject(new Error(reason));
    }
    this.pendingResolvers.clear();
  }
}
