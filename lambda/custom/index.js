// Copyright 2018-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const APLDocs = {
  launch: require('./documents/launchRequest.json'),
  recipe: require('./documents/recipeIntent.json'),
  help: require('./documents/helpIntent.json'),
};

// List of the supported recipes in the skill
const recipes = {
  RECIPE_EN_US: {
    'barbecue': 'To make BBQ sauce, combine brown sugar, ketchup, vinegar, and Worcestershire sauce in a blender. Season with salt, pepper, and cayenne pepper. Blend until smooth.',
    'honey mustard': 'To make honey mustard, mix mayonnaise, yellow mustard, Dijon mustard, honey, and lemon juice together in a bowl. Cover and chill in the refrigerator overnight.',
    'ranch': 'For ranch dressing, whisk together mayonnaise, sour cream, chives, parsley, dill, garlic powder, onion powder, salt and pepper in a large bowl. Cover and refrigerate for 30 minutes before serving.',
    'caesar': 'For Caesar dressing, combine lemon juice, vinegar, water, shredded parmesan cheese, Dijon mustard, garlic powder and pepper in a jar. Cover with a lid and shake well. Refrigerate until ready to use.',
    'worcestershire': 'To make Worcestershire sauce, combine apple cider vinegar, water, soy sauce, brown sugar, mustard powder, onion powder, garlic powder, ground cinnamon, and a pinch of black pepper together in a saucepan; bring to a boil and cook until fragrant, about 45 seconds, then cool to room temperature.',
    'thousand island': 'For Thousand Island dressing, mix together mayonnaise, ketchup, sweet pickle relish, salt and pepper in a small bowl until thoroughly combined. Chill and serve.',
    'pesto': 'To make pesto, combine basil, garlic, Parmesan cheese, olive oil, and pine nuts in a food processor or blender. Blend to a smooth paste. Add parsley if desired.',
    'tartar': 'For tartar sauce, combine mayonnaise, chopped onion, sweet pickle relish, salt and pepper in a medium bowl. Mix well and let stand for at least 10 minutes before serving.',
    'pizza': 'To make pizza sauce, mix together tomato sauce and tomato paste in a medium bowl until smooth. Stir in oregano, dried minced garlic and paprika.',
    'cranberry': 'For cranberry sauce, dissolve sugar in orange juice in a saucepan over medium heat. Stir in cranberries and cook until they start to pop. Remove from heat and transfer the sauce to a bowl before serving.',
    'secret': 'No need to butter me up, I can tell you\'re in a jam, but the secret sauce is safe with me.',
  },
};

/* CONSTANTS */
const skillBuilder = Alexa.SkillBuilders.custom();
const languageStrings = {
  'en': {
    translation: {
      RECIPES: recipes.RECIPE_EN_US,
      SKILL_NAME: 'Sauce Boss',
      WELCOME_MESSAGE: 'Welcome to %s. You can ask a question like, what\'s the recipe for %s sauce? ... Now, what can I help you with?',
      WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.  What can I help you with?',
      DISPLAY_CARD_TITLE: '%s  - Recipe for %s',
      HELP_MESSAGE: 'You can ask questions such as, what\'s the recipe for a %s, or, you can say exit...Now, what can I help you with?',
      HELP_REPROMPT: 'You can say things like, what\'s the recipe for a %s, or you can say exit...Now, what can I help you with?',
      STOP_MESSAGE: 'Goodbye!',
      RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
      RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'I\'m sorry, I currently do not know the recipe for %s. ',
      RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'I\'m sorry, I currently do not know that recipe. ',
      RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
      HINT_TEMPLATE: 'How do I make %s sauce?',
    },
  },
  'en-US': {
    translation: {
      RECIPES: recipes.RECIPE_EN_US,
      SKILL_NAME: 'Sauce Boss',
    },
  },
};

/* INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const item = requestAttributes.t(getRandomItem(Object.keys(recipes.RECIPE_EN_US)));

    const speakOutput = requestAttributes.t('WELCOME_MESSAGE', requestAttributes.t('SKILL_NAME'), item);
    const repromptOutput = requestAttributes.t('WELCOME_REPROMPT');

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    const responseBuilder = handlerInput.responseBuilder;

    if (supportsAPL(handlerInput)) {
      responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.1',
        document: APLDocs.launch,
        datasources: {
          sauceBossData: {
            type: 'object',
            properties: {
              hintString: requestAttributes.t('HINT_TEMPLATE', item),
            },
            transformers: [{
              inputPath: 'hintString',
              transformer: 'textToHint',
            }],
          },
        },
      });
    }

    return responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

const RecipeHandler = {
  canHandle(handlerInput) {
    return ((handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RecipeIntent')
      ||
      (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent'));
  },
  handle(handlerInput) {
    let itemName;

    // Touch Event Request
    if (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent') {
      itemName = (handlerInput.requestEnvelope.request.arguments[0]).toLowerCase();
    } else {
      // Voice Intent Request
      const itemSlot = handlerInput.requestEnvelope.request.intent.slots.Item;
      if (itemSlot && itemSlot.value) {
        itemName = itemSlot.value.toLowerCase();
      }
    }
    // special cleanup for bbq sauce
    itemName = itemName.replace('bbq', 'barbecue').replace(' sauce', '');

    return generateRecipeOutput(handlerInput, itemName);
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const item = requestAttributes.t(getRandomItem(Object.keys(recipes.RECIPE_EN_US)));

    sessionAttributes.speakOutput = requestAttributes.t('HELP_MESSAGE', item);
    sessionAttributes.repromptSpeech = requestAttributes.t('HELP_REPROMPT', item);

    const responseBuilder = handlerInput.responseBuilder;

    if (supportsAPL(handlerInput)) {
      responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.1',
        datasources: recipes,
        document: APLDocs.help,
      });
    }

    return responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
      .getResponse();
  },
};

const PreviousHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const requestHistory = sessionAttributes.requestHistory;
    // first actionable request is the one that is currently displayed or heard,
    // so need to track when that is found so we can go back to the previous one
    let foundActionableRequestInHistory = false;

    // get previous action info
    if (!requestHistory) {
      // there should be at least one entry, but just in case there's
      // no request history, just route to Launch Request
      return LaunchRequestHandler.handle(handlerInput);
    }

    // pop off the current request which is this previous intent request
    requestHistory.pop();

    while (requestHistory.length > 0) {
      // pop off the previous info from the history
      const lastRequest = requestHistory.pop();
      sessionAttributes.requestHistory = requestHistory;

      // return what was done previously
      switch (lastRequest.requestType) {
        case 'IntentRequest':
          // if intent request, check intent name
          console.log(`Found ${lastRequest.intentName} request.`);
          switch (lastRequest.intentName) {
            case 'RecipeIntent':
              if (lastRequest.slots.Item) {
                const itemName = lastRequest.slots.Item;
                if (foundActionableRequestInHistory) {
                  return generateRecipeOutput(handlerInput, itemName);
                }
                foundActionableRequestInHistory = true;
              }
              console.log('no slot value');
              break;
            default:
              // not an actionable intent type.
              break;
          }
          break;
        case 'LaunchRequest':
          console.log(`Found ${lastRequest.intentName} request.`);
          return LaunchRequestHandler.handle(handlerInput);
        default:
          // not an actionable intent, so ignore it
          console.log(`Found ${lastRequest.requestType}.  Not actionable, so keep looking.`);
      }
    }
    // no actionable history, so just go to launch
    return LaunchRequestHandler.handle(handlerInput);
  },
};

const RepeatHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = requestAttributes.t('STOP_MESSAGE', requestAttributes.t('SKILL_NAME'));

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log('Inside SessionEndedRequestHandler');
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    try {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ERROR_MESSAGE'))
        .reprompt(requestAttributes.t('ERROR_MESSAGE'))
        .getResponse();
    } catch (err) {
      console.log(`The ErrorHandler encountered an error: ${err}`);
      // this is fixed text because it handles the scenario where the i18n doesn't work correctly
      const speakOutput = 'This skill encountered an error.  Please contact the developer.';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
    });
    localizationClient.localize = function localize() {
      const args = arguments; // eslint-disable-line prefer-rest-params
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values,
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  },
};

const RequestHistoryInterceptor = {
  process(handlerInput) {
    const maxHistorySize = 5; // number of intent/request events to store
    const thisRequest = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let requestHistory = sessionAttributes.requestHistory;
    const currentRequest = {
      requestType: thisRequest.type,
      intentName: '',
      slots: {},
    };
    if (thisRequest.type === 'IntentRequest') {
      currentRequest.intentName = thisRequest.intent.name;
      if (thisRequest.intent.slots) {
        for (let slot in thisRequest.intent.slots) {
          currentRequest.slots[slot] = thisRequest.intent.slots[slot].value;
        }
      }
    }

    if (!requestHistory) {
      requestHistory = [];
    }

    if (requestHistory.length >= maxHistorySize) {
      requestHistory.shift();
    }
    requestHistory.push(currentRequest);

    sessionAttributes.requestHistory = requestHistory;
  },
};

const RequestLog = {
  process(handlerInput) {
    console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
  },
};

const ResponseLog = {
  process(handlerInput) {
    console.log(`RESPONSE BUILDER = ${JSON.stringify(handlerInput)}`);
    console.log(`RESPONSE = ${JSON.stringify(handlerInput.responseBuilder.getResponse())}`);
  },
};

/* LAMBDA SETUP */
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    RecipeHandler,
    HelpHandler,
    RepeatHandler,
    PreviousHandler,
    ExitHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(
    LocalizationInterceptor,
    RequestLog,
    RequestHistoryInterceptor,
  )
  .addResponseInterceptors(ResponseLog)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sauce-boss/v1')
  .lambda();


function generateRecipeOutput(handlerInput, itemName) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

  const cardTitle = requestAttributes.t('DISPLAY_CARD_TITLE', requestAttributes.t('SKILL_NAME'), itemName);
  const myRecipes = requestAttributes.t('RECIPES');

  // Convert the slot value into one of our recipes
  const recipe = myRecipes[itemName];
  let speakOutput = '';

  if (recipe) {
    sessionAttributes.speakOutput = recipe;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    const responseBuilder = handlerInput.responseBuilder;

    if (supportsAPL(handlerInput)) {
      return responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'sauce-boss',
        version: '1.1',
        document: APLDocs.recipe,
        datasources: constructRecipeDataSource(itemName, recipe, requestAttributes.t('HINT_TEMPLATE', itemName)),
      })
        .addDirective({
          type: 'Alexa.Presentation.APL.ExecuteCommands',
          token: 'sauce-boss',
          commands: [{
            type: 'SpeakItem',
            componentId: 'recipeText',
            highlightMode: 'line',
          }],
        })
        .speak('')
        .withSimpleCard(cardTitle, recipe)
        .getResponse();
    }

    // saved for repeat
    sessionAttributes.repromptSpeech = requestAttributes.t('RECIPE_REPEAT_MESSAGE');

    const largeImageLocation = getRecipeImage(itemName);

    return responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptOutput)
      .withStandardCard(cardTitle, recipe, largeImageLocation, largeImageLocation)
      .getResponse();
  }
  const repromptSpeech = requestAttributes.t('RECIPE_NOT_FOUND_REPROMPT');
  if (itemName) {
    speakOutput = requestAttributes.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', itemName);
  } else {
    speakOutput = requestAttributes.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
  }
  speakOutput += repromptSpeech;

  // saving speakOutput to attributes, so we can use it to repeat
  sessionAttributes.speakOutput = speakOutput;
  sessionAttributes.repromptSpeech = repromptSpeech;

  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

  return handlerInput.responseBuilder
    .speak(sessionAttributes.speakOutput)
    .reprompt(sessionAttributes.repromptSpeech)
    .getResponse();
}

function getRandomItem(arrayOfItems) {
  // the argument is an array [] of words or phrases
  let i = 0;
  i = Math.floor(Math.random() * arrayOfItems.length);
  return (arrayOfItems[i]);
}

// this function will get the Recipe Image to display on screen
function getRecipeImage(selectedSauce) {
  const imageSourceStem = 'https://s3.amazonaws.com/ask-samples-resources/images/sauce-boss/';
  return `${imageSourceStem}${selectedSauce}-sauce-500x500.png`;
}

function supportsAPL(handlerInput) {
  const supportedInterfaces = handlerInput.requestEnvelope.context
    .System.device.supportedInterfaces;
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface != null && aplInterface !== undefined;
}

function loadIfPresent(fileName, defaultToLoad) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const loadedFile = require(fileName);
    return loadedFile;
  } catch (error) {
    return defaultToLoad;
  }
}

// Constructs the datasource object for the given sauce and recipe
function constructRecipeDataSource(selectedSauce, recipe, hintString) {
  return {
    sauceBossData: {
      type: 'object',
      properties: {
        selectedSauceSsml: `<speak>${recipe}</speak>`,
        selectedSauce: selectedSauce,
        selectSauceCaps: selectedSauce.toUpperCase(),
        selectedSauceImg: getRecipeImage(selectedSauce),
        hintString: hintString,
      },
      transformers: [{
        inputPath: 'selectedSauceSsml',
        outputName: 'selectedSauceSpeech',
        transformer: 'ssmlToSpeech',
      },
      {
        inputPath: 'selectedSauceSsml',
        outputName: 'selectedSauceText',
        transformer: 'ssmlToText',
      },
      {
        inputPath: 'hintString',
        transformer: 'textToHint',
      },
      ],
    },
  };
}
