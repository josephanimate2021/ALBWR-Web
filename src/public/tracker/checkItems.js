const checkItems = { 
    // Please be aware that some locked checks might be easy to get meaning that this structure isn't going to be accurate for now.
    // I am working on making sure that this structure is accurate especially for autotracking and new users.
    "Silver Rupee": {},
    "Hylian Shield": {
        cat: 'items',
        id: 'hylianShield',
        imageFilename: 'shield_hylian.png'
    },
    "Monster Tail": {},
    "weatherVanes": {
        dontSayTitle: true,
        id: 'weatherVanes',
        imageFilename: 'weather_vanes.png',
        cat: 'others',
        count: 0,
        limit: 22
    },
    "Empty Bottle": {
        cat: 'items',
        id: 'bottle',
        imageFilename: 'bottle.png',
        count: 0,
        limit: 5
    },
    "Red Rupee": {},
    "Monster Horn": {},
    "Monster Guts": {
        cat: 'junk',
        id: 'monsterGuts',
        imageFilename: `monster_guts.png`,
        count: 0
    },
    "Piece of Heart": {},
    "Lost Maiamai": {
        cat: 'junk',
        id: 'maiamai',
        imageFilename: `maiamai.png`,
        count: 0,
        limit: 100
    },
    "Gold Rupee": {},
    "Sword+": {
        cat: 'items',
        id: 'sword',
        imageFilename: 'fsword.png',
        count: 0,
        limit: 2
    },
    "Heart Container": {},
    "Net+": {
        cat: 'items',
        id: 'net',
        imageFilename: 'net.png',
        count: 0,
        limit: 2
    },
    "Lamp+": {
        cat: 'items',
        id: 'lamp',
        imageFilename: 'lamp.png',
        count: 0,
        limit: 2
    },
    "Bow+": {
        cat: 'items',
        id: 'bow',
        imageFilename: 'bow.png',
        count: 0,
        limit: 2
    },
    "Mail+": {
        cat: 'items',
        id: 'mail',
        imageFilename: 'mail_green.png',
        count: 0,
        limit: 2
    },
    "Purple Rupee": {},
    "Green Rupee": {
        cat: 'junk',
        id: 'greenRupee',
        imageFilename: `rupee_green.png`,
        count: 0
    },
    "Great Spin": {},
    "Blue Rupee": {},
    "Scoot Fruit": {},
    "Foul Fruit": {},
    "Shield": {},
    "Bombs+": {
        cat: 'items',
        id: 'bombs',
        imageFilename: 'bombs.png',
        count: 0,
        limit: 2
    },
    "Ravio's Bracelet+": {
        cat: 'others',
        id: 'bracelet',
        imageFilename: `bracelet.png`,
        count: 0,
        limit: 2,
        archipelagoItemName: ["Progressive Bracelet","Progressive Bracelet"],
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
    "Charm": {},
    "Fire Rod+": {
        cat: 'items',
        id: 'fireRod',
        imageFilename: 'frod.png',
        count: 0,
        limit: 2
    },
    "Ice Rod+": {
        cat: 'items',
        id: 'iceRod',
        imageFilename: 'irod.png',
        count: 0,
        limit: 2
    },
    "Quake": {},
    "Bee Badge": {
        id: "badge",
        cat: "others",
        imageFilename: "bee_badge.png"
    },
    "Hyrule Sewers Key": {},
    "Master Ore": {
        id: 'ore',
        cat: "others",
        imageFilename: "master_ore.png",
        count: 0,
        limit: 4
    },
    "Hint Glasses": {
        id: "glasses",
        cat: "others",
        imageFilename: "hint_glasses.png"
    },
    "Hookshot+": {
        cat: 'items',
        id: 'hookshot',
        imageFilename: 'hookshot.png',
        count: 0,
        limit: 2
    },
    "Tornado Rod+": {
        cat: 'items',
        id: 'tonadoRod',
        imageFilename: 'trod.png',
        count: 0,
        limit: 2
    },
    "Boomerang+": {
        cat: 'items',
        id: 'boomerang',
        imageFilename: 'boomerang.png',
        count: 0,
        limit: 2
    },
    "Bee": {},
    "Golden Bee": {},
    "Fairy": {},
    "Zora's Flippers": {
        cat: 'items',
        id: 'zorasFlippers',
        imageFilename: 'flippers.png',
    },
    "Dark Palace Small Key": {},
    "Dark Palace Big Key": {},
    "Dark Palace Compass": {},
    "Glove+": {
        cat: 'items',
        id: 'glove',
        imageFilename: 'power_glove.png',
        count: 0,
        limit: 2
    },
    "Hammer+": {
        cat: 'items',
        id: 'hammer',
        imageFilename: 'hammer.png',
        count: 0,
        limit: 2
    },
    "Sage Oren": {},
    "Desert Palace Small Key": {},
    "Pegasus Boots": {
        cat: 'items',
        id: 'boots',
        imageFilename: 'pegasus_boots.png'
    },
    "Desert Palace Big Key": {},
    "Sand Rod+": {
        cat: 'items',
        id: 'sandRod',
        imageFilename: 'srod.png',
        count: 0,
        limit: 2
    },
    "Bow of Light": {
        cat: 'items',
        id: 'bowOfLight',
        imageFilename: 'bow_light.png'
    },
    "Desert Palace Compass": {},
    "Pendant of Courage": {},
    "Eastern Palace Small Key": {},
    "Eastern Palace Big Key": {},
    "Stamina Scroll": {
        id: 'staminaScroll',
        cat: 'other',
        imageFilename: 'stamina_scroll.png',
    },
    "Sage Rosso": {},
    "Eastern Palace Compass": {},
    "House of Gales Compass": {},
    "House of Gales Small Key": {},
    "House of Gales Big Key": {},
    "Sage Seres": {},
    "Ice Ruins Small Key": {},
    "Ice Ruins Big Key": {},
    "Ice Ruins Compass": {},
    Bell: {
        cat: 'items',
        id: 'bell',
        imageFilename: 'bell.png',
        count: 0
    },
    "Sage Osfala": {},
    "Smooth Gem": {
        id: "gem",
        cat: "others",
        imageFilename: "smooth_gem.png"
    },
    Pouch: {
        id: "pouch",
        cat: "others",
        imageFilename: "pouch.png"
    },
    "Lorule Castle Small Key": {},
    "Lorule Castle Big Key": {},
    "Lorule Castle Compass": {},
    "Skull Woods Small Key": {},
    "Skull Woods Big Key": {},
    "Skull Woods Compass": {},
    "Sage Irene": {},
    "Swamp Palace Small Key": {},
    "Swamp Palace Big Key": {},
    "Swamp Palace Compass": {},
    "Pendant of Power": {},
    "Thieves' Hideout Small Key": {},
    "Thieves' Hideout Big Key": {},
    "Thieves' Hideout Compass": {},
    "Pendant of Wisdom": {},
    "Tower of Hera Small Key": {},
    "Tower of Hera Big Key": {},
    "Tower of Hera Compass": {},
    "Sage Impa": {},
    "Turtle Rock Big Key": {},
    "Turtle Rock Small Key": {},
    "Turtle Rock Compass": {},
    "Sage Gulley": {}
}