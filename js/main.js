const treeHealthAtt = "data-tree-health";
const woodAtt = "data-wood";
const metalAtt = "data-metal";
const buildingsAtt = "data-buildings";
const strengthAtt = "data-strength";
const monstersAtt = "data-monsters";
const hpAtt = "data-hp";
const warriorHpAtt = "data-warrior-hp";

const monstersDivId = "monster-div";
const materialInfoId = "material-info";
const warriorId = "warrior-1";
const containerId = "container";
const outputId = "output-div";
const lifeBarId = "life-bar";
const buildingsId = "building-div";
const buySwordId = "buy-sword-btn";
const buySmallHouseId = "buy-building-1-btn";
const buyLargeHouseId = "buy-building-2-btn";
const tree1Id = "tree-1";
const tree2Id = "tree-2";
const tree3Id = "tree-3";
const metalMineId = "metal-mine";

function updateInfo() {

    let info = document.getElementById(materialInfoId);

    document.getElementById(materialInfoId).innerHTML =
        `Treverk: ${info.getAttribute(woodAtt)} enheter. 
         Metall: ${info.getAttribute(metalAtt)} enheter. 
         Antall bygninger: ${info.getAttribute(buildingsAtt)}. 
         Styrke: ${info.getAttribute(strengthAtt)}`;
}

function updateBoughtBuildings() {
    let info = document.getElementById(materialInfoId);
    let buildings = parseInt(info.getAttribute(buildingsAtt));
    info.setAttribute(buildingsAtt, `${++buildings}`)
}

function logEvent(message) {

    let output = document.getElementById(outputId);
    output.innerHTML = `<p>${message.replace("data-", "")}</p>` + output.innerHTML;

}

function randomMonsters() {
    let probabilityMonsters = Math.floor(Math.random() * 10);

    if (probabilityMonsters === 1) {
        [...Array(Math.floor(Math.random() * 3) + 1)]
            .forEach(initMonster);
    }
}

function monstersAttack() {
    let monsterCount = document.getElementById(monstersDivId).getAttribute(monstersAtt);

    if (monsterCount === "0") {
        return;
    }

    logEvent("The monsters are attacking you!")

    let currentWarriorHp = parseInt(document.getElementById(warriorId).getAttribute(warriorHpAtt))
    let warriorHp = currentWarriorHp - 10;

    if (warriorHp === 0) {
        logEvent("You died!")

        document.getElementById(containerId).innerHTML = `<img src="images/death.png" style="margin: 0 auto; display: block"/>`
        document.getElementById(containerId).style.background = "none";
        return;
    }

    let lifeBar = document.getElementById(lifeBarId);
    lifeBar.innerHTML = `${warriorHp}hp`
    lifeBar.style.width = `${warriorHp}px`;

    document.getElementById(warriorId).setAttribute(warriorHpAtt, `${warriorHp}`);
}


function handleResources(resource, amount) {
    let element = document.getElementById(materialInfoId);

    let currentAmount = parseInt(element.getAttribute(resource));
    element.setAttribute(resource, `${currentAmount + amount}`)
    logEvent(`Added ${amount} ${resource}`)

    updateInfo();

}

function hitMonster(theMonster) {
    logEvent("You are fighting the monsters!")

    let currentHp = parseInt(theMonster.getAttribute(hpAtt));
    let strength = parseInt(document.getElementById(materialInfoId).getAttribute(strengthAtt));
    let hp = currentHp - strength;

    if (hp === 0) {
        logEvent("The monster died!")
        let monsterDiv = document.getElementById(monstersDivId);

        monsterDiv.removeChild(theMonster);

        let currentMonsters = parseInt(monsterDiv.getAttribute(monstersAtt));
        monsterDiv.setAttribute(monstersAtt, `${currentMonsters - 1}`)
    } else {
        theMonster.setAttribute(hpAtt, `${hp}`);
    }

    monstersAttack();
}

function chopTree(theTree) {

    handleResources(woodAtt, 25);

    let health = theTree.getAttribute(treeHealthAtt) - 1;
    if (health === 0) {
        logEvent(`Tree ${tree} was chopped down!`)
        document.getElementById(containerId).removeChild(theTree);
    }

    theTree.setAttribute(treeHealthAtt, `${health}`);

    monstersAttack();
    randomMonsters();

}

function mineMetal() {
    handleResources(metalAtt, 10);
    monstersAttack()
    randomMonsters();
}

function buy(woodNeeded, metalNeeded, performBuy) {
    let materialInfo = document.getElementById(materialInfoId);
    let woodAmount = parseInt(materialInfo.getAttribute(woodAtt));
    let metalAmount = parseInt(materialInfo.getAttribute(metalAtt));

    if (woodAmount >= woodNeeded && metalAmount >= metalNeeded) {
        performBuy();
        materialInfo.setAttribute(woodAtt, `${woodAmount - woodNeeded}`)
        materialInfo.setAttribute(metalAtt, `${metalAmount - metalNeeded}`)
        updateInfo();
    }
    monstersAttack()
}

function buildSmallHouse() {
    document.getElementById(buildingsId).innerHTML += `<img src="images/building-1.png"/>`
    updateBoughtBuildings();

    logEvent("You bought a small house")
}

function buildLargeHouse() {
    document.getElementById(buildingsId).innerHTML += `<img src="images/building-3.png"/>`
    updateBoughtBuildings()

    logEvent("You bought a large house")
}

function buySword() {
    document.getElementById(materialInfoId).setAttribute(strengthAtt, "40");

    document.getElementById(buySwordId).disabled = true;
    logEvent("A new sword!")
    updateInfo();

}

function initMonster() {
    let monsters = document.getElementById(monstersDivId);
    monsters.innerHTML += `<img src="images/cute-wolfman.png" ${hpAtt}="40" onclick="hitMonster(this)"/>`

    logEvent("A monster appeared!")

    let monsterCount = parseInt(monsters.getAttribute(monstersAtt));
    monsters.setAttribute(monstersAtt, `${monsterCount + 1}`);
}

function initTree(id) {
    let tree = document.getElementById(id);

    tree.onclick = () => chopTree(tree);
    tree.setAttribute(treeHealthAtt, "10");
}

function initInfo() {
    let infoP = document.getElementById(materialInfoId);

    infoP.setAttribute(woodAtt, "0");
    infoP.setAttribute(metalAtt, "0");
    infoP.setAttribute(buildingsAtt, "0");
    infoP.setAttribute(strengthAtt, "10");

    document.getElementById(monstersDivId).setAttribute(monstersAtt, "0");
    document.getElementById(warriorId).setAttribute(warriorHpAtt, "300")
}

function initMine() {
    document.getElementById(metalMineId).onclick = () => mineMetal();
}

function initBuyButtons() {
    document.getElementById(buySmallHouseId).onclick = () => buy(50, 10, buildSmallHouse);
    document.getElementById(buyLargeHouseId).onclick = () => buy(150, 30, buildLargeHouse);
    document.getElementById(buySwordId).onclick = () => buy(0, 200, buySword)
}

(function init() {
    initMine();
    initTree(tree1Id);
    initTree(tree2Id);
    initTree(tree3Id);
    initInfo();
    initBuyButtons();
})();
