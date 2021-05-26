const NOTE_ON = 144;
const NOTE_OFF = 128;

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
            let frequency = midiToFreq(note);
            let velocity = message.data[2];

            if (!isPaused) {
              if (eventType === NOTE_ON && velocity > 0) {
                this.spawningPlatforms[note] = platformManager.createPlatformAtHeight(map(note, NOTE_MIN, NOTE_MAX, height, 0));

                this.synth.noteAttack(frequency, velocity);
              }
            }

            if (eventType === NOTE_OFF || velocity === 0) {
              let platform = this.spawningPlatforms[note];
              platformManager.terminateMIDIPlatform(platform);
              this.spawningPlatforms[note] = null;

              this.synth.noteRelease(frequency);
            }
          }
        } else {
          input.value.onmidimessage = undefined;
        }
      }
    }
  }

  initializeSynth() {
    this.synth = new p5.PolySynth();
    this.synth.setADSR(0.1, 0.1, 1, 0);
  }
}