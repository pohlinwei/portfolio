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
const parentDir = 'https://pohlinwei.github.io/portfolio/';
const featuredWorksDoc = fetch(parentDir + 'projects/featured_works.json')
    .then(response => response.json())
    .then(works => {
    const overviewWorks = [];
    works.forEach((work) => overviewWorks.push({
        name: work.name,
        summary: work.summary,
        tools: work.tools,
        date: work.date,
        page: work.page
    }));
    setUpWorks(overviewWorks);
});
const setUpWorks = (works) => {
    let currentlyShownIndex = 0;
    const createPagination = (numToCreate) => {
        const paginationContainer = document.getElementById('works-pagination-container');
        ensureNonNull(paginationContainer);
        const paginationHtmlArr = [];
        for (let i = 0; i < numToCreate; i++) {
            paginationHtmlArr.push(getPaginationHtml(i));
        }
        paginationContainer.innerHTML = paginationHtmlArr.join('');
        const paginations = document.getElementsByClassName('works-pagination');
        for (let i = 0; i < paginations.length; i++) {
            paginations[i].addEventListener('click', goToWork);
        }
    };
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
    let currX = 0;
    const enableSwipeToNav = () => {
        const worksContainer = document.getElementById('works');
        ensureNonNull(worksContainer);
        worksContainer.addEventListener('touchstart', ev => currX = ev.touches[0].clientX);
        worksContainer.addEventListener('touchend', ev => {
            const newX = ev.touches[0].clientX;
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
    createWorks(works);
    const featuredWorks = document.getElementsByClassName('work');
    ensureNonNull(featuredWorks);
    const numOfWorks = featuredWorks.length;
    createPagination(numOfWorks);
    onlyShowFirstWork(featuredWorks);
    enableSwipeToNav();
};
const createWorks = (works) => {
    const worksHtml = [];
    for (let work of works) {
        worksHtml.push(createWork(work));
    }
    const worksContainer = document.getElementById('works-container');
    ensureNonNull(worksContainer);
    const worksAndPaginationContainerHTML = [...worksHtml, getPaginationContainerHTML()].join('');
    worksContainer.innerHTML = worksAndPaginationContainerHTML;
};
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
const getPaginationContainerHTML = () => '<div id="works-pagination-container"></div>';
var BackgroundColor;
(function (BackgroundColor) {
    BackgroundColor["HIDE"] = "#fff";
    BackgroundColor["SHOW"] = "#000";
})(BackgroundColor || (BackgroundColor = {}));
const onlyShowFirstWork = (featuredWorks) => {
    featuredWorks[0].style.display = Display.SHOW;
    const firstPagination = document.getElementsByClassName('works-pagination')[0];
    firstPagination.style.backgroundColor = BackgroundColor.SHOW;
    for (let i = 1; i < featuredWorks.length; i++) {
        featuredWorks[i].style.display = Display.HIDE;
    }
};
const getPaginationHtml = (pageNum) => `<div class="works-pagination" pageNum="${pageNum}"></div>`;
const animateGoToWork = (currentIndex, targetIndex, featuredWorks) => __awaiter(void 0, void 0, void 0, function* () {
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
