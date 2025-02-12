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
            let remainingText = chunk;
            let isFirst = true;

            // First chunk: 47 chars + '...'
            const firstChunkContent = remainingText.substring(0, maxLength - 3);
            finalChunks.push(firstChunkContent + '...');
            remainingText = remainingText.substring(maxLength - 3);

            // Middle chunks: '...' + 44 chars + '...'
            while (remainingText.length > maxLength - 3) {
                const middleChunkContent = remainingText.substring(0, maxLength - 6);
                finalChunks.push('...' + middleChunkContent + '...');
                remainingText = remainingText.substring(maxLength - 6);
            }

            // Last chunk: '...' + remaining chars (if any)
            if (remainingText.length > 0) {
                finalChunks.push('...' + remainingText);
            }
            return;
        }

        let remainingText = chunk;
        let isFirst = true;

        while (remainingText.length > 0) {
            const ellipsesLength = 3;
            let availableSpace = maxLength;
            
            if (!isFirst) {
                availableSpace -= ellipsesLength; // Space for leading ellipsis
            }
            
            if (remainingText.length > availableSpace - ellipsesLength) {
                // Need to split, so reserve space for trailing ellipsis
                availableSpace -= ellipsesLength;
                
                // Find the last space within the available space
                let splitIndex = remainingText.lastIndexOf(' ', availableSpace);
                if (splitIndex === -1) {
                    splitIndex = availableSpace;
                }

                let currentPiece = remainingText.substring(0, splitIndex).trim();
                currentPiece += '...';
                if (!isFirst) {
                    currentPiece = '...' + currentPiece;
                }

                finalChunks.push(currentPiece);
                remainingText = remainingText.substring(splitIndex).trim();
            } else {
                // This is the last piece
                let currentPiece = remainingText.trim();
                if (!isFirst) {
                    currentPiece = '...' + currentPiece;
                }
                finalChunks.push(currentPiece);
                break;
            }
            
            isFirst = false;
        }
    }
}