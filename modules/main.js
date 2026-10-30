// --------------------------------------------------
// IMPORTS
// --------------------------------------------------

import {
  UI,
  SOUNDS,
  ENDING_TEXTS,
  ANNOUNCEMENTS,
  TIMINGS
} from "./config.js"

import {
  handleDoorClick,
  handleGameButton,
  loadGame,
  MODALS,
  runModalCloseCallbacks,
  closeModalUI,
  runModalAfterClose
} from "./gameplay.js"

import {
  removeDefaultButtonStyle,
  hide,
  showDoors,
  showAll,
  show,
  useDefaultButtonStyle
} from "./ui.js"

import {
  announceNarrative
} from "./accessibility.js"

// --------------------------------------------------
// EVENTS
// --------------------------------------------------

// Tracks whether the credits screen is currently displayed.
let creditsVisible = false

// Registers user interactions and UI event handlers for doors, buttons, credits, and modal dialogs.
document.addEventListener("click", () => {
  SOUNDS.warmUp(SOUNDS.music.final)
  SOUNDS.warmUp(SOUNDS.music.gameOver)
}, { once: true })

UI.doors.buttons.forEach((button, index) => {
  button.onclick = () => handleDoorClick(index)
})

UI.actionButton.onclick = handleGameButton

// Allows keyboard users to activate the focused modal or disclaimer with Enter.
document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return
  if (
    !event.target.closest(".modal") &&
    !event.target.closest(".disclaimer")
  ) return

  event.target.closest(".modal, .disclaimer")?.click()
})

if (UI.creditsButton) {
  UI.creditsButton.onclick = () => {
    if (!creditsVisible) {
      removeDefaultButtonStyle()
      hide(UI.actionButton)
      UI.trueEndingText.classList.add("credits")
      UI.trueEndingText.textContent = ENDING_TEXTS.credits
      announceNarrative(ANNOUNCEMENTS.credits.opening, TIMINGS.endingSRDelay, false)
      announceNarrative(ANNOUNCEMENTS.credits, TIMINGS.endingSRDelay, false)
      UI.creditsButton.textContent = "Back"
    } else {
      UI.trueEndingText.classList.remove("credits")
      UI.actionButton.classList.remove("hidden", "animation")
      UI.actionButton.style.opacity = "1"
      UI.trueEndingText.textContent = ENDING_TEXTS.lastSentence
      // Delay the announcement to allow the UI to update before the screen reader reads the return message.
      setTimeout(() => {
        announceNarrative(ANNOUNCEMENTS.returningFromCredits, TIMINGS.endingSRDelay, false) 
      }, 150)
      UI.creditsButton.textContent = "Credits"
    }
  creditsVisible = !creditsVisible 
  }
}

Object.values(MODALS).forEach(modal => {
  const element = modal.element
  
  element.addEventListener("click", () => {
    if (!modal.canClose) return
  
    UI.narrativeSR.textContent = ""
    runModalCloseCallbacks(modal)
    closeModalUI(modal)
    document.body.classList.remove("hidden")

    if (modal === MODALS.instructions || modal === MODALS.continueModal || modal === MODALS.hurted) {
      showDoors()
      showAll(UI.levelCounters)
      show(UI.header)
    }

  show(UI.actionButton)
  useDefaultButtonStyle()
  runModalAfterClose(modal)
  })
})

// --------------------------------------------------
// BOOTSTRAP
// --------------------------------------------------

// Start the game.
loadGame()