/*
 * Infographic Chat Interface
 * 
 * This interface is ready for n8n.io integration with ChatGPT.
 * 
 * To connect your n8n.io workflow:
 * 1. Replace the placeholder API call in handleAPIResponse() method
 * 2. Update the webhook URL with your n8n.io endpoint
 * 3. Ensure your n8n workflow returns JSON with a 'response' field
 * 
 * Features:
 * - Network detection (shows "No internet" when offline)
 * - Chat history with local storage
 * - Responsive design
 * - Typing indicators
 * - Auto-resizing input field
 */

// Chat Interface Application
class InfographicChatApp {
    constructor() {
        this.chatHistory = JSON.parse(localStorage.getItem('infographic-chat-history')) || [];
        this.isHistoryOpen = false;
        this.isTyping = false;
        this.isOnline = navigator.onLine;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeWelcomeMessage();
        this.loadChatHistory();
        this.autoResizeTextarea();
        this.setupNetworkDetection();
    }

    initializeElements() {
        // Main elements
        this.historyPanel = document.getElementById('historyPanel');
        this.historyToggle = document.getElementById('historyToggle');
        this.mainContent = document.getElementById('mainContent');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.welcomeTime = document.getElementById('welcomeTime');
    }

    bindEvents() {
        // History panel toggle
        this.historyToggle.addEventListener('click', () => this.toggleHistory());
        
        // Send message events
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Clear history
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => this.autoResizeTextarea());

        // Input focus effects
        this.chatInput.addEventListener('focus', () => {
            this.chatInput.parentElement.classList.add('active');
        });
        
        this.chatInput.addEventListener('blur', () => {
            this.chatInput.parentElement.classList.remove('active');
        });

        // Close history panel when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 480 && this.isHistoryOpen) {
                if (!this.historyPanel.contains(e.target) && !this.historyToggle.contains(e.target)) {
                    this.toggleHistory();
                }
            }
        });
    }

    initializeWelcomeMessage() {
        // Set welcome message timestamp
        this.welcomeTime.textContent = this.formatTime(new Date());
        
        // Add entrance animation
        setTimeout(() => {
            this.welcomeMessage.style.animation = 'fadeInUp 0.5s ease-out';
        }, 500);
    }

    toggleHistory() {
        this.isHistoryOpen = !this.isHistoryOpen;
        
        if (this.isHistoryOpen) {
            this.historyPanel.classList.add('open');
            this.historyToggle.classList.add('active');
            if (window.innerWidth > 480) {
                this.mainContent.classList.add('shifted');
            }
        } else {
            this.historyPanel.classList.remove('open');
            this.historyToggle.classList.remove('active');
            this.mainContent.classList.remove('shifted');
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        // Check internet connection
        if (!this.isOnline) {
            this.addMessage("⚠️ No internet connection. Please check your network and try again.", 'bot');
            return;
        }

        // Disable input while processing
        this.setInputState(false);
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        this.chatInput.value = '';
        this.autoResizeTextarea();
        
        // Add to history
        this.addToHistory(message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // TODO: This will be replaced with actual API call to n8n.io/ChatGPT
        await this.handleAPIResponse(message);
        
        // Re-enable input
        this.setInputState(true);
        this.chatInput.focus();
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const timestamp = this.formatTime(new Date());
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-content">${this.escapeHtml(content)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add entrance animation
        messageDiv.style.animation = 'fadeInUp 0.5s ease-out';
    }

    async showTypingIndicator() {
        this.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        
        // Keep typing indicator for 1-2 seconds
        await this.delay(1000 + Math.random() * 1000);
        
        // Remove typing indicator
        typingDiv.remove();
        this.isTyping = false;
    }

    async handleAPIResponse(userMessage) {
        // TODO: Replace this with actual API call to n8n.io/ChatGPT
        // For now, show a placeholder message indicating the system is ready for API integration
        
        this.addMessage("🔧 System ready for API integration. Connect your n8n.io workflow here to get ChatGPT responses.", 'bot');
        
        // Example of what the API call will look like:
        /*
        try {
            const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            this.addMessage(data.response || "Sorry, I couldn't process your request.", 'bot');
            
        } catch (error) {
            console.error('API Error:', error);
            this.addMessage("⚠️ Sorry, there was an error processing your request. Please try again.", 'bot');
        }
        */
    }

    setupNetworkDetection() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus(true);
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus(false);
        });

        // Initial status
        this.updateConnectionStatus(this.isOnline);
    }

    updateConnectionStatus(isOnline) {
        const placeholder = this.chatInput.getAttribute('placeholder');
        
        if (isOnline) {
            this.chatInput.setAttribute('placeholder', 'Describe the infographic you want to create...');
            this.chatInput.disabled = false;
            this.sendButton.disabled = false;
        } else {
            this.chatInput.setAttribute('placeholder', 'No internet connection - Please check your network');
            this.chatInput.disabled = true;
            this.sendButton.disabled = true;
        }
    }

    addToHistory(message) {
        const historyItem = {
            id: Date.now(),
            message: message,
            timestamp: new Date().toISOString(),
            preview: message.length > 50 ? message.substring(0, 50) + '...' : message
        };
        
        this.chatHistory.unshift(historyItem);
        
        // Keep only last 20 items
        if (this.chatHistory.length > 20) {
            this.chatHistory = this.chatHistory.slice(0, 20);
        }
        
        this.saveChatHistory();
        this.renderHistoryItem(historyItem);
    }

    renderHistoryItem(item) {
        const historyDiv = document.createElement('div');
        historyDiv.className = 'history-item';
        historyDiv.dataset.id = item.id;
        
        historyDiv.innerHTML = `
            <div class="preview">${this.escapeHtml(item.preview)}</div>
            <div class="timestamp">${this.formatTime(new Date(item.timestamp))}</div>
        `;
        
        historyDiv.addEventListener('click', () => {
            this.chatInput.value = item.message;
            this.autoResizeTextarea();
            this.chatInput.focus();
            if (window.innerWidth <= 480) {
                this.toggleHistory();
            }
        });
        
        // Insert at the beginning
        this.historyList.insertBefore(historyDiv, this.historyList.firstChild);
        
        // Remove excess items from DOM
        const items = this.historyList.querySelectorAll('.history-item');
        if (items.length > 20) {
            items[items.length - 1].remove();
        }
    }

    loadChatHistory() {
        this.historyList.innerHTML = '';
        
        if (this.chatHistory.length === 0) {
            this.historyList.innerHTML = '<div class="empty-history">No chat history yet<br>Start a conversation!</div>';
            return;
        }
        
        this.chatHistory.forEach(item => {
            this.renderHistoryItem(item);
        });
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
            this.chatHistory = [];
            this.saveChatHistory();
            this.loadChatHistory();
            
            // Add animation effect
            this.historyList.style.animation = 'fadeIn 0.3s ease-out';
        }
    }

    saveChatHistory() {
        localStorage.setItem('infographic-chat-history', JSON.stringify(this.chatHistory));
    }

    setInputState(enabled) {
        this.chatInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.chatInput.placeholder = "Describe the infographic you want to create...";
        } else {
            this.chatInput.placeholder = "Processing your request...";
        }
    }

    autoResizeTextarea() {
        // Reset height to auto to get the correct scrollHeight
        this.chatInput.style.height = 'auto';
        
        // Set height based on scroll height, with min and max constraints
        const minHeight = 50;
        const maxHeight = 150;
        const scrollHeight = this.chatInput.scrollHeight;
        
        this.chatInput.style.height = Math.min(Math.max(scrollHeight, minHeight), maxHeight) + 'px';
        
        // Show/hide scrollbar if content exceeds max height
        if (scrollHeight > maxHeight) {
            this.chatInput.style.overflowY = 'auto';
        } else {
            this.chatInput.style.overflowY = 'hidden';
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Additional Features and Enhancements
class UIEnhancements {
    constructor() {
        this.initializeParticleAnimation();
        this.initializeResponsiveHandlers();
        this.initializeKeyboardShortcuts();
        this.initializeAccessibility();
    }

    initializeParticleAnimation() {
        // Add more dynamic particle animation
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            // Randomize particle properties
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.8 + 0.2;
            const duration = Math.random() * 4 + 4;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.opacity = opacity;
            particle.style.animationDuration = duration + 's';
            
            // Add random colors
            const colors = ['--neon-cyan', '--neon-purple', '--neon-blue', '--neon-green', '--neon-pink'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = `var(${randomColor})`;
            particle.style.boxShadow = `0 0 20px var(${randomColor})`;
        });
    }

    initializeResponsiveHandlers() {
        // Handle window resize
        window.addEventListener('resize', () => {
            const app = window.chatApp;
            if (app && window.innerWidth > 480 && app.isHistoryOpen) {
                app.mainContent.classList.add('shifted');
            } else if (app) {
                app.mainContent.classList.remove('shifted');
            }
        });
    }

    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const app = window.chatApp;
            if (!app) return;

            // Ctrl/Cmd + H to toggle history
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                app.toggleHistory();
            }

            // Escape to close history panel
            if (e.key === 'Escape' && app.isHistoryOpen) {
                app.toggleHistory();
            }

            // Ctrl/Cmd + L to focus input
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                app.chatInput.focus();
            }
        });
    }

    initializeAccessibility() {
        // Add ARIA labels and roles
        const historyToggle = document.getElementById('historyToggle');
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        historyToggle.setAttribute('aria-label', 'Toggle chat history panel');
        historyToggle.setAttribute('aria-expanded', 'false');
        
        chatInput.setAttribute('aria-label', 'Type your infographic request');
        sendButton.setAttribute('aria-label', 'Send message');
        
        // Update aria-expanded when history toggles
        const originalToggle = window.chatApp?.toggleHistory;
        if (originalToggle) {
            window.chatApp.toggleHistory = function() {
                originalToggle.call(this);
                historyToggle.setAttribute('aria-expanded', this.isHistoryOpen.toString());
            };
        }
    }
}

// Theme and Visual Effects Manager
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.initializeThemeControls();
        this.initializeVisualEffects();
    }

    initializeThemeControls() {
        // Could be extended to support theme switching
        this.applyDynamicEffects();
    }

    applyDynamicEffects() {
        // Add subtle color cycling to the grid
        const gridOverlay = document.querySelector('.grid-overlay');
        if (gridOverlay) {
            setInterval(() => {
                const hue = Date.now() / 50 % 360;
                gridOverlay.style.filter = `hue-rotate(${hue}deg)`;
            }, 100);
        }
    }

    initializeVisualEffects() {
        // Add hover effects to messages
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.message-bubble')) {
                const bubble = e.target.closest('.message-bubble');
                bubble.style.transform = 'translateY(-2px) scale(1.01)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.message-bubble')) {
                const bubble = e.target.closest('.message-bubble');
                bubble.style.transform = '';
            }
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.initializeOptimizations();
    }

    initializeOptimizations() {
        // Optimize scroll performance
        let scrollTimeout;
        const chatMessages = document.getElementById('chatMessages');
        
        if (chatMessages) {
            chatMessages.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Re-enable smooth scrolling after user stops scrolling
                    chatMessages.style.scrollBehavior = 'smooth';
                }, 150);
                
                // Disable smooth scrolling during active scrolling for performance
                chatMessages.style.scrollBehavior = 'auto';
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main chat application
    window.chatApp = new InfographicChatApp();
    
    // Initialize enhancements
    new UIEnhancements();
    new ThemeManager();
    new PerformanceMonitor();
    
    // Add loading complete effect
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('🟩 Infographic Chat Interface loaded successfully!');
});
