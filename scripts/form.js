"use strict";
function setupForm() {
    const btn = document.getElementById('contact-submit-button');
    const form = document.querySelector('form[name="contact-form"]');
    ensureNonNull(btn, form);
    const formSubmissionLink = form.getAttribute('action');
    ensureNonNull(formSubmissionLink);
    const backToFormButton = document.getElementById('back-to-form-button');
    ensureNonNull(backToFormButton);
    backToFormButton.onclick = () => hideShowFormLoader(form);
    //const inputAndLabels = getInputAndLabels();
    btn.onclick = event => {
        event.preventDefault();
        showFormLoader(form, FormState.SUBMITTING);
        // TODO: show message
        //let processedInputs: Input[] = [];
        try {
            //processedInputs = getProcessedInputs(inputAndLabels);
        }
        catch (e) {
            // TODO: inform user
            return;
        }
        /*
        fetch(formSubmissionLink, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: toFormUrlEncoded(processedInputs)
        })
        .then(response => response.json())
        .catch(err => {
          console.error(err);
          // TODO: show error message --> fade out
        });*/
    };
}
const getInputAndLabels = () => {
    const inputsAndLabelsHtmlElements = document.getElementsByClassName('input-wrapper');
    ensureNonNull(inputsAndLabelsHtmlElements);
    const inputAndLabels = [];
    for (let i = 0; i < inputsAndLabelsHtmlElements.length; i++) {
        const inputElement = inputsAndLabelsHtmlElements[i].querySelector('input');
        const labelElement = inputsAndLabelsHtmlElements[i].querySelector('label');
        ensureNonNull(inputElement, labelElement);
        const label = labelElement.getAttribute('for');
        inputAndLabels.push({ inputElement: inputElement, label: label });
    }
    // specifically for message input
    const messageElement = document.querySelector('textarea');
    ensureNonNull(messageElement);
    inputAndLabels.push({ inputElement: messageElement, label: 'message' });
    return inputAndLabels;
};
const getProcessedInputs = (inputAndLabels) => {
    const processedInputs = [];
    for (let inputAndLabel of inputAndLabels) {
        const labelKey = inputAndLabel.label;
        const inputValue = inputAndLabel.inputElement.value;
        if (inputValue === '' || inputValue === null || inputAndLabel === undefined) {
            throw new Error(`Please input value for ${labelKey} field.`);
        }
        processedInputs.push({ key: labelKey, value: inputValue });
    }
    return processedInputs;
};
/**
 * Converts the specified object to x-www-form-urlencoded format.
 * @param {Input[]} inputs
 */
const toFormUrlEncoded = (inputs) => {
    return inputs
        .map((input) => `${encodeURIComponent(input.key)}=${encodeURIComponent(input.value)}`)
        .join('&');
};
var FormState;
(function (FormState) {
    FormState["SUBMITTING"] = "submitting...";
    FormState["ERROR"] = "error:";
    FormState["SUCCESS"] = "done!";
})(FormState || (FormState = {}));
const showFormLoader = (form, formState, message) => {
    const formChildren = form.children;
    for (let i = 0; i < formChildren.length; i++) {
        formChildren[i].style.display = Display.HIDE;
    }
    const formLoader = document.getElementById('form-submission-loader');
    ensureNonNull(formLoader);
    const messagePlaceholderElement = document.getElementById('form-response-text');
    ensureNonNull(messagePlaceholderElement);
    let image = document.getElementById('form-submitting-image');
    switch (formState) {
        case FormState.SUBMITTING:
            messagePlaceholderElement.style.animation = 'blinker 0.8s linear infinite';
            // no need to set image since by default this is the image chosen
            break;
        case FormState.SUCCESS:
            image = document.getElementById('form-success-image');
            break;
        case FormState.ERROR:
            image = document.getElementById('form-error-image');
            break;
        default:
            console.assert(true, 'There should only be 3 possible states during form submission');
            break;
    }
    ensureNonNull(image);
    message = message === undefined ? '' : message;
    messagePlaceholderElement.innerHTML = `${formState} ${message}`;
    formLoader.style.display = Display.SHOW;
    image.style.display = Display.SHOW;
};
const hideShowFormLoader = (form) => {
    const formChildren = form.children;
    for (let i = 0; i < formChildren.length; i++) {
        formChildren[i].style.display = Display.SHOW;
    }
    const images = document.getElementsByClassName('form-image');
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = Display.HIDE;
    }
    const formLoader = document.getElementById('form-submission-loader');
    ensureNonNull(formLoader);
    formLoader.style.display = Display.HIDE;
};
