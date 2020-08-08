"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** Sets up the featured work section. */
function setUpWorks(works) {
    let currentlyShownIndex = 0;
    /**
     * Creates a pagination section.
     * @param numToCreate The number of buttons to create. This should correspond to the number of featured works to be shown.
     */
    const createPagination = (numToCreate) => {
        const paginationContainer = document.getElementById('works-pagination-container');
        ensureNonNull(paginationContainer);
        const paginationHtmlArr = [];
        for (let i = 0; i < numToCreate; i++) {
            paginationHtmlArr.push(createPaginationButtonHtml(i));
        }
        paginationContainer.innerHTML = paginationHtmlArr.join('');
        const paginations = document.getElementsByClassName('works-pagination');
        for (let i = 0; i < paginations.length; i++) {
            paginations[i].addEventListener('click', goToWork);
        }
    };
    /** Goes to the selected work, as chosen by clicking on one of the buttons in the pagination section. */
    const goToWork = (e) => {
        const pagination = e.target;
        console.assert(pagination.getAttribute('pageNum') !== null, 'Missing \'pageNum\' attribute for a pagination element');
        const newShownIndex = parseInt(pagination.getAttribute('pageNum'));
        const currentPagination = document.getElementsByClassName('works-pagination')[currentlyShownIndex];
        currentPagination.style.backgroundColor = BackgroundColor.HIDE;
        animateGoToWork(currentlyShownIndex, newShownIndex, featuredWorks);
        pagination.style.backgroundColor = BackgroundColor.SHOW;
        currentlyShownIndex = newShownIndex;
    };
    /** Enables user to swipe to the left and right. */
    const enableSwipeToNav = () => {
        let currX = 0;
        const worksContainer = document.getElementById('works-container');
        ensureNonNull(worksContainer);
        // for touch screen devices
        worksContainer.addEventListener('touchstart', ev => {
            currX = ev.changedTouches[0].screenX;
        });
        worksContainer.addEventListener('touchend', ev => {
            const newX = ev.changedTouches[0].screenX;
            const diffX = newX - currX;
            const THRESHOLD_TO_EXCEED_BEFORE_MOVING = 20;
            if (Math.abs(diffX) < THRESHOLD_TO_EXCEED_BEFORE_MOVING) {
                return;
            }
            const moveBy = diffX < 0 ? 1 : -1;
            const nextIndex = (moveBy + currentlyShownIndex + numOfWorks) % numOfWorks;
            const currentPagination = document.getElementsByClassName('works-pagination')[currentlyShownIndex];
            currentPagination.style.backgroundColor = BackgroundColor.HIDE;
            animateGoToWork(currentlyShownIndex, nextIndex, featuredWorks);
            currentlyShownIndex = nextIndex;
            const nextPagination = document.getElementsByClassName('works-pagination')[currentlyShownIndex];
            nextPagination.style.backgroundColor = BackgroundColor.SHOW;
        });
        // for non-touch screen devices
        worksContainer.addEventListener('mousedown', ev => currX = ev.clientX);
        worksContainer.addEventListener('mouseup', ev => {
            const newX = ev.clientX;
            const diffX = newX - currX;
            const THRESHOLD_TO_EXCEED_BEFORE_MOVING = 20;
            if (Math.abs(diffX) < THRESHOLD_TO_EXCEED_BEFORE_MOVING) {
                return;
            }
            const moveBy = diffX < 0 ? 1 : -1;
            const nextIndex = (moveBy + currentlyShownIndex + numOfWorks) % numOfWorks;
            const currentPagination = document.getElementsByClassName('works-pagination')[currentlyShownIndex];
            currentPagination.style.backgroundColor = BackgroundColor.HIDE;
            animateGoToWork(currentlyShownIndex, nextIndex, featuredWorks);
            currentlyShownIndex = nextIndex;
            const nextPagination = document.getElementsByClassName('works-pagination')[currentlyShownIndex];
            nextPagination.style.backgroundColor = BackgroundColor.SHOW;
        });
    };
    // Function calls and actual set-up begins here. 
    createWorks(works);
    const featuredWorks = document.getElementsByClassName('work');
    ensureNonNull(featuredWorks);
    const numOfWorks = featuredWorks.length;
    createPagination(numOfWorks);
    onlyShowFirstWork(featuredWorks);
    enableSwipeToNav();
}
/**
 * Creates works.
 * @param works An array of JSON objects, each of which contains information for a work @see Work.
 */
function createWorks(works) {
    const worksHtml = [];
    for (let work of works) {
        worksHtml.push(createWork(work));
    }
    const worksContainer = document.getElementById('works-container');
    ensureNonNull(worksContainer);
    const worksAndPaginationContainerHTML = [...worksHtml, getPaginationContainerHTML()].join('');
    worksContainer.innerHTML = worksAndPaginationContainerHTML;
}
/**
 * Creates work by representing in HTML.
 * @param work `Work` to be created
 */
const createWork = (work) => `<div class="work">
      <div class="work-title">
        <h1>${work.name}</h1>
      </div>
      <div class="work-description">
        <div class="wrapper">
          <p class="work-summary">${work.summary}</p>
          <p class="work-tools">
            Made with: ${work.tools}
          </p>
          <p class="work-date">
            Done: ${work.date}
          </p>
          <div class="details-button">
            <a href="${work.page}">Details >></a>
          </div>
        </div>
      </div>
    </div>`;
/** Returns a pagination container in HTML. */
const getPaginationContainerHTML = () => '<div id="works-pagination-container"></div>';
/** Creates a button for pagination section using HTML template. */
const createPaginationButtonHtml = (pageNum) => `<div class="works-pagination" pageNum="${pageNum}"></div>`;
/** Represents possible background colours. */
var BackgroundColor;
(function (BackgroundColor) {
    BackgroundColor["HIDE"] = "#fff";
    BackgroundColor["SHOW"] = "#000";
})(BackgroundColor || (BackgroundColor = {}));
/** Ensures that only the first work is shown, and the rest are hidden. Should be called after adding pagination and works. */
function onlyShowFirstWork(featuredWorks) {
    featuredWorks[0].style.display = Display.SHOW;
    const firstPagination = document.getElementsByClassName('works-pagination')[0];
    firstPagination.style.backgroundColor = BackgroundColor.SHOW;
    for (let i = 1; i < featuredWorks.length; i++) {
        featuredWorks[i].style.display = Display.HIDE;
    }
}
/** Animates go to work event (i.e. change of work shown). */
function animateGoToWork(currentIndex, targetIndex, featuredWorks) {
    return __awaiter(this, void 0, void 0, function* () {
        const diff = targetIndex - currentIndex;
        if (diff === 0) {
            return;
        }
        const isSlideLeft = diff > 0;
        const hasIntermediateSteps = Math.abs(diff) > 1;
        const indexBeforeTargetIndex = isSlideLeft ? targetIndex - 1 : targetIndex + 1;
        const FINAL_DELAY = 1;
        const finalSlider = new Slider(FINAL_DELAY, isSlideLeft, indexBeforeTargetIndex, 1, featuredWorks.length);
        const finalMoveFromTo = finalSlider.move();
        const finalMoveFromWork = featuredWorks[finalMoveFromTo.from];
        const finalMoveToWork = featuredWorks[finalMoveFromTo.to];
        const INTERMEDIATE_DELAY = 0.1;
        if (hasIntermediateSteps) {
            const intermediateSteps = Math.abs(diff) - 1;
            const intermediateSlider = new Slider(INTERMEDIATE_DELAY, isSlideLeft, currentIndex, intermediateSteps, featuredWorks.length);
            let moveFromTo = intermediateSlider.move();
            let currMoveFromWork = featuredWorks[moveFromTo.from];
            let currMoveToWork = featuredWorks[moveFromTo.to];
            let animations = [];
            changeDispAndAnimation(currMoveFromWork, Display.SHOW, intermediateSlider.sliderComponent.hide);
            for (let i = 0; i < intermediateSteps; i++) {
                animations.push(showNextWorkPromiseFactory(currMoveFromWork, currMoveToWork, intermediateSlider));
                moveFromTo = intermediateSlider.move();
                currMoveFromWork = featuredWorks[moveFromTo.from];
                currMoveToWork = featuredWorks[moveFromTo.to];
                animations.push(hideCurrentWorkPromiseFactory(currMoveFromWork, intermediateSlider));
            }
            yield animations.reduce((p, f) => p.then(f), Promise.resolve());
        }
        else {
            changeDispAndAnimation(finalMoveFromWork, Display.SHOW, finalSlider.sliderComponent.hide);
        }
        setTimeout(() => {
            changeDispAndAnimation(finalMoveFromWork, Display.HIDE, 'none');
            changeDispAndAnimation(finalMoveToWork, Display.SHOW, finalSlider.sliderComponent.show);
        }, toMilliseconds(hasIntermediateSteps ? INTERMEDIATE_DELAY : finalSlider.animationDuration / 2));
    });
}
var Movement;
(function (Movement) {
    Movement["LEFT_OUT"] = "leftout";
    Movement["RIGHT_IN"] = "rightin";
    Movement["RIGHT_OUT"] = "rightout";
    Movement["LEFT_IN"] = "leftin";
})(Movement || (Movement = {}));
class Slider {
    constructor(animationDuration, isSlideLeft, currentIndex, numStepsToMove, numWorks) {
        ensureNonNegative(animationDuration, currentIndex, numStepsToMove);
        console.assert(numStepsToMove !== 0, 'Slider should not have no steps to move');
        this.animationDuration = animationDuration;
        this.currentIndex = currentIndex;
        this.remainingStepsToMove = numStepsToMove;
        this.isSlideLeft = isSlideLeft;
        this.numWorks = numWorks;
        if (isSlideLeft) {
            this.sliderComponent = {
                hide: this.getAnimation(Movement.LEFT_OUT, this.animationDuration),
                show: this.getAnimation(Movement.RIGHT_IN, this.animationDuration)
            };
        }
        else {
            this.sliderComponent = {
                hide: this.getAnimation(Movement.RIGHT_OUT, this.animationDuration),
                show: this.getAnimation(Movement.LEFT_IN, this.animationDuration)
            };
        }
    }
    getAnimation(movement, duration) {
        return `${movement} ${duration}s 1`;
    }
    get nextIndex() {
        return (this.currentIndex + (this.isSlideLeft ? 1 : -1) + this.numWorks % this.numWorks);
    }
    move() {
        console.assert(this.remainingStepsToMove > 0, 'Should not call move function when there are no remaining steps');
        const from = this.currentIndex;
        this.currentIndex = this.nextIndex;
        const to = this.currentIndex;
        this.remainingStepsToMove--;
        return { from: from, to: to };
    }
}
const showNextWorkPromiseFactory = (currWork, nextWork, slider) => {
    return () => new Promise(resolve => setTimeout(() => {
        changeDispAndAnimation(currWork, Display.HIDE, 'none');
        changeDispAndAnimation(nextWork, Display.SHOW, slider.sliderComponent.show);
        resolve();
    }, toMilliseconds(slider.animationDuration)));
};
const hideCurrentWorkPromiseFactory = (currWork, slider) => {
    return () => new Promise(resolve => setTimeout(() => {
        changeDispAndAnimation(currWork, Display.SHOW, slider.sliderComponent.hide);
        resolve();
    }, toMilliseconds(slider.animationDuration)));
};
const changeDispAndAnimation = (element, displayValue, animationValue) => {
    element.style.display = displayValue;
    element.style.animation = animationValue;
};
