// --------------------------------------------------
// IMPORTS
// --------------------------------------------------

import {
  UI,
  SOUNDS,
  SIGNATURES,
  BACKGROUNDS,
  gameData,
  isModal
} from "./config.js"

import { 
  setEndingReaderBackUp,
  resetTrueEndingTabOrder
} from "./accessibility.js"

// --------------------------------------------------
// UI HELPERS
// --------------------------------------------------

// Provides reusable helpers for showing, hiding, and updating UI elements and visual states.
function show(element) {
  element.classList.remove("hidden")
}

function hide(element) {
  element.classList.add("hidden")
}

function showAll(elements) {
  elements.forEach(show)
}

function hideAll(elements) {
  elements.forEach(hide)
}

function showDoors() {
  UI.doors.frames.forEach(door => {
    door.classList.remove("hidden")
    door.classList.add("visible")
  })
}

function hideDoors() {
  UI.doors.frames.forEach(door => {
    door.classList.add("hidden")
    door.classList.remove("visible")
  })
}

// Enable or disable interactions with the game content.
function setGameContentInert(bool) {
  if (!UI.gameContent) return
  UI.gameContent.inert = bool
}

function useDefaultButtonStyle() {
  UI.actionButton.classList.add("default_style")
}

function removeDefaultButtonStyle() {
  UI.actionButton.classList.remove("default_style")
}

// Updates crucifix visibility according to the player's inventory and modal state.
function setCrucifixVisible() {
  UI.crucifix.forEach(c => {
    if (gameData.player.inventory.crucifix && !isModal) {
      c.classList.remove("hidden") 
    } else {
      c.classList.add("hidden") 
    }
  }) 
}

// Applies the requested signature class while resetting the previous signature styling.
function setSignatureClass(className) {
  UI.signature.forEach(sig => {
    sig.className = "signature"
    if (className) {
    sig.classList.add(className)
  }
 })
}

// Removes all ending-related signature classes.
function clearSignatureClasses() {
  UI.signature.forEach(sig => {
    sig.classList.remove(
      SIGNATURES.gameOver,
      SIGNATURES.win
    ) 
  }) 
}

// Removes all ending and special-state classes from the main button.
function clearButtonClasses() {
  UI.actionButton.classList.remove(
    "game-over-landscape",
    "game-over-portrait_square",
    "victory-landscape",
    "victory-portrait_square",
    "epic-victory",
    "true_ending_button",
    "last_screen",
    "hidden"
  )
}

// Removes all registered ending background classes from the document body.
function clearBackgroundClasses() {
  document.body.classList.remove(
    BACKGROUNDS.gameOver.landscape,
    BACKGROUNDS.gameOver.portrait_square,
    BACKGROUNDS.victory.landscape,
    BACKGROUNDS.victory.portrait_square,
    BACKGROUNDS.epicVictory.landscape,
    BACKGROUNDS.epicVictory.portrait_square,
    BACKGROUNDS.trueEnding.landscape,
    BACKGROUNDS.trueEnding.portrait_square
)}

// Applies the appropriate portrait or landscape background for the current screen orientation.
function applyBackground(background) {
  clearBackgroundClasses()
  document.body.classList.add(
    isLandscape()
    ? background.landscape
    : background.portrait_square
  )
}

// --------------------------------------------------
// LAYOUT HELPERS
// --------------------------------------------------

// Provides reusable helpers for detecting the current screen orientation.
function isLandscape() {
  return window.innerWidth > window.innerHeight 
}

function isPortrait() {
  return window.innerHeight > window.innerWidth
}

// --------------------------------------------------
// RESET HELPERS
// --------------------------------------------------

// Provides reusable helpers for resetting audio, ending screens, controls, visual elements, and gameplay UI before a new game.

function resetMusic() {
  for (const song of Object.values(SOUNDS.music)) {
  SOUNDS.stop(song)
  }
}

function resetEndingUI() {
  // Prevent TalkBack from replaying the previous live announcement.
  UI.narrativeSR.textContent = ""
  UI.trueEndingText.textContent = ""
  UI.endingReaderBackUp.textContent = ""
  setEndingReaderBackUp(false)
}

function resetButtonUI() {
  UI.actionButton.style.opacity = ""
  clearButtonClasses()
  useDefaultButtonStyle()
  show(UI.actionButton)
}

function resetCreditsUI() {
  if (!UI.creditsButton) return
  hide(UI.creditsButton)
  UI.creditsButton.textContent = "Credits"
}

function resetVisuals() {
  clearBackgroundClasses()
  clearSignatureClasses()
  setSignatureClass(SIGNATURES.hidden)
  document.body.classList.remove("red-tint")
}

function resetGameplayUI() {
  showDoors()
  setGameContentInert(false)
  resetVisuals()
  showAll(UI.levelCounters)
  show(UI.header)
  show(UI.inventory)
  setCrucifixVisible()
}

function resetGameUI() {
  resetMusic()
  resetButtonUI()
  resetCreditsUI()
  resetEndingUI()
  resetTrueEndingTabOrder()
  resetGameplayUI()
}

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

export {
  show,
  hide,
  showAll,
  hideAll,
  showDoors,
  hideDoors,
  setGameContentInert,
  useDefaultButtonStyle,
  removeDefaultButtonStyle,
  setCrucifixVisible,
  setSignatureClass,
  clearSignatureClasses,
  clearButtonClasses,
  clearBackgroundClasses,
  applyBackground,
  isLandscape,
  isPortrait,
  resetMusic,
  resetEndingUI,
  resetButtonUI,
  resetCreditsUI,
  resetVisuals,
  resetGameplayUI,
  resetGameUI
}