/**
 * Adds listener to dropdown menu, elements that belong to main view 
 * and elements in the dropdown menu to enable the user to toggle between them. 
 * To view the dropdown menu, the user has to click on the menu icon.
 * To view the main view after opening the dropdown, the user has to click close
 * or select an element in the dropdown menu.
 */
const setupToggleMainAndMenu = () => {
  const mainViews = document.getElementsByClassName('main-view');
  const dropdownMenu = document.getElementById('dropdown-menu');
  ensureNonNull(mainViews, dropdownMenu);

  // Hides dropdown menu and shows main view elements.
  const hideMenuShowMain = () => {
    ensureHasClass(dropdownMenu, 'show-menu');
    dropdownMenu.classList.remove('show-menu');
    dropdownMenu.classList.add('hide-menu');

    for (let mainView of mainViews) {
      mainView.style.display = 'flex';
    }
  }

  // Hides main view elements and shows dropdown menu.
  const hideMainShowMenu = () => {
    ensureHasClass(dropdownMenu, 'hide-menu');
    dropdownMenu.classList.remove('hide-menu');
    dropdownMenu.classList.add('show-menu');
    
    for (let mainView of mainViews) {
      mainView.style.display = 'none';
    }
  }

  const closeButton = document.getElementById('close-button');
  ensureNonNull(closeButton);
  closeButton.onclick = hideMenuShowMain;

  const menuIcon = document.getElementById('menu-icon'); 
  ensureNonNull(menuIcon);
  menuIcon.onclick = hideMainShowMenu;

  const dropdownMenuContent = document.getElementById('dropdown-menu-content');
  ensureNonNull(dropdownMenuContent);
  
  const dropdownElements = dropdownMenuContent.children;
  for (let dropdownElement of dropdownElements) {
    dropdownElement.onclick = hideMenuShowMain;
  }
}

setupToggleMainAndMenu();
