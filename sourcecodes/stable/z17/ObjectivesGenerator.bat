::Version 0.5
::Generator by Foomafu, additions by MsBeccaFae

@echo off
setlocal enabledelayedexpansion

:input
echo How many goals would you like to generate? (1-49):
set /p number=

REM Validate input is a number between 1 and 49
if "%number%"=="" goto invalid
for /l %%i in (1,1,49) do if "%number%"=="%%i" goto valid

:invalid
echo Invalid input. Please try again.
goto input

:valid
set max=%number%
echo Generating %max% goals by selecting objectives...
:: Define the lists for placeholders
set enemies=Armos;Arrgi;Bawb;Bee;Big_Ice_Gimos;Black_Lynel;Blob;Blue_Bari;Blue_Bow_Soldier;Blue_Eyegore;Blue_Hardhat_Beetle;Blue_Rupee_Like;Blue_Sword_Soldier;Blue_Taros;Blue_Tektite;Blue_Zazak;Bomb_Soldier;Buzz_Blob;Chasupa;Crow;Dacto;Dark_Ghini;Dark_Rat;Deadrock;Devalant;Fire_Bubble;Fire_Gimos;Fire_Wizzrobe;Flamola;Freezor;Geldman;Gibdo;Gibo;Gimos;Gold_Ball_and_Chain_Trooper;Green_Eyegore;Green_Goriya;Green_Kodongo;Green_Rupee_Like;Green_Sword_Soldier;Grey_Ball_and_Chain_Soldier;Gyorm;Helmasaur;Hinox;Hokkubokku;Hyu;Ice_Bubble;Ice_Gimos;Ice_Wizzrobe;Karat_Crab;Keeleon;Keese;Ku;Kyameron;Leever;Light_Ghini;Like_Like;Lorule_Soldier;Lorule_Spear_Soldier;Lynel;Mini-Moldorm;Moblin;Octorok;Peahat;Pengator;Poe;Popo;Purple_Biri;Purple_Mini-Moldorm;Rat;Red_Bari;Red_Biri;Red_Eyegore;Red_Goriya;Red_Hardhat_Beetle;Red_Kodongo;Red_Popo;Red_Rupee_Like;Red_Stalfos;Red_Taros;Red_Tektite;Ropa;Rope;Sand_Crab;Shield_Moblin;Skullrope;Slarok;Sluggula;Snap_Dragon;Snowball_Hinox;Snowball_Zirro;Soldier;Spear_Soldier;Stal;Stalfos;Swamola;Terrorpin;Vulture;Wallmaster;Water_Tektite;White_Bari;Yellow_Bari;Yellow_Biri;Zirro;Zora;Heedle;
set items=Bow;Bombs;Hookshot;Fire_Rod;Ice_Rod;Tornado_Rod;Hammer;Lamp;Boomerang;Bug_Net;Any_Sword;Pegasus Boots
set traps=Arrow_Trap;Ball_Trap;Beamos;Flying_Tile;Blade_Trap;Boulder;Bumper_Trap;Gargantuan_Ball;Guruguru_Bar;Magma_Bomb;Medusa;Mole;Rupee_Boulder;Spiked_Iron_Ball;Rolling_Pin;Winder;Angry_Hinox;Cucco
set bosses=Yuga;Margomill;Moldorm;Stal_Blind;Grinexx;Gemesaur_King;Dharkstare;Zaganaga;Yuga2;Yuganon;Knucklemaster;Arrghus
set zones=Lost_Woods_Area;Death_Mountain;River_Area;Kakariko_Village;Hyrule_Castle_Area;Eastern_Ruins;Desert;Southern_Ruins;Lake_Hylia;Skull_Woods_Area;Lorule_Death_Mountain;Graveyard;Lorule_Castle_Area;Misery_Mire;Turtle_Rock_Area;Dark_Ruins
set dungeons=Eastern_Palace;House_of_Gales;Tower_of_Hera;Desert_Palace;Ice_Ruins;Turtle_Rock;Swamp_Palace;Skull_Woods;Thieves'_Hideout;Palace_of_Darkness;Hyrule_Castle
set OneToFour=1;2;3;4
set OneToSeven=1;2;3;4;5;6;7
set EightToFifteen=8;9;10;11;12;13;14;15
set FourtoTen=4;5;6;7;8;9;10

set pendants=Pendant_of_Courage;Pendant_of_Power;Pendant_of_Wisdom

:: Helper function to get a random item from a semicolon-separated list
call :get_random_item "enemies" random_enemy
call :get_random_item "items" random_item
call :get_random_item "traps" random_trap
call :get_random_item "bosses" random_boss
call :get_random_item "zones" random_zone
call :get_random_item "dungeons" random_dungeon
call :get_random_item "pendants" random_pendant
call :get_random_item "OneToFour" random_onetofour
call :get_random_item "OneToSeven" random_onetoseven
call :get_random_item "EightToFifteen" random_eighttofifteen
call :get_random_item "FourToTen" random_fourtoten

:: Define the array of strings with variables replaced
set objectives[1]=Defeat 5 %random_enemy% using the %random_item%
set objectives[2]=Defeat %random_boss% swordless
set objectives[3]=Game Over to a %random_trap%
set objectives[4]=Burn 5 Gibdo
set objectives[5]=Defeat all enemies in %random_dungeon%
set objectives[6]=Clear Dark Palace while wearing the Hint Glasses
set objectives[7]=Complete all checks in %random_zone%
set objectives[8]=Get scammed by the Great Rupee Fairy
set objectives[9]=Have 20 Maiamais at one time
set objectives[10]=Return 30 Maiamais to their mother
set objectives[11]=Reach 10 Hearts
set objectives[12]=Complete %random_onetofour% Lorule Castle Trials
set objectives[13]=Acquire 5 Nice/Super items
set objectives[14]=Collect %random_pendant%
set objectives[15]=Complete %random_onetoseven% Treasure Hunter Dungeons
set objectives[16]=Pull a Geldman out of the sand
set objectives[17]=Talk to every NPC in Kakariko
set objectives[18]=Talk to every guard in Hyrule Castle
set objectives[19]=Reach a score of 110 or higher in Octoball
set objectives[20]=Reach a score of 150 or higher in Hyrule Rupee Rush
set objectives[21]=Reach a score of 300 or higher in Lorule Rupee Rush
set objectives[22]=Enter the vacant house using the Big Bomb
set objectives[23]=Wear Majora's Mask
set objectives[24]=SMOOCHIN' TIME! Receive a kiss from the Stylish Woman
set objectives[25]=Become Light Link (Lorule Castle Warp)
set objectives[26]=Get scolded in Octoball
set objectives[27]=Use a non-tournament legal bat in Octoball
set objectives[28]=Deliver the Premium Milk
set objectives[29]=Brew a Yellow Potion
set objectives[30]=Make a profit in Lorule Fortune's Choice
set objectives[31]=Reunite the Turtle Family
set objectives[32]=Smash Rosso's Rocks
set objectives[33]=Complete 5 floor Tower of Treachery in under 1 minute
set objectives[34]=Get humbled by Gramps
set objectives[35]=Get revived by a fairy in a bottle
set objectives[36]=Visit all 5 Great Fairies (ER, Swamp, DM, PD, TT)
set objectives[37]=Purchase Scoot Fruit, Foul Fruit, Shield, Bee, Fairy, Golden Bee
set objectives[38]=Active %random_eighttofifteen% Weather Vanes
set objectives[39]=Bottle an Apple
set objectives[40]=Be in jail in Kakariko, Thieves' Hideout, and Dark Maze
set objectives[41]=Get your shield eaten by a Like Like
set objectives[42]=Complete %random_dungeon%
set objectives[43]=Make the Cuccos retaliate
set objectives[44]=Purchase everything in Ravio's Shop
set objectives[45]=Beat Pegasus Boot Dungeon without Pegasus Boots
set objectives[46]=Listen to a rumor from the Rumor Guy
set objectives[47]=Find %random_fourtoten% Compasses
set objectives[48]=Collect all Maiamaias in the %random_zone%
set objectives[49]=Collect 5,000 rupees


:: Initialize variables
set selected=0

:select_objectives
if %selected% GEQ %max% goto done

:: Generate a random number between 1 and xx
set /a randIndex=%random% %% 49 + 1

:: Check if the objective is already picked
for /L %%j in (1,1,%selected%) do (
    if "!picked[%%j]!"=="!objectives[%randIndex%]!" (
        goto select_objectives
    )
)

:: Add the objective to the picked list
set /a selected+=1
set picked[%selected%]=!objectives[%randIndex%]!

goto select_objectives

:done
echo Writting the selected objectives to a file...
mkdir tems
cd tems
echo [ > beg.txt
for /L %%k in (1,1,%selected%) do (
    set "objective=!picked[%%k]!"
    set "objective=!objective:_= !"
    if %%k lss %selected% (
        echo {"name": "!objective!"}, > %%k.txt
    ) else (
        echo {"name": "!objective!"} > %%k.txt
    )
)
echo ] > end.txt
cd ../

pause
exit /b

:get_random_item
:: Input: %1 = variable name, %2 = output variable
setlocal enabledelayedexpansion
set list=!%~1!
set /a count=0
for %%i in (!list!) do set /a count+=1
set /a randIndex=%random% %% !count! + 1
set /a current=0
for %%i in (!list!) do (
    set /a current+=1
    if !current! EQU !randIndex! (
        endlocal & set "%~2=%%i" & exit /b
    )
)
