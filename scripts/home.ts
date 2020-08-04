/**
 * Sets up animation of actions by displaying them like a slideshow.
 * Specifically, we make the current action invisible and the next action
 * visible after every 2s.
 */
const setupActionAnimation = () => {
  const statements: HTMLCollectionOf<Element> = document.getElementsByClassName('value-statement');
  ensureNonNull(statements);

  let currStatementIndex = 0; // indicates the action which is currently shown
  const actionsAnimate = () => {
    const nextStatementIndex = (currStatementIndex + 1) % statements.length;
    const currStatement = <HTMLElement> statements[currStatementIndex];
    const nextStatement = <HTMLElement> statements[nextStatementIndex];

    currStatement.style.display = 'none';
    nextStatement.style.display = 'inline';
    
    currStatementIndex = nextStatementIndex;
  }
  
  window.setInterval(actionsAnimate, 2000);
}

setupActionAnimation();
