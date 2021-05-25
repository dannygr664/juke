const NOTE_ON = 144;
const NOTE_OFF = 128;

const NOTE_MAX = 72;
const NOTE_MIN = 48;
const MAX_NOTE_INDEX = NOTE_MAX - NOTE_MIN;

class MIDIManager {
  constructor() {
    this.controllers = [];
    this.midiAccess = null;
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
          input.value.onmidimessage = (message) => {
            let eventType = message.data[0];
            let note = message.data[1];
            let frequency = this.midiNoteToFrequency(note);
            let velocity = message.data[2];

            if (!isPaused) {
              if (eventType === NOTE_ON && velocity > 0) {
                platformManager.createPlatformAtHeight(map(note, NOTE_MIN, NOTE_MAX, height, 0));

                this.playNote(frequency);
              }
            }

            if (eventType === NOTE_OFF || velocity === 0) {
              this.stopNote(frequency);
            }
          }
        } else {
          input.value.onmidimessage = undefined;
        }
      }
    }
  }

  midiNoteToFrequency(note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
  }

  initializeOscillator() {
    this.osc = new p5.Oscillator('sine');
    this.osc.amp(0.5, 0.1);
  }

  playNote(frequency) {
    this.osc.freq(frequency, 0.1);
    this.osc.start();
  }

  stopNote(frequency) {
    this.osc.stop();
  }
}