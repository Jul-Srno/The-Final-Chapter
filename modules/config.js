// --------------------------------------------------
// CONFIG
// --------------------------------------------------

// Centralizes references to the DOM elements used throughout the game.
const UI = {
  doors: {
    images: [
      document.getElementById("door1"),
      document.getElementById("door2"),
      document.getElementById("door3")
    ],
    
    buttons: document.querySelectorAll(".door-button"),

    frames: document.querySelectorAll(".door-frame"),
  
  },

  levelCounters: document.querySelectorAll(".level_counter"),

  header: document.querySelector(".header"),

  inventory: document.getElementById("inventory"),

  crucifix: document.querySelectorAll(".crucifix"),

  signature: document.querySelectorAll(".signature"),

  gameContent: document.getElementById("game_content"),

  actionButton: document.getElementById("action_button"),

  creditsButton: document.getElementById("credits"),

  trueEndingText: document.getElementById("trueEndingText"),

  narrativeSR: document.getElementById("narrativeSR"),

  // Accessible ending text for keyboard users and screen reader users
  endingReaderBackUp: document.getElementById("endingReaderBackUp"),
}

// Stores the texts displayed during the game's ending sequence and credits.
const ENDING_TEXTS = {
  intro: `The village erupts 
in cheers.

The children are safe!
`,

  statement: `You are no longer 
just a brave soul...
`,

  lastSentence: `You are a hero!`,

  credits: `
CREDITS

GAME DESIGN & DEVELOPMENT

D.. 
Programming
Game Design
Writing
Gameplay
Sound Design
Art Direction

Jul_Srno

───────────────

MUSIC

Original soundtrack
Composed and produced by Jul_Srno

Created with:
• Suno
• Stable Audio

SOUND EFFECTS

Original sound effects
Designed by Jul_Srno

Voice SFX generated with:
• ElevenLabs

───────────────

VISUAL ASSETS

Original visual direction
Image composition
Editing
Integration

Jul_Srno

Created and refined with AI assistance.

Several visual elements were inspired by, or based on, freely available reference material before being substantially reworked to fit the game's artistic direction.

Reference sources include:

• Public-domain backgrounds
(Piqsels)

• Haunted manuscript / instruction background
(Magnific)

• Anonymous gravestone
(Pixabay Thailand / Magnific)

• Ghost illustration
inspired by artwork by Leo Lintang
(123RF / Shutterstock)

• Christian cross icon
inspired by artwork by Ivan Ryabokon
(Vecteezy)

• Hurted modal background
inspired by generic Halloween decoration imagery.

───────────────

TYPOGRAPHY

Google Fonts

Cinzel Decorative
Cormorant Garamond
EB Garamond
IM Fell English
IM Fell English SC
Special Elite

───────────────

SPECIAL THANKS

To those
who chose courage
over certainty...

Some doors should never be opened.

Thank you for playing.

───────────────

LEGAL NOTICE

Every reasonable effort has been made to identify and credit the original creators whose freely available works inspired certain visual assets.

If you believe additional attribution should be given, please get in touch so it can be included in future versions.
`,
}

// Credits and final message prefixes.
const ANNOUNCEMENTS = {
  // Modals
  disclaimer: `
    This game contains sudden loud sounds and disturbing imagery.
    Not recommended for sensitive players 
    or those with heart conditions.
    To enjoy the narrative experience, activate your screen reader or open your browser console.

    Click here, or press Tab then Enter, to descend into the tomb
  `,

  instructions: `
    Some doors should never be opened…
  
    You descend into the ancient tomb, silent 
    and untouched for centuries… 
    Shadows stretch across the walls... 
    and the air feels heavy with memories of the past…

    Three doors lie ahead…
    Behind one... the vengeful ghost stirs, restless and merciless…
  
    Another shelters children... trembling but alive... 
    relying on your courage…    
    The third leads upward, to the next level of the tomb… 
    your path to survival…  

    Your mission... Find the captives and reach the exit, 
    without succumbing to the ghost…
    Every choice matters. One wrong step, 
    and this tomb may claim you… forever… 

    Activate this screen to begin... your fate lies 
    behind one of these doors.
  `,
  
  continueModal: `
    A Narrow Escape…
  
    The crucifix shields you... 
    sparing you from the ghost’s wrath... for now…

    You are shaken, but not defeated…
    Steady your heart, gather your courage, 
    and press further into the tomb…
    
    The children still wait… 
  
    Activate the button below the doors to continue your journey.
  `,
  
  hurted: `
    Grievous Wounds… 

    The crucifix saved you... but not without cost… 
    You have been severely hurt...  your protection lost… 
    The ghost still prowls the tomb... relentless… 
    You have only 30 seconds to rescue the children and reach the exit... or the darkness will claim you… 
  
    Activate the button beneath the doors to continue.
  `,

  ghostEncounter: `
    …You were never meant to see what lies beyond this door… 
    Activate this screen to meet your fate.
  `,
  
  gameOver: `
    From the earth you came...
    And to the earth you return… 
    Here you lie…
    When your courage returns... 
    Activate the button to descend once more.
  `,
  
  escapedDoor: `
    The darkness begins to fade…
    Beyond the ancient stones, a warm light finally reaches you… 
    You are free!
    Activate this screen to return to the village.
  `,
  
  outside: `
    You escaped the tomb…
    Yet the village greets your return in silence… 
    Some of the children were never found… The tomb still hides secrets yet to be uncovered…
    Activate the button below... should you dare enter the tomb again?.
  `,

  // Gameplay
  childrenFound: "You found the children!",
  
  staircase: "A staircase leads higher...",
  
  luckyDoor: "The door reveals only silence... You were lucky this time.",

  celebration: `
    You escaped the tomb…
    The village greets your return with joy and celebration…
    Every child has found the way home!
    …Activate the button below... the final pages of your story 
    have yet to be written.
  `,

  // True ending
  ending: {
    endingIntro: `
      The village erupts 
      in cheers... The children are safe!
    `,

    endingStatement:`
      You are no longer 
      just a brave soul...
    `,

    endingLastSentence: `You are a hero!`,

    endingNavigation: `
      To play again, click or press Shift+Tab to activate the play again button...
      To hear game credits, click or press Shift+Tab twice to activate the credits button.
      `
  },

  // Credits announcements object
  credits: {
    opening: `Opening credits...`,

    developement: `
      …GAME DESIGN & DEVELOPMENT…

      Design...
      Programming...
      Game Design...
      Writing...
      Gameplay...
      Sound Design...
      Art Direction...

      Jul_Srno…
    `,

    music: `
      MUSIC…

      Original soundtrack
      Composed and produced by Jul_Srno…

      Created with
      • Suno...
      • Stable Audio…

      SOUND EFFECTS…

      Original sound effects
      Designed by Jul_Srno…

      Voice SFX generated with:
      • ElevenLabs…
    `,

    visualAssets: `
      VISUAL ASSETS…

      Original visual direction...
      Image composition...
      Editing...
      Integration...

      Jul_Srno…

      Created and refined with AI assistance...
    `,

    visualReferences: `
      Several visual elements were inspired by, or based on, 
      freely available reference material before being substantially
      reworked to fit the game's artistic direction…

      Reference sources include...

      • Public-domain backgrounds
      (Piqsels)…

      • Haunted manuscript / instruction background
      (Magnific)…

      • Anonymous gravestone
      (Pixabay Thailand / Magnific)…

      • Ghost illustration
      inspired by artwork by Leo Lintang
      (123RF / Shutterstock)…

      • Christian cross icon
      inspired by artwork by Ivan Ryabokon
      (Vecteezy)…

      • Hurted modal background
      inspired by generic Halloween decoration imagery…
    `,

    typography: `
      TYPOGRAPHY…

      Google Fonts…

      Cinzel Decorative...
      Cormorant Garamond...
      EB Garamond...
      IM Fell English...
      IM Fell English SC...
      Special Elite...
    `,
  
    specialThanks: `
      SPECIAL THANKS...

      To those
      who chose courage
      over certainty...

      Some doors should never be opened…

      Thank you for playing…
    `,
  
    legal : `
      LEGAL NOTICE...

      Every reasonable effort has been made to identify and credit 
      the original creators whose freely available works inspired 
      certain visual assets…

      If you believe additional attribution should be given... 
      please get in touch so it can be included in future versions…

  `
  },

  returningFromCredits: `
    Returning to the final screen...
  `
}

  // Defines the configuration for each scene in the ending sequence.
const ENDING_SCENES = [
  {
    text: ENDING_TEXTS.intro,
    announcement: ANNOUNCEMENTS["ending"].endingIntro,
    speed: 120,
    rate: 0.95,
    pause: 1550
  },
  
  {
    text: ENDING_TEXTS.statement,
    announcement: ANNOUNCEMENTS["ending"].endingStatement,
    speed: 160,
    rate: 0.85,
    pause: 1700,
  },
  
  {
    text: ENDING_TEXTS.lastSentence,
    announcement: ANNOUNCEMENTS["ending"].endingLastSentence,
    speed: 200,
    rate: 0.75,
  }
]

// Centralizes audio assets and playback controls for music and sound effects.
const SOUNDS = {
  music: {
    tomb: new Audio("./resources/sound/Endless_Tomb_Loop.mp3"),
    hurted: new Audio("./resources/sound/Drums_hurted_sound.mp3"),
    gameOver: new Audio("./resources/sound/Here_you_lie.mp3"),
    nature: new Audio("./resources/sound/Forest_sound_ending.mp3"),
    celebration: new Audio("./resources/sound/Celebrations_sound_ending.mp3"),
    final: new Audio("./resources/sound/Victory_parade.mp3")
    },

  sfx: {
    children: new Audio("./resources/sound/Moving_children_sound_effect.mp3"),
    door1: new Audio("./resources/sound/Opening_door_sound_effect.mp3"),
    door2: new Audio("./resources/sound/Opening_door_sound_effect_2.mp3"),
    door3: new Audio("./resources/sound/Opening_door_sound_effect_3.mp3"),
    upstairs: new Audio("./resources/sound/Going_upstairs_sound_effect.mp3"),
    continueStinger: new Audio("./resources/sound/Continue_stinger_sound_effect.mp3"),
    ghostStinger: new Audio("./resources/sound/Ghost_stinger_sound_effect.mp3"),
    typing: new Audio("./resources/sound/Typing_sound.mp3")
    },
    
  play(sound, {
    time = 0,
    loop = false,
    volume = 1
  } = {}) {
    sound.currentTime = time 
    sound.loop = loop 
    sound.volume = volume 
    sound.play().catch(() => {}) 
  },

  stop(sound, time = 0) {
    sound.pause()
    sound.currentTime = time
  },
    
  playEndingMusic(state) {

    this.stop(this.music.tomb)
    this.stop(this.music.hurted)

    switch (state) {
      case STATES.LOSE:
        this.play(this.music.gameOver, {
          loop: true,
          volume: 0.2
        })
        break

      case STATES.WIN:
// The nature sound is already playing from the escaped modal.
// Increase its volume for the final victory screen.
        this.music.nature.volume = 0.2
        break

      case STATES.EPIC_WIN:
        this.stop(this.music.nature)
        this.play(this.music.celebration, {
          loop: true,
          volume: 0.2
        })
        break
    }
  },

  playStinger(stinger) {
    this.stop(this.sfx.upstairs)
    this.stop(this.music.tomb)
    this.stop(this.music.hurted)
    setTimeout(() => {
      this.play(stinger)
    }, Math.random() * TIMINGS.stingerRandomDelay)
  },

  playRandom(...sounds) {
    const randomIndex = Math.floor(Math.random() * sounds.length) 
    this.play(sounds[randomIndex], { volume: 0.25 })
  },
    
  warmUp(sound) {
    sound.volume = 0
    sound.play().then(() => {
      sound.pause()
      sound.currentTime = 0
      sound.volume = 1
    }).catch(() => {})
  }
}

// Defines the possible game states used to control the game flow.
const STATES = {
  INIT: "init",
  NEXT: "next",
  CONTINUE: "continue",
  HURTED: "hurted",
  WIN: "win",
  EPIC_WIN: "epicWin",
  LOSE: "lose",
  TIMEOUT: "timeOut"
}

// Maps each door type to its corresponding image asset.
const DOOR_IMAGES = {
  ghost: "./resources/images/ghost_door.png",
  kids: "./resources/images/kids_door.png",
  stairs: "./resources/images/stairs_door.png",
  closed: "./resources/images/closed_door.png"
}

// Defines the ghost encounter probability for each game level.
const GHOST_CHANCES = {
  1: 0.15,
  2: 0.25,
  3: 0.35,
  4: 0.50,
  5: 0.65,
  6: 0.75
}

// Defines the timing values used throughout the game flow and audio-visual interactions.
const TIMINGS = {
  modalCloseDelay: 700,
  stairTransition: 900,
  // Delay used to improve narrative flow, audio timing, and UI transitions
  narrationDelay: 1000,
  nextFloorDelay: 1200,
  endingSRDelay: 300,
  hurtedTimeout: 30000,
  stingerRandomDelay: 100
}

// Defines the background classes used for each ending state and screen orientation.
const BACKGROUNDS = {
  gameOver: {
    portrait_square: "game_over_portrait_square_background",
    landscape: "game_over_landscape_background"
  },

  victory: {
    portrait_square: "classic_win_portrait_square_background",
    landscape: "classic_win_landscape_background"
  },

  epicVictory: {
    portrait_square: "epic_win_portrait_square_background",
    landscape: "epic_win_landscape_background"
  },

  trueEnding: {
    portrait_square: "true_ending_portrait_square_background",
    landscape: "true_ending_landscape_background"
  }
}

// Defines the signature classes used for different game outcomes and visibility states.
const SIGNATURES = {
  hidden: "hidden",
  gameOver: "signature_game_over",
  win: "signature_win",
}

// Centralizes the current game state, player data, statistics, round data, timers, and door states.
const gameData = {
  state: STATES.INIT,

  player: {
    hurted: false,
    inventory: {
      crucifix: true
    }
  },

  stats: {
    runs: 0,
    wins: 0,
    loses: 0,
    epicWins: 0
  },

  round: {
    level: 1,

    procedural: {
      toss: 0,
      limit: 0
    },

    luckyActive: false,
    currentlyPlaying: true,
    numClosedDoors: 3,
    justHit: false
  },
  
  timers: {
    hurted: null
  },
  
  doors: []
}

let isModal = false // Tracks whether a modal is currently displayed.

// Updates whether a modal is currently open.
function setModalState(value) {
  isModal = value
}

// Defines the door layouts selected according to the procedural toss value.
const doorsPatterns = {
  low: [
    ["ghost", "kids", "stairs"],
    ["stairs", "ghost", "kids"],
    ["kids", "stairs", "ghost"]
  ],

  high: [
    ["ghost", "stairs", "kids"],
    ["kids", "ghost", "stairs"],
    ["stairs", "kids", "ghost"]
  ]
}

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

export {
  UI,
  ENDING_TEXTS,
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
  isModal,
  setModalState,
}