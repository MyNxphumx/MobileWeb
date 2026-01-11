export class StudentManager {
    constructor() {
        this.students = [];
    }
    addStudent(student) {
        this.students.push(student);
        this.saveToLocalStorage();
    }
    getAllStudents() {
        return this.students;
    }
    findStudentsByName(keyword) {
        keyword = keyword.toLowerCase();
        return this.students.filter((s) => s.first_name.toLowerCase().includes(keyword) ||
            s.last_name.toLowerCase().includes(keyword));
    }
    findStudentsByMajor(keyword) {
        keyword = keyword.toLowerCase();
        return this.students.filter((s) => s.major.toLowerCase().includes(keyword));
    }
    findStudentsByEmail(keyword) {
        keyword = keyword.toLowerCase();
        return this.students.filter((s) => s.email.toLowerCase().includes(keyword));
    }
    saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(this.students));
    }
    loadFromLocalStorage() {
        const data = localStorage.getItem("students");
        if (data)
            this.students = JSON.parse(data);
    }
}
