const { createApp } = Vue
createApp({
    data() {
        return {
            inputText: '',
            maxTweetLength: 280,
            isGenerating: false,
            sampleThread: `AI Agents are revolutionizing the way we develop software! 🤖✨ They're like having a super-smart coding buddy available 24/7.

These AI assistants can understand context, suggest improvements, and even write code. They're particularly amazing at handling repetitive tasks and helping maintain consistency across large codebases.

One of the coolest things about AI Agents is their ability to learn from the entire codebase. They can spot patterns, suggest best practices, and help prevent bugs before they happen! 🎯

Beyond just coding, they're great at documentation, code review, and even helping explain complex code to team members. It's like having a senior developer always ready to help! 👩‍💻

The future of software development is here, and it's collaborative. Humans and AI working together to create better, more reliable software faster than ever before! 🚀`
        }
    },
    computed: {
        characterCount() {
            return this.inputText.length;
        },
        wordCount() {
            return this.inputText.trim() ? this.inputText.trim().split(/\s+/).length : 0;
        },
        tweetThreadChunks() {
            if (!this.inputText.trim()) return [];
            
            // Split by triple or more newlines to force tweet breaks
            const forcedChunks = this.inputText.split(/\n\n\n+/);
            const finalChunks = [];
            
            forcedChunks.forEach(chunk => {
                if (!chunk.trim()) return; // Skip empty chunks
                
                // Preserve the original whitespace within the chunk, but trim only leading/trailing spaces
                chunk = chunk.replace(/^\s+|\s+$/g, '');
                
                if (chunk.length <= this.maxTweetLength) {
                    finalChunks.push(chunk);
                    return;
                }
                
                let currentChunk = '';
                const words = chunk.split(/(\s+)/); // Split preserving whitespace
                
                words.forEach((word) => {
                    if (currentChunk.length + word.length <= this.maxTweetLength) {
                        currentChunk += word;
                    } else {
                        if (word.trim().length > this.maxTweetLength) {
                            // Handle very long words
                            if (currentChunk) {
                                finalChunks.push(currentChunk);
                                currentChunk = '';
                            }
                            let remainingWord = word;
                            while (remainingWord.length > 0) {
                                const chunkSize = Math.min(remainingWord.length, this.maxTweetLength);
                                finalChunks.push(remainingWord.substring(0, chunkSize));
                                remainingWord = remainingWord.substring(chunkSize);
                            }
                        } else {
                            // Normal word that doesn't fit
                            if (currentChunk) {
                                finalChunks.push(currentChunk);
                            }
                            currentChunk = word;
                        }
                    }
                });
                
                if (currentChunk) {
                    finalChunks.push(currentChunk);
                }
            });
            
            return finalChunks;
        }
    },
    methods: {
        handleClick() {
            console.log('Button clicked!')
        },
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        },
        async generateSampleThread() {
            if (this.isGenerating) return;
            
            this.isGenerating = true;
            this.inputText = '';
            
            const delay = char => new Promise(resolve => setTimeout(resolve, 
                char === '\n' ? 150 : // longer pause for newlines
                char === '.' || char === '!' ? 100 : // pause for punctuation
                30 // normal typing speed
            ));

            for (const char of this.sampleThread) {
                await delay(char);
                this.inputText += char;
            }
            
            this.isGenerating = false;
        }
    }
}).mount('#app')