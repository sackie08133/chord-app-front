export const chordShapes = {
  major: [
    {
      name: "maj",
      formula: [0, 4, 7],
      shapes: [
        {
          id: "maj-6-root-e",
          rootString: 6,
          notes: [0, 4, 7],
          voicing: [0, 2, 2, 1, 0, 0],
          movable: true,
          barre: true,
          open: true,
          recommendedMuteOpenShapeEquivalent: true
        },
        {
          id: "maj-5-root-a",
          rootString: 5,
          notes: [0, 4, 7],
          voicing: [null, 0, 2, 2, 2, 0],
          movable: true,
          barre: true,
          open: true
        },
        {
          id: "maj-5-root-c-open",
          rootString: 5,
          notes: [0, 4, 7],
          voicing: [null, 3, 2, 0, 1, 0],
          movable: false,
          open: true
        },
        {
          id: "maj-4-root-d-open",
          rootString: 4,
          notes: [0, 4, 7],
          voicing: [null, null, 0, 2, 3, 2],
          movable: false,
          open: true
        },
        {
          id: "maj-6-root-g-open",
          rootString: 6,
          notes: [0, 4, 7],
          voicing: [3, 2, 0, 0, 0, 3],
          movable: false,
          open: true
        }
      ]
    }
  ],

  minor: [
    {
      name: "min",
      formula: [0, 3, 7],
      shapes: [
        {
          id: "min-6-root-e-open",
          rootString: 6,
          notes: [0, 3, 7],
          voicing: [0, 2, 2, 0, 0, 0],
          movable: false,
          open: true
        },
        {
          id: "min-5-root-a-open",
          rootString: 5,
          notes: [0, 3, 7],
          voicing: [null, 0, 2, 2, 1, 0],
          movable: false,
          open: true
        },
        {
          id: "min-4-root-d-open",
          rootString: 4,
          notes: [0, 3, 7],
          voicing: [null, null, 0, 2, 3, 1],
          movable: false,
          open: true
        },
        {
          id: "min-6-root-barre",
          rootString: 6,
          notes: [0, 3, 7],
          voicing: [0, 2, 2, 0, 0, 0],
          movable: true,
          barre: true
        },
        {
          id: "min-5-root-barre",
          rootString: 5,
          notes: [0, 3, 7],
          voicing: [null, 0, 2, 2, 1, 0],
          movable: true,
          barre: true
        }
      ]
    }
  ],

  seventh: [
    {
      name: "maj7",
      formula: [0, 4, 7, 11],
      shapes: [
        {
          id: "maj7-6-root",
          rootString: 6,
          notes: [0, 4, 7, 11],
          voicing: [0, null, 1, 1, 0, null],
          movable: true
        },
        {
          id: "maj7-5-root",
          rootString: 5,
          notes: [0, 4, 7, 11],
          voicing: [null, 0, 2, 1, 2, null],
          movable: true
        },
        {
          id: "maj7-4-root",
          rootString: 4,
          notes: [0, 4, 7, 11],
          voicing: [null, null, 0, 2, 2, 2],
          movable: true,
          barre: true
        }
      ]
    },
    {
      name: "7",
      formula: [0, 4, 7, 10],
      shapes: [
        {
          id: "dom7-6-root",
          rootString: 6,
          notes: [0, 4, 7, 10],
          voicing: [0, 2, 0, 1, 0, 0],
          movable: true,
          barre: true
        },
        {
          id: "dom7-5-root",
          rootString: 5,
          notes: [0, 4, 7, 10],
          voicing: [null, 0, 2, 0, 2, 0],
          movable: true,
          barre: true
        }
      ]
    },
    {
      name: "m7",
      formula: [0, 3, 7, 10],
      shapes: [
        {
          id: "m7-6-root",
          rootString: 6,
          notes: [0, 3, 7, 10],
          voicing: [0, 2, 0, 0, 0, 0],
          movable: true,
          barre: true
        },
        {
          id: "m7-5-root",
          rootString: 5,
          notes: [0, 3, 7, 10],
          voicing: [null, 0, 2, 0, 1, 0],
          movable: true,
          barre: true
        }
      ]
    },
    {
      name: "mMaj7",
      formula: [0, 3, 7, 11],
      shapes: [
        {
          id: "mmaj7-6-root",
          rootString: 6,
          notes: [0, 3, 7, 11],
          voicing: [0, 2, 1, 0, 0, 0],
          movable: true,
          barre: true
        },
        {
          id: "mmaj7-5-root",
          rootString: 5,
          notes: [0, 3, 7, 11],
          voicing: [null, 0, 2, 1, 1, 0],
          movable: true
        }
      ]
    }
  ],

  sixth: [
    {
      name: "6",
      formula: [0, 4, 7, 9],
      shapes: [
        {
          id: "6-6-root",
          rootString: 6,
          notes: [0, 4, 7, 9],
          voicing: [0, null, 2, 2, 2, null],
          movable: true
        },
        {
          id: "6-5-root",
          rootString: 5,
          notes: [0, 4, 7, 9],
          voicing: [null, 0, 2, 2, 2, 2],
          movable: true,
          barre: true
        }
      ]
    },
    {
      name: "m6",
      formula: [0, 3, 7, 9],
      shapes: [
        {
          id: "m6-6-root",
          rootString: 6,
          notes: [0, 3, 7, 9],
          voicing: [0, 2, 0, 2, 0, null],
          movable: true
        },
        {
          id: "m6-5-root",
          rootString: 5,
          notes: [0, 3, 7, 9],
          voicing: [null, 0, 1, 2, 1, 2],
          movable: true
        }
      ]
    }
  ],

  suspended: [
    {
      name: "sus2",
      formula: [0, 2, 7],
      shapes: [
        {
          id: "sus2-6-root",
          rootString: 6,
          notes: [0, 2, 7],
          voicing: [0, 2, 4, 4, 2, 0],
          movable: true,
          barre: true
        },
        {
          id: "sus2-5-root",
          rootString: 5,
          notes: [0, 2, 7],
          voicing: [null, 0, 2, 4, 0, 0],
          movable: true,
          barre: true
        }
      ]
    },
    {
      name: "sus4",
      formula: [0, 5, 7],
      shapes: [
        {
          id: "sus4-6-root",
          rootString: 6,
          notes: [0, 5, 7],
          voicing: [0, 2, 2, 2, 0, 0],
          movable: true,
          barre: true
        },
        {
          id: "sus4-5-root",
          rootString: 5,
          notes: [0, 5, 7],
          voicing: [null, 0, 2, 2, 3, 0],
          movable: true,
          barre: true
        },
        {
          id: "7sus4-4-root",
          rootString: 4,
          notes: [0, 5, 7, 10],
          voicing: [null, null, 0, 2, 1, 3],
          movable: true
        }
      ]
    }
  ],

  extended: [
    {
      name: "11",
      formula: [0, 4, 7, 10, 2, 5],
      shapes: [
        {
          id: "11-6-root-shell",
          rootString: 6,
          notes: [0, 4, 10, 5],
          voicing: [0, null, 0, 1, 0, 0],
          movable: true,
          omitted: [7, 2]
        }
      ]
    },
    {
      name: "m11",
      formula: [0, 3, 7, 10, 2, 5],
      shapes: [
        {
          id: "m11-6-root",
          rootString: 6,
          notes: [0, 3, 10, 5],
          voicing: [0, 2, 0, 0, 0, 0],
          movable: true,
          omitted: [7, 2]
        },
        {
          id: "m11-5-root",
          rootString: 5,
          notes: [0, 3, 10, 5],
          voicing: [null, 0, 2, 0, 3, 0],
          movable: true,
          omitted: [7, 2]
        }
      ]
    }
  ]
};


export const chordProgressions = {
  pop: [
    ["I", "V", "vi", "IV"],
    ["vi", "IV", "I", "V"],
    ["I", "vi", "IV", "V"],
    ["I", "IV", "V", "I"],
    ["I", "V", "IV", "V"],
    ["vi", "I", "V", "IV"],
    ["I", "iii", "IV", "V"],
    ["I", "IV", "vi", "V"],
    ["vi", "V", "IV", "V"],
    ["I", "vi", "iii", "IV"],
    ["IV", "I", "V", "vi"],
    ["I", "V", "vi", "iii"],
    ["I", "ii", "IV", "V"],
    ["I", "IV", "I", "V"],
    ["vi", "IV", "V", "I"],
    ["I", "V", "ii", "IV"],
    ["I", "iii", "vi", "IV"],
    ["IV", "V", "iii", "vi"],
    ["I", "IV", "ii", "V"],
    ["vi", "ii", "V", "I"],
    ["I", "V", "IV", "I"],
    ["IV", "I", "ii", "V"],
    ["I", "vi", "ii", "V"],
    ["I", "IV", "iii", "vi"],
    ["ii", "IV", "I", "V"]
  ],

  rock: [
    ["I", "bVII", "IV", "I"],
    ["I", "IV", "bVII", "I"],
    ["vi", "bVII", "I", "V"],
    ["I", "V", "bVII", "IV"],
    ["I", "bIII", "IV", "I"],
    ["IV", "I", "V", "IV"],
    ["I", "IV", "I", "V"],
    ["I", "bVII", "IV", "V"],
    ["i", "bVI", "bIII", "bVII"],
    ["I", "V", "vi", "III"],
    ["I", "bVII", "I", "IV"],
    ["I", "bVI", "bVII", "I"],
    ["I", "V", "IV", "bVII"],
    ["IV", "I", "bVII", "IV"],
    ["i", "bVII", "bVI", "bVII"],
    ["I", "bIII", "bVII", "IV"],
    ["I", "IV", "V", "IV"],
    ["I", "bVII", "IV", "bVII"],
    ["i", "bVI", "iv", "V"],
    ["i", "bIII", "bVI", "bVII"],
    ["I", "bVII", "V", "IV"],
    ["I", "IV", "bIII", "bVII"],
    ["I", "bVI", "IV", "V"],
    ["i", "VII", "VI", "VII"],
    ["I", "V", "IV", "I"]
  ],

  jazz: [
    ["ii7", "V7", "Imaj7"],
    ["iii7", "vi7", "ii7", "V7"],
    ["vi7", "ii7", "V7", "Imaj7"],
    ["Imaj7", "vi7", "ii7", "V7"],
    ["ii7", "V7", "iii7", "vi7"],
    ["IVmaj7", "iv6", "Imaj7", "VI7"],
    ["iiø7", "V7", "i7"],
    ["Imaj7", "III7", "vi7", "II7"],
    ["iii7", "VI7", "ii7", "V7"],
    ["Imaj7", "vi7", "ii7", "V7", "Imaj7"],
    ["vi7", "II7", "ii7", "V7"],
    ["Imaj7", "IVmaj7", "iii7", "VI7"],
    ["ii7", "V7", "Imaj7", "VI7"],
    ["iii7", "vi7", "ii7", "V7", "Imaj7"],
    ["Imaj7", "VI7", "ii7", "V7"],
    ["ii7", "V7", "Imaj7", "IVmaj7"],
    ["IVmaj7", "#iv°7", "iii7", "VI7"],
    ["iiø7", "V7", "i7", "VI7"],
    ["i7", "iv7", "VII7", "IIImaj7"],
    ["Imaj7", "vi7", "iii7", "VI7"],
    ["Imaj7", "#i°7", "ii7", "V7"],
    ["iii7", "bIII°7", "ii7", "V7"],
    ["ii7", "bII7", "Imaj7"],
    ["Imaj7", "bIII7", "ii7", "V7"],
    ["Imaj7", "I7", "IVmaj7", "iv6"]
  ],

  minor: [
    ["i", "iv", "V", "i"],
    ["i", "bVI", "bIII", "bVII"],
    ["i", "bVII", "bVI", "bVII"],
    ["i", "iv", "bVII", "III"],
    ["i", "VI", "III", "VII"],
    ["i", "VI", "iv", "V"],
    ["i", "iiø7", "V7", "i"],
    ["i", "bVI", "bVII", "i"],
    ["i", "v", "iv", "i"],
    ["i", "III", "VII", "VI"],
    ["i", "bIII", "bVI", "bVII"],
    ["i", "iv", "bVI", "V"],
    ["i", "VII", "bVI", "VII"],
    ["i", "bVII", "iv", "i"],
    ["i", "VI", "bVII", "i"],
    ["i", "iv", "i", "V"],
    ["i", "bVI", "iv", "bVII"],
    ["i", "III", "iv", "V"],
    ["i", "ii°", "V", "i"],
    ["i", "bVII", "bIII", "bVI"]
  ],

  neoSoul: [
    ["Imaj7", "iii7", "vi7", "ii7"],
    ["ii7", "V7", "Imaj7", "VI7"],
    ["Imaj7", "VI7", "ii7", "V7"],
    ["iii7", "vi7", "ii7", "V7"],
    ["Imaj7", "IVmaj7", "iii7", "vi7"],
    ["vi7", "V7/ii", "ii7", "V7"],
    ["Imaj7", "iii7", "IVmaj7", "iv6"],
    ["ii7", "iii7", "IVmaj7", "V7"],
    ["Imaj7", "vi7", "IVmaj7", "V7"],
    ["Imaj7", "V7/vi", "vi7", "IVmaj7"],
    ["Imaj7", "#ivø7", "iii7", "VI7"],
    ["ii7", "V7", "Imaj7", "iii7"],
    ["vi7", "ii7", "V7", "iii7"],
    ["IVmaj7", "iv6", "iii7", "VI7"],
    ["Imaj7", "ii7", "iii7", "IVmaj7"]
  ],

  turnarounds: [
    ["I", "vi", "ii", "V"],
    ["iii", "vi", "ii", "V"],
    ["Imaj7", "VI7", "ii7", "V7"],
    ["Imaj7", "iii7", "vi7", "ii7", "V7"],
    ["vi7", "ii7", "V7", "Imaj7"],
    ["I", "bIII", "ii", "V"],
    ["I", "#i°7", "ii", "V"],
    ["I", "VI7", "ii", "V"],
    ["iii7", "VI7", "ii7", "V7"],
    ["Imaj7", "vi7", "ii7", "V7"]
  ],

  cadences: [
    ["V", "I"],
    ["IV", "I"],
    ["V7", "Imaj7"],
    ["ii7", "V7", "Imaj7"],
    ["iiø7", "V7", "i"],
    ["IV", "V", "I"],
    ["iv", "V", "i"],
    ["bVII", "I"],
    ["IV", "iv", "I"],
    ["V", "vi"]
  ],

  modal: [
    ["I", "bVII", "IV", "I"],
    ["I", "bVI", "bVII", "I"],
    ["I", "IV", "bVII", "IV"],
    ["I", "bIII", "bVII", "I"], 
    ["i", "bII", "bVII", "i"],
    ["i", "bVI", "bVII", "i"],
    ["I", "II", "IV", "I"],
    ["I", "bVII", "I", "bVII"],
    ["i", "bVII", "IV", "i"],
    ["I", "bIII", "IV", "I"],
    ["I", "bVII", "bVI", "bVII"],
    ["i", "bVI", "iv", "V"],
    ["II", "I", "bVII", "IV"],
    ["i", "bIII", "bVI", "V"],
    ["I", "VII", "IV", "I"]
  ]
};