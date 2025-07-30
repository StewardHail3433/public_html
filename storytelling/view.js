const STORY_DIV = document.getElementById("story");
const SPEAK_BUTTON = document.getElementById("speakBtn");
const STOP_SPEAK_BUTTON = document.getElementById("stopSpeakBtn");
const PAUSE_SPEAK_BUTTON = document.getElementById("pauseSpeakBtn");
const LANGUAGE_SELECT = document.getElementById("languageSelect");
const LOADING_DIV = document.getElementById("loading");
const API_KEY_INPUT = document.getElementById("apiKey");
const SAVE_BUTTON = document.getElementById("saveApiKey");

function updateStory(text) {
    if (STORY_DIV)
        STORY_DIV.textContent = text;
}

function toggleLoading(show) {
    if (LOADING_DIV)
        LOADING_DIV.style.display = show ? "block" : "none";
}

function getSpeakButton() {
    return SPEAK_BUTTON;
}

function getStopSpeakButton() {
    return STOP_SPEAK_BUTTON;
}

function getPauseSpeakButton() {
    return PAUSE_SPEAK_BUTTON;
}

function getLanguageSelect() {
    return LANGUAGE_SELECT;
}

function getSaveButton() {
    return SAVE_BUTTON;
}

function getApiKeyInput() {
    return API_KEY_INPUT;
}

function getInitialStoryContent() {
    return STORY_DIV ? STORY_DIV.textContent.trim() : "Narrator: Help me build a story! Start with a sentence and I will continue it.";
}


function speakText(text, lang) {
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        const voices = speechSynthesis.getVoices();

        if (voices.length == 0) {
            setTimeout(() => speakText(text, lang), 100);
            return;
        }
        const voice = voices.find(v => v.lang == lang);
        if (voice)
            utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
    } catch (error) {
        console.log(`Speach Synthesis Error: ${error}`);
    }
}

function stopSpeaking() {
    window.speechSynthesis.cancel();
}

function pauseOrResumeSpeaking() {
    if(window.speechSynthesis.speaking)
        if(window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            return "Resume"
        } else {
            window.speechSynthesis.pause();
            return "Pause"
        }
}


export default {
    updateStory,
    toggleLoading,
    getSpeakButton,
    getStopSpeakButton,
    getPauseSpeakButton,
    getLanguageSelect,
    getSaveButton,
    getApiKeyInput,
    getInitialStoryContent,
    speakText,
    stopSpeaking,
    pauseOrResumeSpeaking
}