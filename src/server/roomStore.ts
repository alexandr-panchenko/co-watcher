import { RoomState } from './types';
import { TimelineAnchor, SequenceBlock } from '../types';
import { INITIAL_TIMELINE_ANCHORS, DISCOVERY_LECTURES, ASSEMBLED_CUT_BLOCKS } from '../data/mockData';

class RoomStore {
  private rooms: Map<string, RoomState> = new Map();
  private subscribers: Map<string, Set<(room: RoomState) => void>> = new Map();

  public getOrCreateRoom(id: string, initialUrl?: string, userPurpose?: string): RoomState {
    let room = this.rooms.get(id);
    if (!room) {
      room = {
        id,
        videoUrl: initialUrl || 'https://www.youtube.com/watch?v=bCz4OMemCcA',
        videoTitle: 'Attention is All You Need — Transformer Architecture Deep Dive',
        videoId: 'bCz4OMemCcA',
        userPurpose: userPurpose || 'Understand transformer architecture self-attention mechanisms',
        comments: [...INITIAL_TIMELINE_ANCHORS],
        sequenceBlocks: [...ASSEMBLED_CUT_BLOCKS],
        recommendations: [...DISCOVERY_LECTURES],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.rooms.set(id, room);
    }
    return room;
  }

  public getRoom(id: string): RoomState | undefined {
    return this.rooms.get(id);
  }

  public updateRoom(id: string, update: Partial<RoomState>): RoomState | undefined {
    const room = this.rooms.get(id);
    if (!room) return undefined;

    const updated: RoomState = {
      ...room,
      ...update,
      updatedAt: Date.now(),
    };
    this.rooms.set(id, updated);
    this.notifySubscribers(id, updated);
    return updated;
  }

  public addComment(roomId: string, comment: TimelineAnchor): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    const comments = [...room.comments, comment].sort((a, b) => a.timeSec - b.timeSec);
    return this.updateRoom(roomId, { comments });
  }

  public setComments(roomId: string, comments: TimelineAnchor[]): RoomState | undefined {
    const sorted = [...comments].sort((a, b) => a.timeSec - b.timeSec);
    return this.updateRoom(roomId, { comments: sorted });
  }

  public setSequenceBlocks(roomId: string, sequenceBlocks: SequenceBlock[]): RoomState | undefined {
    return this.updateRoom(roomId, { sequenceBlocks });
  }

  public subscribe(roomId: string, cb: (room: RoomState) => void): () => void {
    if (!this.subscribers.has(roomId)) {
      this.subscribers.set(roomId, new Set());
    }
    const set = this.subscribers.get(roomId);
    if (set) {
      set.add(cb);
    }

    return () => {
      const currentSet = this.subscribers.get(roomId);
      if (currentSet) {
        currentSet.delete(cb);
      }
    };
  }

  private notifySubscribers(roomId: string, room: RoomState): void {
    const subs = this.subscribers.get(roomId);
    if (subs) {
      subs.forEach((cb) => {
        try {
          cb(room);
        } catch (e) {
          console.error('Subscriber error:', e);
        }
      });
    }
  }
}

export const roomStore = new RoomStore();
