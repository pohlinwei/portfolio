function setupForm() {
  const btn = <HTMLInputElement> document.getElementById('contact-submit-button');
  const form = <HTMLFormElement> document.querySelector('form[name="contact-form"]');
  ensureNonNull(btn, form);

  const formSubmissionLink = <string> form.getAttribute('action');
  ensureNonNull(formSubmissionLink);

  const backToFormButton = <HTMLDivElement> document.getElementById('back-to-form-button');
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
    } catch (e) {
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
  }
}

type InputAndLabel = {
  inputElement: HTMLInputElement | HTMLTextAreaElement,
  label: string
}

const getInputAndLabels = () => {
  const inputsAndLabelsHtmlElements = <HTMLCollectionOf<HTMLElement>> document.getElementsByClassName('input-wrapper');
  ensureNonNull(inputsAndLabelsHtmlElements);

  const inputAndLabels: InputAndLabel[] = [];
  for (let i = 0; i < inputsAndLabelsHtmlElements.length; i++) {
    const inputElement = <HTMLInputElement> inputsAndLabelsHtmlElements[i].querySelector('input');
    const labelElement = <HTMLLabelElement> inputsAndLabelsHtmlElements[i].querySelector('label');
    ensureNonNull(inputElement, labelElement);
    const label = <string> labelElement.getAttribute('for');
    inputAndLabels.push({inputElement: inputElement, label: label});
  }

  // specifically for message input
  const messageElement = <HTMLTextAreaElement> document.querySelector('textarea');
  ensureNonNull(messageElement);
  inputAndLabels.push({inputElement: messageElement, label: 'message'});

  return inputAndLabels;
}

type Input = {
  key: string,
  value: string
}

const getProcessedInputs = (inputAndLabels: InputAndLabel[]) => {
  const processedInputs: Input[] = [];
  for (let inputAndLabel of inputAndLabels) {
    const labelKey = inputAndLabel.label;
    const inputValue = inputAndLabel.inputElement.value;
    
    if (inputValue === '' || inputValue === null || inputAndLabel === undefined) {
      throw new Error(`Please input value for ${labelKey} field.`);
    }

    processedInputs.push({key: labelKey, value: inputValue});
  }

  return processedInputs;
}

/**
 * Converts the specified object to x-www-form-urlencoded format.
 * @param {Input[]} inputs 
 */
const toFormUrlEncoded = (inputs: Input[]) => {
  return inputs
    .map((input: Input) => `${encodeURIComponent(input.key)}=${encodeURIComponent(input.value)}`)
    .join('&');
}

enum FormState {
  SUBMITTING = 'submitting...',
  ERROR = 'error:',
  SUCCESS = 'done!'
}

const showFormLoader = (form: HTMLFormElement, formState: FormState, message?: string) => {
  const formChildren = <HTMLCollectionOf<HTMLElement>> form.children;
  for (let i = 0; i < formChildren.length; i++) {
    formChildren[i].style.display = Display.HIDE;
  }

  const formLoader = <HTMLDivElement> document.getElementById('form-submission-loader');
  ensureNonNull(formLoader);
  const messagePlaceholderElement = <HTMLParagraphElement> document.getElementById('form-response-text');
  ensureNonNull(messagePlaceholderElement);

  let image: HTMLElement = <HTMLDivElement> document.getElementById('form-submitting-image');
  switch (formState) {
    case FormState.SUBMITTING:
      messagePlaceholderElement.style.animation = 'blinker 0.8s linear infinite';
      // no need to set image since by default this is the image chosen
      break;
    case FormState.SUCCESS:
      image = <HTMLParagraphElement> document.getElementById('form-success-image');
      break;
    case FormState.ERROR:
      image = <HTMLParagraphElement> document.getElementById('form-error-image');
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
}

const hideShowFormLoader = (form: HTMLFormElement) => {
  const formChildren = <HTMLCollectionOf<HTMLElement>> form.children;
  for (let i = 0; i < formChildren.length; i++) {
    formChildren[i].style.display = Display.SHOW;
  }

  const images = <HTMLCollectionOf<HTMLElement>> document.getElementsByClassName('form-image');
  for (let i = 0; i < images.length; i++) {
    images[i].style.display = Display.HIDE;
  }

  const formLoader = <HTMLDivElement> document.getElementById('form-submission-loader');
  ensureNonNull(formLoader);
  formLoader.style.display = Display.HIDE;
}

  