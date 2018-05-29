var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = [
  "in stride you're a jerk",
  "in stride sit down",
  "it's too late"
]

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var player;
var playbackInfoSubscribers = [];
var isPlaying = false;

var testBtn = document.querySelector('#start');
var playPauseBtn = document.querySelector("#playPause");
function randomPhrase() {
  var number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test in progress';
  shouldListen = true;
  shouldRespond = true;

  var phrase = phrases[randomPhrase()];
  phrasePara.textContent = phrase;
  resultPara.textContent = 'Right or wrong?';
  resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = '...diagnostic messages';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    var speechResult = event.results[0][0].transcript;
    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
      speechResult = speechResult.toLowerCase();
      speechResult = speechResult.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      speechResult = speechResult.replace(/\s{2,}/g," ");
      console.log(speechResult);

      if (!shouldRespond) {
        processInstrideCommand(speechResult, recognition);
        return;
      }

      switch (speechResult) {
        case "you're a jerk":
          playYoutube("qv9VKKXwVxU", 24);
          break;
        case "sit down":
          playYoutube("tvTRZJ-4EyI", 65);
          break;
        case "it's too late":
        case "too late":
          playYoutube("ZSM3w1v-A_Y", 57);
          break;
        case "don't worry":
          playYoutube("d-diB65scQU", 38);
          break;
        case "when you start getting a lot of this":
        case "you start getting a lot of this":
          playYoutube("TbmnonNSdWo", 3)
          break;
        case "eat your vegetables":
          //Example using spotify
          if (player) {
            play({
              playerInstance: player,
              spotify_uri: 'spotify:track:27QkAEvVqcIW12r3tCpWzB',
            });
          } else {
            playYoutube("93p6Lsr2GK4", 0);
          }
          break;
        case "wait on the lord":
          playYoutube("J2ulONRdzKE", 39);
          break;
        case "this is how we do it":
          if (player) {
            var status = play({
              playerInstance: player,
              spotify_uri: 'spotify:track:6uQKuonTU8VKBz5SHZuQXD',
              seekPosition: 17 * 1000
            })
          }
          
          playYoutube("0hiUuL5uTKc", 69);
          break;
        case "i learn from the best":
        case "i learned from the best":
          playYoutube("YFVnVuTcz9I", 229);
          break;
        case "on my own":
          playYoutube("KsH63qJlIMM", 51);
          break;
        case "ice box":
        case "icebox":
          playYoutube("jQybgJCswF0", 112);
          break;
        case "i love your smell":
          playYoutube("OHb_tFrvJfA", 0);
          break;
        default:
          if (speechResult.includes("instride")) {
            processInstrideCommand(speechResult, recognition);
          } else {
            resultPara.textContent = 'That didn\'t sound right.';
            resultPara.style.background = 'red';
          }
          break;
    } 

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
      if (shouldListen)
        recognition.start();
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound � recognisable speech or not � has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
      //Fired when any sound � recognisable speech or not � has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}

function processInstrideCommand(command, recognition) {
  if(command.includes("instride start") || command.includes("instride restart")) {
    shouldRespond = true;
  } else if (command.includes("instride pause")) {
    shouldRespond = false;
  } else if (command.includes("instride stop")) {    
    shouldListen = false;
    shouldRespond = false;
    recognition.stop();
  }
}

function playPauseSpotify() {
  if (isPlaying) {
    clearInterval(updatePlaybackInfo, 1000);
    playPauseBtn.innerHTML = 'Play';
    player.pause();
  } else {
    setInterval(updatePlaybackInfo, 1000);
    playPauseBtn.innerHTML = 'Pause';
    player.resume();
  }
  isPlaying = !isPlaying;
}

testBtn.addEventListener('click', testSpeech);
playPauseBtn.addEventListener('click', playPauseSpotify);
document.querySelector("#spotify").addEventListener('click', implicitGrant);

///Spotify stuff
const clientId = "a5f80726272a40d0b67ee389c09e753a";

window.onSpotifyWebPlaybackSDKReady = () => {
  var url = window.location.href,
  access_token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
  // temp token only last an hour
  const token = access_token
     player = new Spotify.Player({
    name: 'InStride Player',
    getOAuthToken: cb => { cb(token); }
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  player.addListener('player_state_changed', ({
    position,
    duration,
    track_window: { current_track }
  }) => {
    console.log('Currently Playing', current_track);
    console.log('Position in Song', position);
    console.log('Duration of Song', duration);
  });

  

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  // Connect to the player!
  player.connect();
};

const play = ({
  spotify_uri,
  seekPosition,
  playerInstance: {
    _options: {
      getOAuthToken,
      id
    }
  }
}) => {
  if (!isPlaying) {
    setInterval(updatePlaybackInfo, 1000);
    isPlaying = true;
  }
  return getOAuthToken(access_token => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
    }).then((response) => {
      console.log("response: ", response.status);
      console.log("seek: ", seekPosition);
      if (seekPosition && response.status != 403) {
        playbackInfoSubscribers.push((state) => {
            if (state.position > 0 && state.position < seekPosition) {
              console.log("seeking");
              player.seek(seekPosition);
            }
        })
      }
      return response.status;
    });
  });
};

function implicitGrant(){
  const redirectURI = "http://localhost:1337";
  window.open(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectURI}&scope=user-modify-playback-state user-read-playback-state user-read-currently-playing streaming%20user-read-birthdate user-read-email user-read-private`)

  window.close();
  console.log(window.location);
}

function updatePlaybackInfo() {
  player.getCurrentState().then(state => {
    for (let s of playbackInfoSubscribers) {
      s(state);
    }
  })
}

      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var playerYT;
      function onYouTubeIframeAPIReady() {
        playerYT = new YT.Player('youtubeplayer', {
          height: '390',
          width: '640',
          videoId: '1i1Mv-cNy3w',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        //event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        } else if (!done){
          done = false;
          event.target.playVideo();
          setTimeout(stopVideo, 6000);
        }
      }
      function stopVideo() {
        playerYT.stopVideo();
      }

      function playYoutube(youtubeVideoId, start) {
        done = false;
        // Example using youtube
        playerYT.cueVideoById({'videoId': youtubeVideoId,
             'startSeconds': start,
             'suggestedQuality': 'small'});
        playerYT.playVideo();

        console.log(playerYT.videoId);
      }