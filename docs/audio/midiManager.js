const NOTE_ON = 144;
const NOTE_OFF = 128;

const NOTE_MAX = 72;
const NOTE_MIN = 48;
const MAX_NOTE_INDEX = NOTE_MAX - NOTE_MIN;

class MIDIManager {
  static initialize() {
    MIDIManager.osc = new p5.Oscillator('sine');
    MIDIManager.osc.amp(0.5, 0.1);
  }

  static connectToMIDIDevice() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(function (access) {

          // Get lists of available MIDI controllers
          const inputs = access.inputs.values();

          for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            if (platformManager.mode !== MIDI_MODE) {
              platformManager.enableMIDIMode();
            }
            // each time there is a midi message call the onMIDIMessage function
            input.value.onmidimessage = MIDIManager.onMIDIMessage;
          }

          const outputs = access.outputs.values();

          access.onstatechange = function (e) {

            // Print information about the (dis)connected MIDI controller
            console.log(e.port.name, e.port.manufacturer, e.port.state);
          };
        }, function () {
          console.log('Failed to access MIDI devices');
        });
    } else {
      console.log('Browser does not support WebMIDI!');
    }
  }

  static onMIDIMessage(message) {
    let eventType = message.data[0];
    let note = message.data[1];
    let frequency = MIDIManager.midiNoteToFrequency(note);
    let velocity = message.data[2];

    if (!isPaused) {
      if (eventType === NOTE_ON && velocity > 0) {
        platformManager.createPlatformAtHeight(map(note, NOTE_MIN, NOTE_MAX, height, 0));

        MIDIManager.playNote(frequency);
      }
    }

    if (eventType === NOTE_OFF || velocity === 0) {
      MIDIManager.stopNote(frequency);
    }
  }


  static midiNoteToFrequency(note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
  }


  static playNote(frequency) {
    MIDIManager.osc.freq(frequency, 0.1);
    MIDIManager.osc.start();
  }


  static stopNote(frequency) {
    MIDIManager.osc.stop();
  }
}