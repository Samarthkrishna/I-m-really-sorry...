// A soft original ambient tone generated in the browser (not BTS audio or a voice clone).
let audioContext = null, masterGain = null, oscillators = [], playing = false;
const toggle = document.getElementById('musicToggle');
const label = document.getElementById('musicLabel');
function startMelody(){
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC){ label.textContent='Audio not supported'; return; }
  audioContext = audioContext || new AC();
  if(audioContext.state === 'suspended') audioContext.resume();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.0001;
  masterGain.connect(audioContext.destination);
  // Gentle, original sustained chord tones; no sampled/copyrighted recording.
  [261.63, 329.63, 392.00, 523.25].forEach((freq,i)=>{
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = i===3 ? 'sine' : 'triangle';
    osc.frequency.value = freq;
    gain.gain.value = [0.12,0.08,0.07,0.035][i];
    osc.connect(gain); gain.connect(masterGain); osc.start();
    oscillators.push(osc);
  });
  masterGain.gain.setTargetAtTime(0.11, audioContext.currentTime, 1.4);
  playing = true; toggle.setAttribute('aria-pressed','true'); label.textContent='Pause gentle melody';
}
function stopMelody(){
  if(masterGain && audioContext){
    masterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.25);
    window.setTimeout(()=>{oscillators.forEach(o=>{try{o.stop()}catch(e){}});oscillators=[];},900);
  }
  playing=false; toggle.setAttribute('aria-pressed','false'); label.textContent='Play gentle melody';
}
toggle.addEventListener('click',()=>{if(playing) stopMelody(); else startMelody();});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 const target=document.querySelector(a.getAttribute('href')); if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
}));