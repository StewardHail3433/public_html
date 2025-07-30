import Model from "./model.js"
import View from "./view.js"

const recongnition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recongnition.lang = Model.getLanguage().value;

let aiRequestInProgress = false;

async function handleVoiceInput(event) {
    const userText = event.results[0][0].transcript;
    const updateStory = Model.appendLine("Player", userText);
    View.toggleLoading(true);
    aiRequestInProgress = true;
    const aiResponse = await Model.generateStory(updateStory + "\nNarrator:");
    aiRequestInProgress = false;
    View.toggleLoading(false)
    const finalStory = Model.appendLine("Narrator", aiResponse);
    View.updateStory(finalStory);
    View.speakText(aiResponse, Model.getLanguage().lang);
}

function handleLanguageChange() {
    const selectOption = View.getLanguageSelect().selectedOptions[0];
    const newLang = selectOption.value;
    const newLangName = selectOption.dataset.name;
    Model.setLanguage(newLang, newLangName);
    recongnition.lang = newLang;
}

function handleStopSpeaking() {
    View.stopSpeaking();
    if (aiRequestInProgress) {
        View.toggleLoading(false);
        aiRequestInProgress = false;
    }

    const resetStory = Model.resetStory();
    View.updateStory(resetStory);

    setTimeout(() => {
        View.speakText("Story Reset! Help me build a story! Start with a sentence and I will continue it.", Model.getLanguage().lang);
    }, 500);
}

function handlePauseResumeSpeaking(event) {
    const newState = View.pauseOrResumeSpeaking();
    event.target.textContent = newState === "Pause" ? "Resume" : "Pause";
}

function handleSaveApiKey() {
    const apiKey = View.getApiKeyInput().value;
    if (Model.setApiKey(apiKey)) {
        View.getSaveButton().textContent = "Saved!";
        View.getSaveButton().background = "green";
    } else {
        View.getSaveButton().textContent = "Save";
        View.getSaveButton().background = "red";
    }
}

function init() {
    window.speechSynthesis.onvoiceschanged = () => { };
    const initializeStory = View.getInitialStoryContent();
    Model.getInitialStory(initializeStory);
    View.updateStory(initializeStory);


    const key = Model.loadApiKey()
    if(key) {
        View.getApiKeyInput().value = key;
        View.getSaveButton().textContent = "Saved!";
        View.getSaveButton().background = "green";
    } else {
        View.getApiKeyInput().value = "";
        View.getSaveButton().textContent = "Save";
    }
    setTimeout(() => {
        View.speakText("Story Reset! Help me build a story! Start with a sentence and I will continue it.", Model.getLanguage().lang);
    }, 500);



    View.getSpeakButton().addEventListener("click", () => {
        try {
            recongnition.start();
        } catch (error) {
            console.log(`Speach Recognition Error: ${error}`);
        }
    });
    recongnition.onresult = handleVoiceInput;
    recongnition.onerror = (event) => {
        console.error("Speach Recognition Error: " + event.error);
        View.toggleLoading(false);
        aiRequestInProgress = false;
    };
    View.getStopSpeakButton().addEventListener("click", handleStopSpeaking);
    View.getPauseSpeakButton().addEventListener("click", handlePauseResumeSpeaking);
    View.getLanguageSelect().addEventListener("change", handleLanguageChange);
    View.getSaveButton().addEventListener("click", handleSaveApiKey);
}


document.addEventListener('DOMContentLoaded', () => {
    init();
});



