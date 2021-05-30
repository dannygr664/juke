function movementControls() {
  if ((currentLevel.genre !== TITLE_GENRE || currentLevel.currentScreen === HOW_TO_PLAY_SCREEN) && !isPaused && playerRole === GAMER) {
    handleMovementControls(keyIsDown(RIGHT_ARROW), keyIsDown(LEFT_ARROW));
  }
}


function handleMovementControls(isRightArrowDown, isLeftArrowDown) {
  if (isRightArrowDown) {
    player.sprite.setSpeed(player.speed, 0);
  } else if (isLeftArrowDown) {
    player.sprite.setSpeed(player.speed, 180);
  } else {
    player.sprite.setSpeed(0, 0);
  }
}


function handleJumpingControls() {
  if (playerRole === GAMER && keyDown(' ')) {
    player.jump();
  }
}


function handleRevivingControls() {
  if (playerRole === GAMER && keyDown(' ')) {
    handleRevived();
  } else {
    movementControls();
  }
}


function handleVolumeControls() {
  let oldVolume = audioManager.volume;

  if (keyDown('q' || 'Q')) {
    audioManager.volume += VOLUME_STEP;
  } else if (keyDown('z' || 'Z')) {
    audioManager.volume -= VOLUME_STEP;
  } else if (keyDown('a' || 'A')) {
    audioManager.volume = INITIAL_VOLUME;
  }

  audioManager.volume = constrain(audioManager.volume, VOLUME_MIN, VOLUME_MAX);

  if (audioManager.volume !== oldVolume && !player.isReviving) {
    player.energy -= VOLUME_ENERGY_COST;
    audioManager.updateVolume(audioManager.volume, 0);
  }
}


function handleSoundSpeedControls() {
  let oldSoundSpeed = audioManager.soundSpeed;
  let step = (audioManager.soundSpeed >= 1) ? SOUND_SPEED_STEP : (SOUND_SPEED_STEP / 2);
  if (keyDown('w' || 'W')) {
    audioManager.soundSpeed += step;
  } else if (keyDown('x' || 'X')) {
    audioManager.soundSpeed -= step;
  } else if (keyDown('s' || 'S')) {
    audioManager.soundSpeed = INITIAL_SOUND_SPEED;
  }

  audioManager.soundSpeed = constrain(audioManager.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX);

  if (audioManager.soundSpeed !== oldSoundSpeed && !player.isReviving) {
    player.energy -= SOUND_SPEED_ENERGY_COST;
    audioManager.updateSoundSpeed(audioManager.soundSpeed, 0);
  }
}


function keyPressed() {
  if (isLoaded && isAwake && !returningToSongSelectionScreen) {
    if (currentLevel.genre === TITLE_GENRE) {
      if (
        currentLevel.currentScreen === MAIN_MENU_SCREEN
        || currentLevel.currentScreen === MODE_SELECTION_SCREEN
        || currentLevel.currentScreen === NETWORK_SELECTION_SCREEN
        || currentLevel.currentScreen === ROLE_SELECTION_SCREEN
      ) {
        menuSelectionKeyPressed(key, keyCode);
      } else if (currentLevel.currentScreen === CONTROLLER_SELECTION_SCREEN) {
        controllerSelectionScreenKeyPressed(key, keyCode);
      } else if (currentLevel.currentScreen === SONG_SELECTION_SCREEN) {
        songSelectionScreenKeyPressed(key, keyCode);
      } else if (currentLevel.currentScreen === HOW_TO_PLAY_SCREEN) {
        howToPlayScreenKeyPressed(key, keyCode);
      } else if (currentLevel.currentScreen === CREDITS_SCREEN) {
        creditsScreenKeyPressed(key, keyCode);
      }
    } else {
      pauseOrQuitKeyPressed(key, keyCode);
    }
  } else if (isLoaded && !isAwake) {
    wakeUp();
  }
}


function menuSelectionKeyPressed(key, keyCode) {
  let menuItems = currentLevel.screenToMenuItems[currentLevel.currentScreen];
  if (keyCode === DOWN_ARROW) {
    currentLevel.currentItemSelected =
      (currentLevel.currentItemSelected + 1) % menuItems.length;
  } else if (keyCode === UP_ARROW) {
    if (currentLevel.currentItemSelected === 0) {
      currentLevel.currentItemSelected = menuItems.length - 1;
    } else {
      currentLevel.currentItemSelected =
        (currentLevel.currentItemSelected - 1) % menuItems.length;
    }
  } else if (key === ' ' || keyCode === RETURN || keyCode === ENTER) {
    currentSelection = menuItems[currentLevel.currentItemSelected];

    if (currentLevel.currentScreen === MAIN_MENU_SCREEN) {
      switch (currentSelection) {
        case 'Play':
          currentLevel.currentScreen = MODE_SELECTION_SCREEN;
          break;
        case 'How To Play':
          player.changeLevel();
          platformManager.changeLevel();
          audioManager.updateVolume(INITIAL_VOLUME, 0);
          currentLevel.currentScreen = HOW_TO_PLAY_SCREEN;
          break;
        case 'Credits':
          currentLevel.currentScreen = CREDITS_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === MODE_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Single Player':
          changeToSongSelectionScreen();
          break;
        case 'Multiplayer':
          isMultiplayerMode = true;
          currentLevel.currentScreen = NETWORK_SELECTION_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === NETWORK_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Local':
          networkMode = LOCAL;
          changeToControllerSelectionScreen();
          break;
        case 'Online':
          networkMode = ONLINE;
          currentLevel.currentScreen = ROLE_SELECTION_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === ROLE_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Gamer':
          playerRole = GAMER;
          changeToControllerSelectionScreen();
          break;
        case 'Musician':
          playerRole = MUSICIAN;
          changeToControllerSelectionScreen();
      }
    }
  } else if (keyCode === ESCAPE) {
    if (currentLevel.currentScreen === MODE_SELECTION_SCREEN) {
      currentLevel.currentScreen = MAIN_MENU_SCREEN;
      currentLevel.currentItemSelected = 0;
    } else if (currentLevel.currentScreen === NETWORK_SELECTION_SCREEN) {
      isMultiplayerMode = false;
      currentLevel.currentScreen = MODE_SELECTION_SCREEN;
      currentLevel.currentItemSelected = 0;
    } else if (currentLevel.currentScreen === ROLE_SELECTION_SCREEN) {
      networkMode = LOCAL;
      currentLevel.currentScreen = NETWORK_SELECTION_SCREEN;
      currentLevel.currentItemSelected = 0;
    }
  }
}


function controllerSelectionScreenKeyPressed(key, keyCode) {
  if (keyCode === ESCAPE) {
    if (controllerSelected) {
      disconnectMIDIControllers();
      // if (networkMode === ONLINE) {
      //   socket.emit('not ready');
      // }
      controllerSelected = false;
    } else {
      // if (networkMode === ONLINE) {
      //   socket.emit('remove player from room');
      // }
      currentLevel.currentScreen = NETWORK_SELECTION_SCREEN;
      currentLevel.currentItemSelected = 0;
      playerRole = GAMER;
    }
  } else {
    if (playerRole === MUSICIAN || networkMode === LOCAL)
      handleControllerSelectionScreenKeyPressed(key, keyCode);
  }
}


function handleControllerSelectionScreenKeyPressed(key, keyCode) {
  if (playerRole === MUSICIAN || networkMode === LOCAL) {
    let menuItems = midiManager.controllers;
    if (menuItems.length > 0 && keyCode !== ESCAPE) {
      if (keyCode === DOWN_ARROW) {
        currentLevel.currentItemSelected =
          (currentLevel.currentItemSelected + 1) % menuItems.length;
      } else if (keyCode === UP_ARROW) {
        if (currentLevel.currentItemSelected === 0) {
          currentLevel.currentItemSelected = menuItems.length - 1;
        } else {
          currentLevel.currentItemSelected =
            (currentLevel.currentItemSelected - 1) % menuItems.length;
        }
      } else if (key === ' ' || keyCode === RETURN || keyCode === ENTER) {
        controllerSelected = true;
        connectMIDIController(midiManager.controllers[currentLevel.currentItemSelected]);
        // if (networkMode === ONLINE) {
        //   socket.emit('ready');
        // } else
        if (networkMode === LOCAL) {
          changeToSongSelectionScreen();
        }
      }
    }
  }
}


function songSelectionScreenKeyPressed(key, keyCode) {
  if (keyCode === ESCAPE) {
    audioManager.stopSongSample();
    if (isMultiplayerMode) {
      disconnectMIDIControllers();
      changeToControllerSelectionScreen();
    } else {
      currentLevel.currentScreen = MODE_SELECTION_SCREEN;
    }
  } else {
    handleSongSelectionScreenKeyPressed(key, keyCode);
  }
}


function handleSongSelectionScreenKeyPressed(key, keyCode) {
  let menuItems = audioManager.songs;
  if (menuItems.length > 0 && keyCode !== ESCAPE) {
    if (keyCode === DOWN_ARROW) {
      audioManager.stopSongSample();
      currentLevel.currentItemSelected =
        (currentLevel.currentItemSelected + 1) % menuItems.length;
      let genre = menuItems[currentLevel.currentItemSelected].soundInfo.genre;
      audioManager.playSongSample(genre);
    } else if (keyCode === UP_ARROW) {
      audioManager.stopSongSample();
      if (currentLevel.currentItemSelected === 0) {
        currentLevel.currentItemSelected = menuItems.length - 1;
        let genre = menuItems[currentLevel.currentItemSelected].soundInfo.genre;
        audioManager.playSongSample(genre);
      } else {
        currentLevel.currentItemSelected =
          (currentLevel.currentItemSelected - 1) % menuItems.length;
        let genre = menuItems[currentLevel.currentItemSelected].soundInfo.genre;
        audioManager.playSongSample(genre);
      }
    } else if (key === ' ' || keyCode === RETURN || keyCode === ENTER) {
      audioManager.stopSongSample();
      let genre = menuItems[currentLevel.currentItemSelected].soundInfo.genre;
      if (isMultiplayerMode) {
        startMultiplayerMode(genre);
      } else {
        startSinglePlayerMode(genre);
      }
    }
  }
}


function howToPlayScreenKeyPressed(key, keyCode) {
  if (keyCode === ESCAPE) {
    if (isPaused) {
      handleUnpausing();
    } else {
      handlePausing();
    }
    isPaused = !isPaused;
  } else if (isPaused) {
    if (keyCode === DELETE || keyCode === BACKSPACE) {
      audioManager.stopSounds();
      isPaused = !isPaused;
      changeLevel(TITLE_GENRE, TITLE_GENRE);
    }
  }
}


function creditsScreenKeyPressed(key, keyCode) {
  if (keyCode === ESCAPE) {
    currentLevel.currentScreen = MAIN_MENU_SCREEN;
    currentLevel.currentItemSelected = 0;
  }
}


function pauseOrQuitKeyPressed(key, keyCode) {
  // if (isMultiplayerMode && networkMode === ONLINE) {
  //   socket.emit('pause or quit', {
  //     key: key,
  //     keyCode: keyCode
  //   });
  // }
  handlePauseOrQuitKeyPressed(key, keyCode);
}


function handlePauseOrQuitKeyPressedMessage(data) {
  if (isMultiplayerMode) {
    handlePauseOrQuitKeyPressed(data.key, data.keyCode);
  }
}


function handlePauseOrQuitKeyPressed(key, keyCode) {
  if (keyCode === ESCAPE) {
    if (isPaused) {
      handleUnpausing();
    } else {
      handlePausing();
    }
    isPaused = !isPaused;
  } else if (isPaused) {
    if (keyCode === DELETE || keyCode === BACKSPACE) {
      isPaused = !isPaused;
      returnToSongSelectionScreen(levelManager.getCurrentLevel().genre);
    }
  }
}


function mousePressed() {
  if (isLoaded) {
    handleMousePressed();
  }
}


function handleMousePressed() {
  if (!isAwake) {
    wakeUp();
  } else if (currentLevel.genre === TITLE_GENRE && (
    currentLevel.currentScreen === MAIN_MENU_SCREEN
    || currentLevel.currentScreen === MODE_SELECTION_SCREEN
    || currentLevel.currentScreen === NETWORK_SELECTION_SCREEN
    || currentLevel.currentScreen === ROLE_SELECTION_SCREEN
  )) {
    currentSelection = (currentLevel.screenToMenuItems[currentLevel.currentScreen])[currentLevel.currentItemSelected];
    if (currentLevel.currentScreen === MAIN_MENU_SCREEN) {
      switch (currentSelection) {
        case 'Play':
          currentLevel.currentScreen = MODE_SELECTION_SCREEN;
          break;
        case 'How To Play':
          player.changeLevel();
          platformManager.changeLevel();
          audioManager.updateVolume(INITIAL_VOLUME, 0);
          currentLevel.currentScreen = HOW_TO_PLAY_SCREEN;
          break;
        case 'Credits':
          currentLevel.currentScreen = CREDITS_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === MODE_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Single Player':
          changeToSongSelectionScreen();
          break;
        case 'Multiplayer':
          isMultiplayerMode = true;
          currentLevel.currentScreen = NETWORK_SELECTION_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === NETWORK_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Local':
          networkMode = LOCAL;
          changeToControllerSelectionScreen();
          break;
        case 'Online':
          networkMode = ONLINE;
          currentLevel.currentScreen = ROLE_SELECTION_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === ROLE_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Gamer':
          playerRole = GAMER;
          changeToControllerSelectionScreen();
          break;
        case 'Musician':
          playerRole = MUSICIAN;
          changeToControllerSelectionScreen();
      }
    }
  } else if (currentLevel.currentScreen === SONG_SELECTION_SCREEN) {
    let menuItems = audioManager.songs;
    if (mouseY > height * 0.75) {
      currentLevel.currentItemSelected =
        (currentLevel.currentItemSelected + 1) % menuItems.length;
      audioManager.stopSongSample();
      let genre = menuItems[currentLevel.currentItemSelected].soundInfo.genre;
      audioManager.playSongSample(genre);
    } else if (mouseY < height * 0.25) {
      audioManager.stopSongSample();
      if (currentLevel.currentItemSelected === 0) {
        currentLevel.currentItemSelected = menuItems.length - 1;
        let genre = menuItems[currentLevel.currentItemSelected].soundInfo.genre;
        audioManager.playSongSample(genre);
      } else {
        currentLevel.currentItemSelected =
          (currentLevel.currentItemSelected - 1) % menuItems.length;
        let genre = menuItems[currentLevel.currentItemSelected].soundInfo.genre;
        audioManager.playSongSample(genre);
      }
    } else {
      audioManager.stopSongSample();
      let genre = menuItems[currentLevel.currentItemSelected].soundInfo.genre;
      if (isMultiplayerMode) {
        startMultiplayerMode(genre);
      } else {
        startSinglePlayerMode(genre);
      }
    }
  } else if (currentLevel.currentScreen === CONTROLLER_SELECTION_SCREEN && midiManager.controllers.length > 0) {
    controllerSelected = true;
    connectMIDIController(midiManager.controllers[currentLevel.currentItemSelected]);
    // if (networkMode === ONLINE) {
    //   socket.emit('ready');
    // } else
    if (networkMode === LOCAL) {
      changeToSongSelectionScreen();
    }
  }
}


function mouseMoved() {
  if (isAwake) {
    handleMouseMoved(mouseY);
  }
}


function handleMouseMoved(yPos) {
  if (currentLevel.genre === TITLE_GENRE) {
    if (currentLevel.currentScreen === MAIN_MENU_SCREEN) {
      const DISTANCE_BETWEEN_ITEMS = currentLevel.getYPosOfItem(2) - currentLevel.getYPosOfItem(1);
      if (yPos <= currentLevel.getYPosOfItem(1) + (DISTANCE_BETWEEN_ITEMS / 2)) {
        currentLevel.currentItemSelected = 0;
      } else if (yPos <= currentLevel.getYPosOfItem(2) + (DISTANCE_BETWEEN_ITEMS / 2)) {
        currentLevel.currentItemSelected = 1;
      } else {
        currentLevel.currentItemSelected = 2;
      }
    } else if (currentLevel.currentScreen === MODE_SELECTION_SCREEN || currentLevel.currentScreen === ROLE_SELECTION_SCREEN || currentLevel.currentScreen === NETWORK_SELECTION_SCREEN) {
      const DISTANCE_BETWEEN_ITEMS = currentLevel.getYPosOfItem(2) - currentLevel.getYPosOfItem(1);
      if (yPos <= currentLevel.getYPosOfItem(1) + (DISTANCE_BETWEEN_ITEMS / 2)) {
        currentLevel.currentItemSelected = 0;
      } else {
        currentLevel.currentItemSelected = 1;
      }
    } else if (currentLevel.currentScreen === CONTROLLER_SELECTION_SCREEN) {
      const DISTANCE_BETWEEN_ITEMS = currentLevel.getYPosOfItem(2) - currentLevel.getYPosOfItem(1.5);
      let isLastItemSelected = true;
      for (let i = 0; i < midiManager.controllers.length; i++) {
        if (yPos <= currentLevel.getYPosOfItem((i * 0.5) + 1.5) + (DISTANCE_BETWEEN_ITEMS / 2)) {
          currentLevel.currentItemSelected = i;
          isLastItemSelected = false;
          break;
        }
      }
      if (isLastItemSelected) {
        currentLevel.currentItemSelected = midiManager.controllers.length - 1;
      }
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}