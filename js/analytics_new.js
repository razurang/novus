/////////////////////////////////////////////
/// helper functions for event logging
/////////////////////////////////////////////

//generic event logging handler
function _logEvent(eventName, eventProperties) {
    amplitude.getInstance().logEvent(eventName, eventProperties);
    console.log('--' + Date.now());
    console.log(`logEvent | eventName: ${eventName} | eventProperties: ${JSON.stringify(eventProperties)}`);
}

function _logIdentity(userProperty, propertyValue) {
    let answerInfo = new amplitude.Identify().set(userProperty, propertyValue);
    amplitude.getInstance().identify(answerInfo);

    console.log(`_logIdentity | ${userProperty}:${propertyValue}`);

}

/////////////////////////////////////////////
/// end helper functions for event logging
/////////////////////////////////////////////



/////////////////////////////////////////////
/// New chat analytics
/////////////////////////////////////////////

function _logChat(eventName, additionalProperties = {}, questionVariant = '') {


    var propertiesPart1 = {
        'variant': questionVariant
    };

    var eventProperties = $.extend({}, additionalProperties, propertiesPart1);

    // console.log(`_logChat | eventName: chat:${eventName} | eventProperties: ${JSON.stringify(eventProperties)}`);
    _logEvent(`chat:${eventName}`, eventProperties);
}

function _logIdentityFromChat(property, value) {
    console.log(`_logIdentityFromChat | property: ${property}:${value}`);
    _logIdentity(property, value);

    // let answerInfo = new amplitude.Identify().set(property, value);
    // amplitude.getInstance().identify(answerInfo);
}


function logChatMessageSent(questionName, questionType, questionVariant = '') {
    // console.log('func: logChatMessageSent');
    additionalProperties = {
        'questionName': questionName,
        'questionType': questionType
    };
    _logChat('messageSent', additionalProperties, questionVariant);
}

function logChatMessageResponse(questionName, questionType, answerText, questionVariant = '') {
    // console.log('func: logChatMessageResponse');
    additionalProperties = {
        'answerText': answerText,
        'questionName': questionName,
        'questionType': questionType
    };
    _logChat('messageResponse', additionalProperties, questionVariant);
}

function logChatQuestionAsked(questionName, questionType, questionVariant = '') {
    // console.log('func: logChatQuestionAsked');
    additionalProperties = {
        'questionName': questionName,
        'questionType': questionType
    };
    _logChat('questionAsked', additionalProperties, questionVariant);
}

function logChatQuestionResponse(questionName, questionType, answerText, questionVariant = '') {
    // console.log('func: logChatQuestionResponse');
    additionalProperties = {
        'answerText': answerText,
        'questionName': questionName,
        'questionType': questionType
    };
    _logChat('questionResponse', additionalProperties, questionVariant);
}

function logChatScreeningAsked(questionName, questionVariant = '') {
    // console.log('func: logChatScreeningAsked');
    // console.log('NOT USED');
    logChatQuestionAsked(questionName, 'screening', questionVariant);
}

function logChatScreeningResponse(questionName, answerText, questionVariant) {
    // console.log('func: logChatScreeningResponse');
    _logIdentityFromChat(questionName + '_response', answerText);
    logChatQuestionResponse(questionName, 'screening', answerText, questionVariant);
}

function logChatContactInfoAsked(askedFromSection, questionVariant = '') {
    // console.log('func: logChatContactInfoAsked');
    additionalProperties = {
        'questionName': askedFromSection,
        'questionType': 'contact_info'
    };
    _logChat('contactInfoAsked', additionalProperties, questionVariant);
}

function logChatContactInfoResponse(askedFromSection, name, email, phone, questionVariant = '') {
    // console.log('func: logChatContactInfoResponse');
    additionalProperties = {
        'questionName': askedFromSection,
        'questionType': 'contact_info'
    };
    _logIdentityFromChat('name', name);
    _logIdentityFromChat('email', email);
    _logIdentityFromChat('phone', phone);
    _logChat('contactInfoResponse', additionalProperties, questionVariant);
}

function logChatFinished(questionVariant = '') {
    _logChat('isFinished', {}, questionVariant);
}

function logChatStarted(questionVariant = '') {
    _logChat('isStarted', {}, questionVariant);
}

function logChatFinishedSection(sectionName, questionVariant = '') {
    additionalProperties = {
        'sectionName': sectionName
    };
    _logChat('finishedSection', additionalProperties, questionVariant);
}

function logNotQualified(knockoutQuestion, questionVariant = '') {
    additionalProperties = {
        'knockoutQuestion': knockoutQuestion
    };
    _logIdentityFromChat('qualified', 'false');
    _logChat('isNotQualified', additionalProperties, questionVariant);
    logChatFinishedSection('screening');
}

function logQualified(questionVariant = '') {
    _logIdentityFromChat('qualified', 'true');
    _logChat('isQualified', {}, questionVariant);
    logChatFinishedSection('screening', questionVariant);
}

/////////////////////////////////////////////
/// End new chat analytics
/////////////////////////////////////////////


//log an event from the accordian
//assumes the job-content property is set
function handleAccordianClick(event) {
    parentContainer = $(event.target).closest('.details_info-item');
    // isOpenedNow = $(event.target).closest('.faq-p');
    jobContainerName = parentContainer.attr('job-content');
    // isOpenedNow = $(parentContainer).children('.w--open').length == 0 ? 'open' : 'close';
    let transformCSS = $($(parentContainer).find('.details_arrow-wrap')[0]).css('transform');
    if (transformCSS === 'none' || transformCSS === 'matrix(1, 0, 0, 1, 0, 0)') {
        actionTaken = 'open';
    } else {
        actionTaken = 'close';
    }
    // isOpenedNow = $($(parentContainer).find('.details_arrow-wrap')[0]).css('transform') === 'matrix(1, 0, 0, 1, 0, 0)' ? 'open' : 'close';

    properties = {
        'jobSection': jobContainerName,
        'actionTaken': actionTaken
    }

    _logEvent('jobdetails:interact', properties);
    return true;
}


/////////////////////////////////////////////
/// log the CTA button actions
/////////////////////////////////////////////

function openDOTApplication() {
    let url = 'https://intelliapp.driverapponline.com/c/outwestexp?r=NovusLabsLead';
    window.location = url;
}

function handleCTAClick(event) {
    let ctaActionText = $(event.target).attr('button-action');
    let ctaPosition = $(event.target).attr('button-location');
    //check-qualify | apply-now | ask-question
    // console.log(ctaAction);

    if (ctaActionText === 'check-qualify') {
        event.preventDefault();
        //if not yet loaded, trigger it to open once we load + tell the user
        if (!window.screeningChatBotIsLoaded) {
            $(event.target).text('Loading, please wait...');
            window.chatButtonClickedWhileLoading = true;
            window.chatButtonToChange.push(event.target);
            _logEvent('chat:clickedButNotYetLoaded', {});
        } else {
            //lets open the chat widget
            openChatBot(event.target);
        }


    }

    properties = {
        // 'actionTaken': 'click',
        'buttonName': ctaActionText,
        'buttonPositionOnPage': ctaPosition
    }
    // logEvent(containerName + '-' + isOpenedNow);
    _logEvent('cta:click', properties);
    // _logEvent('cta:click' + ctaActionText);



    return true;
}

/////////////////////////////////////////////
/// log the CTA button actions
/////////////////////////////////////////////

/////////////////////////////////////////////
/// helper functions
/////////////////////////////////////////////

//https://stackoverflow.com/questions/8618464/how-to-wait-for-another-js-to-load-to-proceed-operation
function whenAvailable(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function () {
        if (window[name]) {
            callback(window[name]);
        } else {
            console.log('waiting');
            whenAvailable(name, callback);
        }
    }, interval);
}

//chat bot generic functions
function openChatBot(theEventTarget) {
    whenAvailable("screeningChatBot", function () {
        //Wotnot
        // $('#chat-bot').show();
        // window.Wotnot.open();
        //Landbot
        // $('.LandbotLivechat').show();
        // logChatStarted('v1');
        $(theEventTarget).text('Check if I qualify');
        window.screeningChatBot.open();
    });
}

//https://www.learningjquery.com/2012/06/get-url-parameters-using-jquery
function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    //return false by default
    return false;
}

/////////////////////////////////////////////
/// end helper functions
/////////////////////////////////////////////

/////////////////////////////////////////////
/// main loop
/////////////////////////////////////////////
window.screeningChatBot = null;
window.chatButtonClickedWhileLoading = false;
window.chatButtonToChange = [];
window.screeningChatBotIsLoaded = false;
var Webflow = Webflow || [];
Webflow.push(function () {
    // DOMready has fired
    // May now use jQuery and Webflow api


    //set up event handlers
    $('.details_info-header').on('click', handleAccordianClick);
    $('.cta-button').on('click', handleCTAClick);

    $('#questions-link').on('click', function () {
        _logEvent('cta:click', { 'buttonName': 'questions-text-us' });
    });
    //log a page view event
    // logEvent('view-page', { 'pageName': 'demo-site' });

    let timestampFinishedLoadingDom = new Date().getTime();

    var eventProperties = {
        'page': window.location.pathname,
        'variant': 'v1',
        'customer': 'outwest-express',
        'timestampStartedLoading': window.timestampStartedLoading,
        'timestampFinishedLoadingDom': timestampFinishedLoadingDom,
        'timeFromLoadToInteractive': timestampFinishedLoadingDom - window.timestampStartedLoading
    };

    //identify the user if they are returning via a link we made
    candidate_id = getURLParameter('candidate_id');
    if (candidate_id) {
        amplitude.getInstance().setUserId(candidate_id);
    }

    lead_id = getURLParameter('lead_id');
    if (lead_id) {
        _logIdentity('lead_id', lead_id);
    }

    _logIdentity('timeFromLoadToInteractive', timestampFinishedLoadingDom - window.timestampStartedLoading);
    _logEvent('page:view', eventProperties);

    //log event from a text confirmation click
    textClick = getURLParameter('text_click');
    if (textClick) {
        _logEvent('text:click', { textSource: textClick });
    }

    if (amplitude && amplitude.getInstance() && amplitude.getInstance().options) {
        let amplitudeDeviceId = amplitude.getInstance().options.deviceId;
        window.hj('identify', null, {
            'amplitudeDeviceId': amplitudeDeviceId,
        });
    }

});

