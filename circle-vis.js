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


/*
  
  Circle animation behind the voice button

*/
class CircleViz {

      constructor(containerEl, onNoMicAccess){
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
      }

      attachUserMediaStream(){
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

      soundNotAllowed(e){
        // circle viz graceful degrade, but let know main component know
        this.onNoMicAccess();
      }

      soundAllowed(stream) {
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

      getCircleScale(){
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

      doDraw(){
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
        this.animation = requestAnimationFrame(this.doDraw.bind(this));
      }

      getCurrentScale(){
        let splitProperty = this.circle.style.transform.split(new RegExp(/\(|\)/, 'g'))
        if(splitProperty.length === 3){
          let currScale = parseFloat(splitProperty[1]);
          return currScale;
        }
        return null;
      }

      startAnimation(){
        if(this.stopped){
          this.containerEl.style.opacity = 1;
          this.stopped = false;
          this.attachUserMediaStream();
        }
      }

      stopAnimation(){
        this.stopped = true;
        this.containerEl.style.opacity = 0;
        if(this.audioStream.getAudioTracks().length > 0){
          this.audioStream.getAudioTracks()[0].stop();
        }
      }

    }