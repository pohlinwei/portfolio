// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Ensures that the stated elements are present. Note that elements maybe an
 * HTMLCollection, NodeList or an HTML element. Hence, the stated elements are considered
 * to be present if all HTMLCollection and NodeList have length > 0 and all HTML elements
 * are non-null.
 * @param {...(NodeList | HTMLCollection | HTML element)} elements Elements to be checked.
 * @throws Will throw if one of the elements is deemed to be not present
 */
function ensureNonNull(... elements) {
  for (element of elements) {
    isEmpty = (element instanceof HTMLCollection || element instanceof NodeList) &&
      element.length === 0;
    isNull = element === null;

    if (isEmpty || isNull) {
      throw new Error("Missing desired element");
    }
  }
}

const mainViews = document.getElementsByClassName('main-view');
const dropdownMenu = document.getElementById('dropdown-menu');
try {
  ensureNonNull(mainViews, dropdownMenu);
} catch (err) {
  console.error(err);
}

// Hides dropdown menu and shows main view elements.
const hideMenuShowMain = () => {
  dropdownMenu.style.display = 'none';
  for (let mainView of mainViews) {
    mainView.style.display = 'flex';
  }
}

// Hides main view elements and shows dropdown menu.
const hideMainShowMenu = () => {
  for (let mainView of mainViews) {
    mainView.style.display = 'none';
  }
  dropdownMenu.style.display = 'block';
}

/**
 * Adds listener to dropdown menu, elements that belong to main view 
 * and elements in the dropdown menu to enable the user to toggle between them. 
 * To view the dropdown menu, the user has to click on the menu icon.
 * To view the main view after opening the dropdown, the user has to click close
 * or select an element in the dropdown menu.
 */
const setupToggleMainAndMenu = () => {
  const closeButton = document.getElementById('close-button');
  try {
    ensureNonNull(closeButton);
  } catch (err) {
    console.error(err);
  }
  closeButton.onclick = hideMenuShowMain;

  const menuIcon = document.getElementById('menu-icon');
  try {
    ensureNonNull(menuIcon);
  } catch (err) {
    console.error(err);
  }
  menuIcon.onclick = hideMainShowMenu;

  const dropdownMenuContent = document.getElementById('dropdown-menu-content');
  try {
    ensureNonNull(dropdownMenuContent);
  } catch (err) {
    console.error(err);
  }
  
  const dropdownElements = dropdownMenuContent.children;
  for (let dropdownElement of dropdownElements) {
    // hides dropdown menu and redirects user to relevant section
    dropdownElement.onclick = hideMenuShowMain;
  }
}

setupToggleMainAndMenu();

/**
 * Sets up animation of actions by displaying them like a slideshow.
 * Specifically, we make the current action invisible and the next action
 * visible after every 2s.
 */
const setupActionAnimation = () => {
  const actions = document.getElementsByClassName('action');
  try {
    ensureNonNull(actions);
  } catch (err) {
    console.error(err);
  }
  let currAction = 0; // indicates the action which is currently shown
  const actionsAnimate = () => {
    const nextAction = (currAction + 1) % actions.length;
    actions[currAction].style.display = 'none';
    actions[nextAction].style.display = 'inline';
    currAction = nextAction;
  }
  
  window.setInterval(actionsAnimate, 2000);
}

setupActionAnimation();

/**
 * Fetches response from the server and displays it under 'Contact' section.
 */
const fetchAndShowResponse = () => {
  const commentPlaceholder = document.getElementById('comment-placeholder');
  try {
    ensureNonNull(commentPlaceholder);
  } catch (err) {
    console.log(error);
  }
  fetch('/submit_comment').then(response => response.json()).then(comments => {
    comments.forEach(commentText => {
      commentPlaceholder.appendChild(createCommentElement(commentText))
    });
  });
}

/** Creates an element which contains the comment text. */
const createCommentElement = (commentText) => {
  const comment = document.createElement('li');
  comment.innerHTML = commentText;
  return comment;
}

const body = document.getElementsByTagName('body')[0];
body.onload = fetchAndShowResponse;
