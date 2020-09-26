// TODO: Write code to define and export the Employee class

class Employee {
    constructor(name, role, email, info) {
        this.name = name;
        this.role = role;
        this.email = email;
        this.info = info;
    }

    getName() {
        return this.name;
    }

    getRole() {
        return this.role;
    }

    getEmail() {
        return this.email;
    }
};

module.exports = Employee;