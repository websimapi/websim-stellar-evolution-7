export default {
    props: {
        settings: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            audioContext: null,
            soundBuffers: {},
            ttsVoice: null,
            isSpeaking: false
        };
    },
    mounted() {
        // Initialize audio context when user interacts with the page
        const initAudio = () => {
            if (!this.audioContext) {
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.loadSounds();
                    this.initTTS();
                } catch (error) {
                    console.error('Web Audio API is not supported in this browser', error);
                }
            }
            
            // Remove event listeners after initialization
            document.removeEventListener('click', initAudio);
            document.removeEventListener('keydown', initAudio);
        };
        
        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
    },
    methods: {
        loadSounds() {
            // List of sounds to preload
            const sounds = {
                'command_sent': '/sounds/command_sent.mp3',
                'notification': '/sounds/notification.mp3',
                'resource_gained': '/sounds/resource_gained.mp3',
                'resource_lost': '/sounds/resource_lost.mp3',
                'discovery': '/sounds/discovery.mp3',
                'research_complete': '/sounds/research_complete.mp3',
                'construction_start': '/sounds/construction_start.mp3',
                'construction_complete': '/sounds/construction_complete.mp3',
                'error': '/sounds/error.mp3',
                'warning': '/sounds/warning.mp3'
            };
            
            // For the demo, we're not actually loading real sound files
            // In a real implementation, you would fetch and decode audio files
            Object.keys(sounds).forEach(key => {
                this.soundBuffers[key] = true; // Placeholder
            });
        },
        playSound(soundName) {
            if (!this.audioContext || !this.settings.enableSounds) return;
            
            // In a real implementation, you would play the actual sound buffer
            console.log(`Playing sound: ${soundName}`);
            
            // Simulated sound playback
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Different sounds have different frequencies and durations
            let frequency = 440;
            let duration = 0.2;
            
            switch(soundName) {
                case 'command_sent':
                    frequency = 440;
                    duration = 0.1;
                    break;
                case 'notification':
                    frequency = 660;
                    duration = 0.2;
                    break;
                case 'discovery':
                    frequency = 880;
                    duration = 0.5;
                    break;
                case 'error':
                    frequency = 220;
                    duration = 0.3;
                    break;
                case 'warning':
                    frequency = 330;
                    duration = 0.3;
                    break;
            }
            
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            gainNode.gain.value = 0.1 * (this.settings.soundVolume / 100);
            oscillator.start();
            
            setTimeout(() => {
                oscillator.stop();
            }, duration * 1000);
        },
        initTTS() {
            // Check if browser supports speech synthesis
            if ('speechSynthesis' in window) {
                // Get available voices
                const getVoices = () => {
                    const voices = window.speechSynthesis.getVoices();
                    if (voices.length > 0) {
                        // Prefer a neutral English voice
                        this.ttsVoice = voices.find(voice => 
                            voice.lang.includes('en') && 
                            (voice.name.includes('Neural') || voice.name.includes('Google'))
                        ) || voices[0];
                    }
                };
                
                // Chrome needs a timeout for getVoices to work properly
                setTimeout(getVoices, 100);
                
                // Firefox and some others use this event
                window.speechSynthesis.onvoiceschanged = getVoices;
            }
        },
        async speak(text, tone = 'neutral') {
            if (!('speechSynthesis' in window) || !this.settings.enableTTS) {
                return Promise.resolve();
            }
            
            // If already speaking, cancel it
            if (this.isSpeaking) {
                window.speechSynthesis.cancel();
            }
            
            return new Promise((resolve) => {
                const utterance = new SpeechSynthesisUtterance(text);
                
                if (this.ttsVoice) {
                    utterance.voice = this.ttsVoice;
                }
                
                // Adjust parameters based on tone
                switch(tone) {
                    case 'positive':
                        utterance.pitch = 1.2;
                        utterance.rate = 1.1;
                        break;
                    case 'negative':
                    case 'error':
                        utterance.pitch = 0.8;
                        utterance.rate = 0.9;
                        break;
                    case 'warning':
                        utterance.pitch = 1.1;
                        utterance.rate = 1.2;
                        break;
                    case 'info':
                        utterance.pitch = 1.0;
                        utterance.rate = 1.0;
                        break;
                    default:
                        utterance.pitch = 1.0;
                        utterance.rate = 1.0;
                }
                
                // Set volume based on settings
                utterance.volume = this.settings.ttsVolume / 100;
                
                // Event listeners
                utterance.onstart = () => {
                    this.isSpeaking = true;
                };
                
                utterance.onend = () => {
                    this.isSpeaking = false;
                    resolve();
                };
                
                utterance.onerror = (event) => {
                    console.error('TTS Error:', event);
                    this.isSpeaking = false;
                    resolve();
                };
                
                // Speak
                window.speechSynthesis.speak(utterance);
            });
        }
    },
    template: `<div style="display: none;"></div>`
};

