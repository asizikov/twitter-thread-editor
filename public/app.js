import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { threadLogic } from './threadLogic.js';

try {
  createApp({
      data() {
          return {
              inputText: '',
              maxTweetLength: threadLogic.maxTweetLength,
              isGenerating: false,
              copiedTweets: new Set(),
              sampleThread: `AI Agents are revolutionizing the way we develop software! 🤖✨ They're like having a super-smart coding buddy available 24/7.

These AI assistants can understand context, suggest improvements, and even write code. They're particularly amazing at handling repetitive tasks and helping maintain consistency across large codebases.

One of the coolest things about AI Agents is their ability to learn from the entire codebase. They can spot patterns, suggest best practices, and help prevent bugs before they happen! 🎯

Beyond just coding, they're great at documentation, code review, and even helping explain complex code to team members. It's like having a senior developer always ready to help! 👩‍💻

The future of software development is here, and it's collaborative. Humans and AI working together to create better, more reliable software faster than ever before! 🚀`
          }
      },
      watch: {
          inputText() {
              this.copiedTweets.clear();
          }
      },
      computed: {
          currentYear() {
              return new Date().getFullYear();
          },
          characterCount() {
              return threadLogic.getCharacterCount(this.inputText);
          },
          wordCount() {
              return threadLogic.getWordCount(this.inputText);
          },
          tweetThreadChunks() {
              return threadLogic.splitIntoTweets(this.inputText);
          }
      },
      methods: {
          handleClick() {
              console.log('Button clicked!')
          },
          async copyToClipboard(text, index) {
              try {
                  await navigator.clipboard.writeText(text);
                  if (this.copiedTweets.has(index)) {
                      this.copiedTweets.delete(index);
                  } else {
                      this.copiedTweets.add(index);
                  }
              } catch (err) {
                  console.error('Failed to copy text: ', err);
              }
          },
          isTweetCopied(index) {
              return this.copiedTweets.has(index);
          },
          async generateSampleThread() {
              if (this.isGenerating) return;
              
              this.isGenerating = true;
              this.inputText = '';
              this.copiedTweets.clear();
              
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
} catch (error) {
  console.error('Module loading error:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error loading application: ${error.message}</div>`;
}