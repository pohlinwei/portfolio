/**
 * Sets up animation of actions by displaying them like a slideshow.
 * Specifically, we make the current action invisible and the next action
 * visible after every 2s.
 */
var setupActionAnimation = function () {
    var statements = document.getElementsByClassName('value-statement');
    ensureNonNull(statements);
    var currStatementIndex = 0; // indicates the action which is currently shown
    var actionsAnimate = function () {
        var nextStatementIndex = (currStatementIndex + 1) % statements.length;
        var currStatement = statements[currStatementIndex];
        var nextStatement = statements[nextStatementIndex];
        currStatement.style.display = 'none';
        nextStatement.style.display = 'inline';
        currStatementIndex = nextStatementIndex;
    };
    window.setInterval(actionsAnimate, 2000);
};
setupActionAnimation();
