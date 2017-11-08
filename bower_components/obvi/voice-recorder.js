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
 
}