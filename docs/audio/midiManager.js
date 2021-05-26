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

                if (this.osc.started) {
                  this.playNote(this.osc2, frequency);
                } else {
                  this.playNote(this.osc, frequency);
                }
              }
            }

            if (eventType === NOTE_OFF || velocity === 0) {
              let platform = this.spawningPlatforms[note];
              platformManager.terminateMIDIPlatform(platform);
              this.spawningPlatforms[note] = null;

              if (this.osc.started) {
                this.stopNote(this.osc);
              } else if (this.osc2.started) {
                this.stopNote(this.osc2);
              }
            }
          }
        } else {
          input.value.onmidimessage = undefined;
        }
      }
    }
  }

  initializeOscillator() {
    this.osc = new p5.Oscillator('sine');
    this.osc2 = new p5.Oscillator('sine');
    this.osc.amp(0.5, 0.1);
    this.osc2.amp(0.5, 0.1);
  }

  playNote(osc, frequency) {
    osc.freq(frequency, 0.1);
    osc.start();
  }

  stopNote(osc) {
    if (osc.started) {
      osc.stop();
    }
  }
}