
//See if the browser supports Service Workers, if so try to register one
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js").then(function(registering){
      // Registration was successful
      console.log("Browser: Service Worker registration is successful with the scope",registering.scope);
    }).catch(function(error){
      //The registration of the service worker failed
      console.log("Browser: Service Worker registration failed with the error",error);
    });
  }else { 
    //The registration of the service worker failed
    console.log("Browser: I don't support Service Workers :(");
  }
//Asking for permission with the Notification API
if(typeof Notification!==typeof undefined){ //First check if the API is available in the browser
	Notification.requestPermission().then(function(result){ 
		//If accepted, then save subscriberinfo in database
		if(result==="granted"){
			console.log("Browser: User accepted receiving notifications, save as subscriber data!");
			navigator.serviceWorker.ready.then(function(serviceworker){ //When the Service Worker is ready, generate the subscription with our Serice Worker's pushManager and save it to our list
				const VAPIDPublicKey="BBYHcYG5-56sO2qJVXUkt5pZyZ49MHguMnV9h93Sia_wceO-yc0Hyln3b6LLnkY-4rB-Dnnk5vGKxzsN3YXzA0s"; // Fill in your VAPID publicKey here
				const options={applicationServerKey:VAPIDPublicKey,userVisibleOnly:true} //Option userVisibleOnly is neccesary for Chrome
				serviceworker.pushManager.subscribe(options).then((subscription)=>{
          //POST the generated subscription to our saving script (this needs to happen server-side, (client-side) JavaScript can't write files or databases)
					let subscriberFormData=new FormData();
					subscriberFormData.append("json",JSON.stringify(subscription));
					fetch("data/saveSubscription.php",{method:"POST",body:subscriberFormData});
				});
			});
		}
	}).catch((error)=>{
		console.log(error);
	});
}
 

// Dit zorgt ervoor dat wanneer de pagina refresht, het scroll effect blijft werken
document.scrollingElement.scrollTo(0, 0)

// Navigation

const navButtons = document.getElementsByClassName('nav-button');
const pages = document.getElementsByClassName('page');

for (const button of navButtons) {
    button.onclick = function () {
        for (const btn of navButtons) { btn.children[0].classList.remove("active"); }
        const selectedPage = button.id.split('-')[1];
        button.children[0].classList.add("active");
        navigatePage(selectedPage);
    }
}

function navigatePage(selectedPage) {
    for (const page of pages) {
        page.id.split('-')[2] == selectedPage ? page.hidden = false : page.hidden = true;
    }
}

// Daily challenges

const difficulty = {
    controls: {
        container: document.getElementById('difficulty-controls'),
        left: document.getElementById("difficulty-control-left"),
        right: document.getElementById("difficulty-control-right"),
        naturalPosition: 0,
        sticky: false
    },
    title: document.getElementById('tab-title'),
    levels: ["easy", "medium", "hard"],
    current: {
        name: "",
        getIndex: function () { return difficulty.levels.findIndex(difficultyName => difficulty.current.name == difficultyName); }
    },
    contents: document.getElementsByClassName('difficulty-tab-content')
}

function chooseDifficulty(difficultyName) {
    difficulty.title.innerHTML = difficultyName.toUpperCase();
    for (const content of difficulty.contents) {
        content.id.split('-')[2] == difficultyName ? content.hidden = false : content.hidden = true;
    }
}

function toggleControls() {
    difficulty.controls.left.style.visibility = difficulty.current.getIndex() == 0 ? "hidden" : "visible";
    difficulty.controls.right.style.visibility = difficulty.current.getIndex() == difficulty.levels.length - 1 ? "hidden" : "visible";
}

difficulty.controls.left.onclick = function () {
    difficulty.current.name = difficulty.levels[difficulty.current.getIndex() - 1];
    chooseDifficulty(difficulty.current.name);
    toggleControls();
}

difficulty.controls.right.onclick = function () {
    difficulty.current.name = difficulty.levels[difficulty.current.getIndex() + 1];
    chooseDifficulty(difficulty.current.name);
    toggleControls();
}

document.onscroll = function () {
    if (difficulty.controls.container.offsetTop > difficulty.controls.naturalPosition && !difficulty.controls.sticky) {
        difficulty.controls.sticky = true;
        difficulty.controls.container.classList.add("sticky");
    } else if (difficulty.controls.container.offsetTop == difficulty.controls.naturalPosition && difficulty.controls.sticky) {
        difficulty.controls.sticky = false;
        difficulty.controls.container.classList.remove("sticky");
    }
}

function initDifficulty() {
    difficulty.controls.naturalPosition = difficulty.controls.container.offsetTop;
    difficulty.current.name = difficulty.levels[0];

    toggleControls();
}

initDifficulty();
