/**
 * Sets up animation of actions by displaying them like a slideshow.
 * Specifically, we make the current action invisible and the next action
 * visible after every 2s.
 */
const setupActionAnimation = () => {
  const actions = document.getElementsByClassName('action');
  ensureNonNull(actions);

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
