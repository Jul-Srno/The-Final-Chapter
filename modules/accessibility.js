// --------------------------------------------------
// IMPORTS
// --------------------------------------------------

import {
  UI,
  TIMINGS
} from "./config.js"

// --------------------------------------------------
// SCREEN READER ANNOUNCEMENTS
// --------------------------------------------------

// Updates the live region with one or more screen reader announcements.
function announceNarrative(content, delay = TIMINGS.endingSRDelay, log = true) {
  if (!UI.narrativeSR) return
  UI.narrativeSR.textContent = ""

  const texts = typeof content === "object"
    ? Object.values(content)
    : [content]

  texts.forEach((text, index) => {
    setTimeout(() => {
      UI.narrativeSR.textContent = text
      // Log narrative text to the console for player to read.
      if (log) {
        logNarrative(text)
      }
    }, delay * index)
  })
}

// --------------------------------------------------
// NARRATIVE CONSOLE LOGGING
// --------------------------------------------------

//Logs narrative text to the browser console as an alternative way to access the game's story.
function logNarrative(text) {
  console.log(text)
}

// --------------------------------------------------
// ENDING READER
// --------------------------------------------------

// Enable or disable keyboard access to the ending reader
function setEndingReaderBackUp(enabled) {
  if (!UI.endingReaderBackUp) return
  UI.endingReaderBackUp.tabIndex = enabled ? 0 : -1
}

// --------------------------------------------------
// KEYBOARD NAVIGATION
// --------------------------------------------------

 // Removes non-ending elements from the keyboard tab order
function setTrueEndingTabOrder() {
  UI.levelCounters.forEach(counter => {
    counter.tabIndex = -1
  })

  UI.crucifix.tabIndex = -1
}

// Restores the keyboard tab order for non-ending elements
function resetTrueEndingTabOrder() {
  UI.levelCounters.forEach(counter => {
    counter.tabIndex = 0
  })

  UI.crucifix.tabIndex = 0
}

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

export {
  announceNarrative,
  setEndingReaderBackUp,
  setTrueEndingTabOrder,
  resetTrueEndingTabOrder
}