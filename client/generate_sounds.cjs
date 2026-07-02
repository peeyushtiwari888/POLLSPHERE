const fs = require('fs');
const path = require('path');

function createWavFile(filename, frequency, durationMs) {
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  
  const numSamples = Math.floor((sampleRate * durationMs) / 1000);
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;
  
  const buffer = Buffer.alloc(44 + dataSize);
  
  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize, 4);
  buffer.write('WAVE', 8);
  
  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // ByteRate
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);
  
  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // Write audio data (sine wave)
  const amplitude = 32760; // Max 16-bit volume
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const value = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    buffer.writeInt16LE(Math.floor(value), 44 + i * 2);
  }
  
  fs.writeFileSync(path.join(__dirname, 'public', 'sounds', filename), buffer);
  console.log(`Created ${filename}`);
}

createWavFile('lobby.wav', 440, 500); // generic tone
createWavFile('ticktock.wav', 800, 100); // short beep
createWavFile('correct.wav', 600, 300); // slightly higher
createWavFile('wrong.wav', 200, 400); // low tone
createWavFile('applause.wav', 500, 800); // generic tone
