# Build an Alexa Sauce Recipe Skill using Alexa Presentation Language
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

This sample skill use a how-to or recipe use case to demonstrate the Alexa Presentation Language (APL). Ask for a sauce and you'll be provided with an image and recipe description for the sauce of your choice.

## Customize the Skill to be Yours

At this point, you should have a working copy of our Sauce Boss skill.  In order to make it your own, you will need to customize it with data and responses that you create.  Here are the things you will need to change:

1.  **APL Customization** You can change any of the images or APL Style for the entire skill's User Interface. To learn more about APL, feel free to read over the [APL Documentation](https://developer.amazon.com/docs/alexa-presentation-language/apl-document.html). For example, if you wanted to change the background image for the skill, you would do the following:
   
    1. Navigate to the **Code** tab again, and expand the project folder on the left to `Skill Code/lambda/apl`.
    
    2. Open **[helpIntent.json](../lambda/py/documents/helpIntent.json), [launchRequest.json](../lambda/py/documents/launchRequest.json), and [recipeIntent.json](../lambda/py/documents/recipeIntent.json)**
    
    3. These files might look confusing, but don't worry, we only care about lines `14-35` for `helpIntent.json`, lines `54-73` for `launchRequest.json`, and lines `18-39` for `recipeIntent.json`. Let's focus on `helpIntent.json` for now, and you can repeat the process for `recipeIntent.json` and `launchRequest.json`.
    
     On line `14`, you will find a property called `resources` (Feel free to use CTRL+F to find it if needed), which contains all of the images and assets that our APL document uses. There are 3 JSON Objects in the `resources` array that we care about:
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
    Each of these objects corresponds to the background image that gets rendered on the device depending on the device's resolution. Since we are replacing these images, make sure your replacement images have the _same_ resolution as the originals, or it might look wrong on the device.

    After finding your images, find a file hosting service, such as a [S3 Bucket](https://aws.amazon.com/s3/). After uploading them all, remember the URL's of where they are hosted. For example, I found some new images and hosted them at the following URLS: 
        - `https://my.custom.url/images/new_background_image_small.png`
        - `https://my.custom.url/images/new_background_image_medium.png`
        - `https://my.custom.url/images/new_background_image_large.png`
    We are going to replace the old `backgroundImg` property in each of the JSON Objects with the _new_ URL's that store the new images. Using my example URL's as above, lines `14-35` now look like the following:
    ```js
    "resources": [
        {
            "description": "Background Image for Help Screen on Small Round Hubs",
            "when": "${@viewportProfile == @hubRoundSmall}",
            "strings": {
                "backgroundImg": "https://my.custom.url/images/new_background_image_small.png" <-- CHANGED
            }
        },
        {
            "description": "Background Image for Help Screen on Landscape Hubs",
            "when": "${@viewportProfile == @hubLandscapeSmall || @viewportProfile == @hubLandscapeMedium || @viewportProfile == @hubLandscapeLarge}",
            "strings": {
                "backgroundImg": "https://my.custom.url/images/new_background_image_medium.png" <-- CHANGED
            }
        },
        {
            "description": "Background Image for Help Screen on XLarge Hubs (e.g TV)",
            "when": "${@viewportProfile == @tvLandscapeXLarge}",
            "strings": {
                "backgroundImg": "https://my.custom.url/images/new_background_image_large.png" <-- CHANGED
            }
        },
        ...,
    ],
    ```

    Make sure to repeat this process for each document you want to replace the background image for, in this case we only did it for `helpIntent.json`, but the process is exactly the same for `recipeIntent.json` and `launchRequest.json`

    After you're done editing all of the files necessary, make sure to press **Save**, **Deploy**, and navigate back to the **Testing** tab. When you reopen your skill, Alexa your new background images should show up!

    APL allows for plenty of customization, and if you want more control of your document's look and feel, make sure to check out the [APL Documentation](https://developer.amazon.com/docs/alexa-presentation-language/apl-document.html) to learn all you can do.


2.  **New sentences to respond to your users.** There are several sentences and responses that you will want to customize for your skill.

    1. Navigate to the **Code** tab again, and expand the project folder on the left to `Skill Code/lambda`.

    2.  Go to **[languageStrings.js](../lambda/custom/languageStrings.js).**

    3.  **Look for the a specific locale such as `en`** This is the beginning of the section where you need to customize several text strings for your skill.

    4.  For each prompt, such as `RECIPE_NOT_FOUND_REPROMPT`, replace the string contents with any sentence you would like Alexa to respond with instead. For example, the following changes will result in Alexa saying "Which sauce would you like to learn how to make?", instead of "Which sauce would you like to prepare?", when Alexa doesn't know which Sauce the user asked for.
        
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
                RECIPE_NOT_FOUND_REPROMPT: `Which sauce would you like to learn how to make?`, <-- CHANGED
                ...
            }
        },  
        ```

        After you're done editing all of the files necessary, as before, make sure to press **Save**, **Deploy**, and navigate back to the **Testing** tab. When you no recipe is found, Alexa should say "Which sauce would you like to learn how to make".


3.  **New language.** If you are creating this skill for another language other than English, you will need to make sure Alexa's responses are also in that language.

    - For example, if you are creating your skill in German, every single response that Alexa makes has to be in German. You can't use English responses or your skill will fail certification.

4. **Once you have customized the skill's data, languages and/or sentences, return to the [Amazon Developer Portal](https://developer.amazon.com/alexa/console/ask?&sc_category=Owned&sc_channel=RD&sc_campaign=Evangelism2018&sc_publisher=github&sc_content=Survey&sc_detail=fact-nodejs-V2_GUI-5&sc_funnel=Convert&sc_country=WW&sc_medium=Owned_RD_Evangelism2018_github_Survey_fact-nodejs-V2_GUI-5_Convert_WW_beginnersdevs&sc_segment=beginnersdevs) and select your skill from the list.**

5.  **Click on "Distribution" in the top navigation to move on to the publishing and certification of your skill.**


[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_publication._TTH_.png)](./submit-for-certification.md)
