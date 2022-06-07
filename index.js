let sampler;

// We need a human gesture for audio playback to be enabled.
document.body.addEventListener("click", setup);

function setup() {

  // Remove listener, hide click messages and display device
  document.querySelector("h1").style.display = "none";
  document.querySelector("svg").style.display = "block";
  document.body.removeEventListener("click", setup);

  // Create sample player and map output to master
  sampler = new Tone.Sampler({
    baseUrl: "samples/",
    urls: {
      "E2":  "tom1.wav",         // PAD1
      "F2":  "tom2.wav",         // PAD2
      "F#2": "tom3.wav",         // PAD3
      "G2":  "crash.wav",        // PAD4
      "C2":  "kick.wav",         // PAD5
      "C#2": "snare-clap.wav",   // PAD6
      "D2":  "let-s-do-it.wav",  // PAD7
      "D#2": "hat.wav"           // PAD8
    }
  }).toDestination();

  // Since we are using it live, we do not want Tone.js to look ahead
  Tone.context.lookAhead = 0;

  // Enable WebMidi
  WebMidi.enable()
    .then(onMidiReady)
    .catch(err => console.error("WebMidi could not be enabled!"));

}

function onMidiReady() {

  // Fetch desired input device by name
  const synth = WebMidi.getInputByName("MPK mini 3");

  // Listen to MIDI 'note on' events from the synth
  synth.addListener('noteon', e => {

    // Play sound on sampler
    sampler.triggerAttack(e.note.identifier);

    // Flash pad
    const map = { 40: 1, 41: 2, 42: 3, 43: 4, 36: 5, 37: 6, 38: 7, 39: 8 };
    const pad = document.getElementById("pad" + map[e.note.number]);
    pad.style.opacity = "1";

    // Fade out the opacity
    new TinyTween({
      target: pad,
      from: {'style.opacity': 1},
      to: {'style.opacity': 0},
      duration: 350
    });

  });

}

