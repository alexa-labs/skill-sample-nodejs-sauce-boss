// Copyright 2018-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

/**
 * This file defines the different utililies to manage APL displays.
 */

// ASK SDK
const Alexa = require('ask-sdk-core');
// General Utilities
const recipeUtils = require('./recipeUtils');
// APL Templates
const APLDocs = {
    launch: require('./documents/launchRequest.json'),
    recipe: require('./documents/recipeIntent.json'),
    help: require('./documents/helpIntent.json'),
};

/**
 * Checks whether APL is supported by the User's device
 */
function supportsAPL(handlerInput) {
    const supportedInterfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
    const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
    return aplInterface !== null && aplInterface !== undefined;
}

/**
 * Adds Launch Screen (APL Template) to Response
 */
function launchScreen(handlerInput) {
    // Only add APL directive if User's device supports APL
    if (supportsAPL(handlerInput)) {
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document: APLDocs.launch,
            datasources: generateLaunchScreenDatasource(handlerInput)
        });
    }
}

/**
 * Adds Help Screen (APL Template) to Response
 */
function helpScreen(handlerInput) {
        // Only add APL directive if User's device supports APL
    if (supportsAPL(handlerInput)) {
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document: APLDocs.help,
            datasources: generateHelpScreenDatasource(handlerInput)
        });
    }
}

/**
 * Adds Recipe Screen (APL Template) to Response
 */
function recipeScreen(handlerInput, sauceItem) {
    // Get prompt & reprompt speech
    const speakOutput = sauceItem.instructions;
    const repromptOutput = handlerInput.t('RECIPE_REPEAT_MESSAGE');
    // Only add APL directive if User's device supports APL
    if (supportsAPL(handlerInput)) {
        // add APL Template
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            token: 'sauce-boss',
            version: '1.1',
            document: APLDocs.recipe,
            datasources: generateRecipeScreenDatasource(handlerInput, sauceItem)
        })
        // Add APL Command (Karaoke: sync. Voice/Text)
        .addDirective({
            type: 'Alexa.Presentation.APL.ExecuteCommands',
            token: 'sauce-boss',
            commands: [{
                type: 'SpeakItem',
                componentId: 'recipeText',
                highlightMode: 'line',
            }],
        });
        // As speech will be done by APL Command (SpeakItem) Voice/Text sync
        // Save prompt & reprompt for repeat
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.speakOutput = speakOutput;
        sessionAttributes.repromptOutput = repromptOutput;
    } else {
        // As APL is not supported by device
        // Provide prompt & reprompt instead of APL Karaoke
        handlerInput.responseBuilder
            .speak(speakOutput);
    }
}

/**
 * Compute the JSON Datasource associated to APL Launch Screen
 */
function generateLaunchScreenDatasource(handlerInput) {
    // Get recipes
    const recipes = handlerInput.t('RECIPES');
    // Get a random sauce name for hint
    const randomRecipe = recipeUtils.getRandomRecipe(handlerInput);
    // Define Header Title & Hint 
    const headerTitle = handlerInput.t('HEADER_TITLE', { skillName: handlerInput.t('SKILL_NAME') });
    const hintText = handlerInput.t('HINT_TEMPLATE', { sauce: randomRecipe.name });
    // Define Sauces to be displayed
    const saucesIdsToDisplay = ["BBQ", "CRA", "HON", "PES", "PIZ", "TAR", "THO", "SEC"];
    const sauces = [];
    Object.keys(recipes).forEach((item) => {
        if (saucesIdsToDisplay.includes(item)) {
            let sauceItem = {
                id: item,
                image: recipeUtils.getSauceImage(item),
                text: recipes[item].name,
            };
            sauces.push(sauceItem);
        }
    });
    // Generate JSON Datasource
    return {
        sauceBossData: {
            type: 'object',
            properties: {
                headerTitle: headerTitle,
                hintText: hintText,
                items: sauces
            },
            transformers: [
                {
                    inputPath: 'hintText',
                    transformer: 'textToHint',
                }
            ]
        }
    };
}

/**
 * Compute the JSON Datasource associated to APL Recipe Screen
 */
function generateRecipeScreenDatasource(handlerInput, sauceItem) {
    // Get a random sauce name for hint
    const randomSauce = recipeUtils.getRandomRecipe(handlerInput);
    // Define Header Title & Hint 
    const headerTitle = handlerInput.t('RECIPE_HEADER_TITLE', { sauce: sauceItem.name });
    const hintText = handlerInput.t('HINT_TEMPLATE', { sauce: randomSauce.name });
    // Generate JSON Datasource
    return {
        sauceBossData: {
            type: 'object',
            properties: {
                headerTitle: headerTitle,
                headerBackButton: !Alexa.isNewSession(handlerInput.requestEnvelope),
                hintText: hintText,
                sauceImg: sauceItem.image,
                sauceText: sauceItem.instructions,
                sauceSsml: `<speak>${sauceItem.instructions}</speak>`
            },
            transformers: [
                {
                    inputPath: 'sauceSsml',
                    transformer: 'ssmlToSpeech',
                    outputName: 'sauceSpeech'
                },
                {
                    inputPath: 'hintText',
                    transformer: 'textToHint',
                }
            ]
        }
    };
}

/**
 * Compute the JSON Datasource associated to APL Help Screen
 */
function generateHelpScreenDatasource(handlerInput) {
    // Get recipes
    const recipes = handlerInput.t('RECIPES');
    // Define Header & Sub Titles 
    const headerTitle = handlerInput.t('HELP_HEADER_TITLE');
    const headerSubTitle = handlerInput.t('HELP_HEADER_SUBTITLE');
    // Define Sauces to be displayed
    const saucesIdsToDisplay = ["BBQ", "CRA", "HON", "PES", "PIZ", "TAR", "THO", "SEC"];
    const sauces = [];
    Object.keys(recipes).forEach((item) => {
        if (saucesIdsToDisplay.includes(item)) {
            let sauceItem = {
                id: item,
                primaryText: handlerInput.t('HINT_TEMPLATE', { sauce: recipes[item].name }),
            };
            sauces.push(sauceItem);
        }
    });
    // Generate JSON Datasource
    return {
        sauceBossData: {
            headerTitle: headerTitle,
            headerSubtitle: headerSubTitle,
            headerBackButton: !Alexa.isNewSession(handlerInput.requestEnvelope),
            items: sauces
        }
    };
}

module.exports = {
    launchScreen,
    helpScreen,
    recipeScreen
} 