# Build an Alexa Sauce Recipe Skill using Alexa Presentation Language
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

This sample skill use a how-to or recipe use case to demonstrate the Alexa Presentation Language (APL). Ask for a sauce and you'll be provided with an image and recipe description for the sauce of your choice.

## Customize the Skill to be Yours

At this point, you should have a working copy of our Fact skill.  In order to make it your own, you will need to customize it with data and responses that you create.  Here are the things you will need to change:

1.  **APL Customization** You can change any of the images or APL Style for the entire skill's User Interface. To learn more about APL, feel free to read over the [APL Documentation](https://developer.amazon.com/docs/alexa-presentation-language/apl-document.html). For example, if you wanted to change the background image for the skill, you would do the following:
   
    1.  Navigate to **[helpIntent.json](../lambda/py/documents/helpIntent.json), [launchRequest.json](../lambda/py/documents/launchRequest.json), and [recipeIntent.json](../lambda/py/documents/recipeIntent.json)**
    
    2.  Under the `resources` property, find the following three objects:
    ```js
    "resources": [
        {
            "description": "Background Image for Help Screen on Small Round Hubs",
            "when": "${@viewportProfile == @hubRoundSmall}",
            "strings": {
                "backgroundImg": "https://s3.amazonaws.com/ask-samples-resources/images/sauce-boss/sauceBoss-background-bottom-smHub.png"
            }
        },
        {
            "description": "Background Image for Help Screen on Landscape Hubs",
            "when": "${@viewportProfile == @hubLandscapeSmall || @viewportProfile == @hubLandscapeMedium || @viewportProfile == @hubLandscapeLarge}",
            "strings": {
                "backgroundImg": "https://s3.amazonaws.com/ask-samples-resources/images/sauce-boss/sauceBoss-background-bottom-Hub.png"
            }
        },
        {
            "description": "Background Image for Help Screen on XLarge Hubs (e.g TV)",
            "when": "${@viewportProfile == @tvLandscapeXLarge}",
            "strings": {
                "backgroundImg": "https://s3.amazonaws.com/ask-samples-resources/images/sauce-boss/sauceBoss-background-bottom-TV.png"
            }
        },
        ...,
    ],
    ```
    Each of these objects corresponds to the background image that gets rendered on the device depending on the device's resolution. Make sure your replacement images match the resolutions of those above.

    If I had my custom background images hosted at `https://my.custom.url/images/new_background_image_small.png`, `https://my.custom.url/images/new_background_image_medium.png`, and `https://my.custom.url/images/new_background_image_large.png`, then my `resources` property would now look like:
    
    ```js
    "resources": [
        {
            "description": "Background Image for Help Screen on Small Round Hubs",
            "when": "${@viewportProfile == @hubRoundSmall}",
            "strings": {
                "backgroundImg": "https://my.custom.url/images/new_background_image_small.png"
            }
        },
        {
            "description": "Background Image for Help Screen on Landscape Hubs",
            "when": "${@viewportProfile == @hubLandscapeSmall || @viewportProfile == @hubLandscapeMedium || @viewportProfile == @hubLandscapeLarge}",
            "strings": {
                "backgroundImg": "https://my.custom.url/images/new_background_image_medium.png"
            }
        },
        {
            "description": "Background Image for Help Screen on XLarge Hubs (e.g TV)",
            "when": "${@viewportProfile == @tvLandscapeXLarge}",
            "strings": {
                "backgroundImg": "https://my.custom.url/images/new_background_image_large.png"
            }
        },
        ...,
    ],
    ```

    Make sure to repeat this process for each document you want to replace the background image for.

    APL allows for plenty of customization, and if you want more control of your document's look and feel, make sure to check out the [APL Documentation](https://developer.amazon.com/docs/alexa-presentation-language/apl-document.html) to learn all you can do.


2.  **New sentences to respond to your users.** There are several sentences and responses that you will want to customize for your skill.

    1.  Go to **[localisation.js](../lambda/custom/localisation.js).**

    2.  **Look for the a specific locale such as `en`** This is the beginning of the section where you need to customize several text strings for your skill.

    3.  For each prompt, such as `RECIPE_NOT_FOUND_REPROMPT`, replace the string contents with any sentence you would like Alexa to respond with instead. For example, the following changes will result in Alexa saying "Which sauce would you like to learn how to make?", instead of "Which sauce would you like to prepare?", when Alexa doesn't know which Sauce the user asked for.
        
        Before:
        ```js
        en: {
            translation: {
                ...,
                ...,
                ...,
                RECIPE_NOT_FOUND_REPROMPT: `Which sauce would you like to prepare?`,
                ...
            }
        },  
        ```
        After:
        ```js
        en: {
            translation: {
                ...,
                ...,
                ...,
                RECIPE_NOT_FOUND_REPROMPT: `Which sauce would you like to learn how to make?`,
                ...
            }
        },  
        ```

        


3.  **New language.** If you are creating this skill for another language other than English, you will need to make sure Alexa's responses are also in that language.

    - For example, if you are creating your skill in German, every single response that Alexa makes has to be in German. You can't use English responses or your skill will fail certification.

4. **Once you have customized the skill's data, languages and/or sentences, return to the [Amazon Developer Portal](https://developer.amazon.com/alexa/console/ask?&sc_category=Owned&sc_channel=RD&sc_campaign=Evangelism2018&sc_publisher=github&sc_content=Survey&sc_detail=fact-nodejs-V2_GUI-5&sc_funnel=Convert&sc_country=WW&sc_medium=Owned_RD_Evangelism2018_github_Survey_fact-nodejs-V2_GUI-5_Convert_WW_beginnersdevs&sc_segment=beginnersdevs) and select your skill from the list.**

5.  **Click on "Distribution" in the top navigation to move on to the publishing and certification of your skill.**


[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_publication._TTH_.png)](./submit-for-certification.md)
