// Copyright 2018-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

/**
 * This file defines the prompts, reprompts, APL content for each supported locale
 */

// List of localized recipes (all locales)
const recipes = require("./recipes");

// List of localized strings (all locales)
module.exports = {
  en: {
    translation: {
      RECIPES: recipes.en,
      SKILL_NAME: `Sauce Boss`,
      HEADER_TITLE: `Welcome to {{skillName}}`,
      RECIPE_HEADER_TITLE: `HOW TO MAKE {{sauce}} SAUCE`,
      HELP_HEADER_TITLE: `HELP`,
      HELP_HEADER_SUBTITLE: `Select the sauce you want to prepare`,
      WELCOME_MESSAGE: `Welcome to {{skillName}}. You can ask a question like, what's the recipe for {{sauce}} sauce? ... Now, which sauce would you like to prepare?`,
      WELCOME_REPROMPT: `For instructions on what you can say, please say help me.  Which sauce would you like to prepare?`,
      DISPLAY_CARD_TITLE: `{{skillName}}  - Recipe for {{sauce}}`,
      HELP_MESSAGE: `You can ask questions such as, what's the recipe for {{sauce}}, or, you can say exit ... Now, which sauce would you like to prepare?`,
      HELP_REPROMPT: `You can say things like, what's the recipe for {{sauce}}, or you can say exit ... Now, which sauce would you like to prepare?`,
      STOP_MESSAGE: `Goodbye!`,
      RECIPE_REPEAT_MESSAGE: `Try saying repeat.`,
      RECIPE_NOT_FOUND_WITH_ITEM_NAME: `I'm sorry, I currently do not know the recipe for {{sauce}}. Which sauce would you like to prepare ?`,
      RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: `I'm sorry, I currently do not know that recipe. Which sauce would you like to prepare?`,
      RECIPE_NOT_FOUND_REPROMPT: `Which sauce would you like to prepare?`,
      ERROR_MESSAGE: `I'm sorry I didn't catch that. Can you reformulate please ?`,
      HINT_TEMPLATE: `How do I make {{sauce}} sauce?`,
      REFLECTOR_MESSAGE: `You just triggered {{intentName}}`
    }
  },
  fr: {
    translation: {
      RECIPES: recipes.fr,
      SKILL_NAME: `Le Roi des Sauces`,
      HEADER_TITLE: `Bienvenue chez {{skillName}}`,
      RECIPE_HEADER_TITLE: `PREPARATION POUR SAUCE {{sauce}}`,
      HELP_HEADER_TITLE: `AIDE`,
      HELP_HEADER_SUBTITLE: `Sélectionnez la sauce que vous souhaitez cuisiner`,
      WELCOME_MESSAGE: `Bienvenue chez {{skillName}}. Je vous accompagne dans la conception de vos sauces culinaires. Pour me demander la recette d'une sauce, il suffit de me dire par exemple "Quelle est la recette de la sauce {{sauce}}?" ... Quelle sauce souhaitez-vous cuisiner?`,
      WELCOME_REPROMPT: `Quelle sauce souhaitez-vous cuisiner?`,
      DISPLAY_CARD_TITLE: `{{skillName}}  - Recette {{sauce}}`,
      HELP_MESSAGE: `Dites-moi la sauce que vous voulez cuisinez et je vous donnerai la recette. Vous pouvez me poser des questions comme par exemple "Quelle est la recette de la sauce {{sauce}}?" ... Quelle sauce souhaitez-vous cuisiner?`,
      HELP_REPROMPT: `Vous pouvez me poser des questions comme par exemple "Quelle est la recette de la sauce {{sauce}}?" ... Quelle sauce souhaitez-vous cuisiner?`,
      STOP_MESSAGE: `Au revoir!`,
      RECIPE_REPEAT_MESSAGE: `Dites "Répétez" pour que je relise la recette.`,
      RECIPE_NOT_FOUND_WITH_ITEM_NAME: `Désolé, je ne connais pas encore la recette de la sauce {{sauce}}. Quelle autre sauce souhaitez-vous cuisiner?`,
      RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: `Désolé, je ne connais pas encore cette recette. Quelle autre sauce souhaitez-vous cuisiner?`,
      RECIPE_NOT_FOUND_REPROMPT: `Quelle autre sauce souhaitez-vous cuisiner?`,
      ERROR_MESSAGE: `Désolé, je n'ai pas compris. Pouvez-vous reformulez s'il vous plait ?`,
      HINT_TEMPLATE: `quelle est la recette de la sauce {{sauce}}?`,
      REFLECTOR_MESSAGE: `Vous avez invoqué l'intention {{intentName}}`
    }
  },
  es: {
    translation: {
      RECIPES: recipes.es,
      SKILL_NAME: `Rey de la Salsa`,
      HEADER_TITLE: `Bienvenidos al {{skillName}}`,
      RECIPE_HEADER_TITLE: `COMO HACER SALSA {{sauce}}`,
      HELP_HEADER_TITLE: `AYUDA`,
      HELP_HEADER_SUBTITLE: `Selecciona la salsa que quieres cocinar`,
      WELCOME_MESSAGE: `Bienvenidos al {{skillName}}. Puedes hacerme una pregunta como, "Cuál es la receta de la salsa {{sauce}}?" ... Bien, qué salsa quieres cocinar?`,
      WELCOME_REPROMPT: `Si necesitas entender qué puedes hacer con la skill, di ayuda.  Qué salsa quieres cocinar?`,
      DISPLAY_CARD_TITLE: `{{skillName}}  - Receta de {{sauce}}`,
      HELP_MESSAGE: `Puedes preguntar cosas como, "cuál es la receta de la salsa {{sauce}}?", o, puedes decir salir ... Qué salsa quieres cocinar?`,
      HELP_REPROMPT: `Puedes decirme cosas como por ejemplo, "cuál es la receta de la salsa {{sauce}}?", o, puedes decir salir ... Qué salsa quieres cocinar?`,
      STOP_MESSAGE: `Hasta luego!`,
      RECIPE_REPEAT_MESSAGE: `Intenta decir Repite.`,
      RECIPE_NOT_FOUND_WITH_ITEM_NAME: `Lo siento, ahora mismo no conozco la receta de {{sauce}}. Qué salsa quieres cocinar?`,
      RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: `Lo siento, aun no conozco esa receta. Qué salsa quieres cocinar?`,
      RECIPE_NOT_FOUND_REPROMPT: `Qué salsa quieres cocinar?`,
      ERROR_MESSAGE: `No se que ha pasado. Por favor inténtalo otra vez.`,
      HINT_TEMPLATE: `Cómo puedo elaborar salsa {{sauce}}?`,
      REFLECTOR_MESSAGE: `Acabas de activar {{intentName}}`
    }
  },
  "ja-JP": {
    translation: {
      RECIPES: recipes.jp,
      SKILL_NAME: `ソースボス`,
      HEADER_TITLE: `ようこそ{{skillName}}へ`,
      RECIPE_HEADER_TITLE: `{{sauce}}ソースの作り方`,
      HELP_HEADER_TITLE: `ヘルプ`,
      HELP_HEADER_SUBTITLE: `作りたいソースを選んでください。`,
      WELCOME_MESSAGE: `{{skillName}}へようこそ。「{{sauce}}の作り方を教えて。」のように聞くことができます。きょうはどんなソースを作りたいですか？`,
      WELCOME_REPROMPT: `使い方を知りたい場合は、「ヘルプ」と言ってください。きょうはどんなソースを作りたいですか？`,
      DISPLAY_CARD_TITLE: `{{skillName}}  - {{sauce}}のレシピ`,
      HELP_MESSAGE: `「{{sauce}}の作り方を教えて。」のように聞くことができます。終わりたい場合は「終了。」と言ってください。きょうはどんなソースを作りたいですか？`,
      HELP_REPROMPT: `「{{sauce}}の作り方を教えて。」のように聞くことができます。終わりたい場合は「終了。」と言ってください。きょうはどんなソースを作りたいですか？`,
      STOP_MESSAGE: `さようなら!`,
      RECIPE_REPEAT_MESSAGE: `リピートと言ってみて。`,
      RECIPE_NOT_FOUND_WITH_ITEM_NAME: `ごめんなさい。{{sauce}}ソースの作り方は知りません。他にどんなソースを作りたいですか？`,
      RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: `ごめんなさい。そのソースの作り方は知りません。他にどんなソースを作りたいですか？`,
      RECIPE_NOT_FOUND_REPROMPT: `他にどんなソースを作りたいですか？`,
      ERROR_MESSAGE: `すみません。うまく理解できませんでした。もう一度言ってみてください。`,
      HINT_TEMPLATE: `{{sauce}}ソースの作り方を教えて？`,
      REFLECTOR_MESSAGE: `You just triggered {{intentName}}`
    }
  }
};
