import { Student } from "../models/Student.js";

export class StudentManager {
  private students: Student[] = [];

  addStudent(student: Student): void {
    this.students.push(student);
    this.saveToLocalStorage();
  }

  getAllStudents(): Student[] {
    return this.students;
  }

  findStudentsByName(keyword: string): Student[] {
    keyword = keyword.toLowerCase();
    return this.students.filter(
      (s) =>
        s.first_name.toLowerCase().includes(keyword) ||
        s.last_name.toLowerCase().includes(keyword)
    );
  }

  findStudentsByMajor(keyword: string): Student[] {
    keyword = keyword.toLowerCase();
    return this.students.filter((s) => s.major.toLowerCase().includes(keyword));
  }

  findStudentsByEmail(keyword: string): Student[] {
    keyword = keyword.toLowerCase();
    return this.students.filter((s) => s.email.toLowerCase().includes(keyword));
  }

  saveToLocalStorage(): void {
    localStorage.setItem("students", JSON.stringify(this.students));
  }

  loadFromLocalStorage(): void {
    const data = localStorage.getItem("students");
    if (data) this.students = JSON.parse(data);
  }
}
