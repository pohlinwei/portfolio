/**
 * Ensures that the stated elements are present. Note that elements maybe an
 * HTMLCollection, NodeList or an HTML element. Hence, the stated elements are considered
 * to be present if all HTMLCollection and NodeList have length > 0 and all HTML elements
 * are non-null.
 * @param {...(NodeList | HTMLCollection | HTML element)} elements Elements to be checked.
 */
function ensureNonNull(... elements) {
  for (element of elements) {
    isEmpty = (element instanceof HTMLCollection || element instanceof NodeList) &&
      element.length === 0;
    isNull = element === null;

    console.assert(!isEmpty && !isNull, 'Missing desired element');
  }
}

/** Ensures that the element has the stated class. */
function ensureHasClass(element, statedClass) {
  if (!element.classList.contains(statedClass)) {
    throw new Error(`Element does not have ${statedClass} class`);
  }
}
