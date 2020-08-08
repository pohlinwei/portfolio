const foo = () => {return new Promise((resolve) => {
    setTimeout(() => { 
        console.log('done' + 1);
        resolve();
    }, 1000);
})}

const pa = [foo, foo, foo];

//pa.reduce((p, f) => p.then(f), Promise.resolve())
let h = Promise.resolve();
h = h.then(foo);
h = h.then(foo);
h;
//foo().then(() => foo()).then(() => foo());


/*
const p = new Promise((resolve) => {
    setTimeout(() => { 
        console.log('done' + 1);
        resolve();
    }, 3000);
}).then(() => new Promise((resolve) => {
    setTimeout(() => { 
        console.log('done' + 1);
        resolve();
    }, 3000);
}, 3000)).then((resolve) => setTimeout(() => { 
    console.log('done' + 1);
    resolve();
}, 3000))*/
/*
const ps = [];

for (i = 0; i < 3; i++) {
    ps.push(p);
}

for (const p of ps) {
    console.log('hi');
}*/
