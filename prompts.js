const inquirer = require('inquirer');
inquirer.registerPrompt('selectLine', require('inquirer-select-line'));

const confirmQuestion = {
    name: "confirm",
    message: "Confirm?",
    type: "confirm",
}

// listElements is important! ListPrompt() accesses and changes this for listQuestions.
let teamMembers = [];
const teamQuestions = [
    {
        name: "Main",
        type: "list",
        message: "Please list your team members (you will be able to add contact info after): ",
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
        message: "How would you like to edit this Team Member?",
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
                name: "Edit Position",
                value: "position",
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
        message: "Please change name: ",
        when: (answers) => { if (answers["Edit"] === "name") return true; }
    },
    {
        name: "Edit - Position",
        type: "list",
        message: "Please select the correction position: ",
        choices: ["Intern", "Engineer", "Manager"],
        when: (answers) => { if (answers["Edit"] === "position") return true; }
    },
    {
        name: "Edit - Order",
        type: "selectLine",
        message: "Please change order: ",
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
        message: "Are you sure you want to delete this line?",
        when: (answers) => { if (answers["Edit"] === "delete") return true; }
    },
]

const newTeamMemberQuestions = [
    {
        name: "name",
        message: "Team Member Name: ",
    },
    {
        name: "position",
        message: "Team Member Position: ",
        type: "list",
        choices: ["Intern", "Engineer", "Manager"],
    },
    {
        name: "email",
        message: "Team Member Email: ",
    },
    {
        name: "secondaryInfoList",
        message: "Would you like to add a secondary piece of information?",
        type: "list",
        choices: ["None", "GitHub", "Office Number", "Website", "Phone Number", "Other",]
    },
    {
        name: "secondaryInfo",
        message: "Please input secondary info: ",
        when: (answers) => {
            if(answers.secondaryInfoList != "None") return true;
        },
    },
]

async function addNewTeamMember() {
    let answers = await inquirer.prompt(newTeamMemberQuestions);
    let newTeamMember = {name, position, email, secondaryInfoList, secondaryInfo} = answers;

    console.info(`Does this look correct?`);
    console.info(`Name: ${newTeamMember.name}`);
    console.info(`Position: ${newTeamMember.position}`);
    console.info(`Email: ${newTeamMember.email}`);
    if(newTeamMember.secondaryInfoList != "None" && newTeamMember.secondaryInfoList != "Other") {
        console.info(`${newTeamMember.secondaryInfoList}: ${newTeamMember.secondaryInfo}`);
    } 
    else if (newTeamMember.secondaryInfoList === "Other") {
        console.info(secondaryInfo);
    }

    let confirm = await inquirer.prompt(confirmQuestion);
    if (confirm.confirm == false) { await addNewTeamMember; }
    else {
        teamMembers.push(newTeamMember);
    }
}

async function gatherTeamInfo() {
    startPrompt = async function () {
        // console.clear();
        let answers = await inquirer.prompt(teamQuestions);
        let mainAnswer = answers["Main"];
        
        // If the user chose to add a new line:
        if(mainAnswer === "new") { 
            let newTeamMemberAnswer = await addNewTeamMember();
            // let newTeamMemberAnswer = answers["New Team Member"];
            // let newTeamMember = {
            //     name: newTeamMemberAnswer[],
            //     position: newTeamMemberAnswer,
            // }
            // // Put this at the end of the list
            // teamMembers.push(newTeamMember);
            return startPrompt();
        }

        else if (mainAnswer === "finish") {
            // let namesToFormat = teamMembers.map(element => element.name);
            return teamMembers;
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

            else if(editAnswer === "order") {
                let orderAnswer = answers["Edit - Order"];

                // Get Object that we are reordering, and remove it from the list
                let objectToReorder = teamMembers[listObjectToEditIndex];
                teamMembers.splice(listObjectToEditIndex, 1);
                teamMembers.splice(orderAnswer, 0, objectToReorder);
            }
            
            else if(editAnswer === "name") {
                let textAnswer = answers["Edit - Name"];
                listObjectToEdit.name = textAnswer;
            }
            return this.startPrompt();
        }
    }
    await startPrompt();
    return teamMembers;
}

exports.gatherTeamInfo = gatherTeamInfo;