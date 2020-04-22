function getChallenges() {
    fetch("http://127.0.0.1:3000/challenges")
        .then(response => response.json())
        .then(challenges => {
            console.log(challenges);
            return challenges;
        });
}

function postChallenge() {

}

function getSharedChallenges() {

}