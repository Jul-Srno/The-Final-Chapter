// --------------------------------------------------
// IMPORTS
// --------------------------------------------------

import {
  UI,
  SOUNDS
} from "./config.js"

// --------------------------------------------------
// AUDIO / NARRATION
// --------------------------------------------------

// Handles synchronized visual typing, typing sound playback, and screen reader narration.
async function playNarration(text, speed = 120, soundRate = 1) {
  let currentText = "" 
  
  SOUNDS.sfx.typing.playbackRate = soundRate 
  SOUNDS.stop(SOUNDS.sfx.typing)
  SOUNDS.play(SOUNDS.sfx.typing,{ volume : 0.2 })

  for (let i = 0;  i < text.length;  i++) {
    currentText += text[i]
    UI.trueEndingText.textContent = currentText

  await new Promise(r => setTimeout(r, speed)) 
  }
  
  SOUNDS.stop(SOUNDS.sfx.typing)
}

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

export {
  playNarration
}