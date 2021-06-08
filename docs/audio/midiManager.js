const NOTE_ON = 144;
const NOTE_OFF = 128;
const NUM_CHANNELS = 16;

const NOTE_MAX = 72;
const NOTE_MIN = 48;
const MAX_NOTE_INDEX = NOTE_MAX - NOTE_MIN;

class MIDIManager {
  constructor() {
    this.controllers = [];
    this.midiAccess = null;
    this.spawningPlatforms = {};
  }

  getMIDIAccess() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          this.midiAccess = access;
          this.midiAccess.onstatechange = (e) => {
            // Print information about the (dis)connected MIDI controller
            console.log(e.port.name, e.port.manufacturer, e.port.state);
            this.getControllers();
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

  setInputController(controller) {
    if (this.midiAccess) {
      // Get lists of available MIDI controllers
      const inputs = this.midiAccess.inputs.values();

      for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        if (input.value.name === controller) {
          console.log(`Setting input controller to ${controller}`);
          input.value.onmidimessage = (message) => {
            let eventType = message.data[0];
            let note = message.data[1];
            if (note !== undefined && (this.isNoteOn(eventType) || this.isNoteOff(eventType))) {
              let channel = this.getChannelFromEvenType(eventType);
              let frequency = midiToFreq(note);
              let velocity = message.data[2];

              const mappedNote = this.mapNoteToRange(note, NOTE_MIN, NOTE_MAX);

              if (!isPaused) {
                if (this.isNoteOn(eventType) && velocity > 0) {
                  this.spawningPlatforms[mappedNote] = platformManager.createColoredPlatformAtHeight(this.getNoteColor(note), map(mappedNote, NOTE_MIN, NOTE_MAX, height, platformManager.minPlatformYPos));

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
          this.initializeSynth();
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
  }

  initializeSynth() {
    MIDI.loadPlugin({
      soundfontUrl: "lib/midi-js/soundfont/",
      instrument: "acoustic_grand_piano",
      onprogress: function (state, progress) {
        console.log(state, progress);
      },
      onsuccess: function () {
        for (let i = 0; i < NUM_CHANNELS; i++) {
          MIDI.setVolume(i, 40);
        }
      }
    });
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
    const noteColor = colorMap[(note - 27) % 12];
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
    const SHIFT_AMOUNT = noteMax - noteMin;
    let mappedNote = note;

    while (mappedNote < noteMin) {
      mappedNote += SHIFT_AMOUNT;
    }

    while (mappedNote > noteMax) {
      mappedNote -= SHIFT_AMOUNT;
    }

    return mappedNote;
  }

  playMIDIFile(filePath) {
    loadFile({
      file: filePath,
      onSuccess: function () {
        console.log(`${file} loaded!`);
        MIDI.Player.addListener((data) => {
          const eventType = data.message;
          const note = data.note;
          if (note !== undefined && (this.isNoteOn(eventType) || this.isNoteOff(eventType))) {
            // const channel = data.channel;
            let velocity = message.data[2];

            const mappedNote = this.mapNoteToRange(note, NOTE_MIN, NOTE_MAX);

            if (!isPaused) {
              if (this.isNoteOn(eventType) && velocity > 0) {
                this.spawningPlatforms[mappedNote] = platformManager.createColoredPlatformAtHeight(this.getNoteColor(note), map(mappedNote, NOTE_MIN, NOTE_MAX, height, platformManager.minPlatformYPos));

                // const delay = 0;
                // MIDI.noteOn(channel, note, velocity, delay);
              }
            }

            if (this.isNoteOff(eventType) || velocity === 0) {
              let platform = this.spawningPlatforms[mappedNote];
              platformManager.terminateMIDIPlatform(platform);
              this.spawningPlatforms[mappedNote] = null;

              // const delay = 0;
              // MIDI.noteOff(channel, note, delay);
            }
          }
        });
        MIDI.Player.start();
      }
    });
  }
}