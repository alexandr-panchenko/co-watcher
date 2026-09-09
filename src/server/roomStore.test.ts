import { describe, it, expect } from 'bun:test';
import { roomStore } from './roomStore';
import { TimelineAnchor } from '../types';

describe('RoomStore', () => {
  it('initializes default room state', () => {
    const room = roomStore.getOrCreateRoom('test-room', 'https://www.youtube.com/watch?v=test');
    expect(room.id).toBe('test-room');
    expect(room.videoUrl).toBe('https://www.youtube.com/watch?v=test');
    expect(room.comments.length).toBeGreaterThan(0);
  });

  it('adds and sorts timestamped comments chronologically', () => {
    const anchor: TimelineAnchor = {
      id: 'test-comment-1',
      timeSec: 45,
      timeFormatted: '00:45',
      title: 'Intro note',
      category: 'analysis',
      categoryLabel: 'Analysis',
      summary: 'Test summary',
    };
    const updated = roomStore.addComment('test-room', anchor);
    expect(updated).toBeDefined();
    expect(updated?.comments[0]?.timeSec).toBeLessThanOrEqual(45);
  });

  it('notifies subscribers on room update', () => {
    let notified = false;
    const unsub = roomStore.subscribe('test-room', (room) => {
      if (room.userPurpose === 'New Purpose') {
        notified = true;
      }
    });

    roomStore.updateRoom('test-room', { userPurpose: 'New Purpose' });
    expect(notified).toBe(true);
    unsub();
  });

  it('maintains and updates sequence storyboard blocks', () => {
    const room = roomStore.getRoom('test-room');
    expect(room?.sequenceBlocks.length).toBeGreaterThan(0);
    expect(room?.sequenceBlocks[0]?.title).toBe('Source Context Clip');

    const updated = roomStore.setSequenceBlocks('test-room', [
      {
        id: 'custom-block-1',
        number: 1,
        title: 'Custom Reaction Cut',
        type: 'HUMAN VOICE & CAM',
        timeRange: '0:00 - 0:15',
        startSec: 0,
        endSec: 15,
        durationFormatted: '0:15',
        description: 'Testing custom sequence block',
        thumbnail: '',
      },
    ]);
    expect(updated?.sequenceBlocks.length).toBe(1);
    expect(updated?.sequenceBlocks[0]?.title).toBe('Custom Reaction Cut');
  });
});
