console.log("theMessage");

// // value of const variable will not change
// //// this line passes the body element into the variable theBody
// const theBody = document.querySelector('body');
// //// this line passes the main element into the variable theMain
// let theMain = document.querySelector('main')
// // let value changes
// let theButton = document.querySelector("button");
// theButton.style.border = "10px solid black";

// // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// theButton.addEventListener("click", theyClicked);

// function theyClicked(){
//     console.log("clicked!");
//     theMain.style.backgroundColor = "pink";    
// }

const picButtons = document.querySelectorAll('.picBtn');
const gifURL = 'https://media1.tenor.com/m/wW2HwZr1x_sAAAAd/childish-gambino-this-is-america.gif';

picButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('image button clicked');
        const img = btn.querySelector('img');

        const currentHeight = img.clientHeight;
        img.src = gifURL;
        img.style.height = currentHeight + 'px';
    });
});

