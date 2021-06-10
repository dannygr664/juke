const NOTE_ON = 144;
const NOTE_OFF = 128;
const NUM_CHANNELS = 16;

const NOTE_MAX = 72;
const NOTE_MIN = 48;
const MAX_NOTE_INDEX = NOTE_MAX - NOTE_MIN;

const SYNTH_VOLUME = 40;

const GENRES_TO_NOTE_RANGES = {
  'Spaceship': {
    'noteMin': 30,
    'noteMax': 70
  },
  'Ethereal': {
    'noteMin': 48,
    'noteMax': 60
  }
};

class MIDIManager {
  constructor() {
    this.controllers = [];
    this.instrumentSounds = [
      'acoustic_grand_piano',
      'synth_drum'
    ];
    this.midiAccess = null;
    this.spawningPlatforms = {};
    this.fileLoaded = false;
    this.noteMax = NOTE_MAX;
    this.noteMin = NOTE_MIN;
    this.getMIDIFilePaths();
  }

  getMIDIFilePaths() {
    this.genresToMIDIFilePaths = {};

    this.genresToMIDIFilePaths['City'] = 'audio/City/Juke_City_City_88bpm4-4_L74B.mid';
    this.genresToMIDIFilePaths['Spaceship'] = 'audio/Spaceship/Juke_Spaceship_Spaceship_76,88bpm4-4_L26M.mid';
    this.genresToMIDIFilePaths['Ethereal'] = 'audio/Ethereal/Juke_Ethereal_11Parts_88bpm4-4_L21M.mid';
    this.genresToMIDIFilePaths['LoFi'] = 'audio/LoFi/Juke_LoFi_LoFi_87bpm4-4_L241B.mid';
    //this.genresToMIDIFilePaths['Chill'] = 'audio/Chill/Juke_Chill_Chill_95,94bpm4-4_L82M.mid';
    //this.genresToMIDIFilePaths['Cinematic'] = 'audio/Cinematic/Juke_Cinematic_Cinematic_96bpm4-4_L24M.mid';
  }

  getMIDIAccess() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          MIDI.Player.removeListener();
          this.midiAccess = access;
          this.midiAccess.onstatechange = (e) => {
            // Print information about the (dis)connected MIDI controller
            console.log(e.port.name, e.port.manufacturer, e.port.state);
            this.getControllers();
            controllerDropdown.html("");
            for (let i = 0; i < this.controllers.length; i++) {
              controllerDropdown.option(this.controllers[i]);
            }
          };
          this.getControllers();
        }, function () {
          console.log('Failed to access MIDI devices');
          return;
        });
    } else {
      console.log('Browser does not support WebMIDI!');
      browserSupportsMIDI = false;
      return;
    }
  }

  getAvailableMIDIDevices() {
    if (!this.midiAccess) {
      this.getMIDIAccess();
    } else {
      this.getControllers();
    }
  }

  getControllers() {
    this.clearControllers();

    // Get lists of available MIDI controllers
    const inputs = this.midiAccess.inputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      this.controllers.push(input.value.name);
    }
  }

  clearControllers() {
    this.controllers = [];
  }

  setInputController(controller, instrument) {
    if (this.midiAccess) {
      // Get lists of available MIDI controllers
      const inputs = this.midiAccess.inputs.values();

      for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        if (input.value.name === controller) {
          console.log(`Setting input controller to ${controller}`);
          this.initializeSynth(instrument, SYNTH_VOLUME);
          input.value.onmidimessage = (message) => {
            let eventType = message.data[0];
            let note = message.data[1];
            if (note !== undefined && (this.isNoteOn(eventType) || this.isNoteOff(eventType))) {
              let channel = this.getChannelFromEvenType(eventType);
              let frequency = midiToFreq(note);
              let velocity = message.data[2];

              const mappedNote = this.mapNoteToRange(note, this.noteMin, this.noteMax);

              if (!isPaused) {
                if (this.isNoteOn(eventType) && velocity > 0) {
                  this.spawningPlatforms[mappedNote] = platformManager.createColoredPlatformAtHeight(this.getNoteColor(note), map(mappedNote, this.noteMin, this.noteMax, height, platformManager.minPlatformYPos));

                  const delay = 0;
                  MIDI.noteOn(channel, note, velocity, delay);
                }
              }

              if (this.isNoteOff(eventType) || velocity === 0) {
                let platform = this.spawningPlatforms[mappedNote];
                platformManager.terminateMIDIPlatform(platform);
                this.spawningPlatforms[mappedNote] = null;

                const delay = 0;
                MIDI.noteOff(channel, note, delay);
              }
            }
          }
        } else {
          input.value.onmidimessage = undefined;
        }
      }
    }
  }

  disconnectInputControllers() {
    if (this.midiAccess) {
      // Get lists of available MIDI controllers
      const inputs = this.midiAccess.inputs.values();

      for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        console.log('Disconnecting all MIDI controllers');
        input.value.onmidimessage = undefined;
      }
    }
    this.setSynthVolume(0);
    this.setMIDIPlayerListener();
  }

  initializeSynth(instrument, volume) {
    MIDI.loadPlugin({
      soundfontUrl: "lib/midi-js/soundfont/",
      instrument: instrument,
      onprogress: function (state, progress) {
        console.log(state, progress);
      },
      onsuccess: () => {
        this.setInstrument(instrument);
        this.setSynthVolume(volume);
      }
    });
  }

  setNoteRangeForGenre(genre) {
    if (GENRES_TO_NOTE_RANGES[genre]) {
      this.noteMin = GENRES_TO_NOTE_RANGES[genre]['noteMin'] ?? NOTE_MIN;
      this.noteMax = GENRES_TO_NOTE_RANGES[genre]['noteMax'] ?? NOTE_MAX;
    } else {
      this.noteMin = NOTE_MIN;
      this.noteMax = NOTE_MAX;
    }
  }

  setMIDIPlayerListener() {
    MIDI.Player.removeListener();
    MIDI.Player.addListener((data) => {
      const eventType = data.message;
      const note = data.note;
      if (note !== undefined && (this.isNoteOn(eventType) || this.isNoteOff(eventType))) {
        // const channel = data.channel;
        let velocity = data.velocity;

        const mappedNote = this.mapNoteToRange(note, this.noteMin, this.noteMax);

        if (!isPaused) {
          if (this.isNoteOn(eventType) && velocity > 0) {
            this.spawningPlatforms[mappedNote] = platformManager.createColoredPlatformAtHeight(this.getNoteColor(note), map(mappedNote, this.noteMin, this.noteMax, height, platformManager.minPlatformYPos));
          }
        }

        if (this.isNoteOff(eventType) || velocity === 0) {
          let platform = this.spawningPlatforms[mappedNote];
          platformManager.terminateMIDIPlatform(platform);
          this.spawningPlatforms[mappedNote] = null;
        }
      }
    });
  }

  setInstrument(instrument) {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      MIDI.programChange(i, MIDI.GM.byName[instrument].number);
    }
  }

  setSynthVolume(volume) {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      MIDI.setVolume(i, volume);
    }
  }

  isNoteOn(eventType) {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      if (eventType === NOTE_ON + i) {
        return true;
      }
    }

    return false;
  }

  isNoteOff(eventType) {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      if (eventType === NOTE_OFF + i) {
        return true;
      }
    }

    return false;
  }

  getChannelFromEvenType(eventType) {
    if (this.isNoteOn(eventType)) {
      return eventType - NOTE_ON;
    } else if (this.isNoteOff(eventType)) {
      return eventType - NOTE_OFF;
    }
  }

  getNoteColor(note) {
    const colorMap = MIDI.Synesthesia.data['D. D. Jameson (1844)'];
    const noteColor = colorMap[note % 12];
    if (noteColor) {
      push();
      colorMode(HSL, 360, 100, 100, 1);
      const hslColor = color(noteColor[0], noteColor[1], noteColor[2]);
      pop();
      return hslColor;
    } else {
      return ColorScheme.BLACK;
    }
  }

  mapNoteToRange(note, noteMin, noteMax) {
    const NOTES_PER_OCTAVE = 12;
    const OCTAVE_SHIFT = floor((noteMax - noteMin) / NOTES_PER_OCTAVE) * NOTES_PER_OCTAVE;
    let mappedNote = note;

    while (mappedNote < noteMin) {
      mappedNote += OCTAVE_SHIFT;
    }

    while (mappedNote > noteMax) {
      mappedNote -= OCTAVE_SHIFT;
    }

    return mappedNote;
  }

  playMIDIFileForGenre(genre) {
    this.setNoteRangeForGenre(genre);
    this.fileLoaded = false;
    MIDI.Player.timewarp = 1.0;
    this.baseBPM = audioManager.sounds.filter(sound => sound.soundInfo.genre === genre)[0].soundInfo.bpm;
    MIDI.Player.BPM = this.baseBPM;
    const filePath = this.genresToMIDIFilePaths[genre];
    MIDI.Player.loadFile(
      filePath,
      () => {
        console.log(`${filePath} loaded!`);
        this.fileLoaded = true;
        MIDI.Player.start();
        audioManager.startSounds(genre);
      }
    );
    this.setMIDIPlayerListener();
  }

  stopMIDI() {
    if (MIDI.Player.playing) {
      MIDI.Player.stop();
    }
  }

  pauseMIDI() {
    if (MIDI.Player.playing && platformManager.mode === PLATFORMER_MODE) {
      MIDI.Player.pause();
    }
  }

  resumeMIDI() {
    if (!MIDI.Player.playing && platformManager.mode === PLATFORMER_MODE) {
      MIDI.Player.resume();
    }
  }

  handlePausing() {
    this.pauseMIDI();
  }

  handleUnpausing() {
    if (!player.isReviving) {
      this.resumeMIDI();
    }
  }

  handleFalling() {
    this.pauseMIDI();
  }

  handleRevived() {
    this.resumeMIDI();
  }

  updateSoundSpeed(newSpeed) {
    MIDI.Player.BPM = this.baseBPM * newSpeed;
    if (!player.isReviving && !isPaused) {
      this.resumeMIDI();
    }
  }

  hasMIDIFile(genre) {
    return (this.genresToMIDIFilePaths[genre] !== undefined);
  }
}