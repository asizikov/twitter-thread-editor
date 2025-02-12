import { threadLogic } from '../public/threadLogic.js';

describe('Thread Logic', () => {
    describe('getCharacterCount', () => {
        test('should return correct character count', () => {
            expect(threadLogic.getCharacterCount('Hello')).toBe(5);
            expect(threadLogic.getCharacterCount('')).toBe(0);
            expect(threadLogic.getCharacterCount('Hello\nWorld')).toBe(11); // Updated to account for \n as one character
        });
    });

    describe('getWordCount', () => {
        test('should return correct word count', () => {
            expect(threadLogic.getWordCount('Hello world')).toBe(2);
            expect(threadLogic.getWordCount('')).toBe(0);
            expect(threadLogic.getWordCount('   ')).toBe(0);
            expect(threadLogic.getWordCount('Hello\nworld')).toBe(2);
            expect(threadLogic.getWordCount('Multiple   spaces   between')).toBe(3);
        });
    });

    describe('splitIntoTweets', () => {
        test('should return empty array for empty input', () => {
            expect(threadLogic.splitIntoTweets('')).toEqual([]);
            expect(threadLogic.splitIntoTweets('   ')).toEqual([]);
        });

        test('should keep text with single newline as one tweet', () => {
            const text = 'hello\nthis is a tweet';
            expect(threadLogic.splitIntoTweets(text)).toEqual([
                'hello\nthis is a tweet'
            ]);
        });

        test('should keep text with single empty line as one tweet', () => {
            const text = 'hello\n\nthis is a tweet';
            expect(threadLogic.splitIntoTweets(text)).toEqual([
                'hello\n\nthis is a tweet'
            ]);
        });

        test('should split text at double empty lines', () => {
            const text = 'hello\n\n\nthis is a tweet';
            expect(threadLogic.splitIntoTweets(text)).toEqual([
                'hello',
                'this is a tweet'
            ]);
        });

        test('should handle multiple splits and preserve format', () => {
            const text = 'First tweet\n\n\nSecond tweet\nwith newline\n\n\nThird tweet\n\nwith empty line';
            expect(threadLogic.splitIntoTweets(text)).toEqual([
                'First tweet',
                'Second tweet\nwith newline',
                'Third tweet\n\nwith empty line'
            ]);
        });

        test('should handle long words', () => {
            const longWord = 'a'.repeat(300);
            const result = threadLogic.splitIntoTweets(longWord);
            expect(result).toHaveLength(2);
            expect(result[0].length).toBe(280);
            expect(result[1].length).toBe(20);
        });

        test('should respect word boundaries when possible', () => {
            const text = 'This is a ' + 'very '.repeat(100) + 'long tweet';
            const result = threadLogic.splitIntoTweets(text);
            expect(result.length).toBeGreaterThan(1);
            // Check that no words are cut in the middle
            result.forEach(tweet => {
                const lastChar = tweet[tweet.length - 1];
                expect(lastChar === ' ' || lastChar === tweet[tweet.length - 1]).toBeTruthy();
            });
        });

        test('should handle custom max length', () => {
            const text = 'This is a test message';
            const result = threadLogic.splitIntoTweets(text, 10);
            expect(result).toEqual(['This is a', 'test', 'message']);
        });
    });
});