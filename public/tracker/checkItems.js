const checkItems = { 
    // Please be aware that some locked checks might be easy to get meaning that this structure isn't going to be accurate for now.
    // I am working on making sure that this structure is accurate especially for autotracking and new users.
    "Silver Rupee": {
        cat: 'gear',
        id: 'rupee_silver',
        counts: [0]
    },
    "Hylian Shield": {
        cat: 'gear',
        id: 'shield-2'
    },
    "Monster Tail": {
        cat: 'gear',
        id: 'tail'
    },
    "Empty Bottle": {
        cat: 'items',
        id: 'bottle',
        counts: [0, 0, 5]
    },
    "Red Rupee": {
        cat: 'gear',
        id: 'rupee_red',
        counts: [0]
    },
    "Monster Horn": {
        cat: 'gear',
        id: 'horn',
        counts: [0]
    },
    "Monster Guts": {
        cat: 'gear',
        id: 'guts',
        counts: [0]
    },
    "Piece of Heart": {
        cat: 'gear',
        id: 'heart',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true,
        startImageCountAt0: true
    },
    "Lost Maiamai": {
        cat: 'gear',
        id: 'maiamai',
        counts: [0, 0, 100],
    },
    "Gold Rupee": {
        cat: 'gear',
        id: 'rupee_gold',
        counts: [0]
    },
    Sword: {
        cat: 'gear',
        id: 'sword',
        counts: [1, 1, 4],
        dontShowCount: true,
        hasImageWithCount: true
    },
    "Heart Container": {
        cat: 'gear',
        id: 'heart-container',
        counts: [0, 0, 10]
    },
    Net: {
        cat: 'items',
        id: 'net',
        counts: [0, 0, 2],
        dontShowCount: true,
        hasImageWithCount: true
    },
    Lamp: {
        cat: 'items',
        id: 'lamp',
        counts: [0, 0, 2],
        dontShowCount: true,
        hasImageWithCount: true
    },
    Bow: {
        cat: 'items',
        id: 'bow',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true
    },
    Mail: {
        cat: 'gear',
        id: 'mail',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true
    },
    "Purple Rupee": {
        cat: 'gear',
        id: 'rupee_purple',
        counts: [0]
    },
    "Green Rupee": {
        cat: 'gear',
        id: 'rupee_green',
        counts: [0]
    },
    "Great Spin": {
        cat: 'gear',
        id: 'great_spin'
    },
    "Blue Rupee": {
        cat: 'gear',
        id: 'rupee_blue',
        counts: [0]
    },
    "Scoot Fruit": {
        cat: 'items',
        id: 'scoot-fruit',
        counts: [0]
    },
    "Foul Fruit": {
        cat: 'items',
        id: 'foul-fruit',
        counts: [0]
    },
    Shield: {
        cat: 'gear',
        id: 'shield-1'
    },
    Bombs: {
        cat: 'items',
        id: 'bombs',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true
    },
    "Ravio's Bracelet": {
        cat: 'gear',
        id: 'bracelet',
        counts: [0, 0, 2],
        dontShowCount: true,
        hasImageWithCount: true,
        unlockChecks2: [ 
            // Ravio's Bracelet unlocks a ton of checks (mainly in Lourle and bits in Hyrule). 
            // If there are any checks that don't get instantly unlocked after you get Ravio's Bracelet, 
            // please report the bug to me via discord. My username is josephalt7000
            "[Mai] Behind Your House",
            "[Mai] Eastern Ruins Wall",
            "[Mai] Outside Maiamai Cave",
            "[Mai] Fortune-Teller Tent",
            "[Mai] Rosso Wall",
            "[Mai] Sanctuary Wall",
            "[Mai] Witch's House",
            "[Mai] Hyrule Rupee Rush Wall",
            "Thieves' Town Item Shop (1)",
            "Thieves' Town Item Shop (2)",
            "Thieves' Town Item Shop (3)",
            "Thieves' Town Item Shop (4)",
            "Thieves' Town Weather Vane",
            "Octoball Derby",
            "Vacant House Weather Vane",
            "Vacant House",
            "Thief Girl",
            "[Mai] Lorule Graveyard Wall",
            "Lorule Castle Weather Vane",
            "[Mai] Lorule Castle Wall",
            "[Mai] Lorule S Ruins Wall",
            "Skull Woods Weather Vane",
            "Eastern Ruins Merge Chest",
            "[Mai] Rosso Wall",
            "Fortune's Choice",
            "[Mai] Lorule Blacksmith Wall",
            "[Mai] Lorule Haunted Grove Wall",
            "[Mai] Lorule Rupee Rush Wall",
            "[Mai] Thieves' Town Wall",
            "[Mai] Behind Vacant House",
            "[Mai] Thieves' Town Wall"
        ],
    },
    Charm: {
        cat: 'gear',
        id: 'pendant_charm'
    },
    "Fire Rod": {
        cat: 'items',
        id: 'frod',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true
    },
    "Ice Rod": {
        cat: 'items',
        id: 'irod',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true
    },
    Quake: {
        cat: 'others',
        id: 'quake'
    },
    "Bee Badge": {
        id: "badge",
        cat: "gear"
    },
    "Hyrule Sewers Key": {},
    "Master Ore": {
        id: 'master_ore',
        cat: "others",
        counts: [0, 0, 4]
    },
    "Hint Glasses": {
        id: "hint-glasses",
        cat: "items"
    },
    Hookshot: {
        cat: 'items',
        id: 'hookshot',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true
    },
    "Tornado Rod": {
        cat: 'items',
        id: 'trod',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true
    },
    Boomerang: {
        cat: 'items',
        id: 'boomerang',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true
    },
    Bee: {
        cat: 'items',
        id: 'bottle_bee',
        count: [0]
    },
    "Golden Bee": {
        cat: 'items',
        id: 'bottle_bee_golden',
        count: [0]
    },
    Fairy: {
        cat: 'items',
        id: 'bottle_fairy',
        count: [0]
    },
    "Zora's Flippers": {
        cat: 'gear',
        id: 'flippers'
    },
    "Dark Palace Small Key": {},
    "Dark Palace Big Key": {},
    "Dark Palace Compass": {},
    Glove: {
        cat: 'gear',
        id: 'mitt',
        counts: [0, 0, 2],
        dontShowCount: true,
        hasImageWithCount: true
    },
    Hammer: {
        cat: 'items',
        id: 'hammer',
        counts: [0, 0, 2],
        dontShowCount: true,
        hasImageWithCount: true
    },
    "Sage Oren": {
        cat: 'gear',
        id: 'sage-oren'
    },
    "Desert Palace Small Key": {},
    "Pegasus Boots": {
        cat: 'gear',
        id: 'boots'
    },
    "Desert Palace Big Key": {},
    "Sand Rod": {
        cat: 'items',
        id: 'srod',
        counts: [0, 0, 3],
        dontShowCount: true,
        hasImageWithCount: true
    },
    "Bow of Light": {
        cat: 'items',
        id: 'bow-of-light'
    },
    "Desert Palace Compass": {},
    "Pendant of Courage": {},
    "Eastern Palace Small Key": {},
    "Eastern Palace Big Key": {},
    "Stamina Scroll": {
        id: 'scroll',
        cat: 'gear'
    },
    "Sage Rosso": {
        cat: 'gear',
        id: 'sage-rosso'
    },
    "Eastern Palace Compass": {},
    "House of Gales Compass": {},
    "House of Gales Small Key": {},
    "House of Gales Big Key": {},
    "Sage Seres": {
        cat: 'gear',
        id: 'sage-seres'
    },
    "Ice Ruins Small Key": {},
    "Ice Ruins Big Key": {},
    "Ice Ruins Compass": {},
    Bell: {
        cat: 'gear',
        id: 'bell'
    },
    "Sage Osfala": {},
    "Smooth Gem": {
        id: "gem",
        cat: "gear"
    },
    Pouch: {
        id: "pouch",
        cat: "gear"
    },
    "Lorule Castle Small Key": {},
    "Lorule Castle Big Key": {},
    "Lorule Castle Compass": {},
    "Skull Woods Small Key": {},
    "Skull Woods Big Key": {},
    "Skull Woods Compass": {},
    "Sage Irene": {
        cat: 'gear',
        id: 'sage-irene'
    },
    "Swamp Palace Small Key": {},
    "Swamp Palace Big Key": {},
    "Swamp Palace Compass": {},
    "Pendant of Power": {
        cat: 'gear',
        id: 'pendant-of-power'
    },
    "Thieves' Hideout Small Key": {},
    "Thieves' Hideout Big Key": {},
    "Thieves' Hideout Compass": {},
    "Pendant of Wisdom": {
        cat: 'gear',
        id: 'pendant-of-wisdom'
    },
    "Tower of Hera Small Key": {},
    "Tower of Hera Big Key": {},
    "Tower of Hera Compass": {},
    "Sage Impa": {
        cat: 'gear',
        id: 'sage-impa'
    },
    "Turtle Rock Big Key": {},
    "Turtle Rock Small Key": {},
    "Turtle Rock Compass": {},
    "Sage Gulley": {
        cat: 'gear',
        id: 'sage-gulley'
    },
}