// Thread models for multi-agent discussion
class Thread {
  constructor({ id, topic, participants = [], messages = [], interestScore = 0, status = 'active' }) {
    this.id = id;
    this.topic = topic;
    this.participants = participants;
    this.messages = messages;
    this.interestScore = interestScore;
    this.status = status; // 'active', 'dormant', 'closed'
  }
}

class ThreadManager {
  constructor() {
    this.threads = [];
  }

  spawn({ id, topic, participants }) {
    const thread = new Thread({ id, topic, participants });
    this.threads.push(thread);
    return thread;
  }

  merge(threadIds, newTopic) {
    // Merge threads by IDs into a new thread
    const merged = threadIds.map(id => this.threads.find(t => t.id === id)).filter(Boolean);
    const participants = [...new Set(merged.flatMap(t => t.participants))];
    const messages = merged.flatMap(t => t.messages);
    const newThread = new Thread({ id: `merged-${Date.now()}`, topic: newTopic, participants, messages });
    this.threads = this.threads.filter(t => !threadIds.includes(t.id));
    this.threads.push(newThread);
    return newThread;
  }

  close(threadId) {
    const thread = this.threads.find(t => t.id === threadId);
    if (thread) thread.status = 'closed';
  }

  rank() {
    // Rank threads by interestScore
    return [...this.threads].sort((a, b) => b.interestScore - a.interestScore);
  }

  calculateInterest(thread) {
    // Automatic interest calculation based on engagement
    const engagement = thread.messages.length + thread.participants.length;
    thread.interestScore = engagement;
    // Dormant if low engagement
    if (engagement < 3) thread.status = 'dormant';
    // Closed if no engagement for a while (simulate)
    if (thread.messages.length === 0 && thread.status === 'dormant') thread.status = 'closed';
    return thread.interestScore;
  }

  shouldSpawnNewThread(currentThreads, newMessage) {
    // Identify when new threads should spawn (e.g., new topic or high divergence)
    const topics = currentThreads.map(t => t.topic);
    if (!topics.includes(newMessage.topic)) return true;
    return false;
  }
}

module.exports = {
  Thread,
  ThreadManager
};
