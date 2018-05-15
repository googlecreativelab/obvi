/* // Copyright 2017 Google Inc.
//
//     Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License. */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from './node_modules/@polymer/polymer/polymer-element.js';

import './node_modules/@polymer/paper-behaviors/paper-ripple-behavior.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="voice-button">

  <!-- 
  Note: deprecation warning for styling master document doesn't apply within <template> tags
  Read more: https://www.polymer-project.org/blog/2017-10-18-upcoming-changes
   -->

  <template>

    <style>

      /* shadow DOM styles */      
      
      :host {
        /* red active color */
        --active-color: #fe4042;
        /* background color for button */
        --button-color: #FFFFFF;
        /* circle viz color (opacity is at 0.2) */
        --circle-viz-color:#000000;
        /* diameter of button, option can be changed by user */
        --button-diameter:100px;
        /* mic color*/
        --mic-color:#FFFFFF;
        /* text color, used for warning messaging*/
        --text-color:#666;
        
        display: inline-block;
        height: var(--button-diameter);
        width: var(--button-diameter);
      }

      #paper-button{
        outline:none;
        background:var(--button-color);
        border:none;
        width:100%;
        height:100%;
        min-width:0;
        border-radius:50%;
        cursor:pointer;
        transition: all ease 0.25s;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);
        z-index:2;
        position:absolute;
        opacity:0.8;
        margin:0;
        left:0;
      }

      #paper-button.flat{
        box-shadow:0px 0px 0px 0px;
      }

      #paper-button:hover{
        box-shadow: 0 4px 7px 0 rgba(0,0,0,.20);
      }

      #paper-button.disabled{
        box-shadow: 0px 0px 0px 0px;
        cursor:not-allowed;
        opacity:0.5;
      }

      #paper-button.listening, #paper-button.user-input{
        box-shadow: 0px 0px 0px 0px;
        opacity:1; 
        background:var(--active-color);
      }

      #paper-button.flat:hover{
        box-shadow:0px 0px 0px 0px; 
      }

      #paper-button.disabled:hover{
        box-shadow: 0px 0px 0px 0px;
      }

      #circle-viz-container{
        position:absolute;
        z-index:0;
        opacity:0;
      }

      .svg-container{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(255, 0, 0, 0);
        z-index:3;
        pointer-events: none;
      }

      #mic-svg, #mic-svg-disabled, #mic-loading{
        height: 64%;
        width:100%;
        display: block;
        position: absolute;
        top: -11%;
        left: 0px;
        transform:translate(0, 50%);
        z-index:3;
        pointer-events:none;
      }

      #mic-loading {
        opacity: 0;
        top: -14%;
        transform: translate(0, 50%) scale(0.8, 0.8);
      }

      #mic-loading circle:nth-child(1) {
        animation: 0.7s micLoading 0s infinite;
      }

      #mic-loading circle:nth-child(2) {
        animation: 0.7s micLoading 0.3s infinite;
      }

      #mic-loading circle:nth-child(3) {
        animation: 0.7s micLoading 0.5s infinite;
      }

      @keyframes micLoading {
        to {
          fill-opacity: 0;
        }
        from {
          fill-opacity: 1;
        }
      }


      /* show the disabled mic when in disabled state */
      .container #mic-svg-disabled{ display:none; }
      .container.disabled #mic-svg-disabled{ display:block; }
      .container.disabled #mic-svg{ display:none; }
      .container.listening #mic-svg, .container.user-input #mic-svg { fill: #FFFFFF !important; }


      .container{
        position:absolute;
        height: var(--button-diameter);
        width: var(--button-diameter);
      }

      .circle{
        width:calc(var(--button-diameter) - 4px);
        height:calc(var(--button-diameter) - 4px);
        background-color:var(--circle-viz-color);
        opacity:0.2;
        border-radius:50%;
        position:absolute;
        transform-origin: center center;
        transform:scale(1);
      }

      #mic-not-allowed{
        font-family: 'Noto Sans', sans-serif;
        font-size: 1.0em;
        -webkit-font-smoothing: antialiased;
        color: var(--text-color);
        width: 210px;
        top: 100%;
        display: none;
        position: absolute;
        margin-left: 0px;
        transform: translateX(-50%);
        left: 50%;
        font-weight: 400;
        text-align: center;
        vertical-align: bottom;
        margin-top: 15px;
      }
      #mic-not-allowed.show{
        display:block;
      }

      paper-ripple{
        position:absolute;
      }

    </style>


    <!-- shadow DOM -->
    <div class\$="container [[state]]">

      <!-- rings that scale out from button with user input (only available with autodetect)  -->
      <div id="circle-viz-container"></div>
      
      <!-- clickable button -->
      <button id="paper-button" class\$="voice-button [[state]] [[flatStr]] [[autoDetectStr]]"><paper-ripple></paper-ripple></button>
      
      <div class="svg-container">
        <!-- mic icon -->
        <svg id="mic-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="#000000">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path>
            <path d="M0 0h24v24H0z" fill="none"></path>
        </svg>
        <svg id="mic-svg-disabled" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="#000000">
            <path d="M0 0h24v24H0zm0 0h24v24H0z" fill="none"></path>
            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"></path>
        </svg>
      <svg id="mic-loading" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 727 353" fill="#ffffff">
        <circle cx="136.5" cy="176.5" r="73.5"></circle>
        <circle cx="363.5" cy="176.5" r="73.5"></circle>
        <circle cx="590.5" cy="176.5" r="73.5"></circle>
      </svg>
      </div>

      <div id="mic-not-allowed">Cannot access microphone</div>
    
    </div>

  </template>

  

</dom-module>`;

document.head.appendChild($_documentContainer.content);
// Copyright 2017 Google Inc.
//
//     Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License. 

window.AudioContext = window.AudioContext || window.webkitAudioContext;

function VoiceRecorder(autodetect, onStopRecordComplete) {

  this.autodetect = autodetect;
  this.onStopRecordComplete = onStopRecordComplete;
  this.microphone;
  this.isRecording = false;
  this.isSpeaking = false;
  this.audioContext;
  this.leftChannel = [];
  this.recordingLength = 0;
  this.processor;
  this.config = {
    sampleRate: 44100,
    bufferLen: 4096,
    numChannels: 1,
    mimeType: 'audio/mpeg'
  };

  this.analyzer = (context) => {
    let listener = context.createAnalyser();
    this.microphone.connect(listener);
    listener.fftSize = 256;
    var bufferLength = listener.frequencyBinCount;
    let analyserData = new Uint8Array(bufferLength);
  }

  this.onAudioProcess = (e) => {
    var left = e.inputBuffer.getChannelData(0);

    this.recordingLength += this.config.bufferLen;

    // we clone the samples
    this.leftChannel.push(new Float32Array(left));
    // Check for pause while speaking
    var MIN_SPEAKING_VOLUME = 0.04;
    var sum = 0.0;
    var i;
    var clipcount = 0;
    for (i = 0; i < left.length; ++i) {
      sum += left[i] * left[i];
      if (Math.abs(left[i]) > 0.99) {
        clipcount += 1;
      }
    }
    var volume = Math.sqrt(sum / left.length);
    if (volume > MIN_SPEAKING_VOLUME) {
      this.isSpeaking = true;
      clearTimeout(this.speakingTimeout);
    } else {
      if (this.isSpeaking) {
        this.isSpeaking = false;
        clearTimeout(this.speakingTimeout);
        this.speakingTimeout = setTimeout(() => {
          this.stopRecord();
        }, 500);
      }
    }
  }

  this.logError = (error) => {
    console.error(error);
  }

  this.startRecord = () => {
    this.audioContext = new AudioContext();
    /** 
    * Create a ScriptProcessorNode
    * */
    if (this.audioContext.createJavaScriptNode) {
      this.processor = this.audioContext.createJavaScriptNode(this.config.bufferLen, this.config.numChannels, this.config.numChannels);
    } else if (this.audioContext.createScriptProcessor) {
      this.processor = this.audioContext.createScriptProcessor(this.config.bufferLen, this.config.numChannels, this.config.numChannels);
    } else {
      console.log('WebAudio API has no support on this browser.');
    }

    this.processor.connect(this.audioContext.destination);
    /**
    *  ask permission of the user for use this.microphone or camera  
    * */
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(this.gotStreamMethod.bind(this))
    .catch(this.logError);
  }

  this.getBuffers = (event) => {
    var buffers = [];
    for (var ch = 0; ch < 2; ++ch){
      buffers[ch] = event.inputBuffer.getChannelData(ch);
    }
    return buffers;
  }

  this.gotStreamMethod = (stream) => {
    // audioElement.src = "";
    this.isRecording = true;

    this.tracks = stream.getTracks();
    /** 
    * Create a MediaStreamAudioSourceNode for the this.microphone 
    * */
    this.microphone = this.audioContext.createMediaStreamSource(stream);
    /** 
    * connect the AudioBufferSourceNode to the gainNode 
    * */
    this.microphone.connect(this.processor);
    // encoder = new Mp3LameEncoder(audioContext.sampleRate, 160);
    /** 
    * Give the node a function to process audio events 
    */
    if(this.autodetect){
      this.processor.onaudioprocess = this.onAudioProcess;
    }

    this.analyzer(this.audioContext);
  }

  this.clearRecordedData = () => {
    this.recordingLength = 0;
    this.leftChannel = [];
  }



  this.stopRecord = () => {
    var callback = this.onStopRecordComplete;
    this.isRecording = false;
    this.audioContext.close();
    this.processor.disconnect();
    this.tracks.forEach(track => track.stop());


    this.mergeLeftRightBuffers({
      sampleRate: this.config.sampleRate,
      numberOfAudioChannels: this.config.numChannels,
      internalInterleavedLength: this.recordingLength,
      leftBuffers: this.leftChannel,
      rightBuffers: this.config.numChannels === 1 ? [] : rightChannel
    }, (buffer, view) => {

      self.blob = new Blob([view], {
        type: 'audio/wav'
      });

      self.buffer = new ArrayBuffer(view.buffer.byteLength);
      self.view = view;
      self.sampleRate = this.config.sampleRate;
      self.bufferSize = this.config.bufferLen;
      self.length = this.recordingLength;

      callback && callback(self.blob);

      this.clearRecordedData();

      isAudioProcessStarted = false;
    });
  }

  this.mergeLeftRightBuffers = (config, callback) => {
    function mergeAudioBuffers(config, cb){
      var numberOfAudioChannels = config.numberOfAudioChannels;

      // todo: "slice(0)" --- is it causes loop? Should be removed?
      var leftBuffers = config.leftBuffers.slice(0);
      var rightBuffers = config.rightBuffers.slice(0);
      var sampleRate = config.sampleRate;
      var internalInterleavedLength = config.internalInterleavedLength;
      var desiredSampRate = config.desiredSampRate;

      if (numberOfAudioChannels === 2) {
        leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
        rightBuffers = mergeBuffers(rightBuffers, internalInterleavedLength);
        if (desiredSampRate) {
          leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
          rightBuffers = interpolateArray(rightBuffers, desiredSampRate, sampleRate);
        }
      }

      if (numberOfAudioChannels === 1) {
        leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
        if (desiredSampRate) {
          leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
        }
      }

      // set sample rate as desired sample rate
      if (desiredSampRate) {
        sampleRate = desiredSampRate;
      }

      // for changing the sampling rate, reference:
      // http://stackoverflow.com/a/28977136/552182
      function interpolateArray(data, newSampleRate, oldSampleRate){
        var fitCount = Math.round(data.length * (newSampleRate / oldSampleRate));
        //var newData = new Array();
        var newData = [];
        //var springFactor = new Number((data.length - 1) / (fitCount - 1));
        var springFactor = Number((data.length - 1) / (fitCount - 1));
        newData[0] = data[0]; // for new allocation
        for (var i = 1; i < fitCount - 1; i++) {
          var tmp = i * springFactor;
          //var before = new Number(Math.floor(tmp)).toFixed();
          //var after = new Number(Math.ceil(tmp)).toFixed();
          var before = Number(Math.floor(tmp)).toFixed();
          var after = Number(Math.ceil(tmp)).toFixed();
          var atPoint = tmp - before;
          newData[i] = linearInterpolate(data[before], data[after], atPoint);
        }
        newData[fitCount - 1] = data[data.length - 1]; // for new allocation
        return newData;
      }

      function linearInterpolate(before, after, atPoint){
        return before + (after - before) * atPoint;
      }

      function mergeBuffers(channelBuffer, rLength){
        var result = new Float64Array(rLength);
        var offset = 0;
        var lng = channelBuffer.length;

        for (var i = 0; i < lng; i++) {
          var buffer = channelBuffer[i];
          result.set(buffer, offset);
          offset += buffer.length;
        }

        return result;
      }

      function interleave(leftChannel, rightChannel){
        var length = leftChannel.length + rightChannel.length;

        var result = new Float64Array(length);

        var inputIndex = 0;

        for (var index = 0; index < length;) {
          result[index++] = leftChannel[inputIndex];
          result[index++] = rightChannel[inputIndex];
          inputIndex++;
        }
        return result;
      }

      function writeUTFBytes(view, offset, string){
        var lng = string.length;
        for (var i = 0; i < lng; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

      // interleave both channels together
      var interleaved;

      if (numberOfAudioChannels === 2) {
        interleaved = interleave(leftBuffers, rightBuffers);
      }

      if (numberOfAudioChannels === 1) {
        interleaved = leftBuffers;
      }

      var interleavedLength = interleaved.length;

      // create wav file
      var resultingBufferLength = 44 + interleavedLength * 2;

      var buffer = new ArrayBuffer(resultingBufferLength);

      var view = new DataView(buffer);

      // RIFF chunk descriptor/identifier
      writeUTFBytes(view, 0, 'RIFF');

      // RIFF chunk length
      view.setUint32(4, 44 + interleavedLength * 2, true);

      // RIFF type
      writeUTFBytes(view, 8, 'WAVE');

      // format chunk identifier
      // FMT sub-chunk
      writeUTFBytes(view, 12, 'fmt ');

      // format chunk length
      view.setUint32(16, 16, true);

      // sample format (raw)
      view.setUint16(20, 1, true);

      // stereo (2 channels)
      view.setUint16(22, numberOfAudioChannels, true);

      // sample rate
      view.setUint32(24, sampleRate, true);

      // byte rate (sample rate * block align)
      view.setUint32(28, sampleRate * 2, true);

      // block align (channel count * bytes per sample)
      view.setUint16(32, numberOfAudioChannels * 2, true);

      // bits per sample
      view.setUint16(34, 16, true);

      // data sub-chunk
      // data chunk identifier
      writeUTFBytes(view, 36, 'data');

      // data chunk length
      view.setUint32(40, interleavedLength * 2, true);

      // write the PCM samples
      var lng = interleavedLength;
      var index = 44;
      var volume = 1;
      for (var i = 0; i < lng; i++) {
        view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
        index += 2;
      }

      if (cb) {
        return cb({
          buffer: buffer,
          view: view
        });
      }

      postMessage({
        buffer: buffer,
        view: view
      });
    }

    var webWorker = this.processInWebWorker(mergeAudioBuffers);

    webWorker.onmessage = function(event) {
      callback(event.data.buffer, event.data.view);

      // release memory
      URL.revokeObjectURL(webWorker.workerURL);
    };

    webWorker.postMessage(config);
  }

  this.processInWebWorker = (_function) => {
    var workerURL = URL.createObjectURL(new Blob([_function.toString(),
      ';this.onmessage =  function (e) {' + _function.name + '(e.data);}'
    ], {
      type: 'application/javascript'
    }));

    var worker = new Worker(workerURL);
    worker.workerURL = workerURL;
    return worker;
  }
 
}// Copyright 2017 Google Inc.
//
//     Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License. 

/*
  
  Circle animation behind the voice button

*/
function CircleViz(containerEl, onNoMicAccess){

  this.containerEl = containerEl;
  this.stopped = true;
  this.circle = document.createElement('div');
  this.circle.classList.add('circle');
  this.containerEl.appendChild(this.circle);
  this.isMobile = window.mobileAndTabletcheck();
  this.onNoMicAccess = onNoMicAccess;
  this.attachedUserMediaStream = false;
  // create one audio context
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  if(typeof AudioContext !== 'undefined'){
    this.audioContext = new AudioContext();
  }

  this.attachUserMediaStream = () => {
    // if it has been stopped, let's open it back up
    if(!this.attachedUserMediaStream || (this.audioStream && !this.audioStream.active)){
      if(this.isMobile){
        this.doDraw();
      }else{
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
          navigator.mediaDevices
            .getUserMedia({audio:true})
            .then(this.soundAllowed.bind(this))
            .catch(this.soundNotAllowed.bind(this));
        }else{ // deprecated approach: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
          navigator.getUserMedia = navigator['getUserMedia'] || navigator['webkitGetUserMedia'] || navigator['mozGetUserMedia'] || null;
          if (navigator.getUserMedia) navigator.getUserMedia({ audio: true }, (stream) => this.soundAllowed(stream), (e) => this.soundNotAllowed(e));
        }
      }
      this.attachedUserMediaStream = true;
    }
  }

  this.soundNotAllowed = (e) => {
    // circle viz graceful degrade, but let know main component know
    this.onNoMicAccess();
  }

  this.soundAllowed = (stream) => {
    this.audioStream = stream;
    if(this.audioContext){
      var audioStream = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      audioStream.connect(this.analyser);
      this.analyser.fftSize = 1024;
      this.frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);
    }
    this.doDraw();
  }

  this.getCircleScale = () => {
    let scale = 1;
    if(this.analyser){
      this.analyser.getByteFrequencyData(this.frequencyArray);
      // todo: frequency array is all zeros for android chrome
      let freqSum = 0;
      for (let i = 0; i < 255; i++) {
        freqSum += this.frequencyArray[i]
      }
      let freqAvg = freqSum / 255
      scale = 1 + ((freqAvg / 255) * 1.2)
    }else{
      // don't have FFT spectrum, so fake it
      let currScale = this.getCurrentScale();
      if(currScale){
        var rand = 1 + Math.random();
        // smooth it
        scale = currScale + ((rand - currScale) / 8);
      }
    }
    return scale;
  }

  this.doDraw = () => {
    if(!this.stopped){
      let newScale = this.getCircleScale();
      this.circle.style.transform = 'scale(' + newScale + ') translate(2px, 2px)';
    }else{
      // stopped, slowly scale down
      let currScale = this.getCurrentScale();
      if(currScale){
        if(currScale > 0){
          currScale = Math.max(0, currScale - 0.05);
          this.circle.style.transform = 'scale(' + currScale + ') translate(2px, 2px)';
        }
      }
    }
    this.animation = window.requestAnimationFrame(this.doDraw.bind(this));
  }

  this.getCurrentScale = () => {
    let transformProp = (this.circle.style.transform && this.circle.style.transform !== '') ? this.circle.style.transform : 'scale(1)'
    let splitProperty = transformProp.split(new RegExp(/\(|\)/, 'g'))
    if(splitProperty.length > 2){
      let currScale = parseFloat(splitProperty[1]);
      return currScale;
    }
    return null;
  }

  this.startAnimation = () => {
    if(this.stopped){
      this.containerEl.style.opacity = 1;
      this.stopped = false;
      this.attachUserMediaStream();
    }
  }

  this.stopAnimation = () => {
    this.stopped = true;
    this.containerEl.style.opacity = 0;
    if(this.audioStream && this.audioStream.getAudioTracks().length > 0){
      this.audioStream.getAudioTracks()[0].stop();
    }
  }

}window.componentTranslations = {
 "micNotAllowed": {
     "af": "Kan nie toegang tot mikrofoon hê nie",
     "sq": "Nuk mund të hyni në mikrofon",
     "am": "ማይክሮፎን መድረስ አልተቻለም",
     "ar": "لا يمكن الدخول إلى الميكروفون",
     "hy": "Հնարավոր չէ մուտք գործել խոսափող",
     "az": "Mikrofona daxil ola bilmir",
     "eu": "Ezin da mikrofonoa atzitu",
     "be": "Не ўдаецца атрымаць доступ да мікрафону",
     "bs": "Ne mogu pristupiti mikrofonu",
     "bg": "Няма достъп до микрофона",
     "ca": "No es pot accedir al micròfon",
     "ceb": "Dili maka-access sa mikropono",
     "ny": "Sangathe kulumikiza maikolofoni",
     "zh": "无法访问麦克风",
     "zh-TW": "無法訪問麥克風",
     "co": "Ùn pudete micca accede à u micrufonu",
     "hr": "Nije moguće pristupiti mikrofonu",
     "cs": "Nemá přístup k mikrofonu",
     "da": "Kan ikke få adgang til mikrofonen",
     "nl": "Kan geen microfoon openen",
     "en": "Cannot access microphone",
     "eo": "Ne povas aliri mikrofonon",
     "et": "Ei saa mikrofoni juurde pääseda",
     "tl": "Hindi ma-access ang mikropono",
     "fi": "Mikrofonia ei voi käyttää",
     "fr": "Impossible d&#39;accéder au microphone",
     "fy": "Kin gjin mikrofoan tagong krije",
     "gl": "Non se pode acceder ao micrófono",
     "ka": "მიკროფონი ვერ წვდომა",
     "de": "Kann nicht auf Mikrofon zugreifen",
     "el": "Δεν είναι δυνατή η πρόσβαση στο μικρόφωνο",
     "gu": "માઇક્રોફોનને ઍક્સેસ કરી શકતા નથી",
     "ht": "Pa ka jwenn mikwofòn",
     "ha": "Ba za a iya shiga makirufo ba",
     "haw": "ʻAʻole hiki ke hoʻokomo i ka microphone",
     "iw": "לא ניתן לגשת למיקרופון",
     "hi": "माइक्रोफ़ोन तक नहीं पहुंच सकते",
     "hmn": "Mus saib tsis tau microphone",
     "hu": "Nem lehet hozzáférni a mikrofonhoz",
     "is": "Get ekki fengið aðgang að hljóðnemanum",
     "ig": "Enweghị ike ịnweta igwe okwu",
     "id": "Tidak dapat mengakses mikrofon",
     "ga": "Ní féidir rochtain a fháil ar mhicreafón",
     "it": "Impossibile accedere al microfono",
     "ja": "マイクにアクセスできない",
     "jw": "Ora bisa ngakses mikropon",
     "kn": "ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ",
     "kk": "Микрофонға кіру мүмкін емес",
     "km": "មិនអាចចូលដំណើរការមីក្រូហ្វូន",
     "ko": "마이크에 액세스 할 수 없습니다.",
     "ku": "Mirov dikare mîkrofon nikare",
     "ky": "коелу кире албайт",
     "lo": "ບໍ່ສາມາດເຂົ້າເຖິງໄມໂຄໂຟນ",
     "la": "Access potest non tortor ligula, facilisis",
     "lv": "Nevar piekļūt mikrofonam",
     "lt": "Negalite pasiekti mikrofono",
     "lb": "Kann net op den Mikrofon goen",
     "mk": "Не можам да пристапам на микрофон",
     "mg": "Tsy afaka mikitika mikrôfo",
     "ms": "Tidak boleh mengakses mikrofon",
     "ml": "മൈക്രോഫോൺ ആക്സസ്സുചെയ്യാനാവില്ല",
     "mt": "Ma tistax taċċessa mikrofonu",
     "mi": "Kaore e taea te uru ki te hopuorooro",
     "mn": "Микрофон руу нэвтэрч чадахгүй байна",
     "my": "မိုက်ခရိုဖုန်းကိုရယူမနိုင်",
     "no": "Kan ikke få tilgang til mikrofonen",
     "ps": "مایکروفون ته لاسرسی نشي کولی",
     "fa": "می توانید به میکروفون دسترسی پیدا کنید",
     "pl": "Nie można uzyskać dostępu do mikrofonu",
     "pt": "Não é possível acessar o microfone",
     "pa": "ਮਾਈਕ੍ਰੋਫੋਨ ਤੱਕ ਪਹੁੰਚ ਨਹੀਂ ਕਰ ਸਕਦਾ",
     "ro": "Nu puteți accesa microfonul",
     "ru": "Не удается получить доступ к микрофону",
     "sm": "E le mafai ona maua le masini faaleotele leo",
     "gd": "Cha ghabh mi lorg air microfòn",
     "sr": "Не могу приступити микрофону",
     "st": "Ha e khone ho finyella microphone",
     "sn": "Haikwanise kuwana maikorofoni",
     "sd": "مائڪروفون تائين رسائي نه ٿي سگھي",
     "si": "මයික්රෆෝනය වෙත පිවිසිය නොහැක",
     "sk": "Nemáte prístup k mikrofónu",
     "sl": "Ne morem dostopati do mikrofona",
     "so": "Ma heli kartid makarafoon",
     "es": "No se puede acceder al micrófono",
     "su": "moal bisa ngakses mikropon",
     "sw": "Haiwezi kufikia kipaza sauti",
     "sv": "Kan inte komma åt mikrofonen",
     "tg": "Микрофонро ба кор андохта намешавад",
     "ta": "மைக்ரோஃபோனை அணுக முடியவில்லை",
     "te": "మైక్రోఫోన్ను ప్రాప్యత చేయలేరు",
     "th": "ไม่สามารถเข้าถึงไมโครโฟนได้",
     "tr": "Mikrofona erişilemiyor",
     "uk": "Не вдається отримати доступ до мікрофона",
     "ur": "مائیکروفون تک رسائی حاصل نہیں",
     "uz": "Mikrofonga kirib bo&#39;lmadi",
     "vi": "Không thể truy cập micrô",
     "cy": "Methu â chael mynediad i feicroffon",
     "xh": "Ayikwazi ukufikelela kwimakrofoni"
 }
}

/* 
  Note: deprecation warning for styling master document doesn't apply within <template> tags
  Read more: https://www.polymer-project.org/blog/2017-10-18-upcoming-changes
   */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
const ListeningState = Object.freeze({
  IDLE: 'idle',
  LISTENING: 'listening',
  USER_INPUT: 'user-input',
  DISABLED: 'disabled'
});

const KeyboardTriggers = Object.freeze({
  ALL_KEYS: 'all-keys',
  SPACE_BAR: 'space-bar',
  NONE: 'none'
})

// maintain one audio stream, immediately, to work in safari
// see here: https://forums.developer.apple.com/thread/86286
var audioStream;

class VoiceButton extends PolymerElement {
  
  static get is() {
    return 'voice-button';
  }

  static get properties(){
    return {
      
      flat: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      autodetect: {
        type: Boolean,
        notify: false,
        reflectToAttribute: true,
        value: false
      },
      clickForPermission: {
        type: Boolean,
        notify: false,
        reflectToAttribute: true,
        value: false
      },
      hidePermissionText: {
        type: Boolean,
        notify: false,
        reflectToAttribute: true,
        value: false
      },
      language: {
        type: String,
        reflectToAttribute: true,
        value: 'en-US'
      },
      disabled: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true,
        value: false,
        observer: '_onEnabledStateChange'
      },
      keyboardTrigger: {
        type: String,
        reflectToAttribute: true,
        value: KeyboardTriggers.SPACE_BAR
      },
      pressed: {
        type: Boolean,
        notify: false,
        reflectToAttribute: true,
        readOnly: true,
        value: false
      },
      cloudSpeechApiKey: {
        type:String,
        readOnly: false,
        reflectToAttribute: false,
        value: null
      },
      state: {
        type: String,
        notify: false,
        readOnly: true,
        reflectToAttribute: true,
        value: ListeningState.IDLE,
        observer: '_onStateChange'
      },
      supported: {
        type: Boolean,
        readOnly: true,
        reflectToAttribute: true,
        value: true
      },
      flatStr: String,
      autoDetectStr: String
    }
  }

  constructor() {
    super();
    this._setState(ListeningState.IDLE)
  }

  ready() {
    super.ready();

    this.useCloudSpeech = false;

    // warn host if a cloud speech api isn't provided
    if(typeof this.cloudSpeechApiKey !== 'string'){
      console.warn('For fallback support, it is recommended to provide a cloud-speech-api-key.')
    }
    
    // Get the SpeechRecognition object
    // only allow prefixed webkitSpeechRecognition for Chrome, Opera has support but doesn't work
    // As test: https://www.google.com/intl/en/chrome/demos/speech.html
    // Support table: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    const SpeechRecognition = window['webkitSpeechRecognition'];
    if(typeof SpeechRecognition === 'undefined' || isOpera){      
      // make sure you have a Cloud Speech API key 
      if(typeof this.cloudSpeechApiKey !== 'string'){
        console.error('Need to provide a cloud-speech-api-key.')
        this._setState(ListeningState.DISABLED)
        this.set('disabled', true)
        return;
      }
      // check for WebRTC support
      // notice at the release of iOS11, webRTC has not reached WebKit
      // more info: https://stackoverflow.com/questions/45055329/does-webkit-in-ios-11-beta-support-webrtc
      if (this.checkWebRTC()) {
        this.useCloudSpeech = true;
      } else {
        this._setSupported(false)
        // disable button if speech recognition isn't available
        this._setState(ListeningState.DISABLED)
        this.set('disabled', true)
        console.error('WebRTC is not supported on this browser.');
        return;
      }
    }

    this.set('flatStr', (this.flat) ? 'flat' : '')
    this.set('autoDetectStr', (this.autodetect) ? 'auto-detect' : '')

    var micColor = getComputedStyle(this).getPropertyValue('--mic-color');

    this.googleMicEl = this.$['mic-svg'];
    this.googleMicLoaderEl = this.$['mic-loading'];
    this.googleMicDisabledEl = this.$['mic-svg-disabled'];
    this.buttonEl = this.$['paper-button'];

    let circleVizContainer = this.$['circle-viz-container'];
    this.circleViz = new CircleViz(circleVizContainer, () => {
      this.onSpeechError({error: 'not-allowed'});
    });
    // if user wants to ask for permission when clicked, then wait
    if(!this.clickForPermission){
      this.circleViz.attachUserMediaStream();
    }

    // set mic color
    this.googleMicEl.style.fill = this.googleMicDisabledEl.style.fill = micColor;

    // mouse listeners
    this.buttonEl.addEventListener('mousedown', this.mouseDown.bind(this));
    this.buttonEl.addEventListener('mouseup', this.mouseUp.bind(this));

    // listen for space bar on document
    if(this.keyboardTrigger !== KeyboardTriggers.NONE){
      document.body.addEventListener('keydown', this.keyDown.bind(this));
      document.body.addEventListener('keyup', this.keyUp.bind(this)) ;
    }

    if(this.hidePermissionText){
      this.$['mic-not-allowed'].style.display = 'none';
    }

    // setup microphone-not-allowed messaging
    var translatedCopy = this.getTranslation();
    if(translatedCopy){
      this.$['mic-not-allowed'].innerHTML = translatedCopy;
    }

    if (!this.useCloudSpeech) {
      // set up speech recognition
      this.recognition = new SpeechRecognition();
      if(this.language != '') this.recognition.lang = this.language;
      // weird issue where `interimResults = true` is cutting off speech 
      // see comment here: https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API?google_comment_id=z13msdqh0yqpyrpfx23gw5xa2wu0ypzwj04
      const isMobile = window.mobileAndTabletcheck();
      this.recognition.interimResults = !isMobile;
      this.recognition.continuous =  (isMobile) ? false : !this.autodetect;
      this.recognition.maxAlternatives = 0;


      // add event listeners
      this.recognition.onresult = this.onSpeechResult.bind(this);
      this.recognition.onspeechend = this.onSpeechEnd.bind(this);
      this.recognition.onerror = this.onSpeechError.bind(this);
    } else {
      // get blob data to send up to Cloud Speech API
      this.voiceRecorder = new VoiceRecorder(this.autodetect, this.onStopRecordingVoiceComplete.bind(this));
    }
  }

  getTranslation(){
    var full = window.componentTranslations.micNotAllowed[this.language];
    if(typeof full !== 'undefined') return full;
    var half = window.componentTranslations.micNotAllowed[this.language.split('-')[0].toLowerCase()];
    if(typeof half !== 'undefined') return half;
    return null;
  }

  keyDown(event){
    if(this.state === ListeningState.DISABLED) return;
    this.pressed = true;
    if((event.keyCode == 32 && this.keyboardTrigger === KeyboardTriggers.SPACE_BAR) || 
      (this.keyboardTrigger === KeyboardTriggers.ALL_KEYS)){
      if(this.state !== ListeningState.USER_INPUT && this.state !== ListeningState.LISTENING){
        this.startListening();
      }
    }
  }

  keyUp(event){
    if(this.state === ListeningState.DISABLED) return;
    this.pressed = false;
    if((event.keyCode == 32 && this.keyboardTrigger === KeyboardTriggers.SPACE_BAR) || 
      (this.keyboardTrigger === KeyboardTriggers.ALL_KEYS)){

      if(this.autodetect && (this.state === ListeningState.IDLE || this.state === ListeningState.USER_INPUT)){
        this.stopListening();
      }
      else if(!this.autodetect){
        this.stopListening();
      }
    }
  }

  mouseDown(event){
    // If we use Cloud Speech, we'll have it start and stop by a toggle
    if(this.state === ListeningState.DISABLED) return;
    this.pressed = true;
    if(this.state !== ListeningState.USER_INPUT && this.state !== ListeningState.LISTENING){
      this.startListening();
    }else if(this.state === ListeningState.LISTENING) {
      this.stopListening();
    }
  }

  mouseUp(event){
    if(this.state === ListeningState.DISABLED) return;

    // if in autodetect mode but user taps again to stop
    if(this.autodetect && (this.state === ListeningState.IDLE || this.state === ListeningState.USER_INPUT)){
      this.stopListening();
    }
    else if(!this.autodetect){  // press & hold mode, stop listening when mouse is up
      this.stopListening();
    }

    this.buttonEl.blur();
    this.pressed = false;
  }

  startRecordingVoice() {
    this.isRecording = true;
    this.voiceRecorder.startRecord();
  }

  // need audio blob in Base64 to send to CloudSpeech API
  blobToBase64(blob, cb){
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl = reader.result;
      let base64 = dataUrl.split(',')[1];
      cb(base64);
    }
    reader.onerror = (err) => {
      console.error('Error in reading blob', err)
    }
    reader.readAsDataURL(blob);
  }


  onStopRecordingVoiceComplete(blob){
    if(this.isRecording){
      this.isRecording = false;
      this._setState(ListeningState.IDLE);
      this.circleViz.stopAnimation();
      this.postTranscription(blob);
    }
  }

  postTranscription(blob){
    this.showLoader();

    this.blobToBase64(blob, (data) => {
      let postBody = `{
          "config": {
            "encoding": "LINEAR16",
            "languageCode": "en-US",
            "enableWordTimeOffsets": false
          },
          "audio": {
            "content": "${data}"
          }
        }`;
      let xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://speech.googleapis.com/v1/speech:recognize?key=' + this.cloudSpeechApiKey, true);
      xhr.onload = (data) => {
        // Request finished. Do processing here.
        // hide the dot loader
        this.hideLoader();

        let response = JSON.parse(xhr.responseText);
        if (
          response &&
          response.results &&
          response.results[0] &&
          response.results[0].alternatives &&
          response.results[0].alternatives[0] &&
          response.results[0].alternatives[0].transcript
        ) {
          let text = response.results[0].alternatives[0].transcript || '';
          let event = {
            speechResult : text,
            confidence : response.results[0].alternatives[0].confidence,
            isFinal : true
          };
          this.dispatchEvent(new CustomEvent('onSpeech', {detail: event}));
        }
      }
      xhr.onerror = () => {
        console.error('Error occurred during Cloud Speech AJAX request.')
      }
      xhr.send(postBody);
    });
  }

  startListening(){
    if(this.clickForPermission){
      this.circleViz.attachUserMediaStream();
    }
    this._setState(ListeningState.LISTENING);
    if(!this.useCloudSpeech) {
      // start recognition
      this.recognition.start();
    } else {
      this.startRecordingVoice();
    }
    this.circleViz.startAnimation();
  }
  
  stopListening(){
    if(!this.useCloudSpeech) {
      this._setState(ListeningState.IDLE);
      this.circleViz.stopAnimation();
      this.recognition.stop();
      this.removeSpeechEventListeners();          
    } else {
      this.voiceRecorder.stopRecord();
    }
  }

  onSpeechResult(event){
    var result = {
      speechResult : event.results[0][0].transcript,
      confidence : event.results[0][0].confidence,
      isFinal : event.results[0].isFinal,
      sourceEvent: event
    }
    this._setState(ListeningState.USER_INPUT);
    this.dispatchEvent(new CustomEvent('onSpeech', {detail: result}));

    if(result.isFinal){
      this._setState(ListeningState.IDLE);
      this.circleViz.stopAnimation();
      if(this.autodetect){
        this.stopListening();
      }
    }
  }

  onSpeechEnd(){
    this._setState(ListeningState.IDLE);
    this.circleViz.stopAnimation();
    this.removeSpeechEventListeners();
  }

  onSpeechError(event){
    this._setState(ListeningState.IDLE);
    this.circleViz.stopAnimation();
    this.removeSpeechEventListeners();
    this.dispatchEvent(new CustomEvent('onSpeechError', {detail: event}));
    if(event.error === 'not-allowed'){
      this.$['mic-not-allowed'].classList.add('show');
      this._setState(ListeningState.DISABLED)
      this.set('disabled', true)
    }
  }


  removeSpeechEventListeners(){
    if(this.recognition){
      this.recognition.removeEventListener('result', this.onSpeechResult);
      this.recognition.removeEventListener('end', this.onSpeechEnd);
      this.recognition.removeEventListener('error', this.onSpeechError);
    }
  }

  _onEnabledStateChange(newValue, oldValue){
    if(this.disabled) this._setState(ListeningState.DISABLED);
    else this._setState(ListeningState.IDLE);
  }

  _onStateChange(newValue, oldValue){
    this.dispatchEvent(new CustomEvent('onStateChange', {detail: {newValue: newValue, oldValue: oldValue}}));
  }

  showLoader() {
    this.googleMicLoaderEl.style.opacity = 1;
    this.googleMicEl.style.display = 'none';
  }

  hideLoader() {
    this.googleMicLoaderEl.style.opacity = 0;
    this.googleMicEl.style.display = 'block';
  }

  checkWebRTC() {
    let audioCtx = (window.AudioContext || window.webkitAudioContext)
    if (
      (audioCtx) &&
      ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia) &&
      (Worker)
    ) {
      return true;
    }
    console.error('Need to provide a cloud-speech-api-key for support on this browser.')
    return false;
  }

}



window.mobileAndTabletcheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
return check;
};

customElements.define(VoiceButton.is, VoiceButton);
