/*
 * Entry point for the watch app
 *
 * Copyright (c) 2020 Kay Patzwald
 *
 */
import document from "document";
import { gettext } from "i18n";

let tapButton = document.getElementById("tapButton");
let measureButton = document.getElementById("measureButton");
let beatsButton = document.getElementById("beatsButton");
let startResetButton = document.getElementById("startResetButton");
let time = 4;
let beats = true; // Beats = true, time signature (Taktart) = false
let txtMpM = document.getElementById("txtMpMCount");
let txtBpM = document.getElementById("txtBpMCount");
let taps = [];
let beatsPerMinute;
let beatDuration;
let measureDuration;
let measuresPerMinute;


startResetButton.onactivate = function(evt) {
  taps = [];
  txtMpM.text = "";
  txtBpM.text = "";
}

tapButton.onactivate = function(evt) {
  addTap();
  
  let delta = getAverageDelta();

  switch (beats) {
    case true:
      setBeatDuration(delta);
      break;
    case false:
      setMeasureDuration(delta);
      break;
            //default:
                //TODO //throw new IllegalStateException();
  }
  if (measuresPerMinute <= 0) {
    txtMpM.text = "-";
  } else {
    txtMpM.text = Math.round(measuresPerMinute);
  }
  
  if (beatsPerMinute <= 0) {
    txtBpM.text = "-"
  } else {
    txtBpM.text = Math.round(beatsPerMinute);
  }
}

measureButton.onactivate = function(evt) {
  if (time == 4) {
    time = 3;
    measureButton.text = "3/4";
  } else {
    if (time == 3) {
      time = 2;
      measureButton.text = "2/4";
    } else {
      time = 4;
      measureButton.text = "4/4";
    }
  }
}

beatsButton.onactivate = function(evt) {
  if (beats == true) {
    beats = false;
    beatsButton.text = gettext("measure");
  } else {
    beats = true;
    beatsButton.text = gettext("beats");
  }
}

function addTap() {
  let timeStamp = new Date().getTime();
  taps.push(timeStamp);
}

function getDeltaList() {
  if (taps.length == 0) {
    console.log("Liste ist leer.");
    return null;
  } else {
    let deltaList = [];
    let lastTap = taps[0];
    for (let i = 1; i < taps.length; i++) {
      let tap = taps[i];
      deltaList.push((tap - lastTap) / 1000); //1000d
      lastTap = tap;
    }

    return deltaList;
  }
}
  
function getAverageDelta() {
  let deltaList = getDeltaList();
  if (deltaList.length == 0) {
    return 0;
  } else {
            let sum = 0;
            let i = 0;
            for (i = 0; i < deltaList.length; i++) {
              sum += deltaList[i];
            }
            return sum / deltaList.length;
        }
}

function setBeatsPerMinute(bpm) {
        beatsPerMinute = bpm;
        beatDuration = durationFromXpm(bpm);
        measuresPerMinute = bpm / time;
        measureDuration = beatDuration * time;
}

function setBeatDuration(duration) {
        beatDuration = duration;
        beatsPerMinute = xpmFromDuration(duration);
        measureDuration = duration * time;
        measuresPerMinute = beatsPerMinute / time;
}

function setMeasuresPerMinute(mpm) {
        measuresPerMinute = mpm;
        measureDuration = durationFromXpm(mpm);
        beatDuration = measureDuration / time;
        beatsPerMinute = mpm * time;
}

function setMeasureDuration(duration) {
        measureDuration = duration;
        measuresPerMinute = xpmFromDuration(duration);
        beatDuration = duration / time;
        beatsPerMinute = measuresPerMinute * time;
}

function xpmFromDuration(delay) {
        if (delay == 0) {
            return -1; //Double.POSITIVE_INFINITY;
        } else {
            return 60 / delay;
        }
    }

function durationFromXpm(xpm) {
        if (xpm == 0) {
            return -1; //Double.POSITIVE_INFINITY;
        } else {
            return 60 / xpm;
        }
    }