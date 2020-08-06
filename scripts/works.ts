const setUpWorks = () => {
  const featuredWorks = <HTMLCollectionOf<HTMLDivElement>> document.getElementsByClassName('work');
  ensureNonNull(featuredWorks);
  const numOfWorks = featuredWorks.length;
  
  let currentlyShownIndex = 0;

  const createPagination = (numToCreate: number) => {
    const paginationContainer = <HTMLDivElement> document.getElementById('works-pagination-container');
    ensureNonNull(paginationContainer);

    const paginationHtmlArr: string[] = [];
    
    for (let i = 0; i < numToCreate; i++) {
      paginationHtmlArr.push(getPaginationHtmlString(i));
    }

    paginationContainer.innerHTML = paginationHtmlArr.join('');

    const paginations = <HTMLCollectionOf<HTMLDivElement>> document.getElementsByClassName('works-pagination');
    for (let i = 0; i < paginations.length; i++) {
      paginations[i].addEventListener('click', goToWork);
    }
  }

  const goToWork:EventListener = (e: Event) => {
    const pagination = <HTMLDivElement> e.target;
    console.assert(pagination.getAttribute('pageNum') !== null, 
        'Missing \'pageNum\' attribute for a pagination element');
    const newShownIndex = parseInt(<string>pagination.getAttribute('pageNum'));
    
    const currentPagination = <HTMLDivElement> document.getElementsByClassName('works-pagination')[currentlyShownIndex];
    currentPagination.style.backgroundColor = BackgroundColor.HIDE;
    animateGoToWork(currentlyShownIndex, newShownIndex, featuredWorks);
    pagination.style.backgroundColor = BackgroundColor.SHOW;

    currentlyShownIndex = newShownIndex;
  }

  createPagination(numOfWorks);
  onlyShowFirstWork(featuredWorks);
}

enum BackgroundColor {
  HIDE = '#fff',
  SHOW = '#000'
}

const onlyShowFirstWork = (featuredWorks: HTMLCollectionOf<HTMLDivElement>) => {
  featuredWorks[0].style.display = Display.SHOW;
  const firstPagination = <HTMLDivElement> document.getElementsByClassName('works-pagination')[0];
  firstPagination.style.backgroundColor = BackgroundColor.SHOW;

  for (let i = 1; i < featuredWorks.length; i++) {
    featuredWorks[i].style.display = Display.HIDE;
  }
}

const getPaginationHtmlString = (pageNum: number) => `<div class="works-pagination" pageNum="${pageNum}"></div>`;

const animateGoToWork = async (currentIndex: number, targetIndex: number, featuredWorks: HTMLCollectionOf<HTMLDivElement>) => {
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

    let animations: (() => Promise<void>)[] = [];
    changeDispAndAnimation(currMoveFromWork, Display.SHOW, intermediateSlider.sliderComponent.hide);

    for (let i = 0; i < intermediateSteps; i++) {
      animations.push(showNextWorkPromiseFactory(currMoveFromWork, currMoveToWork, intermediateSlider));
      moveFromTo = intermediateSlider.move();
      currMoveFromWork = featuredWorks[moveFromTo.from];
      currMoveToWork = featuredWorks[moveFromTo.to];
      animations.push(hideCurrentWorkPromiseFactory(currMoveFromWork, intermediateSlider));
    }

    await animations.reduce((p, f) => p.then(f), Promise.resolve());
    
  } else {
    changeDispAndAnimation(finalMoveFromWork, Display.SHOW, finalSlider.sliderComponent.hide);
  }

  setTimeout(() => {
    changeDispAndAnimation(finalMoveFromWork, Display.HIDE, 'none');
    changeDispAndAnimation(finalMoveToWork, Display.SHOW, finalSlider.sliderComponent.show);
  }, toMilliseconds(hasIntermediateSteps ? INTERMEDIATE_DELAY : finalSlider.animationDuration / 2));
}


enum Movement {
  LEFT_OUT = 'leftout',
  RIGHT_IN = 'rightin',
  RIGHT_OUT = 'rightout',
  LEFT_IN = 'leftin'
}

type SliderComponent = {
  hide: string,
  show: string,
}

type MoveFromTo = {
  from: number,
  to: number
}

class Slider {
  animationDuration: number;
  sliderComponent: SliderComponent;
  currentIndex: number;
  remainingStepsToMove: number;
  isSlideLeft: boolean;

  constructor(animationDuration: number, isSlideLeft: boolean, currentIndex: number, numStepsToMove: number) {
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
      }
    } else {
      this.sliderComponent = {
        hide: this.getAnimation(Movement.RIGHT_OUT, this.animationDuration),
        show: this.getAnimation(Movement.LEFT_IN, this.animationDuration)
      }
    }
  }

  private getAnimation(movement: Movement, duration: number): string {
    return `${movement} ${duration}s 1`;
  }

  private get nextIndex(): number {
    return this.currentIndex + (this.isSlideLeft ? 1 : -1);
  }

  move(): MoveFromTo {
    console.assert(this.remainingStepsToMove > 0, 'Should not call move function when there are no remaining steps');
    
    const from = this.currentIndex;
    this.currentIndex = this.nextIndex;
    const to = this.currentIndex;
    this.remainingStepsToMove--;

    return {from: from, to: to};
  }
}

const showNextWorkPromiseFactory = (currWork: HTMLElement, nextWork: HTMLElement, slider: Slider): () => Promise<void> => {
  return () => new Promise(resolve => setTimeout(() => {
      changeDispAndAnimation(currWork, Display.HIDE, 'none');
      changeDispAndAnimation(nextWork, Display.SHOW, slider.sliderComponent.show);
      resolve();
      }, toMilliseconds(slider.animationDuration))
  );
}

const hideCurrentWorkPromiseFactory = (currWork: HTMLElement, slider: Slider): () => Promise<void> => {
  return () => new Promise(resolve => setTimeout(() => {
      changeDispAndAnimation(currWork, Display.SHOW, slider.sliderComponent.hide);
      resolve();
      }, toMilliseconds(slider.animationDuration))
  );
}

const changeDispAndAnimation = (element: HTMLElement, displayValue: Display, animationValue: string) => {
  element.style.display = displayValue;
  element.style.animation = animationValue;
}

setUpWorks();
