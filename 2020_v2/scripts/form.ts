function setupForm() {
  const btn = <HTMLInputElement> document.getElementById('contact-submit-button');
  const form = <HTMLFormElement> document.querySelector('form[name="contact-form"]');
  ensureNonNull(btn, form);

  const formSubmissionLink = <string> form.getAttribute('action');
  ensureNonNull(formSubmissionLink);

  const inputAndLabels = getInputAndLabels();

  let status: FormState | null = null;
  const backToFormButton = <HTMLDivElement> document.getElementById('back-to-form-button');
  ensureNonNull(backToFormButton);
  backToFormButton.onclick = () => {
    if (status === FormState.SUCCESS) {
      clearFormInputs(inputAndLabels);
    }
    hideShowFormLoader();
  }

  btn.onclick = event => {
    event.preventDefault();
    status = FormState.SUBMITTING;
    showFormLoader(status);
    let processedInputs: Input[] = [];
    try {
      processedInputs = getProcessedInputs(inputAndLabels);
    } catch (e) {
      status = FormState.ERROR;
      showFormLoader(status, e);
      return;
    }
    
    fetch(formSubmissionLink, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      body: toFormUrlEncoded(processedInputs)
    })
    .then(response => {
      if (response.ok) {
        status = FormState.SUCCESS;
        showFormLoader(status);
      } else {
        status = FormState.ERROR;
        showFormLoader(status);
      }
      console.log(response);
    })   
    .catch(err => {
      console.error(err);
      status = FormState.ERROR;
      showFormLoader(status, err);
    });
  }

  const formLoader = <HTMLDivElement> document.getElementById('form-submission-loader');
  ensureNonNull(formLoader);
  const formChildren = <HTMLCollectionOf<HTMLElement>> form.children;
  const hideShowFormLoader = () => {
    for (let i = 0; i < formChildren.length; i++) {
      formChildren[i].style.display = Display.SHOW;
    }
  
    hideFormState();
  
    formLoader.style.display = Display.HIDE;
  }

  const images = <HTMLCollectionOf<HTMLElement>> document.getElementsByClassName('form-image');
  const messagePlaceholderElement = <HTMLParagraphElement> document.getElementById('form-response-text');
  ensureNonNull(messagePlaceholderElement);
  const hideFormState = () => {
    for (let i = 0; i < images.length; i++) {
      images[i].style.display = Display.HIDE;
    }
  
    messagePlaceholderElement.style.animation = 'none';
  }

  const showFormLoader = (formState: FormState, message?: string) => {
    hideFormState();
    for (let i = 0; i < formChildren.length; i++) {
      formChildren[i].style.display = Display.HIDE;
    }

    backToFormButton.style.display = Display.SHOW_BLOCK;
    let image: HTMLElement = <HTMLDivElement> document.getElementById('form-submitting-image');
    switch (formState) {
      case FormState.SUBMITTING:
        messagePlaceholderElement.style.animation = 'blinker 0.8s linear infinite';
        backToFormButton.style.display = Display.HIDE;
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
  
    messagePlaceholderElement.innerHTML = message === undefined ? `${formState}` : `${message}`;
  
    formLoader.style.display = Display.SHOW;
    image.style.display = Display.SHOW_BLOCK;
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

    if (labelKey === 'email' && !validateEmail(inputValue)) {
      throw new Error(`Please input a valid email.`);
    }

    processedInputs.push({key: labelKey, value: inputValue});
  }

  return processedInputs;
}

const validateEmail = (email: string) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(String(email).toLowerCase());
}

/**
 * Converts the specified object to x-www-form-urlencoded format.
 * @param {Input[]} inputs 
 */
const toFormUrlEncoded = (inputs: Input[]) => {
  return inputs
    .map((input: Input) => `${encodeURIComponent(input.key)}=${encodeURIComponent(input.value)}`)
    .join('&') + `&${encodeURIComponent('_gotcha')}=`;
}

enum FormState {
  SUBMITTING = 'Submitting...',
  ERROR = 'Error',
  SUCCESS = 'Done!'
}

const clearFormInputs = (inputAndLabels: InputAndLabel[]) => {
  inputAndLabels.forEach(inputAndLabel => inputAndLabel.inputElement.value = '');
}
  