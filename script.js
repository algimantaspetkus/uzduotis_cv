//magic
document.addEventListener("DOMContentLoaded", () => main("Chuck Norris", "Jack of all trades", "./avatar.png"));

// main is async becouse we cant use await in the event listener
async function main(name, title, avatar) {
    toggleLoading();
    const [experianceList, skillList] = await Promise.all([getExperiences(), getSkills()]);
    if (experianceList && skillList) {
        const person = new Person(name, title, avatar, experianceList, skillList);
        person.renderPerseonalInfo();
        setTimeout(() => toggleLoading(), 1000); //just to see the loading animation, not really needed
        return;
    }
    const mainTag = document.querySelector("main");
    mainTag.innerHTML = "";
    const error = document.createElement("h1");
    error.textContent = "Error fetching data";
    mainTag.appendChild(error);
}

async function getExperiences() {
    // some random change
    try {
        const response = await fetch("https://zany-skitter-caper.glitch.me/experiences");
        const data = await response.json();
        data.sort((a, b) => (a.startYear - b.startYear ? 1 : -1)); //sort by start year to logically look better
        return new WorkExperiance(data);
    } catch (error) {
        console.log(error);
    }
}

async function getSkills() {
    try {
        const response = await fetch("https://zany-skitter-caper.glitch.me/skills");
        const data = await response.json();
        return new Skills(data);
    } catch (error) {
        console.log(error);
    }
}

//toggle between .loading and .container HTML classes
const toggleLoading = () => {
    const loading = document.querySelector(".loading");
    const container = document.querySelector(".container");
    loading.classList.toggle("hidden");
    container.classList.toggle("hidden");
};

class Person {
    constructor(name, title, avatar, experianceList, skillList) {
        this.name = name;
        this.title = title;
        this.avatar = avatar;
        this.experianceList = experianceList; // should be an object with the call of WorkExperiance
        this.skillList = skillList; // should be an object with the call of Skills
    }

    renderPerseonalInfo() {
        //rendering the personal info
        document.querySelector(".personInfo .avatar").style.backgroundImage = `url(${this.avatar})`;
        document.querySelector(".personInfo .name").innerHTML = this.name;
        document.querySelector(".personInfo .title").innerHTML = this.title;
        document.querySelector(".personInfo .copyright span").innerHTML = new Date().getFullYear();

        this.experianceList.renderExperiances(); //rendering the experiance list
        this.skillList.renderSkills(); //rendering the skill list
    }
}

class Skills {
    constructor(skills) {
        this.skills = skills;
    }

    renderSkills() {
        const skillsContainer = document.querySelector(".skillsList");
        this.skills.forEach((skill) => {
            const skillElement = document.createElement("li");
            skillElement.classList.add("skill");
            const skillName = document.createElement("div");
            skillName.classList.add("skillName");
            skillName.textContent = skill.title;
            const skillLevel = document.createElement("div");
            skillLevel.classList.add("skillLevel");
            skillLevel.textContent = `${skill.level}%`;
            const skillNameLevelContainer = document.createElement("div");
            skillNameLevelContainer.classList.add("skillNameLevelContainer");
            skillNameLevelContainer.appendChild(skillName);
            skillNameLevelContainer.appendChild(skillLevel);
            const skillBar = document.createElement("div");
            skillBar.classList.add("skillBar");
            const progress = document.createElement("div");
            progress.classList.add("progress");
            progress.style.width = `${skill.level}%`;
            skillBar.appendChild(progress);
            skillElement.appendChild(skillNameLevelContainer);
            skillElement.appendChild(skillBar);
            skillsContainer.appendChild(skillElement);
        });
    }
}

class WorkExperiance {
    constructor(experiances) {
        this.experiances = experiances;
    }

    renderExperiances() {
        const experiancesContainer = document.querySelector(".experianceList");
        this.experiances.forEach(({ startYear, finishYear, companyName, position, description }) => {
            const experianceElement = document.createElement("li");
            experianceElement.classList.add("experiance");
            const yearCompanyContainer = document.createElement("div");
            yearCompanyContainer.classList.add("yearCompanyContainer");
            const year = document.createElement("div");
            year.classList.add("year");
            year.textContent = `${startYear} - ${finishYear}`;
            const companyNameDiv = document.createElement("div");
            companyNameDiv.classList.add("companyName");
            companyNameDiv.textContent = companyName;
            yearCompanyContainer.appendChild(year);
            yearCompanyContainer.appendChild(companyNameDiv);
            const companyTitleContainer = document.createElement("div");
            companyTitleContainer.classList.add("companyTitleContainer");
            const title = document.createElement("div");
            title.classList.add("title");
            title.textContent = position;
            const descriptionDiv = document.createElement("div");
            descriptionDiv.classList.add("description");
            descriptionDiv.textContent = description;
            companyTitleContainer.appendChild(title);
            companyTitleContainer.appendChild(descriptionDiv);
            experianceElement.appendChild(yearCompanyContainer);
            experianceElement.appendChild(companyTitleContainer);
            experiancesContainer.appendChild(experianceElement);
        });
    }
}
