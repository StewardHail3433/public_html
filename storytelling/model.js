let story = "";
let initialStory = "";
let currentLanguage = "en-US";
let currentLanguageName = "English";

let geminiApiKey = localStorage.getItem('geminiApiKey') || '';
let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

async function generateStory(prompt) {
    const body = {
        contents: [{
            parts: [{
                text: `Continur the story in ${currentLanguageName}:\n${prompt}`
            }]
        }],
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            body,
        )
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "(No response)";
}

function appendLine(role, text) {
    story += `\n${role}: ${text}`;
    return story;
}

function getStory() {
    return story;
}

function getInitialStory() {
    return initialStory;
}

function getLanguage() {
    return { lang: currentLanguage, name: currentLanguageName };
}

function setLanguage(lang, name) {
    currentLanguage = lang;
    currentLanguageName = name;
}

function resetStory() {
    story = initialStory;
    return story;
}

function initializeStory(initialText) {
    story = initialText;
    initialStory = initialText;
    return story;
}

export default {
    generateStory,
    appendLine,
    getStory,
    getInitialStory,
    getLanguage,
    setLanguage,
    resetStory,
    initializeStory,
    setApiKey,
    loadApiKey
}

function setApiKey(key) {
    const apiKey = key.trim();
    if (!apiKey) {
        console.log("GeminiAPI key cannot be empty");
        return false;
    }
    geminiApiKey = key;
    localStorage.setItem('geminiApiKey', geminiApiKey);
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
    return true;
}

function loadApiKey() {
    if (geminiApiKey) {
        return geminiApiKey;
    }
}