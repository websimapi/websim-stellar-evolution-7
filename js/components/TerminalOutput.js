export default {
    props: {
        messages: {
            type: Array,
            required: true
        },
        activeTTS: {
            type: Boolean,
            default: false
        }
    },
    emits: ['image-loaded'],
    methods: {
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        async generateImage(prompt) {
            try {
                // Find the message that needs the image
                const messageIndex = this.messages.findIndex(m => m.imagePrompt === prompt && m.imageLoading);
                if (messageIndex === -1) return;
                
                // Generate image
                const result = await websim.imageGen({
                    prompt: prompt,
                    aspect_ratio: "16:9"
                });
                
                // Update message with image URL
                this.$set(this.messages[messageIndex], 'imageUrl', result.url);
                this.$set(this.messages[messageIndex], 'imageLoading', false);
                
                // Emit event to scroll to bottom after image loads
                this.$emit('image-loaded');
            } catch (error) {
                console.error('Error generating image:', error);
                
                // Find the message and mark it as not loading
                const messageIndex = this.messages.findIndex(m => m.imagePrompt === prompt && m.imageLoading);
                if (messageIndex !== -1) {
                    this.$set(this.messages[messageIndex], 'imageLoading', false);
                    this.$set(this.messages[messageIndex], 'imageError', true);
                }
            }
        }
    },
    watch: {
        messages: {
            handler(newMessages, oldMessages) {
                if (newMessages.length > oldMessages.length) {
                    // Check if any new messages need images
                    const newMessage = newMessages[newMessages.length - 1];
                    if (newMessage.imagePrompt && newMessage.imageLoading) {
                        this.generateImage(newMessage.imagePrompt);
                    }
                }
            },
            deep: true
        }
    },
    template: `
        <div class="terminal-output">
            <div v-for="message in messages" :key="message.id" :class="['message', message.type, message.tone]">
                <div class="message-header">
                    <div class="message-indicator">
                        <span v-if="message.type === 'user'" class="user-indicator">&gt;</span>
                        <span v-else-if="message.type === 'system'" class="system-indicator">!</span>
                        <span v-else class="ai-indicator" :class="{ 'speaking': activeTTS && message.id === messages[messages.length - 1].id }">*</span>
                    </div>
                    <div class="message-meta">
                        <span class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</span>
                    </div>
                </div>
                
                <div class="message-content" :class="{ 'typing-animation': message.id === messages[messages.length - 1].id && message.type === 'game' }">
                    <template v-if="message.type === 'system'">
                        <h3 class="system-title">{{ message.title }}</h3>
                        <p v-if="message.text">{{ message.text }}</p>
                    </template>
                    <template v-else>
                        <p>{{ message.text }}</p>
                        <p v-if="message.detailText" class="detail-text">{{ message.detailText }}</p>
                    </template>
                    
                    <div v-if="message.imagePrompt" class="message-image">
                        <div v-if="message.imageLoading" class="image-loading">
                            <div class="loading-spinner"></div>
                            <span>Generating image...</span>
                        </div>
                        <div v-else-if="message.imageError" class="image-error">
                            <span>Unable to generate image</span>
                        </div>
                        <img v-else-if="message.imageUrl" :src="message.imageUrl" @load="$emit('image-loaded')" alt="Generated visualization">
                    </div>
                </div>
            </div>
            
            <div v-if="activeTTS" class="tts-indicator">
                <div class="tts-waves">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span>Speaking...</span>
            </div>
        </div>
    `,
    styles: `
        <style>
            .terminal-output {
                font-family: 'Space Mono', monospace;
                line-height: 1.5;
                white-space: pre-wrap;
                word-break: break-word;
            }
            
            .message {
                margin-bottom: var(--spacing-md);
                animation: messageAppear 0.3s ease-out forwards;
            }
            
            .message-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: var(--spacing-xs);
            }
            
            .message-indicator {
                font-weight: bold;
            }
            
            .user-indicator {
                color: var(--minerals-color);
            }
            
            .system-indicator {
                color: var(--warning-color);
            }
            
            .ai-indicator {
                color: var(--accent-color);
            }
            
            .ai-indicator.speaking {
                animation: pulse 1s infinite;
            }
            
            .message-timestamp {
                font-size: var(--font-xs);
                color: var(--secondary-text);
            }
            
            .message-content {
                background-color: rgba(30, 39, 56, 0.3);
                padding: var(--spacing-md);
                border-radius: var(--radius-md);
                border-left: 3px solid transparent;
            }
            
            .message.user .message-content {
                border-left-color: var(--minerals-color);
            }
            
            .message.game .message-content {
                border-left-color: var(--accent-color);
            }
            
            .message.system .message-content {
                border-left-color: var(--neutral-color);
            }
            
            .message.positive .message-content {
                border-left-color: var(--success-color);
            }
            
            .message.error .message-content {
                border-left-color: var(--warning-color);
                background-color: rgba(255, 92, 92, 0.1);
            }
            
            .message.warning .message-content {
                border-left-color: var(--energy-color);
                background-color: rgba(255, 203, 69, 0.1);
            }
            
            .message.info .message-content {
                border-left-color: var(--knowledge-color);
                background-color: rgba(101, 221, 155, 0.1);
            }
            
            .system-title {
                font-family: 'Orbitron', sans-serif;
                color: var(--neutral-color);
                margin-bottom: var(--spacing-xs);
                font-size: var(--font-md);
            }
            
            .detail-text {
                margin-top: var(--spacing-sm);
                color: var(--secondary-text);
                font-size: var(--font-sm);
            }
            
            .message-image {
                margin-top: var(--spacing-md);
                width: 100%;
            }
            
            .message-image img {
                max-width: 100%;
                border-radius: var(--radius-sm);
                border: 1px solid var(--border-color);
            }
            
            .image-loading, .image-error {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-sm);
                height: 150px;
                background-color: rgba(30, 39, 56, 0.5);
                border-radius: var(--radius-sm);
                color: var(--secondary-text);
            }
            
            .image-error {
                color: var(--warning-color);
            }
            
            .tts-indicator {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-sm);
                color: var(--accent-color);
                font-size: var(--font-sm);
            }
            
            .tts-waves {
                display: flex;
                align-items: flex-end;
                height: 16px;
            }
            
            .tts-waves span {
                display: inline-block;
                width: 3px;
                height: 5px;
                margin: 0 2px;
                background-color: var(--accent-color);
                border-radius: 1px;
                animation: tts-wave 1.2s infinite ease-in-out;
            }
            
            .tts-waves span:nth-child(2) {
                animation-delay: 0.2s;
                height: 8px;
            }
            
            .tts-waves span:nth-child(3) {
                animation-delay: 0.4s;
                height: 12px;
            }
            
            .tts-waves span:nth-child(4) {
                animation-delay: 0.6s;
                height: 6px;
            }
            
            @keyframes tts-wave {
                0%, 100% {
                    transform: scaleY(1);
                }
                50% {
                    transform: scaleY(1.5);
                }
            }
        </style>
    `
};

