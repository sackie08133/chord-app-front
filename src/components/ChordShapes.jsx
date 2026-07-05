export const basic = {
  major: [
    {
      name: "Cmaj",
      notes: [0, 4, 7],
      voicing: [null, 3, 2, 0, 1, 0]
    },
    {
      name: "Dmaj",
      notes: [2, 6, 9],
      voicing: [null, null, 0, 2, 3, 2]
    },
    {
      name: "Emaj",
      notes: [4, 8, 11],
      voicing: [0, 2, 2, 1, 0, 0],
      barre: true
    },
    {
      name: "Fmaj",
      notes: [5, 9, 0],
      voicing: [1, 3, 3, 2, 1, 1],
      barre: true
    },
    {
      name: "Gmaj",
      notes: [7, 11, 2],
      voicing: [3, 2, 0, 0, 0, 3]
    },
    {
      name: "Amaj",
      notes: [9, 1, 4],
      voicing: [0, 0, 2, 2, 2, 0] // see note below — low E probably should be null
    },
    {
      name: "Bmaj",
      notes: [11, 3, 6],
      voicing: [2, 4, 4, 4, 4, 2] // see note below — low E probably should be null
    }
  ],
  minor: [
    {
      name: "Cmin",
      notes: [0, 3, 7],
      voicing: [null, 3, 5, 5, 4, 3]
    },
    {
      name: "Dmin",
      notes: [2, 5, 9],
      voicing: [null, null, 0, 2, 3, 1]
    },
    {
      name: "Emin",
      notes: [4, 7, 11],
      voicing: [0, 2, 2, 0, 0, 0]
    },
    {
      name: "Fmin",
      notes: [5, 8, 0],
      voicing: [1, 3, 3, 1, 1, 1]
    },
    {
      name: "Gmin",
      notes: [7, 10, 2],
      voicing: [3, 5, 5, 3, 3, 3]
    },
    {
      name: "Amin",
      notes: [9, 0, 4],
      voicing: [0, 0, 2, 2, 1, 0] // see note below — low E probably should be null
    },
    {
      name: "Bmin",
      notes: [11, 2, 6],
      voicing: [2, 3, 4, 4, 3, 2] // see note below — low E probably should be null
    }
  ]
}

