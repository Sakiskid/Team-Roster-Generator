const inquirer = require('inquirer');
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const style = require('./style');
inquirer.registerPrompt('selectLine', require('inquirer-select-line'));

const confirmQuestion = {
    name: "confirm",
    message: style.confirm("Confirm?"),
    type: "confirm",
}

// listElements is important! ListPrompt() accesses and changes this for listQuestions.
let teamMembers = [];
const teamQuestions = [
    {
        name: "Main",
        type: "list",
        message: style.q("\n\nPlease list your team members: \n"),
        loop: false,
        pageSize: 16,
        choices: () => {
            let newChoices = [
                {
                    name: "ADD NEW TEAM MEMBER",
                    value: "new"
                },
                {
                    name: "FINISH",
                    value: "finish"
                },
                new inquirer.Separator(), // Separato
            ]
            for (let i = 0; i < teamMembers.length; i++) {
                newChoices.push(teamMembers[i]);
            }
            return newChoices;
        } 
    },
    // {
    //     name: "New Team Member",
    //     type: "input",
    //     message: "Add new Team Member: \n",
    //     when: (answers) => { // If the installation main value is new...
    //         if (answers["Main"] === "new") {
    //             return true;
    //         } else return false;
    //     }
    // },
    {
        name: "Edit",
        type: "list",
        message: style.q("How would you like to edit this Team Member?"),
        when: (answers) => { // If the user chose to edit a line...
            if (answers["Main"] !== "finish" &&
                answers["Main"] !== "new") {
                return true;
            } else return false;
        },
        choices: [
            {
                name: "Cancel",
                value: "cancel",
            },
            {
                name: "Edit Name",
                value: "name",
            },
            {
                name: "Edit Role",
                value: "role",
            },
            {
                name: "Edit ID",
                value: "id",
            },
            {
                name: "Edit Email",
                value: "email",
            },
            {
                name: "Change order",
                value: "order",
            },
            {
                name: "Delete",
                value: "delete",
            },
        ]
    },
    {
        name: "Edit - Name",
        type: "input",
        message: style.q("Please change name: "),
        when: (answers) => { if (answers["Edit"] === "name") return true; }
    },
    {
        name: "Edit - Role",
        type: "list",
        message: style.q("Please select the correction role: "),
        choices: ["Intern", "Engineer", "Manager"],
        when: (answers) => { if (answers["Edit"] === "role") return true; }
    },
    {
        name: "Edit - Order",
        type: "selectLine",
        message: style.q("Please change order: "),
        when: (answers) => { if (answers["Edit"] === "order") return true; },
        // placeholder: (answers) => answers["Main"],
        choices: (answers) => {
            // Take the element out of the new DISPLAY list to display for more accurate reordering
            let elementsToDisplay = [ ...teamMembers ];
            elementsToDisplay.splice(teamMembers.findIndex(element => element.value === answers["Main"]), 1);            
            // Get an array of names from the objects
            let listElementNames = elementsToDisplay.map(element => element.name);

            return listElementNames;
        },
    },
    {
        name: "Edit - Delete",
        type: "confirm",
        message: style.q("Are you sure you want to delete this line?"),
        when: (answers) => { if (answers["Edit"] === "delete") return true; }
    },
]

const newTeamMemberQuestions = [
    {
        name: "name",
        message: style.q("Team Member Name: "),
    },
    {
        name: "role",
        message: style.q("Team Member Role: "),
        type: "list",
        choices: ["Intern", "Engineer", "Manager"],
    },
    {
        name: "id",
        type: "number",
        message: style.q("Team Member ID: "),
    },
    {
        name: "email",
        message: style.q("Team Member Email: "),
    },
    {
        name: "other",
        message: (answers) => {
            switch (answers.role) {
                case "Intern":
                    return style.q("Please input Intern's school: ");
                case "Engineer":
                    return style.q("Please input Engineer's GitHub Username: ");
                case "Manager":
                    return style.q("Please input Manager's Office Number: ");
            }
        },
    },
]

async function addNewTeamMember() {
    let answers = await inquirer.prompt(newTeamMemberQuestions);
    let newTeamMember = {name, id, email, other} = answers;

    console.info(`Does this look correct?`);
    console.info(`Name: ${newTeamMember.name}`);
    console.info(`Role: ${newTeamMember.role}`);
    console.info(`ID: ${newTeamMember.id}`);
    console.info(`Email: ${newTeamMember.email}`);
    console.info(`Other: ${newTeamMember.other}`);

    let confirm = await inquirer.prompt(confirmQuestion);
    if (confirm.confirm == false) { await addNewTeamMember(); }
    else {teamMembers.push(newTeamMember);}
}

async function gatherTeamInfo() {
    startPrompt = async function () {
        style.clear();
        let answers = await inquirer.prompt(teamQuestions);
        let mainAnswer = answers["Main"];
        
        // If the user chose to add a new line:
        if(mainAnswer === "new") { 
            let newTeamMemberAnswer = await addNewTeamMember();
            return startPrompt();
        }

        else if (mainAnswer === "finish") {
        }

        // EDITING A LINE:
        if(answers["Edit"]) {
            let editAnswer = answers["Edit"];
            let listObjectToEdit = teamMembers.find(
                element => element.name === mainAnswer);
            let listObjectToEditIndex = teamMembers.findIndex(
                element => element.name === mainAnswer);

            if(editAnswer === "cancel") { } // Do nothing on cancel

            else if(editAnswer === "delete") {
                // Delete at the index of the chosen list object
                if(answers["Edit - Delete"] === true) { 
                    teamMembers.splice(listObjectToEditIndex, 1);
                }
            }

            // else if(editAnswer === "order") {
            //     let orderAnswer = answers["Edit - Order"];

            //     // Get Object that we are reordering, and remove it from the list
            //     let objectToReorder = teamMembers[listObjectToEditIndex];
            //     teamMembers.splice(listObjectToEditIndex, 1);
            //     teamMembers.splice(orderAnswer, 0, objectToReorder);
            // }
            
            else if(editAnswer === "name") {
                let textAnswer = answers["Edit - Name"];
                listObjectToEdit.name = textAnswer;
            }
            return this.startPrompt();
        }
    }
    await startPrompt();
    let team = await finalizeTeam();
    return team;
}

async function finalizeTeam() {
    let finalTeam = [];
    for (let i = 0; i < teamMembers.length; i++) {
        let m = teamMembers[i];
        switch(m.role) {
            case "Intern":
                finalTeam.push(new Intern(m.name, m.id, m.email, m.other));
                break;
            case "Engineer":
                finalTeam.push(new Engineer(m.name, m.id, m.email, m.other));
                break;
            case "Manager":
                finalTeam.push(new Manager(m.name, m.id, m.email, m.other));
                break;
        }
    }
    return finalTeam;
}

exports.gatherTeamInfo = gatherTeamInfo;