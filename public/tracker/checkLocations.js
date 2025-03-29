const checkLocations = {
    "Death Mountain": {
        "Bouldering Guy": {},
        "Death Mountain (Hyrule) Weather Vane": {
            position: "252x82"
        },
        "Death Mountain Blocked Cave": {},
        "Death Mountain Fairy Cave": {},
        "Death Mountain Open Cave": {},
        "Death Mountain West Highest Cave": {},
        "Donkey Cave": {},
        "Donkey Cave Ledge": {},
        "Fire Cave Pillar": {},
        "Floating Island": {},
        "Hookshot Mini-Dungeon": {},
        "Spectacle Rock": {},
        "Tower of Hera Weather Vane": {
            position: "305x20"
        },
        "[Mai] Death Mountain Base Rock": {},
        "[Mai] Death Mountain West Ledge": {},
        "[Mai] Fire Cave Ledge": {},
        "[Mai] Outside Hookshot Mini-Dungeon": {},
        "[Mai] Rosso's Ore Mine": {}
    },
    "Desert": {
        "Desert Palace Weather Vane": {
            position: "42x428"
        },
        "[Mai] Buried in the Desert": {},
        "[Mai] Buried near Desert Palace": {},
        "[Mai] Southern Ruins Big Rock": {}
    },
    "Eastern Ruins": {
        "Bird Lover": {},
        "Eastern Palace Weather Vane": {
            position: "483x200",
            unlockedByDefault: true
        },
        "Eastern Ruins Armos Chest": {},
        "Eastern Ruins Cave": {},
        "Eastern Ruins Hookshot Chest": {},
        "Eastern Ruins Merge Chest": {},
        "Eastern Ruins Peg Circle": {},
        "Merge Mini-Dungeon": {},
        "[Mai] Eastern Ruins Bonk Rocks": {},
        "[Mai] Eastern Ruins Green Tree": {},
        "[Mai] Eastern Ruins River": {},
        "[Mai] Eastern Ruins Rock": {},
        "[Mai] Eastern Ruins Wall": {},
        "[Mai] Eastern Ruins Yellow Tree": {}
    },
    "Hyrule Castle Area": {
        Blacksmith: {},
        "Blacksmith Cave": {},
        "Blacksmith Ledge": {},
        "Blacksmith Table": {
            unlockedByDefault: true,
            position: "0x0"
        },
        "Cucco Mini-Dungeon": {},
        "Haunted Grove Stump": {},
        "Hyrule Castle Rocks": {},
        "Your House Weather Vane": {
            unlockedByDefault: true,
            position: "256x340"
        },
        "[Mai] Behind Your House": {},
        "[Mai] Blacksmith Tiles": {},
        "[Mai] Blacksmith Tree": {},
        "[Mai] Haunted Grove Tree": {},
        "[Mai] Hyrule Castle Tiles": {},
        "[Mai] Hyrule Castle Tree": {},
        "[Mai] Outside Cucco Mini-Dungeon": {},
        "[Mai] Your House Tree": {}
    },
    "Irene the Witch": {
        Irene: {}
    },
    "Kakariko Village": {
        "Bee Guy (1)": {},
        "Bee Guy (2)": {},
        "Dodge the Cuccos": {},
        "Kakariko Item Shop (1)": {},
        "Kakariko Item Shop (2)": {},
        "Kakariko Item Shop (3)": {},
        "Kakariko Jail": {
            unlockedByDefault: true,
            position: "10x10"
        },
        "Kakariko Village Weather Vane": {
            unlockedByDefault: true,
            position: "68x239"
        },
        "Kakariko Well (Bottom)": {},
        "Kakariko Well (Top)": {},
        "Rupee Rush (Hyrule)": {},
        "Shady Guy": {},
        "Street Merchant (Left)": {},
        "Street Merchant (Right)": {},
        "Stylish Woman": {},
        Woman: {},
        "[Mai] Cucco Ranch Tree": {},
        "[Mai] Hyrule Rupee Rush Wall": {},
        "[Mai] Kakariko Bush": {
            unlockedByDefault: true,
            position: ""
        },
        "[Mai] Kakariko Sand": {},
        "[Mai] Woman's Roof": {}
    },
    "Lake Hylia": {
        "100 Maiamai": {},
        "House of Gales Weather Vane": {
            position: "386x430"
        },
        "Ice Rod Cave": {},
        "Lake Hylia Dark Cave": {},
        "Lake Hylia Eastern Shore": {},
        "Lake Hylia Ledge Chest": {},
        "Lakeside Item Shop (1)":  {},
        "Lakeside Item Shop (2)": {},
        "Lakeside Item Shop (3)": {},
        "Maiamai Bombs Upgrade": {},
        "Maiamai Boomerang Upgrade": {},
        "Maiamai Bow Upgrade": {},
        "Maiamai Fire Rod Upgrade": {},
        "Maiamai Hammer Upgrade": {},
        "Maiamai Hookshot Upgrade": {},
        "Maiamai Ice Rod Upgrade": {},
        "Maiamai Sand Rod Upgrade": {},
        "Maiamai Tornado Rod Upgrade": {},
        "[Mai] Hyrule Hotfoot Rock": {},
        "[Mai] Lake Hylia East River": {},
        "[Mai] Lake Hylia Island Tile": {},
        "[Mai] Lake Hylia Shallow Ring": {
            position: ""
        },
        "[Mai] Outside Maiamai Cave": {}
    },
    "Lost Woods Area": {
        "Fortune-Teller": {},
        "Hyrule Hotfoot 65s": {},
        "Hyrule Hotfoot 75s": {},
        "Lost Woods Alcove": {},
        "Lost Woods Chest": {},
        "Master Sword Pedestal": {},
        "Rosso (1)": {},
        "Rosso (2)": {},
        "Rosso Cave": {},
        "[Mai] Fortune-Teller Tent": {},
        "[Mai] Lost Woods Bush": {},
        "[Mai] Lost Woods Path Rock": {},
        "[Mai] Lost Woods Rock": {},
        "[Mai] Lost Woods Tree": {},
        "[Mai] Moldorm Ledge": {},
        "[Mai] Rosso Wall": {},
        "[Mai] Small Pond": {}
    },
    "Ravio's Shop": {
        "Ravio's Gift": {
            small: true,
            unlockedByDefault: true,
            position: "274x344"
        },
        "Ravio's Shop (1)": {
            small: true,
            unlockedByDefault: true,
            position: "268x346"
        },
        "Ravio's Shop (2)": {
            small: true,
            unlockedByDefault: true,
            position: "268x340"
        },
        "Ravio's Shop (3)": {
            stroke: true,
            small: true,
            unlockedByDefault: true,
            position: "268x334"
        },
        "Ravio's Shop (5)": {
            stroke: true,
            small: true,
            unlockedByDefault: true,
            position: "274x332"
        },
        "Ravio's Shop (4)": {
            small: true,
            unlockedByDefault: true,
            position: "270x332"
        },
        "Ravio's Shop (7)": {
            stroke: true,
            small: true,
            unlockedByDefault: true,
            position: "280x334"
        },
        "Ravio's Shop (6)": {
            small: true,
            unlockedByDefault: true,
            position: "278x332"
        },
        "Ravio's Shop (8)": {
            small: true,
            unlockedByDefault: true,
            position: "280x340"
        },
        "Ravio's Shop (9)": {
            small: true,
            unlockedByDefault: true,
            position: "280x346"
        },
    },
    "River Area": {
        Dampe: {},
        "Graveyard Ledge Cave": {},
        "Queen Oren": {},
        "River Mini-Dungeon": {},
        "Sanctuary Pegs": {},
        "Sanctuary Weather Vane": {
            unlockedByDefault: true,
            position: "226x157"
        },
        "Waterfall Cave": {},
        "Witch's House Weather Vane": {
            position: "405x168"
        },
        "Zora's Domain Ledge": {},
        "[HS] Entrance": {},
        "[HS] Ledge": {},
        "[HS] Lower Chest": {},
        "[HS] Upper Chest": {},
        "[Mai] Hyrule Graveyard Wall": {},
        "[Mai] Sanctuary Wall": {},
        "[Mai] South of Zora's Domain": {},
        "[Mai] Waterfall Ledge": {},
        "[Mai] Witch's House": {},
        "[Mai] Wooden Bridge": {},
        "[Mai] Zora's Domain": {}
    },
    "Southern Ruins": {
        "Flippers Mini-Dungeon": {},
        "Runaway Item Seller": {},
        "Southern Ruins Ledge": {},
        "Southern Ruins Pillar Cave": {},
        "[Mai] Outside Flippers Mini-Dungeon": {},
        "[Mai] Southern Ruins Bomb Cave": {},
        "[Mai] Southern Ruins Pillars": {}
    },
    "Dark Ruins": {
        "Dark Maze Chest": {},
        "Dark Maze Ledge": {},
        "Dark Palace Weather Vane": {
            position: "999x210"
        },
        "Hinox (1)": {},
        "Hinox (2)": {},
        "Hinox (3)": {},
        "Hinox (4)": {},
        "Hinox (5)": {},
        "Hinox (6)": {},
        "Ku's Domain Fight": {},
        "[Mai] Dark Maze Center Wall": {},
        "[Mai] Dark Maze Entrance Wall": {},
        "[Mai] Dark Ruins Bonk Rocks": {},
        "[Mai] Dark Ruins East Tree": {},
        "[Mai] Dark Ruins South Wall": {},
        "[Mai] Dark Ruins Waterfall": {},
        "[Mai] Dark Ruins West Tree": {},
        "[Mai] Ku's Domain Grass": {},
        "[Mai] Ku's Domain Water": {},
        "[Mai] Outside Hinox Cave": {}
    },
    "Graveyard": {
        "Graveyard Peninsula": {},
        "Graveyard Weather Vane": {
            position: "813x171"
        },
        "Philosopher's Cave": {},
        "[LS] Entrance Chest": {},
        "[LS] Ledge": {},
        "[LS] Lower Chest": {},
        "[LS] Upper Chest": {},
        "[Mai] Lorule Graveyard Big Rock": {},
        "[Mai] Lorule Graveyard Tree": {},
        "[Mai] Lorule Graveyard Wall": {}
    },
    "Lorule Castle Area": {
        "Big Bomb Flower Cave": {},
        "Blacksmith (Lorule)": {},
        "Blacksmith Weather Vane": {
            position: "680x262"
        },
        "Fortune's Choice": {},
        "Great Rupee Fairy": {},
        "Lorule Castle Weather Vane": {
            position: "760x228"
        },
        "Lorule Field Hookshot Chest": {},
        "Octoball Derby": {},
        "Pegasus Boots Pyramid": {},
        "Rupee Rush (Lorule)": {},
        "Swamp Cave (Left)": {},
        "Swamp Cave (Middle)": {},
        "Swamp Cave (Right)": {},
        "Swamp Palace Weather Vane": {
            position: "744x461"
        },
        "Thief Girl": {},
        "Thieves' Town Item Shop (1)": {},
        "Thieves' Town Item Shop (2)": {},
        "Thieves' Town Item Shop (3)": {},
        "Thieves' Town Item Shop (4)": {},
        "Thieves' Town Weather Vane": {
            position: "542x260"
        },
        "Vacant House": {},
        "Vacant House Weather Vane": {
            position: "792x348"
        },
        "[Mai] Behind Vacant House": {},
        "[Mai] Big Bomb Flower Grass": {},
        "[Mai] Lorule Blacksmith Wall": {},
        "[Mai] Lorule Castle Tree": {},
        "[Mai] Lorule Castle Wall": {},
        "[Mai] Lorule Fortune-Teller Rock": {},
        "[Mai] Lorule Haunted Grove Wall": {},
        "[Mai] Lorule Rupee Rush Wall": {},
        "[Mai] Lorule S Ruins Pillars": {},
        "[Mai] Lorule S Ruins Wall": {},
        "[Mai] Lorule S Ruins Water": {},
        "[Mai] Octoball Derby Skull": {},
        "[Mai] Thieves' Town Tree": {},
        "[Mai] Thieves' Town Wall": {},
        "[Mai] Vacant House Rock": {}
    },
    "Lorule Death Mountain": {
        "Behind Ice Gimos": {},
        "Death Mountain (Lorule) Weather Vane": {
            position: "888x95"
        },
        "Ice Cave Ledge": {},
        "Ice Gimos Fight": {},
        "Ice Ruins Weather Vane": {
            position: "965x50"
        },
        "Lorule Mountain W Ledge": {},
        "Treacherous Tower": {
            position: "794x10"
        },
        "Treacherous Tower Weather Vane": {
            position: "785x30"
        },
        "[Mai] Ice Cave Ledge": {},
        "[Mai] Lorule Mountain E Big Rock": {},
        "[Mai] Lorule Mountain E Wall": {},
        "[Mai] Lorule Mountain W Big Rock": {},
        "[Mai] Lorule Mountain W Skull": {},
        "[Mai] Outside Ice Ruins": {}
    },
    "Misery Mire": {
        "Misery Mire Ledge": {
            small: true,
            position: "625x449"
        },
        "Misery Mire Weather Vane": {
            small: true,
            position: "625x455"
        },
        "Sand Mini-Dungeon": {},
        "[Mai] Misery Mire Rock": {
            position: "672x470"
        },
        "[Mai] Misery Mire Wall": {},
        "[Mai] Misery Mire Water": {
            position: "547x467"
        }
    },
    "Skull Woods Area": {
        "Destroyed House": {},
        "Mysterious Man": {},
        "Skull Woods Weather Vane": {
            position: "610x80"
        },
        "[Mai] Destroyed House Tree": {},
        "[Mai] Skull Woods Bush": {},
        "[Mai] Skull Woods Dry Pond": {},
        "[Mai] Skull Woods Entrance Wall": {},
        "[Mai] Skull Woods Grass": {},
        "[Mai] Skull Woods Rock": {},
        "[Mai] Skull Woods Skull": {},
        "[Mai] n-Shaped House Wall": {},
        "n-Shaped House": {}
    },
    "Turtle Rock Area": {
        "Dark/Turtle Chest": {},
        "Lorule Lake Chest": {},
        "Lorule Lakeside Item Shop (1)": {},
        "Lorule Lakeside Item Shop (2)": {},
        "Lorule Lakeside Item Shop (3)": {},
        "Lorule Lakeside Item Shop (4)": {},
        "Turtle Rock Weather Vane": {
            position: "908x445"
        },
        "[Mai] Lorule Lake Rock": {},
        "[Mai] Lorule Lake SE Wall": {},
        "[Mai] Lorule Lake Skull": {},
        "[Mai] Lorule Lake Water": {},
        "[Mai] Lorule Lake West Wall": {}
    }
    /*
    The tracker only supports both Hyrule and Lourle maps, so dungeons will have to wait.
    "Dungeons": {
        "Dark Palace": {
            "[PD] (1F) Fall From 2F":                        {},
            "[PD] (1F) Hidden Room (Lower)":                 "Dark Palace Small Key",
            "[PD] (1F) Hidden Room (Upper)":                 {},
            "[PD] (1F) Left Pit":                            "Dark Palace Compass",
            "[PD] (1F) Right Pit":                           "Dark Palace Small Key",
            "[PD] (1F) Switch Puzzle":                       {},
            "[PD] (2F) Alcove":                              {},
            "[PD] (2F) Big Chest (Hidden)":                  "Glove+",
            "[PD] (2F) South Hidden Room":                   {},
            "[PD] (B1) Bomb Bowling":                        "Premium Milk",
            "[PD] (B1) Fall From 1F":                        "Dark Palace Small Key",
            "[PD] (B1) Glow-in-the-Dark Maze":               "Hammer+",
            "[PD] (B1) Helmasaur Room":                      "Dark Palace Big Key",
            "[PD] (B1) Helmasaur Room (Fall)":               "Dark Palace Small Key",
            "[PD] Gemesaur King":                            "Master Ore",
            "[PD] Prize":                                    "Sage Oren"
        },
        "Desert Palace": {
            "[DP] (1F) Behind Rocks":                        {},
            "[DP] (1F) Big Chest (Behind Wall)":             "Desert Palace Small Key",
            "[DP] (1F) Entrance":                            {},
            "[DP] (1F) Sand Room (North)":                   "Desert Palace Small Key",
            "[DP] (1F) Sand Room (South)":                   "Pegasus Boots",
            "[DP] (1F) Sand Switch Room":                    {},
            "[DP] (2F) Beamos Room":                         {},
            "[DP] (2F) Big Chest (Puzzle)":                  "Desert Palace Big Key",
            "[DP] (2F) Leever Room":                         {},
            "[DP] (2F) Red/Blue Switches":                   "Desert Palace Small Key",
            "[DP] (2F) Under Rock (Ball Room)":              "Sand Rod+",
            "[DP] (2F) Under Rock (Left)":                   "Bow of Light",
            "[DP] (2F) Under Rock (Right)":                  "Desert Palace Small Key",
            "[DP] (3F) Armos Room":                          "Desert Palace Small Key",
            "[DP] (3F) Behind Falling Sand":                 "Desert Palace Compass",
            "[DP] Prize":                                    "Pendant of Courage",
            "[DP] Zaganaga":                                 {}
        },
        "Eastern Palace": {
            "[EP] (1F) Escape Chest":                        {},
            "[EP] (1F) Left Door Chest":                     "Eastern Palace Small Key",
            "[EP] (1F) Merge Chest":                         "Hammer+",
            "[EP] (1F) Popo Room":                           "Eastern Palace Big Key",
            "[EP] (1F) Secret Room":                         "Boomerang+",
            "[EP] (1F) Switch Room":                         {},
            "[EP] (2F) Ball Room":                           {},
            "[EP] (2F) Big Chest":                           {},
            "[EP] (2F) Defeat Popos":                        "Stamina Scroll",
            "[EP] (2F) Switch Room":                         {},
            "[EP] (3F) Escape Chest":                        "Eastern Palace Small Key",
            "[EP] Prize":                                    "Sage Rosso",
            "[EP] Yuga (1)":                                 "Eastern Palace Compass",
            "[EP] Yuga (2)":                                 {}
        },
        "House of Gales": {
            "[HG] (1F) Fire Bubbles":                        "House of Gales Compass",
            "[HG] (1F) Switch Room":                         "House of Gales Small Key",
            "[HG] (1F) Torches":                             "House of Gales Small Key",
            "[HG] (1F) West Room":                           "House of Gales Small Key",
            "[HG] (1F) West Room Secret":                    "Master Ore",
            "[HG] (2F) Big Chest":                           "House of Gales Small Key",
            "[HG] (2F) Fire Ring":                           "Ice Rod+",
            "[HG] (2F) Narrow Ledge":                        {},
            "[HG] (3F) Fire Bubbles":                        "House of Gales Big Key",
            "[HG] (3F) Rat Room":                            {},
            "[HG] Margomill":                                {},
            "[HG] Prize":                                    "Sage Seres"
        },
        "Hyrule Castle": {
            "[HC] Battlement":                               {},
            "[HC] Throne":                                   {},
            "[HC] West Wing":                                {}
        },
        "Ice Ruins": {
            "[IR] (1F) Hidden Chest":                        {},
            "[IR] (B1) East Chest":                          "Ice Ruins Small Key",
            "[IR] (B1) Narrow Ledge":                        "Ice Ruins Big Key",
            "[IR] (B1) Upper Chest":                         "Ice Ruins Small Key",
            "[IR] (B2) Ice Pillar":                          {},
            "[IR] (B2) Long Merge Chest":                    {},
            "[IR] (B3) Big Chest (Puzzle)":                  {},
            "[IR] (B3) Grate Chest (Left)":                  "Ice Ruins Small Key",
            "[IR] (B3) Grate Chest (Right)":                 {},
            "[IR] (B4) Narrow Platform":                     {},
            "[IR] (B4) Southeast Chest (Fall)":              {},
            "[IR] (B4) Southwest Chest (Fall)":              {},
            "[IR] (B4) Switches":                            "Ice Ruins Compass",
            "[IR] (B5) Big Chest":                           "Bell",
            "[IR] Dharkstare":                               {},
            "[IR] Prize":                                    "Sage Osfala"
        },
        "Lorule Castle": {
            "[LC] (1F) Center":                              {},
            "[LC] (1F) Ledge":                               "Lorule Castle Small Key",
            "[LC] (2F) Hidden Path":                         "Pouch",
            "[LC] (2F) Ledge":                               {},
            "[LC] (2F) Near Torches":                        {},
            "[LC] (4F) Center":                              {},
            "[LC] (4F) Hidden Path":                         "Lorule Castle Small Key",
            "[LC] Bomb Trial (1)":                           "Lorule Castle Small Key",
            "[LC] Bomb Trial (2)":                           {},
            "[LC] Hook Trial (1)":                           "Lorule Castle Small Key",
            "[LC] Hook Trial (2)":                           "Lorule Castle Compass",
            "[LC] Lamp Trial":                               {},
            "[LC] Tile Trial (1)":                           "Lorule Castle Small Key",
            "[LC] Tile Trial (2)":                           {},
            "[LC] Zelda":                                    {}
        },
        "Skull Woods": {
            "[SW] (B1) Big Chest (Eyes)":                    "Master Ore",
            "[SW] (B1) Big Chest (Upper)":                   {},
            "[SW] (B1) Gibdo Room (Hole)":                   "Skull Woods Small Key",
            "[SW] (B1) Gibdo Room (Lower)":                  "Skull Woods Compass",
            "[SW] (B1) Grate Room":                          "Skull Woods Big Key",
            "[SW] (B1) South Chest":                         "Skull Woods Small Key",
            "[SW] (B2) Moving Platform Room":                "Skull Woods Small Key",
            "[SW] Knucklemaster":                            {},
            "[SW] Outdoor Chest":                            {},
            "[SW] Prize":                                    "Sage Irene"
        },
        "Swamp Palace": {
            "[SP] (1F) Big Chest (Fire)":                    "Swamp Palace Small Key",
            "[SP] (1F) East Room":                           {},
            "[SP] (1F) Water Puzzle":                        {},
            "[SP] (1F) West Room":                           "Swamp Palace Big Key",
            "[SP] (B1) Big Chest (Secret)":                  "Swamp Palace Small Key",
            "[SP] (B1) Center":                              {},
            "[SP] (B1) Gyorm":                               {},
            "[SP] (B1) Raft Room (Left)":                    "Swamp Palace Small Key",
            "[SP] (B1) Raft Room (Pillar)":                  "Swamp Palace Small Key",
            "[SP] (B1) Raft Room (Right)":                   {},
            "[SP] (B1) Waterfall Room":                      "Green Rupee",
            "[SP] Arrghus":                                  "Swamp Palace Compass",
            "[SP] Prize":                                    "Pendant of Power"
        },
        "Thieves' Hideout": {
            "[TT] (B1) Behind Wall":                         {},
            "[TT] (B1) Big Chest (Entrance)":                "Glove+",
            "[TT] (B1) Grate Chest":                         "Thieves' Hideout Small Key",
            "[TT] (B1) Jail Cell":                           {},
            "[TT] (B2) Eyegores":                            {},
            "[TT] (B2) Grate Chest (Fall)":                  {},
            "[TT] (B2) Jail Cell":                           "Thieves' Hideout Big Key",
            "[TT] (B2) Switch Puzzle Room":                  {},
            "[TT] (B3) Big Chest (Hidden)":                  "Thieves' Hideout Compass",
            "[TT] (B3) Underwater":                          {},
            "[TT] Prize":                                    "Pendant of Wisdom",
            "[TT] Stalblind":                                {}
        },
        "Tower of Hera": {
            "[TH] (11F) Big Chest":                          {},
            "[TH] (1F) Center":                              "Tower of Hera Small Key",
            "[TH] (1F) Outside":                             {},
            "[TH] (3F) Platform":                            {},
            "[TH] (5F) Red/Blue Switches":                   "Tower of Hera Small Key",
            "[TH] (6F) Left Mole":                           "Tower of Hera Big Key",
            "[TH] (6F) Right Mole":                          {},
            "[TH] (7F) Outside (Ledge)":                     "Tower of Hera Compass",
            "[TH] (8F) Fairy Room":                          {},
            "[TH] Moldorm":                                  {},
            "[TH] Prize":                                    "Sage Impa"
        },
        "Turtle Rock": {
            "[TR] (1F) Center":                              "Turtle Rock Big Key",
            "[TR] (1F) Defeat Flamolas":                     "Sand Rod+",
            "[TR] (1F) Grate Chest":                         {},
            "[TR] (1F) Northeast Ledge":                     "Turtle Rock Small Key",
            "[TR] (1F) Northwest Room":                      {},
            "[TR] (1F) Southeast Chest":                     "Turtle Rock Compass",
            "[TR] (1F) Under Center":                        {},
            "[TR] (B1) Big Chest (Center)":                  {},
            "[TR] (B1) Big Chest (Top)":                     "Turtle Rock Small Key",
            "[TR] (B1) Grate Chest (Small)":                 "Turtle Rock Small Key",
            "[TR] (B1) Northeast Room":                      "Tornado Rod+",
            "[TR] (B1) Platform":                            {},
            "[TR] (B1) Under Center":                        {},
            "[TR] Grinexx":                                  {},
            "[TR] Left Balcony":                             {},
            "[TR] Prize":                                    "Sage Gulley"
        }
    }*/
}