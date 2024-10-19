export interface InstrumentOptions {
  keys: string[];
  start?: number;
  volume?: number;
  url: string;
}

export class Instrument<K extends string = string> {
  readonly id: K;
  readonly keys: string[];
  readonly start: number;
  readonly volume: number;
  readonly url: string;
  private readonly context: AudioContext;
  private buffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;

  constructor(id: K, context: AudioContext, { keys, start = 0, volume = 1, url }: InstrumentOptions) {
    this.id = id;
    this.keys = keys;
    this.start = start;
    this.volume = volume;
    this.url = url;
    this.context = context;
    this.load();
  }

  private async load(): Promise<void> {
    const response: Response = await fetch(this.url);
    const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
    this.buffer = await this.context.decodeAudioData(arrayBuffer);
  }

  play(): void {
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;

    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = this.volume;

    this.source.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);

    this.source.start(0, this.start);
  }

  pause(): void {
    this.source?.stop();
  }
}