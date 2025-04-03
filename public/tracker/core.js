const trackerCore = {
  "version":                                             "v0.4.1 - Beta Build 2025-03-25",
  "settings": {
    "lc_requirement":                                    7,
    "ped_requirement":                                   "Standard",
    "logic_mode":                                        "Normal",
    "dark_rooms_lampless":                               false,
    "dungeon_prize_shuffle":                             true,
    "maiamai_limit":                                     50,
    "maiamai_madness":                                   false,
    "nice_items":                                        "Shuffled",
    "super_items":                                       true,
    "lamp_and_net_as_weapons":                           false,
    "cracks":                                            "Closed",
    "door_shuffle":                                      "Off",
    "cracksanity":                                       "Off",
    "weather_vanes":                                     "Hyrule",
    "bow_of_light_in_castle":                            false,
    "no_progression_enemies":                            false,
    "keysy":                                             "Off",
    "swordless_mode":                                    false,
    "start_with_merge":                                  false,
    "start_with_pouch":                                  false,
    "bell_in_shop":                                      false,
    "sword_in_shop":                                     false,
    "boots_in_shop":                                     false,
    "assured_weapon":                                    true,
    "chest_size_matches_contents":                       true,
    "minigames_excluded":                                false,
    "skip_big_bomb_flower":                              true,
    "trials_door":                                       "OpenFromInsideOnly",
    "treacherous_tower_floors":                          5,
    "purple_potion_bottles":                             true,
    "night_mode":                                        false,
    "user_exclusions": [
      "Dodge the Cuccos",
      "Hyrule Hotfoot 65s",
      "Hyrule Hotfoot 75s",
      "Octoball Derby",
      "Rupee Rush (Hyrule)",
      "Rupee Rush (Lorule)"
    ]
  },
  "full_exclusions": [
    "100 Maiamai",
    "Dodge the Cuccos",
    "Hyrule Hotfoot 65s",
    "Hyrule Hotfoot 75s",
    "Octoball Derby",
    "Rupee Rush (Hyrule)",
    "Rupee Rush (Lorule)",
    "Stylish Woman (Repeat)"
  ],
  "removed_from_play": [
    "Red Rupee",
    "Monster Guts"
  ],
  "treacherous_tower_floors": [],
  "trials_config": {
    "bomb_trial":                                        false,
    "tile_trial":                                        false,
    "lamp_trial":                                        false,
    "hook_trial":                                        false
  },
  "itemLayout": {
    searchFor(value) {
      function c(i) {
        const info = {};
        for (const k in i) {
          if (typeof i[k] != "object") continue;
          if (i[k][value]) {
            info.cat = k;
            info.data = i[info.cat][value];
          } else if (i[k].alt == value || k == value) {
            info.cat = k;
            info.data = i[info.cat];
          } else {
            info.parent = k;
            info.child = c(i[info.parent]);
          }
        }
        return info;
      }
      return c(this);
    },
    "Progression Items": {
      "Fire Rod+": {
        "alt": "Fire Rod",
        "imageFile": "items/frod",
        "counts": [0, 1, 3]
      },
      "Glove+": {
        "alt": "Progressive Glove",
        "imageFile": "gear/mitt",
        "counts": [0, 1, 2]
      },
      "Hookshot+": {
        "alt": "Hookshot",
        "imageFile": "items/hookshot",
        "counts": [0, 1, 3]
      },
      "Sword+": {
        "alt": "Progressive Sword",
        "imageFile": "gear/sword",
        "counts": [0, 1, 4]
      },
      "Bow+": {
        "alt": "Bow",
        "imageFile": "items/bow",
        "counts": [0, 1, 3]
      },
      "Boomerang+": {
        "alt": "Boomerang",
        "imageFile": "items/boomerang",
        "counts": [0, 1, 3]
      },
      "Lamp+": {
        "alt": "Lamp",
        "imageFile": "items/lamp",
        "counts": [0, 1, 2]
      },
      "Sand Rod+": {
        "alt": "Sand Rod",
        "imageFile": "items/srod",
        "counts": [0, 1, 3]
      },
      "Master Ore": {
        "imageFile": "others/master_ore",
        "counts": [0, 1, 4],
        "noImageCount": true
      },
      "Bombs+": {
        "alt": "Bombs",
        "imageFile": "items/bombs",
        "counts": [0, 1, 3]
      },
      "Hammer+": {
        "alt": "Hammer",
        "imageFile": "items/hammer",
        "counts": [0, 1, 3]
      },
      "Ice Rod+": {
        "alt": "Ice Rod",
        "imageFile": "items/irod",
        "counts": [0, 1, 3]
      },
      "Bell": {
        "imageFile": "gear/bell"
      },
      "Tornado Rod+": {
        "alt": "Tornado Rod",
        "imageFile": "items/trod",
        "counts": [0, 1, 3]
      },
      "Progressive Bracelet": {
        "imageFile": "gear/bracelet",
        "counts": [0, 1, 2]
      },
      "Quake": {
        "imageFile": "others/quake"
      },
      "Bow of Light": {
        "imageFile": "items/bow-of-light",
      },
      "Flippers": {
        "imageFile": "gear/flippers"
      },
    },
    "Dungeon Prizes": {
      "Pendant of Power": {
        "imageFile": "gear/pendant-of-power"
      },
      "Pendant of Courage": {
        "imageFile": "gear/pendant-of-courage"
      },
      "Pendant of Wisdom": {
        "imageFile": "gear/pendant-of-wisdom"
      },
      "Sage Seres": {
        "alt": "Rescue Seres",
        "imageFile": "gear/sage-seres"
      },
      "Sage Impa": {
        "alt": "Rescue Impa",
        "imageFile": "gear/sage-impa"
      },
      "Sage Gulley": {
        "alt": "Rescue Impa",
        "imageFile": "gear/sage-gulley"
      },
      "Sage Irene": {
        "alt": "Rescue Impa",
        "imageFile": "gear/sage-irene"
      },
      "Sage Rosso": {
        "alt": "Rescue Impa",
        "imageFile": "gear/sage-rosso"
      },
      "Sage Oren": {
        "alt": "Rescue Oren",
        "imageFile": "gear/sage-oren"
      },
      "Sage Osfala": {
        "alt": "Rescue Osfala",
        "imageFile": "gear/sage-osfala"
      },
    },
    "Junk Items": {
      "Green Rupee": {
        "imageFile": "gear/rupee_green",
        "counts": [0, 1],
        "noImageCount": true
      },
      "Blue Rupee": {
        "imageFile": "gear/rupee_blue",
        "counts": [0, 1],
        "noImageCount": true
      },
      "Red Rupee": {
        "imageFile": "gear/rupee_red",
        "counts": [0, 1],
        "noImageCount": true
      },
      "Purple Rupee": {
        "imageFile": "gear/rupee_purple",
        "counts": [0, 1],
        "noImageCount": true
      },
      "Silver Rupee": {
        "imageFile": "gear/rupee_silver",
        "counts": [0, 1],
        "noImageCount": true,
        // Not disabling this becuase the Rupee color is the same style of color as the grayscale color of all items by default.
        "noDisable": true
      },
      "Gold Rupee": {
        "imageFile": "gear/rupee_gold",
        "counts": [0, 1, 7],
        "noImageCount": true
      },
      "Monster Guts": {
        "imageFile": "gear/guts",
        "counts": [0, 1, 4],
        "noImageCount": true
      },
      "Monster Tail": {
        "imageFile": "gear/tail",
        "counts": [0, 1, 4],
        "noImageCount": true,
      },
      "Monster Horn": {
        "imageFile": "gear/horn",
        "counts": [0, 1, 3],
        "noImageCount": true,
      },
      "Bee": {
        "imageFile": "items/bottle_bee",
        "counts": [0, 1, 2],
        "noImageCount": true
      },
      "Golden Bee": {
        "imageFile": "items/bottle_bee_golden",
        "counts": [0, 1, 4],
        "noImageCount": true
      },
      "Fairy": {
        "imageFile": "items/bottle_fairy",
        "counts": [0, 1, 2],
        "noImageCount": true
      },
      "Charm": {
        "imageFile": "gear/pendant_charm"
      },
      "Heart": {},
      "Hint Glasses": {
        "imageFile": "items/hint-glasses"
      },
    },
    "Other Items": {
      "Smooth Gem": {
        "imageFile": "gear/gem"
      },
      "Shield": {
        "imageFile": "gear/shield-1"
      },
      "Hylian Shield": {
        "imageFile": "gear/shield-2"
      },
      "Great Spin": {
        "imageFile": "gear/great_spin"
      },
      "Piece of Heart": {
        "imageFile": "gear/heart",
        "counts": [0, 0, 3, true],
        "noDisable": true
      },
      "Lost Maiamai": {
        "alt": "Maiamai",
        "imageFile": "gear/maiamai",
        "noImageCount": true,
        "counts": [0, 1, 100]
      },
      "Heart Container": {
        "imageFile": "gear/heart-container",
        "counts": [0, 1, 10],
        "noImageCount": true
      },
      "Empty Bottle": {
        "alt": "Bottle",
        "imageFile": "items/bottle",
        "counts": [0, 1, 5],
        "noImageCount": true
      },
      "Pouch": {
        "imageFile": "gear/pouch"
      },
      "Stamina Scroll": {
        "imageFile": "gear/scroll"
      },
      "Mail+": {
        "alt": "Progressive Mail",
        "imageFile": "gear/mail",
        "counts": [0, 1, 3]
      },
      "Net+": {
        "alt": "Bug Net",
        "imageFile": "items/net",
        "counts": [0, 1, 2]
      },
      "Letter in a Bottle": {
        "imageFile": "items/note-bottle",
        "counts": [0, 1, 2]
      },
      "Bee Badge": {
        "imageFile": "gear/badge"
      },
      "Foul Fruit": {
        "imageFile": "items/foul-fruit"
      },
      "Scoot Fruit": {
        "imageFile": "items/scoot-fruit"
      },
      "Pegasus Boots": {
        "imageFile": "gear/boots"
      },
    },
  },
  "layout": {
    "Hyrule": {
      "Death Mountain": {
        "Bouldering Guy":                                {
          "position": "422x55"
        },
        "Death Mountain (Hyrule) Weather Vane":          {
          "position": "254x85"
        },
        "Death Mountain Blocked Cave":                   "Silver Rupee",
        "Death Mountain Fairy Cave":                     "Silver Rupee",
        "Death Mountain Open Cave":                      "Bee Badge",
        "Death Mountain West Highest Cave":              "Silver Rupee",
        "Donkey Cave":                                   "Silver Rupee",
        "Donkey Cave Ledge":                             "Heart Container",
        "Fire Cave Pillar":                              "Silver Rupee",
        "Floating Island":                               "Mail+",
        "Hookshot Mini-Dungeon":                         "Red Rupee",
        "Spectacle Rock":                                "Piece of Heart",
        "Tower of Hera Weather Vane":                    {
          "position": "308x18"
        },
        "[Mai] Death Mountain Base Rock": {},
        "[Mai] Death Mountain West Ledge": {},
        "[Mai] Fire Cave Ledge": {},
        "[Mai] Outside Hookshot Mini-Dungeon": {},
        "[Mai] Rosso's Ore Mine": {}
      },
      "Desert": {
        "Desert Palace Weather Vane":                    {
          "position": "44x432"
        },
        "[Mai] Buried in the Desert": {},
        "[Mai] Buried near Desert Palace": {},
        "[Mai] Southern Ruins Big Rock": {}
      },
      "Eastern Ruins": {
        "Bird Lover":                                    "Green Rupee",
        "Eastern Palace Weather Vane":                   {
          "position": "484x202"
        },
        "Eastern Ruins Armos Chest":                     "Bombs+",
        "Eastern Ruins Cave":                            "Red Rupee",
        "Eastern Ruins Hookshot Chest":                  "Silver Rupee",
        "Eastern Ruins Merge Chest":                     "Red Rupee",
        "Eastern Ruins Peg Circle":                      "Piece of Heart",
        "Merge Mini-Dungeon":                            "Letter in a Bottle",
        "[Mai] Eastern Ruins Bonk Rocks": {},
        "[Mai] Eastern Ruins Green Tree": {},
        "[Mai] Eastern Ruins River": {},
        "[Mai] Eastern Ruins Rock": {},
        "[Mai] Eastern Ruins Wall": {},
        "[Mai] Eastern Ruins Yellow Tree": {}
      },
      "Hyrule Castle Area": {
        "Blacksmith":                                    "Silver Rupee",
        "Blacksmith Cave":                               "Hammer+",
        "Blacksmith Ledge":                              "Green Rupee",
        "Blacksmith Table":                              "Ravio's Bracelet+",
        "Cucco Mini-Dungeon":                            "Zora's Flippers",
        "Haunted Grove Stump":                           "Hammer+",
        "Hyrule Castle Rocks":                           "Fire Rod+",
        "Your House Weather Vane":                       {
          "position": "262x342",
          "unlocked": true,
          "unlockedByDefault": true
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
        "Irene":                                         "Red Rupee"
      },
      "Kakariko Village": {
        "Bee Guy (1)":                                   {
          "position": "76x273",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Bee Guy (2)":                                   {
          "position": "93.5x273",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Dodge the Cuccos":                              {
          "position": "93x339",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Kakariko Item Shop (3)":                        {
          "position": "23.5x226",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Kakariko Jail":                                 {
          "position": "72.5x215",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Kakariko Village Weather Vane":                 {
          "position": "71x242",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Kakariko Well (Bottom)":                        {
          "position": "30x218",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Kakariko Well (Top)":                           {
          "position": "20.3x218.5"
        },
        "Rupee Rush (Hyrule)":                           {
          "position": "38x344.5",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Shady Guy":                                     "Monster Tail",
        "Street Merchant (Left)":                        {
          "position": "45x237",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Street Merchant (Right)":                       {
          "position": "58.5x237",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Stylish Woman":                                 "Red Rupee",
        "Stylish Woman (Repeat)":                        "Red Rupee",
        "Woman":                                         "Red Rupee",
        "[Mai] Cucco Ranch Tree": {},
        "[Mai] Hyrule Rupee Rush Wall": {},
        "[Mai] Kakariko Bush": {},
        "[Mai] Kakariko Sand":                           {
          "position": "50.4x294",
          "housesItem": "Lost Maiamai"
        },
        "[Mai] Woman's Roof": {}
      },
      "Lake Hylia": {
        "100 Maiamai":                                   "Monster Tail",
        "House of Gales Weather Vane":                   {
          "position": "387x430"
        },
        "Ice Rod Cave":                                  "Master Ore",
        "Lake Hylia Dark Cave":                          "Monster Guts",
        "Lake Hylia Eastern Shore":                      "Red Rupee",
        "Lake Hylia Ledge Chest":                        "Blue Rupee",
        "Lakeside Item Shop (3)":                        "Shield",
        "Maiamai Bombs Upgrade":                         "Gold Rupee",
        "Maiamai Boomerang Upgrade":                     "Silver Rupee",
        "Maiamai Bow Upgrade":                           "Heart Container",
        "Maiamai Fire Rod Upgrade":                      "Piece of Heart",
        "Maiamai Hammer Upgrade":                        "Master Ore",
        "Maiamai Hookshot Upgrade":                      "Monster Guts",
        "Maiamai Ice Rod Upgrade":                       "Silver Rupee",
        "Maiamai Sand Rod Upgrade":                      "Heart Container",
        "Maiamai Tornado Rod Upgrade":                   "Piece of Heart",
        "[Mai] Hyrule Hotfoot Rock": {},
        "[Mai] Lake Hylia East River": {},
        "[Mai] Lake Hylia Island Tile": {},
        "[Mai] Lake Hylia Shallow Ring": {},
        "[Mai] Outside Maiamai Cave": {}
      },
      "Lost Woods Area": {
        "Fortune-Teller":                                "Ravio's Bracelet+",
        "Hyrule Hotfoot 65s":                            "Red Rupee",
        "Hyrule Hotfoot 75s":                            "Monster Guts",
        "Lost Woods Alcove":                             "Heart Container",
        "Lost Woods Chest":                              "Purple Rupee",
        "Master Sword Pedestal":                         "Piece of Heart",
        "Rosso (1)":                                     "Gold Rupee",
        "Rosso (2)":                                     "Silver Rupee",
        "Rosso Cave":                                    "Bombs+",
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
        "Ravio's Gift":                                  {
          "position": "274x342",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Ravio's Shop (1)":                              {
          "position": "268x346",
          "unlocked": true,
          "housesItem": "Ice Rod+",
          "unlockedByDefault": true
        },
        "Ravio's Shop (2)":                              {
          "position": "268x340",
          "unlocked": true,
          "housesItem": "Hookshot+",
          "unlockedByDefault": true
        },
        "Ravio's Shop (3)":                              {
          "position": "268x334",
          "unlocked": true,
          "housesItem": "Tornado Rod+",
          "unlockedByDefault": true
        },
        "Ravio's Shop (4)":                              {
          "position": "274x334",
          "unlocked": true,
          "housesItem": "Bombs+",
          "unlockedByDefault": true
        },
        "Ravio's Shop (5)":                              {
          "position": "280x334",
          "unlocked": true,
          "housesItem": "Bow+",
          "unlockedByDefault": true
        },
        "Ravio's Shop (6)":                              {
          "position": "280x340",
          "unlocked": true,
          "housesItem": "Sand Rod+",
          "unlockedByDefault": true
        },
        "Ravio's Shop (7)":                              {
          "position": "280x346",
          "unlocked": true,
          "housesItem": "Hammer+",
          "unlockedByDefault": true
        },
        "Ravio's Shop (8)":                              {
          "position": "280x352",
          "unlocked": true,
          "housesItem": "Boomerang+",
          "unlockedByDefault": true
        },
        "Ravio's Shop (9)":                              {
          "position": "286x352",
          "unlocked": true,
          "housesItem": "Fire Rod+",
          "unlockedByDefault": true
        }
      },
      "River Area": {
        "Dampe":                                         {
          "position": "234x154",
          "unlocked": true,
          "housesItem": "Sword+",
          "unlockedByDefault": true
        },
        "Graveyard Ledge Cave":                          {
          "position": "288x142.2"
        },
        "Queen Oren":                                    "Gold Rupee",
        "River Mini-Dungeon":                            "Bow+",
        "Sanctuary Pegs":                                "Master Ore",
        "Sanctuary Weather Vane":                        {
          "position": "230x147",
          "unlocked": true,
          "unlockedByDefault": true
        },
        "Waterfall Cave":                                {
          "position": "450x69"
        },
        "Witch's House Weather Vane":                    {
          "position": "407x175"
        },
        "Zora's Domain Ledge":                           "Gold Rupee",
        "[HS] Entrance":                                 "Sword+",
        "[HS] Ledge":                                    "Hookshot+",
        "[HS] Lower Chest":                              "Hyrule Sewers Key",
        "[HS] Upper Chest":                              "Gold Rupee",
        "[Mai] Hyrule Graveyard Wall": {},
        "[Mai] Sanctuary Wall":                          {},
        "[Mai] South of Zora's Domain": {},
        "[Mai] Waterfall Ledge": {},
        "[Mai] Witch's House": {},
        "[Mai] Wooden Bridge": {},
        "[Mai] Zora's Domain": {}
      },
      "Southern Ruins": {
        "Flippers Mini-Dungeon":                         "Silver Rupee",
        "Runaway Item Seller":                           "Piece of Heart",
        "Southern Ruins Ledge":                          "Red Rupee",
        "Southern Ruins Pillar Cave":                    "Piece of Heart",
        "[Mai] Outside Flippers Mini-Dungeon": {},
        "[Mai] Southern Ruins Bomb Cave": {},
        "[Mai] Southern Ruins Pillars": {}
      }
    },
    "Lorule": {
      "Dark Ruins": {
        "Dark Maze Chest":                               "Heart Container",
        "Dark Maze Ledge":                               "Purple Rupee",
        "Dark Palace Weather Vane":                      {
          "position": "1002x218"
        },
        "Hinox (1)":                                     "Lamp+",
        "Hinox (2)":                                     "Monster Guts",
        "Hinox (3)":                                     "Silver Rupee",
        "Hinox (4)":                                     "Monster Guts",
        "Hinox (5)":                                     "Purple Rupee",
        "Hinox (6)":                                     "Silver Rupee",
        "Ku's Domain Fight":                             "Master Ore",
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
        "Graveyard Peninsula":                           "Silver Rupee",
        "Graveyard Weather Vane":                        {
          "position": "817x166"
        },
        "Philosopher's Cave":                            {
          "position": "746x144"
        },
        "[LS] Entrance Chest":                           "Lorule Sewers Key",
        "[LS] Ledge":                                    "Piece of Heart",
        "[LS] Lower Chest":                              "Net+",
        "[LS] Upper Chest":                              "Empty Bottle",
        "[Mai] Lorule Graveyard Big Rock": {},
        "[Mai] Lorule Graveyard Tree": {},
        "[Mai] Lorule Graveyard Wall": {}
      },
      "Lorule Castle Area": {
        "Big Bomb Flower Cave":                          "Silver Rupee",
        "Blacksmith (Lorule)":                           "Silver Rupee",
        "Blacksmith Weather Vane":                       {
          "position": "680x270"
        },
        "Fortune's Choice":                              {
          "position": "621x270"
        },
        "Great Rupee Fairy":                             "Heart Container",
        "Lorule Castle Weather Vane":                    {
          "position": "762x240"
        },
        "Lorule Field Hookshot Chest":                   "Red Rupee",
        "Octoball Derby":                                {
          "position": "674.4x340"
        },
        "Pegasus Boots Pyramid":                         "Purple Rupee",
        "Rupee Rush (Lorule)":                           {
          "position": "553.2x346"
        },
        "Swamp Cave (Left)":                             "Tornado Rod+",
        "Swamp Cave (Middle)":                           "Purple Rupee",
        "Swamp Cave (Right)":                            "Piece of Heart",
        "Swamp Palace Weather Vane":                     {
          "position": "744x460"
        },
        "Thief Girl":                                    "Pouch",
        "Thieves' Town Item Shop (1)":                   "Bee",
        "Thieves' Town Item Shop (2)":                   "Golden Bee",
        "Thieves' Town Item Shop (3)":                   "Fairy",
        "Thieves' Town Item Shop (4)":                   "Shield",
        "Thieves' Town Weather Vane":                    {
          "position": "545x255"
        },
        "Vacant House":                                  {
          "position": "788.5x335",
          "housesItem": "Empty Bottle"
        },
        "Vacant House Weather Vane":                     {
          "position": "795x350"
        },
        "[Mai] Behind Vacant House":                     {
          "position": "788.5x328.5",
          "housesItem": "Lost Maiamai"
        },
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
        "[Mai] Octoball Derby Skull":                    {
          "position": "660x360",
          "housesItem": "Lost Maiamai"
        },
        "[Mai] Thieves' Town Tree": {},
        "[Mai] Thieves' Town Wall": {},
        "[Mai] Vacant House Rock": {}
      },
      "Lorule Death Mountain": {
        "Behind Ice Gimos":                              "Piece of Heart",
        "Death Mountain (Lorule) Weather Vane":          {
          "position": "886x95"
        },
        "Ice Cave Ledge":                                "Silver Rupee",
        "Ice Gimos Fight":                               "Bell",
        "Ice Ruins Weather Vane":                        {
          "position": "965x53"
        },
        "Lorule Mountain W Ledge":                       "Boomerang+",
        "Treacherous Tower":                             {
          "position": "796.5x14"
        },
        "Treacherous Tower Weather Vane":                {
          "position": "805x30"
        },
        "[Mai] Ice Cave Ledge":                          {},
        "[Mai] Lorule Mountain E Big Rock": {},
        "[Mai] Lorule Mountain E Wall": {},
        "[Mai] Lorule Mountain W Big Rock": {},
        "[Mai] Lorule Mountain W Skull": {},
        "[Mai] Outside Ice Ruins": {}
      },
      "Misery Mire": {
        "Misery Mire Ledge":                             "Monster Guts",
        "Misery Mire Weather Vane":                      {
          "position": "627x455"
        },
        "Sand Mini-Dungeon":                             "Red Rupee",
        "[Mai] Misery Mire Rock": {},
        "[Mai] Misery Mire Wall": {},
        "[Mai] Misery Mire Water": {}
      },
      "Skull Woods Area": {
        "Destroyed House":                               "Purple Rupee",
        "Mysterious Man":                                {
          "position": "567x20"
        },
        "Skull Woods Weather Vane":                      {
          "position": "608x100"
        },
        "[Mai] Destroyed House Tree": {},
        "[Mai] Skull Woods Bush": {},
        "[Mai] Skull Woods Dry Pond": {},
        "[Mai] Skull Woods Entrance Wall": {},
        "[Mai] Skull Woods Grass": {},
        "[Mai] Skull Woods Rock": {},
        "[Mai] Skull Woods Skull": {},
        "[Mai] n-Shaped House Wall": {},
        "n-Shaped House":                                "Silver Rupee"
      },
      "Turtle Rock Area": {
        "Dark/Turtle Chest":                             "Blue Rupee",
        "Lorule Lake Chest":                             "Heart Container",
        "Lorule Lakeside Item Shop (1)":                 "Bee",
        "Lorule Lakeside Item Shop (2)":                 "Golden Bee",
        "Lorule Lakeside Item Shop (3)":                 "Fairy",
        "Lorule Lakeside Item Shop (4)":                 "Shield",
        "Turtle Rock Weather Vane":                      {
          "position": "913x438"
        },
        "[Mai] Lorule Lake Rock": {},
        "[Mai] Lorule Lake SE Wall": {},
        "[Mai] Lorule Lake Skull": {},
        "[Mai] Lorule Lake Water": {},
        "[Mai] Lorule Lake West Wall": {}
      }
    },
    "Dungeons": {
      "Dark Palace": {
        "[PD] (1F) Fall From 2F":                        "Purple Rupee",
        "[PD] (1F) Hidden Room (Lower)":                 "Blue Rupee",
        "[PD] (1F) Hidden Room (Upper)":                 "Dark Palace Small Key",
        "[PD] (1F) Left Pit":                            "Dark Palace Small Key",
        "[PD] (1F) Right Pit":                           "Dark Palace Compass",
        "[PD] (1F) Switch Puzzle":                       "Dark Palace Big Key",
        "[PD] (2F) Alcove":                              "Silver Rupee",
        "[PD] (2F) Big Chest (Hidden)":                  "Silver Rupee",
        "[PD] (2F) South Hidden Room":                   "Gold Rupee",
        "[PD] (B1) Bomb Bowling":                        "Red Rupee",
        "[PD] (B1) Fall From 1F":                        "Piece of Heart",
        "[PD] (B1) Glow-in-the-Dark Maze":               "Piece of Heart",
        "[PD] (B1) Helmasaur Room":                      "Dark Palace Small Key",
        "[PD] (B1) Helmasaur Room (Fall)":               "Dark Palace Small Key",
        "[PD] Gemesaur King":                            "Purple Rupee",
        "[PD] Prize":                                    {
          "position": "990x214"
        },
      },
      "Desert Palace": {
        "[DP] (1F) Behind Rocks":                        "Empty Bottle",
        "[DP] (1F) Big Chest (Behind Wall)":             "Desert Palace Small Key",
        "[DP] (1F) Entrance":                            "Piece of Heart",
        "[DP] (1F) Sand Room (North)":                   "Purple Rupee",
        "[DP] (1F) Sand Room (South)":                   "Desert Palace Small Key",
        "[DP] (1F) Sand Switch Room":                    "Desert Palace Compass",
        "[DP] (2F) Beamos Room":                         "Piece of Heart",
        "[DP] (2F) Big Chest (Puzzle)":                  "Heart Container",
        "[DP] (2F) Leever Room":                         "Desert Palace Small Key",
        "[DP] (2F) Red/Blue Switches":                   "Red Rupee",
        "[DP] (2F) Under Rock (Ball Room)":              "Red Rupee",
        "[DP] (2F) Under Rock (Left)":                   "Boomerang+",
        "[DP] (2F) Under Rock (Right)":                  "Desert Palace Small Key",
        "[DP] (3F) Armos Room":                          "Desert Palace Small Key",
        "[DP] (3F) Behind Falling Sand":                 "Desert Palace Big Key",
        "[DP] Prize":                                    {
          "position": "43.5x402"
        },
        "[DP] Zaganaga":                                 "Sword+"
      },
      "Eastern Palace": {
        "[EP] (1F) Escape Chest":                        "Purple Rupee",
        "[EP] (1F) Left Door Chest":                     "Glove+",
        "[EP] (1F) Merge Chest":                         "Piece of Heart",
        "[EP] (1F) Popo Room":                           "Heart Container",
        "[EP] (1F) Secret Room":                         "Eastern Palace Small Key",
        "[EP] (1F) Switch Room":                         "Silver Rupee",
        "[EP] (2F) Ball Room":                           "Eastern Palace Compass",
        "[EP] (2F) Big Chest":                           "Monster Tail",
        "[EP] (2F) Defeat Popos":                        "Eastern Palace Big Key",
        "[EP] (2F) Switch Room":                         "Pegasus Boots",
        "[EP] (3F) Escape Chest":                        "Eastern Palace Small Key",
        "[EP] Prize":                                    {
          "position": "478x194"
        },
        "[EP] Yuga (1)":                                 "Blue Rupee",
        "[EP] Yuga (2)":                                 "Piece of Heart"
      },
      "House of Gales": {
        "[HG] (1F) Fire Bubbles":                        "Sand Rod+",
        "[HG] (1F) Switch Room":                         "House of Gales Small Key",
        "[HG] (1F) Torches":                             "House of Gales Compass",
        "[HG] (1F) West Room":                           "Silver Rupee",
        "[HG] (1F) West Room Secret":                    "House of Gales Small Key",
        "[HG] (2F) Big Chest":                           "House of Gales Small Key",
        "[HG] (2F) Fire Ring":                           "House of Gales Small Key",
        "[HG] (2F) Narrow Ledge":                        "Hylian Shield",
        "[HG] (3F) Fire Bubbles":                        "Purple Rupee",
        "[HG] (3F) Rat Room":                            "House of Gales Big Key",
        "[HG] Margomill":                                "Charm",
        "[HG] Prize":                                    {
          "position": "403x425"
        },
      },
      "Hyrule Castle": {
        "[HC] Battlement":                               "Hookshot+",
        "[HC] Throne":                                   "Piece of Heart",
        "[HC] West Wing":                                "Stamina Scroll"
      },
      "Ice Ruins": {
        "[IR] (1F) Hidden Chest":                        "Ice Ruins Big Key",
        "[IR] (B1) East Chest":                          "Purple Rupee",
        "[IR] (B1) Narrow Ledge":                        "Ice Ruins Small Key",
        "[IR] (B1) Upper Chest":                         "Piece of Heart",
        "[IR] (B2) Ice Pillar":                          "Tornado Rod+",
        "[IR] (B2) Long Merge Chest":                    "Ice Ruins Small Key",
        "[IR] (B3) Big Chest (Puzzle)":                  "Piece of Heart",
        "[IR] (B3) Grate Chest (Left)":                  "Silver Rupee",
        "[IR] (B3) Grate Chest (Right)":                 "Ice Ruins Small Key",
        "[IR] (B4) Narrow Platform":                     "Ice Ruins Compass",
        "[IR] (B4) Southeast Chest (Fall)":              "Red Rupee",
        "[IR] (B4) Southwest Chest (Fall)":              "Silver Rupee",
        "[IR] (B4) Switches":                            "Silver Rupee",
        "[IR] (B5) Big Chest":                           "Silver Rupee",
        "[IR] Dharkstare":                               "Sword+",
        "[IR] Prize":                                    {
          "position": "980x40"
        },
      },
      "Lorule Castle": {
        "[LC] (1F) Center":                              "Red Rupee",
        "[LC] (1F) Ledge":                               "Silver Rupee",
        "[LC] (2F) Hidden Path":                         "Lorule Castle Small Key",
        "[LC] (2F) Ledge":                               "Sand Rod+",
        "[LC] (2F) Near Torches":                        "Purple Rupee",
        "[LC] (4F) Center":                              "Piece of Heart",
        "[LC] (4F) Hidden Path":                         "Lorule Castle Small Key",
        "[LC] Bomb Trial (1)":                           "Lorule Castle Small Key",
        "[LC] Bomb Trial (2)":                           "Silver Rupee",
        "[LC] Hook Trial (1)":                           "Lorule Castle Compass",
        "[LC] Hook Trial (2)":                           "Lorule Castle Small Key",
        "[LC] Lamp Trial":                               "Red Rupee",
        "[LC] Tile Trial (1)":                           "Lorule Castle Small Key",
        "[LC] Tile Trial (2)":                           "Smooth Gem",
        "[LC] Zelda":                                    "Silver Rupee"
      },
      "Skull Woods": {
        "[SW] (B1) Big Chest (Eyes)":                    "Monster Guts",
        "[SW] (B1) Big Chest (Upper)":                   "Glove+",
        "[SW] (B1) Gibdo Room (Hole)":                   "Skull Woods Small Key",
        "[SW] (B1) Gibdo Room (Lower)":                  "Skull Woods Small Key",
        "[SW] (B1) Grate Room":                          "Skull Woods Big Key",
        "[SW] (B1) South Chest":                         "Skull Woods Small Key",
        "[SW] (B2) Moving Platform Room":                "Skull Woods Compass",
        "[SW] Knucklemaster":                            "Blue Rupee",
        "[SW] Outdoor Chest":                            "Piece of Heart",
        "[SW] Prize":                                    {
          "position": "558x50"
        },
      },
      "Swamp Palace": {
        "[SP] (1F) Big Chest (Fire)":                    "Heart Container",
        "[SP] (1F) East Room":                           "Swamp Palace Small Key",
        "[SP] (1F) Water Puzzle":                        "Swamp Palace Small Key",
        "[SP] (1F) West Room":                           "Blue Rupee",
        "[SP] (B1) Big Chest (Secret)":                  "Silver Rupee",
        "[SP] (B1) Center":                              "Swamp Palace Small Key",
        "[SP] (B1) Gyorm":                               "Purple Rupee",
        "[SP] (B1) Raft Room (Left)":                    "Swamp Palace Small Key",
        "[SP] (B1) Raft Room (Pillar)":                  "Swamp Palace Big Key",
        "[SP] (B1) Raft Room (Right)":                   "Blue Rupee",
        "[SP] (B1) Waterfall Room":                      "Swamp Palace Compass",
        "[SP] Arrghus":                                  "Great Spin",
        "[SP] Prize":                                    {
          "position": "750x450"
        },
      },
      "Thieves' Hideout": {
        "[TT] (B1) Behind Wall":                         "Silver Rupee",
        "[TT] (B1) Big Chest (Entrance)":                "Silver Rupee",
        "[TT] (B1) Grate Chest":                         "Thieves' Hideout Big Key",
        "[TT] (B1) Jail Cell":                           "Thieves' Hideout Compass",
        "[TT] (B2) Eyegores":                            "Ice Rod+",
        "[TT] (B2) Grate Chest (Fall)":                  "Silver Rupee",
        "[TT] (B2) Jail Cell":                           "Fire Rod+",
        "[TT] (B2) Switch Puzzle Room":                  "Thieves' Hideout Small Key",
        "[TT] (B3) Big Chest (Hidden)":                  "Red Rupee",
        "[TT] (B3) Underwater":                          "Hint Glasses",
        "[TT] Prize":                                    {
          "position": "584x245"
        },
        "[TT] Stalblind":                                "Silver Rupee"
      },
      "Tower of Hera": {
        "[TH] (11F) Big Chest":                          "Monster Guts",
        "[TH] (1F) Center":                              "Silver Rupee",
        "[TH] (1F) Outside":                             "Tower of Hera Small Key",
        "[TH] (3F) Platform":                            "Piece of Heart",
        "[TH] (5F) Red/Blue Switches":                   "Tower of Hera Compass",
        "[TH] (6F) Left Mole":                           "Tower of Hera Small Key",
        "[TH] (6F) Right Mole":                          "Tower of Hera Big Key",
        "[TH] (7F) Outside (Ledge)":                     "Piece of Heart",
        "[TH] (8F) Fairy Room":                          "Piece of Heart",
        "[TH] Moldorm":                                  "Sword+",
        "[TH] Prize":                                    {
          "position": "300.2x12"
        },
      },
      "Turtle Rock": {
        "[TR] (1F) Center":                              "Turtle Rock Compass",
        "[TR] (1F) Defeat Flamolas":                     "Ice Rod+",
        "[TR] (1F) Grate Chest":                         "Turtle Rock Big Key",
        "[TR] (1F) Northeast Ledge":                     "Purple Rupee",
        "[TR] (1F) Northwest Room":                      "Gold Rupee",
        "[TR] (1F) Southeast Chest":                     "Gold Rupee",
        "[TR] (1F) Under Center":                        "Silver Rupee",
        "[TR] (B1) Big Chest (Center)":                  "Turtle Rock Small Key",
        "[TR] (B1) Big Chest (Top)":                     "Silver Rupee",
        "[TR] (B1) Grate Chest (Small)":                 "Turtle Rock Small Key",
        "[TR] (B1) Northeast Room":                      "Turtle Rock Small Key",
        "[TR] (B1) Platform":                            "Mail+",
        "[TR] (B1) Under Center":                        "Gold Rupee",
        "[TR] Grinexx":                                  "Monster Tail",
        "[TR] Left Balcony":                             "Monster Horn",
        "[TR] Prize":                                    {
          "position": "903x425"
        },
      }
    }
  },
  "door_map": {
    "Dark Palace Entrance":                              "Dark Palace Exit",
    "Dark Palace Exit":                                  "Dark Palace Entrance",
    "Desert Palace Entrance":                            "Desert Palace Exit",
    "Desert Palace Exit":                                "Desert Palace Entrance",
    "Eastern Palace Entrance":                           "Eastern Palace Exit",
    "Eastern Palace Exit":                               "Eastern Palace Entrance",
    "House of Gales Entrance":                           "House of Gales Exit",
    "House of Gales Exit":                               "House of Gales Entrance",
    "Ice Ruins Entrance":                                "Ice Ruins Exit",
    "Ice Ruins Exit":                                    "Ice Ruins Entrance",
    "Inside Hyrule Castle Entrance":                     "Inside Hyrule Castle Exit",
    "Inside Hyrule Castle Exit":                         "Inside Hyrule Castle Entrance",
    "Lorule Castle Entrance":                            "Lorule Castle Exit",
    "Lorule Castle Exit":                                "Lorule Castle Entrance",
    "Skull Woods Entrance":                              "Skull Woods Exit",
    "Skull Woods Exit":                                  "Skull Woods Entrance",
    "Swamp Palace Entrance":                             "Swamp Palace Exit",
    "Swamp Palace Exit":                                 "Swamp Palace Entrance",
    "Thieves' Hideout Entrance":                         "Thieves' Hideout Exit",
    "Thieves' Hideout Exit":                             "Thieves' Hideout Entrance",
    "Tower of Hera Entrance":                            "Tower of Hera Exit",
    "Tower of Hera Exit":                                "Tower of Hera Entrance",
    "Turtle Rock Entrance":                              "Turtle Rock Exit",
    "Turtle Rock Exit":                                  "Turtle Rock Entrance"
  },
  "crack_map": {
    "Dark Ruins Pillar Crack":                           "Eastern Ruins Pillar Crack",
    "Dark Ruins SE Crack":                               "Eastern Ruins SE Crack",
    "Desert Left Pillar Crack":                          "Mire Left Pillar Crack",
    "Desert Middle Crack":                               "Mire Middle Crack",
    "Desert North Crack":                                "Mire North Crack",
    "Desert Palace Crack":                               "Zaganaga Crack",
    "Desert Right Pillar Crack":                         "Mire Right Pillar Crack",
    "Desert SW Crack":                                   "Mire SW Crack",
    "Destroyed House Crack":                             "Rosso's House Crack",
    "Eastern Ruins Pillar Crack":                        "Dark Ruins Pillar Crack",
    "Eastern Ruins SE Crack":                            "Dark Ruins SE Crack",
    "Hyrule Death West Crack":                           "Lorule Death West Crack",
    "Hyrule Floating Island Crack":                      "Lorule Floating Island Crack",
    "Hyrule Graveyard Ledge Crack":                      "Lorule Graveyard Ledge Crack",
    "Hyrule Hotfoot Crack":                              "Lorule Hotfoot Crack",
    "Hyrule Left Paradox Crack":                         "Lorule Left Paradox Crack",
    "Hyrule Right Paradox Crack":                        "Lorule Right Paradox Crack",
    "Hyrule River Crack":                                "Lorule River Crack",
    "Hyrule Rosso's Ore Mine Crack":                     "Lorule Rosso's Ore Mine Crack",
    "Hyrule Swamp Pillar Crack":                         "Lorule Swamp Pillar Crack",
    "Hyrule Waterfall Crack":                            "Lorule Waterfall Crack",
    "Ku's Domain Crack":                                 "Zora's Domain Crack",
    "Lake Hylia Crack":                                  "Lorule Lake Crack",
    "Lorule Death West Crack":                           "Hyrule Death West Crack",
    "Lorule Floating Island Crack":                      "Hyrule Floating Island Crack",
    "Lorule Graveyard Ledge Crack":                      "Hyrule Graveyard Ledge Crack",
    "Lorule Hotfoot Crack":                              "Hyrule Hotfoot Crack",
    "Lorule Lake Crack":                                 "Lake Hylia Crack",
    "Lorule Left Paradox Crack":                         "Hyrule Left Paradox Crack",
    "Lorule Right Paradox Crack":                        "Hyrule Right Paradox Crack",
    "Lorule River Crack":                                "Hyrule River Crack",
    "Lorule Rosso's Ore Mine Crack":                     "Hyrule Rosso's Ore Mine Crack",
    "Lorule Swamp Pillar Crack":                         "Hyrule Swamp Pillar Crack",
    "Lorule Waterfall Crack":                            "Hyrule Waterfall Crack",
    "Lost Woods Pillar Crack":                           "Skull Woods Pillar Crack",
    "Mire Left Pillar Crack":                            "Desert Left Pillar Crack",
    "Mire Middle Crack":                                 "Desert Middle Crack",
    "Mire North Crack":                                  "Desert North Crack",
    "Mire Right Pillar Crack":                           "Desert Right Pillar Crack",
    "Mire SW Crack":                                     "Desert SW Crack",
    "Misery Mire Entrance Crack":                        "Misery Mire Exit Crack",
    "Misery Mire Exit Crack":                            "Misery Mire Entrance Crack",
    "Philosopher's Cave Crack":                          "Sanctuary Crack",
    "Rosso's House Crack":                               "Destroyed House Crack",
    "Sahasrahla's House Crack":                          "n-Shaped House Crack",
    "Sanctuary Crack":                                   "Philosopher's Cave Crack",
    "Skull Woods Pillar Crack":                          "Lost Woods Pillar Crack",
    "Stylish Woman's House Crack":                       "Thieves' Town Crack",
    "Thieves' Town Crack":                               "Stylish Woman's House Crack",
    "Vacant House Crack":                                "Your House Crack",
    "Your House Crack":                                  "Vacant House Crack",
    "Zaganaga Crack":                                    "Desert Palace Crack",
    "Zora's Domain Crack":                               "Ku's Domain Crack",
    "[HC] Crack":                                        "[LC] Crack",
    "[LC] Crack":                                        "[HC] Crack",
    "n-Shaped House Crack":                              "Sahasrahla's House Crack"
  },
  "weather_vane_map": {
    "Blacksmith Weather Vane":                           "Blacksmith Weather Vane",
    "Dark Palace Weather Vane":                          "Dark Palace Weather Vane",
    "Death Mountain (Hyrule) Weather Vane":              "Death Mountain (Hyrule) Weather Vane",
    "Death Mountain (Lorule) Weather Vane":              "Death Mountain (Lorule) Weather Vane",
    "Desert Palace Weather Vane":                        "Desert Palace Weather Vane",
    "Eastern Palace Weather Vane":                       "Eastern Palace Weather Vane",
    "Graveyard Weather Vane":                            "Graveyard Weather Vane",
    "House of Gales Weather Vane":                       "House of Gales Weather Vane",
    "Ice Ruins Weather Vane":                            "Ice Ruins Weather Vane",
    "Kakariko Village Weather Vane":                     "Kakariko Village Weather Vane",
    "Lorule Castle Weather Vane":                        "Lorule Castle Weather Vane",
    "Misery Mire Weather Vane":                          "Misery Mire Weather Vane",
    "Sanctuary Weather Vane":                            "Sanctuary Weather Vane",
    "Skull Woods Weather Vane":                          "Skull Woods Weather Vane",
    "Swamp Palace Weather Vane":                         "Swamp Palace Weather Vane",
    "Thieves' Town Weather Vane":                        "Thieves' Town Weather Vane",
    "Tower of Hera Weather Vane":                        "Tower of Hera Weather Vane",
    "Treacherous Tower Weather Vane":                    "Treacherous Tower Weather Vane",
    "Turtle Rock Weather Vane":                          "Turtle Rock Weather Vane",
    "Vacant House Weather Vane":                         "Vacant House Weather Vane",
    "Witch's House Weather Vane":                        "Witch's House Weather Vane",
    "Your House Weather Vane":                           "Your House Weather Vane"
  }
}