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
const setUpWorks = () => {
    const featuredWorks = document.getElementsByClassName('work');
    ensureNonNull(featuredWorks);
    const numOfWorks = featuredWorks.length;
    let currentlyShownIndex = 0;
    for (let i = 1; i < numOfWorks; i++) {
        featuredWorks[i].style.display = Display.HIDE;
    }
    const createPagination = (numToCreate) => {
        const paginationContainer = document.getElementById('works-pagination-container');
        ensureNonNull(paginationContainer);
        const paginationHtmlArr = [];
        for (let i = 0; i < numToCreate; i++) {
            paginationHtmlArr.push(getPaginationHtmlString(i));
        }
        paginationContainer.innerHTML = paginationHtmlArr.join('');
        const paginations = document.getElementsByClassName('works-pagination');
        for (let i = 0; i < paginations.length; i++) {
            paginations[i].addEventListener('click', goToWork);
        }
    };
    const getPaginationHtmlString = (pageNum) => `<div class="works-pagination" pageNum="${pageNum}"></div>`;
    const goToWork = (e) => {
        const pagination = e.target;
        console.assert(pagination.getAttribute('pageNum') !== null, 'Missing \'pageNum\' attribute for a pagination element');
        const newShownIndex = parseInt(pagination.getAttribute('pageNum'));
        animateGoToWork(currentlyShownIndex, newShownIndex);
        currentlyShownIndex = newShownIndex;
    };
    const animateGoToWork = (currentIndex, targetIndex) => __awaiter(void 0, void 0, void 0, function* () {
        const diff = targetIndex - currentIndex;
        if (diff === 0) {
            return;
        }
        const isSlideLeft = diff > 0;
        const hasIntermediateSteps = Math.abs(diff) > 1;
        const indexBeforeTargetIndex = isSlideLeft ? targetIndex - 1 : targetIndex + 1;
        const FINAL_DELAY = 1;
        const finalSlider = new Slider(FINAL_DELAY, isSlideLeft, indexBeforeTargetIndex, 1);
        const finalMoveFromTo = finalSlider.move();
        const finalMoveFromWork = featuredWorks[finalMoveFromTo.from];
        const finalMoveToWork = featuredWorks[finalMoveFromTo.to];
        const INTERMEDIATE_DELAY = 0.1;
        if (hasIntermediateSteps) {
            const intermediateSteps = Math.abs(diff) - 1;
            const intermediateSlider = new Slider(INTERMEDIATE_DELAY, isSlideLeft, currentIndex, intermediateSteps);
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
    createPagination(numOfWorks);
};
var Movement;
(function (Movement) {
    Movement["LEFT_OUT"] = "leftout";
    Movement["RIGHT_IN"] = "rightin";
    Movement["RIGHT_OUT"] = "rightout";
    Movement["LEFT_IN"] = "leftin";
})(Movement || (Movement = {}));
class Slider {
    constructor(animationDuration, isSlideLeft, currentIndex, numStepsToMove) {
        ensureNonNegative(animationDuration, currentIndex, numStepsToMove);
        console.assert(numStepsToMove !== 0, 'Slider should not have no steps to move');
        this.animationDuration = animationDuration;
        this.currentIndex = currentIndex;
        this.remainingStepsToMove = numStepsToMove;
        this.isSlideLeft = isSlideLeft;
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
        return this.currentIndex + (this.isSlideLeft ? 1 : -1);
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
setUpWorks();
