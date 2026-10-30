// --------------------------------------------------
// IMPORTS
// --------------------------------------------------

import {
  UI,
  ENDING_SCENES,
  ANNOUNCEMENTS,
  SOUNDS,
  STATES,
  DOOR_IMAGES,
  GHOST_CHANCES,
  TIMINGS,
  BACKGROUNDS,
  SIGNATURES,
  gameData,
  doorsPatterns,
  setModalState
} from "./config.js"

import {
  playNarration
} from "./audio.js"

import {
  announceNarrative,
  setEndingReaderBackUp,
  setTrueEndingTabOrder
} from "./accessibility.js"

import {
  show,
  hide,
  hideAll,
  hideDoors,
  setGameContentInert,
  removeDefaultButtonStyle,
  setCrucifixVisible,
  setSignatureClass,
  clearSignatureClasses,
  clearButtonClasses,
  clearBackgroundClasses,
  applyBackground,
  isLandscape,
  resetGameUI
} from "./ui.js"

// --------------------------------------------------
// GAMEPLAY HELPERS
// --------------------------------------------------

// Provides reusable helpers for game logic, door interactions, progression, encounters, and state transitions.

function logStats() {
  console.log(`
╔════════════════════════════════════╗
║      %c🕯️ TOMB LEDGER 🕯️%c        ║
╚════════════════════════════════════╝
       %cEntered the tomb%c  : %c${gameData.stats.runs}%c           
         %cEscaped%c            : %c${gameData.stats.wins}%c             
         %cLegendary escape%c   : %c${gameData.stats.epicWins > 0 ? `${gameData.stats.epicWins} 🏆` : gameData.stats.epicWins}%c             
         %cSlain by the ghost%c : %c${gameData.stats.loses}%c             
╔════════════════════════════════════╗
║  %c"The darkness keeps count…"%c  ║
╚════════════════════════════════════╝
  `, 
  "color: goldenrod  font-weight: bold  font-size: 14px ",
  "",
  " font-size: 13px ",
  "",
  "color: #e6dcc6  font-weight: bold ",
  "",
   "font-style: italic ",
  "",
  "color: lightgreen  font-weight: bold ",
  "",
   "font-style: italic ",
  "",
  "color: deepskyblue  font-weight: bold ",
  "",
   "font-style: italic ",
  "",
  "color: crimson  font-weight: bold ",
  "",
  "color: #8a7a5a  font-weight: bold  font-style: italic  font-size: 13px ",
"",)
}

function isGhost(door) {
  return door.type === "ghost" 
}

function getGhostChance(level) {
  let value = GHOST_CHANCES[level] ?? 0.85

  if (gameData.round.justHit) {
    value -= 0.08 
  }
  return value
}

function ghostDoorAttribution(toss) {
  const ghostIndex = Math.floor(Math.random() * 3) 

  const selectedPatterns = toss < 0.5
    ? doorsPatterns.low
    : doorsPatterns.high 

  gameData.doors = selectedPatterns[ghostIndex].map(type => ({ type, opened: false
    }))
}

function renderDoors() {
  gameData.doors.forEach((door, index) => {
    const img = UI.doors.images[index]
    img.src = door.opened
      ? DOOR_IMAGES[door.type]
      : DOOR_IMAGES.closed
  })
}

function handleDoorClick(index) {
  if (!gameData.round.currentlyPlaying) return 

  const door = gameData.doors[index] 

  if (door.opened) return 
  openDoor(door)
  playDoor(door, gameData.round.procedural.limit) 
}

function openDoor(door) {
  door.opened = true
  renderDoors()
}

function playDoor(door, limit) {
  if (!gameData.round.currentlyPlaying) return
  gameData.round.numClosedDoors--

  const isDoorGhost = isGhost(door) 
  handleNarration(door, isDoorGhost) 
  
  if (isDoorGhost) {
    ghostEncounter(limit) 
  } else {
    progressDoor(limit) 
  }
}

function handleNarration(door, isDoorGhost) {
  if (isDoorGhost) return

  if (door.type === "kids") {
    setTimeout(() => {
    announceNarrative(ANNOUNCEMENTS.childrenFound)
    }, TIMINGS.narrationDelay)
    
    SOUNDS.playRandom(SOUNDS.sfx.door1,SOUNDS.sfx.door2,SOUNDS.sfx.door3)
    SOUNDS.play(SOUNDS.sfx.children)
    
  } else if (door.type === "stairs") {
    setTimeout(() => {
    announceNarrative(ANNOUNCEMENTS.staircase)
    }, TIMINGS.narrationDelay)
    SOUNDS.playRandom(SOUNDS.sfx.door2,SOUNDS.sfx.door3,SOUNDS.sfx.door1)
  }
}

function ghostEncounter(limit) {
  const hadBonus = gameData.round.justHit
  
  if (hadBonus) {
    gameData.round.justHit = false 
  }
  
  if (Math.random() > getGhostChance(gameData.round.level)) {
    UI.actionButton.innerHTML = "Lucky!"
    gameData.round.luckyActive = true
    setTimeout(() => {
    announceNarrative(ANNOUNCEMENTS.luckyDoor)
    }, TIMINGS.narrationDelay)
    
    SOUNDS.playRandom(SOUNDS.sfx.door3,SOUNDS.sfx.door1,SOUNDS.sfx.door2)
    return
  } 
  
  if (gameData.player.inventory.crucifix && gameData.round.procedural.toss >= 0.66 && limit >= 5) {
    gameData.round.justHit = true
    nextState(STATES.HURTED)
    return
  }

  if (gameData.player.inventory.crucifix) {
    gameData.round.justHit = true
    nextState(STATES.CONTINUE)
    return
  } 
  nextState(STATES.LOSE)
}

function advanceToNextLevel() {
  gameData.round.level++
  nextState(STATES.NEXT)
}

function finishGame(limit) {
  if ( limit >= 6 &&
  (gameData.player.hurted ||
  gameData.player.inventory.crucifix)
  ) {
    nextState(STATES.EPIC_WIN)
  } else {
    nextState(STATES.WIN)
  }
}

function progressDoor(limit) {
  const doorsRemaining =
    gameData.round.luckyActive ? 0 : 1 

  if (gameData.round.numClosedDoors === doorsRemaining
  ) {
    if (gameData.round.level >= limit) {
      finishGame(limit)
      return
    }
  advanceToNextLevel()
  }
}

function hurtedPlayer() {
  if (!gameData.player.hurted) return
  setCrucifixVisible()
  gameData.timers.hurted = setTimeout(() => { 
    nextState(STATES.TIMEOUT)
  }, TIMINGS.hurtedTimeout) 
}

function cancelHurtedTimer() {
  if (gameData.timers.hurted !== null) {
    clearTimeout(gameData.timers.hurted) 
    gameData.timers.hurted = null 
  }
}

function setState(newState) {
  gameData.state = newState
  gameData.round.currentlyPlaying = false

  if (typeof stateHandlers[newState] === "function") {
    stateHandlers[newState]()
  } else {
    stateHandlers[newState]?.onEnter?.()
  }
}

function getStateConfig() {
  return stateHandlers[gameData.state]
}

function nextState(state) {
  setState(state)
  setCrucifixVisible()
}

function handleGameButton() {
  if (gameData.round.currentlyPlaying) return 

  if (
    gameData.state === STATES.NEXT ||
    gameData.state === STATES.CONTINUE ||
    gameData.state === STATES.HURTED
  ) {
    if (gameData.state === STATES.NEXT) {
      SOUNDS.play(SOUNDS.sfx.upstairs)
      setTimeout(() => {
        launchRound()
      }, TIMINGS.stairTransition)
    return
  }
    launchRound()
  } else {
    gameData.stats.runs++
    logStats()
    startGame()
  }
}

// --------------------------------------------------
// STATE MANAGEMENT
// --------------------------------------------------

// Defines the configuration and entry behavior for each game state.
const stateHandlers = {
  [STATES.NEXT]: {
    buttonText: "Go on",

    onEnter() {
        UI.actionButton.innerHTML = this.buttonText
    }
  },
    
  [STATES.CONTINUE]: {
    buttonText: "Beware...",

    onEnter() {
      UI.actionButton.innerHTML = this.buttonText
      gameData.player.inventory.crucifix = false
      modalManager(MODALS.continueModal)
    }
  },
    
  [STATES.HURTED]: {
    buttonText: "Hurry up !",

    onEnter() {
      UI.actionButton.innerHTML = this.buttonText
      gameData.player.inventory.crucifix = false
      gameData.player.hurted = true
      modalManager(MODALS.hurted)
    }
  },

  [STATES.WIN]: {
    buttonText: "Nice try !",
    background: BACKGROUNDS.victory,
    signature: SIGNATURES.win,
    announcement: ANNOUNCEMENTS.outside,

    buttonClass: {
      portrait_square: "victory-portrait_square",
      landscape: "victory-landscape"
    },

    onEnter() {
      cancelHurtedTimer()
      gameData.player.inventory.crucifix = false
      gameData.stats.wins++
      modalManager(MODALS.escaped)
    }
  },

  [STATES.EPIC_WIN]: {
    buttonText: "You triumphed !",
    background: BACKGROUNDS.epicVictory,
    signature: SIGNATURES.hidden,
    announcement: ANNOUNCEMENTS.celebration,

    buttonClass: {
      portrait_square: "victory-portrait_square",
      landscape: "victory-landscape"
    },

    extraClass: "epic-victory",

    onEnter() {
      cancelHurtedTimer()
      UI.actionButton.onclick = showTrueEnding
      gameData.player.inventory.crucifix = false
      gameData.stats.epicWins++
      modalManager(MODALS.escaped)
    }
  },

  [STATES.LOSE]: {
    buttonText: "Here you lie",
    background: BACKGROUNDS.gameOver,
    signature: SIGNATURES.gameOver,
    announcement: ANNOUNCEMENTS.gameOver,

    buttonClass: {
      portrait_square: "game-over-portrait_square",
      landscape: "game-over-landscape"
    },

    onEnter() {
      cancelHurtedTimer()
      gameData.stats.loses++
      modalManager(MODALS.ghost)
    }
  },

  [STATES.TIMEOUT]: {
    onEnter() {
      gameData.stats.loses++
      gameOverBackground()
    }
  }
}

// --------------------------------------------------
// GAME FLOW
// --------------------------------------------------

// Manages the main game flow, from run initialization and round setup to game start and initial loading.

function generateRunParameters() {
  // Randomizes the door pattern and the number of levels required to complete the run.
  gameData.round.procedural.toss = Math.random()
  gameData.round.procedural.limit = Math.floor((Math.random() * 3) + 5)
}

function initializePlayer() {
  gameData.player.inventory.crucifix = true
  gameData.player.hurted = false
  setCrucifixVisible()
}

function initializeRun() {
  gameData.round.level = 1
  generateRunParameters()
}

function initializeRound() {
  UI.levelCounters.forEach(el => {
    el.textContent = `level : ${gameData.round.level}`
  })

  gameData.round.luckyActive = false
  gameData.round.numClosedDoors = 3
  ghostDoorAttribution(gameData.round.procedural.toss)
  renderDoors()
}

function enableRound() {
  if (
    gameData.state === STATES.NEXT &&
    !gameData.player.hurted
  ) {
    setTimeout(() => {
      gameData.round.currentlyPlaying = true
    }, TIMINGS.nextFloorDelay)
  } else {
    gameData.round.currentlyPlaying = true
  }
}

function launchRound() {
  initializeRound()
  enableRound()
  UI.actionButton.innerHTML = "Good Luck"
}

function startGame() {
  gameData.state = STATES.INIT
  resetGameUI()
  cancelHurtedTimer()
  UI.actionButton.onclick = handleGameButton
  SOUNDS.play(SOUNDS.music.tomb, { loop: true, volume: 0.15 })
  initializePlayer()
  initializeRun()
  launchRound()
}

function loadGame() {
  if (UI.creditsButton) {
  hide(UI.creditsButton)
}

  generateRunParameters()
  ghostDoorAttribution(gameData.round.procedural.toss)
  renderDoors()
  nextState(STATES.INIT)
  gameData.round.currentlyPlaying = true
  setSignatureClass(SIGNATURES.hidden)
  UI.levelCounters.forEach(elem => { 
    elem.textContent = "level : 1"
  })
 
  modalManager(MODALS.disclaimer)
}

// --------------------------------------------------
// MODAL HELPERS
// --------------------------------------------------

// Provides reusable helpers for preparing, opening, closing, and coordinating modal dialogs and their associated callbacks.

// Defines the configuration and lifecycle callbacks for each modal.
const MODALS = {

  disclaimer: {
    element: document.getElementById("disclaimer_modal"),
    narration: ANNOUNCEMENTS.disclaimer,
    logNarrative: false,

    onOpen() {
      document.body.classList.add("disclaimer") 
    },

    onClose() {},
    
    afterClose() {
      document.body.classList.remove("disclaimer")
      modalManager(MODALS.instructions)
      gameData.stats.runs++
      logStats()
    }
  },

  instructions: {
    element: document.getElementById("instructions_modal"),
    narration: ANNOUNCEMENTS.instructions,
    logNarrative: false,

    onOpen() {
      SOUNDS.play(SOUNDS.music.tomb, {
        loop: true,
        volume: 0.3
      }) 
    },

    onClose() {
    }
  },

  continueModal: {
    element: document.getElementById("continue_modal"),
    narration: ANNOUNCEMENTS.continueModal,
    logNarrative: false,

    onOpen() {
      SOUNDS.playStinger(SOUNDS.sfx.continueStinger)
    },

    onClose() {
      SOUNDS.play(SOUNDS.music.tomb, {
        loop: true,
        volume: 0.3
      })
    }
  },

  hurted: {
    element: document.getElementById("hurted_modal"),
    narration: ANNOUNCEMENTS.hurted,
    logNarrative: false,

    onOpen() {
      document.body.classList.add("red-tint")

      SOUNDS.stop(SOUNDS.music.tomb) 

      SOUNDS.play(SOUNDS.music.hurted, {
        loop: true,
        volume: 0.7
      })
    },

    onClose() {
      hurtedPlayer() 
    }
  },

  ghost: {
    element: document.getElementById("ghost_modal"),

    narration: ANNOUNCEMENTS.ghostEncounter,

    onOpen() {
      SOUNDS.playStinger(SOUNDS.sfx.ghostStinger)
    },

    onClose() {},
    
    afterClose() {
        gameOverBackground()
    }
},

  escaped: {
    element: document.getElementById("escaped_modal"),

    narration: ANNOUNCEMENTS.escapedDoor,

    onOpen() {
      SOUNDS.play(SOUNDS.music.nature, {
        loop: true,
        volume: 0.02
      })
    },

    onClose() {},
    
    afterClose() {
        victoryBackground()
    }
  }
}

function prepareModal(element, modal) {
  UI.narrativeSR.textContent = ""
  document.body.classList.add("hidden")
  modal.canClose = false
  element.style.cursor = "default"

  setTimeout(() => {
    modal.canClose = true
    element.style.cursor = "pointer"
  }, TIMINGS.modalCloseDelay)
}

function runModalCallbacks(modal) {
  modal.onOpen?.()
    
  if (modal.narration) {
    //Delay the modal announcement to ensure the screen reader has time to process the modal opening
    setTimeout(() => { 
      announceNarrative(modal.narration, 
      TIMINGS.narrationDelay, 
      modal.logNarrative !== false) 
    }, 300)
  }
}

function runModalCloseCallbacks(modal) {
  modal.onClose?.()
}

function runModalAfterClose(modal) {
  modal.afterClose?.()
}

function openModalUI(modal) {
  const element = modal.element
  element.tabIndex = 0

  setModalState(true)
  setGameContentInert(true)
  setCrucifixVisible()
  element.style.display = "flex"
  element.setAttribute("aria-hidden", "false")
  hideDoors()
  hide(UI.header)
  hideAll(UI.levelCounters)
  removeDefaultButtonStyle()
  hide(UI.actionButton)
}

function closeModalUI(modal) {
  const element = modal.element
  element.tabIndex = -1

  setModalState(false)
  setGameContentInert(false)
  setCrucifixVisible()
  element.style.display = "none"
  document.activeElement.blur()
  element.setAttribute("aria-hidden", "true")
  }

function modalManager(modal) {
  const element = modal.element
  prepareModal(element, modal)
  openModalUI(modal)
  runModalCallbacks(modal)
}

// --------------------------------------------------
// ENDING HELPERS
// --------------------------------------------------

// Provides reusable helpers for configuring ending screens, applying their visual and audio presentation, and displaying the true ending sequence.

function announceEnding() {
  const config = getStateConfig()
  if (!config) return
  announceNarrative(config.announcement, TIMINGS.narrationDelay)
}

function configureSignature() {
  clearSignatureClasses()
  const config = getStateConfig()
  if (!config) return
  setSignatureClass(config.signature)
}

function applyEndingButton() {
  clearButtonClasses()
  removeDefaultButtonStyle()
    
  const config = getStateConfig()
  if (!config) return

  UI.actionButton.innerHTML = config.buttonText

  if (config.extraClass) {
    UI.actionButton.classList.add(config.extraClass)
  }

  UI.actionButton.classList.add(
    isLandscape()
    ? config.buttonClass.landscape
    : config.buttonClass.portrait_square
  )
}

function applyEnding() {
  UI.narrativeSR.textContent = ""
  applyBackground(getStateConfig().background)
  configureSignature()
  applyEndingButton()
  //Delay the ending announcement to allow the background and UI transitions to settle before the scren reader reads it
  setTimeout(announceEnding,TIMINGS.narrationDelay)
  SOUNDS.playEndingMusic(gameData.state)
}

function gameOverBackground() {
  setGameContentInert(true)
  clearBackgroundClasses()
  document.body.classList.remove("red-tint")
  gameData.state = STATES.LOSE
  hideDoors() 
  hide(UI.header) 
  hideAll(UI.levelCounters)
  applyEnding()
}

function victoryBackground() {
  setGameContentInert(true)
  clearBackgroundClasses()
  document.body.classList.remove("red-tint")
  applyEnding()
}

function prepareTrueEnding() {
  UI.narrativeSR.textContent = ""
  clearBackgroundClasses()
  clearSignatureClasses()
  removeDefaultButtonStyle()
  hide(UI.actionButton)
  SOUNDS.stop(SOUNDS.music.celebration)
  applyBackground(BACKGROUNDS.trueEnding)
}

function showTrueEndingUI() {
  UI.signature.forEach(sig => {
    sig.classList.remove("hidden")
  })
  
  clearButtonClasses()
  removeDefaultButtonStyle()
  setTrueEndingTabOrder()

  UI.actionButton.classList.add("true_ending_button", "animation")
  UI.actionButton.addEventListener("animationend", () => {
    UI.actionButton.classList.remove("animation")
    UI.actionButton.style.opacity = "1"
  }, { once: true })

  show(UI.creditsButton)

  UI.actionButton.textContent = "Thanks for playing !"

  // Make the full ending text available to keyboard and screen reader users
  UI.endingReaderBackUp.textContent = Object.values(ANNOUNCEMENTS.ending).join(" ")
  setEndingReaderBackUp(true)

  SOUNDS.play(SOUNDS.music.final, {
    loop: true,
    volume: 0.4
  })
  UI.actionButton.onclick = startGame
}

async function playEndingScenes() {

  for (const scene of ENDING_SCENES) {
    UI.trueEndingText.textContent = ""
    UI.trueEndingText.classList.add("typing")
    await playNarration(
      scene.text,
      scene.speed,
      scene.rate
    )
    
    announceNarrative(scene.announcement, 0, false)

    UI.trueEndingText.classList.remove("typing")

    if (scene.pause) {
      await new Promise(resolve =>
      setTimeout(resolve, scene.pause)
      )
    }
  }
}

async function showTrueEnding() {
  prepareTrueEnding()
  await playEndingScenes()
  showTrueEndingUI()
}

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

export {
  handleDoorClick,
  handleGameButton,
  loadGame,
  MODALS,
  runModalCloseCallbacks,
  closeModalUI,
  runModalAfterClose
}