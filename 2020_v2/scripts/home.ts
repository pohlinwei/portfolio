/**
 * Sets up animation of actions by displaying them like a slideshow.
 * Specifically, we make the current action invisible and the next action
 * visible after every 2s.
 */
const setupActionAnimation = () => {
  const statements = <HTMLCollectionOf<HTMLElement>> document.getElementsByClassName('value-statement');
  ensureNonNull(statements);

  let currStatementIndex = 0; // indicates the action which is currently shown
  const actionsAnimate = () => {
    const nextStatementIndex = (currStatementIndex + 1) % statements.length;

    statements[currStatementIndex].style.display = 'none';
    statements[nextStatementIndex].style.display = 'inline';
    
    currStatementIndex = nextStatementIndex;
  }
  
  window.setInterval(actionsAnimate, 2000);
}

const setupDropdownMenu = () => {
  const menuButton = <HTMLDivElement> document.getElementById('menu-button');
  ensureNonNull(menuButton);
  menuButton.onclick = () => toggleMain(false);

  const closeButton = <HTMLDivElement> document.getElementById('close-button');
  ensureNonNull(closeButton);
  closeButton.onclick = () => toggleMain(true);


  const menuList = <HTMLElement> document.getElementById('menu-list');
  ensureNonNull(menuList);
  const menuItems = <HTMLCollectionOf<HTMLElement>> menuList.children;
  for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].onclick = () => toggleMain(true);
  }

  const sections = <HTMLCollectionOf<HTMLElement>> document.getElementsByTagName('section');
  ensureNonNull(sections);
  const footer = <HTMLElement> document.querySelector('footer');
  ensureNonNull(footer);
  const menu = <HTMLDivElement> document.getElementById('menu');
  ensureNonNull(menu);
  
  const toggleMain = (shouldShowMain: boolean) => {
    const mainDisplayValue = shouldShowMain ? Display.SHOW : Display.HIDE;
    const menuDisplayValue = shouldShowMain ? Display.HIDE : Display.SHOW;
  
    for (let i = 0; i < sections.length; i++) {
      sections[i].style.display = mainDisplayValue;
    }

    footer.style.display = mainDisplayValue;
    menu.style.display = menuDisplayValue;
  }
}
