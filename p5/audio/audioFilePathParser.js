class AudioFilePathParser {
  static parseFilePath(filePath) {
    const filePathNoExtension = filePath.split('.')[0];
    const nameParts = filePathNoExtension.split('_');
    const genre = nameParts[1];
    const partName = nameParts[2];
    const bpmAndTimeSignature = nameParts[3];
    const bpm = parseInt(bpmAndTimeSignature.split('bpm')[0]);
    const timeSignature = nameParts[3].split('bpm')[1];
    const timeSignatureUpper = timeSignature.split('-')[0];
    const timeSignatureLower = timeSignature.split('-')[1];

    const length = (nameParts[4].slice(-1) === 'B')
      ? nameParts[4].slice(1, -1)
      : nameParts[4].slice(1, -1) * timeSignatureLower;

    return new SoundInfo(
      genre,
      partName,
      bpm,
      timeSignatureUpper,
      timeSignatureLower,
      length
    );
  }
}