export const threadLogic = {
    maxTweetLength: 280,

    getCharacterCount(text) {
        return text.length;
    },

    getWordCount(text) {
        return text.trim() ? text.trim().split(/\s+/).length : 0;
    },

    splitIntoTweets(text, maxLength = this.maxTweetLength) {
        if (!text.trim()) return [];
        
        // Normalize newlines and split by triple+ newlines (double empty line)
        text = text.replace(/\r\n/g, '\n');
        const chunks = text.split(/\n\n\n+/);
        
        return chunks
            .map(chunk => chunk.trim()) // Remove leading/trailing whitespace
            .filter(chunk => chunk.length > 0) // Remove empty chunks
            .reduce((finalChunks, chunk) => {
                if (chunk.length <= maxLength) {
                    finalChunks.push(chunk);
                } else {
                    this._splitLongChunk(chunk, maxLength, finalChunks);
                }
                return finalChunks;
            }, []);
    },

    _splitLongChunk(chunk, maxLength, finalChunks) {
        if (!chunk.includes(' ')) {
            // Handle text without spaces
            let remainingText = chunk;
            while (remainingText.length > 0) {
                const chunkSize = Math.min(remainingText.length, maxLength);
                finalChunks.push(remainingText.substring(0, chunkSize));
                remainingText = remainingText.substring(chunkSize);
            }
            return;
        }

        let currentChunk = '';
        const words = chunk.split(' '); // Split by space
        
        words.forEach((word, index) => {
            const space = currentChunk.length > 0 ? ' ' : '';
            const wordWithSpace = space + word;
            
            if (currentChunk.length + wordWithSpace.length <= maxLength) {
                currentChunk += wordWithSpace;
            } else if (word.length > maxLength) {
                // Handle a word that's longer than maxLength
                if (currentChunk) {
                    finalChunks.push(currentChunk.trim());
                    currentChunk = '';
                }
                let remainingWord = word;
                while (remainingWord.length > 0) {
                    const chunkSize = Math.min(remainingWord.length, maxLength);
                    finalChunks.push(remainingWord.substring(0, chunkSize));
                    remainingWord = remainingWord.substring(chunkSize);
                }
            } else {
                // Word doesn't fit in current chunk but isn't too long
                if (currentChunk) {
                    finalChunks.push(currentChunk.trim());
                }
                currentChunk = word;
            }
        });
        
        if (currentChunk) {
            finalChunks.push(currentChunk.trim());
        }
    }
}