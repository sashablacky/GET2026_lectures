# Data structure: {roll_number: {"name": str, "marks": (m1, m2, m3, m4, m5)}}
students = {}

SUBJECTS = 5
PASS_MARK = 40


def get_value(prompt, convert, allow_negative=True):
    while True:
        try:
            raw = input(prompt).strip()
            if raw == "":
                raise ValueError("This field cannot be empty.")
            try:
                value = convert(raw)
            except ValueError:
                raise ValueError(f"Invalid format! Please enter a {convert.__name__}.") from None
            if convert is not str and not allow_negative and value < 0:
                raise ValueError("Value cannot be negative.")
        except ValueError as error:
            print(f"[ERROR]: {error}")
        else:
            return value


def get_mark(prompt):
    while True:
        try:
            mark = get_value(prompt, float)
            if not 0 <= mark <= 100:
                raise ValueError("Mark must be between 0 and 100.")
        except ValueError as error:
            print(f"[ERROR]: {error}")
        else:
            return mark


def get_marks():
    marks = []
    for i in range(1, SUBJECTS + 1):
        marks.append(get_mark(f"Enter mark for subject {i}: "))
    return tuple(marks)


def is_valid_entry(student):
    marks = student.get("marks")
    if not student.get("name") or not isinstance(marks, tuple) or len(marks) != SUBJECTS:
        return False
    for mark in marks:
        if not 0 <= mark <= 100:
            return False
    return True


def valid_students(students):
    return {roll: s for roll, s in students.items() if is_valid_entry(s)}


def calculate_total(marks):
    total = 0
    for mark in marks:
        total += mark
    return total


def calculate_average(marks):
    return calculate_total(marks) / len(marks)


def grade_student(average):
    if average >= 90:
        return "A+"
    elif average >= 80:
        return "A"
    elif average >= 70:
        return "B"
    elif average >= 60:
        return "C"
    elif average >= 50:
        return "D"
    return "F"


def has_passed(marks):
    for mark in marks:
        if mark < PASS_MARK:
            return False
    return True


def check_new_roll(students, roll):
    if roll in students:
        raise KeyError(f"Roll number '{roll}' already exists.")


def check_existing_roll(students, roll):
    if roll not in students or not is_valid_entry(students[roll]):
        raise KeyError(f"No student found with roll number '{roll}'.")


def add_student(students, roll, name, marks):
    check_new_roll(students, roll)
    students[roll] = {"name": name, "marks": marks}


def report_student(roll, student):
    marks = student["marks"]
    average = calculate_average(marks)
    status = "PASS" if has_passed(marks) else "FAIL"
    marks_text = ", ".join(f"{m:g}" for m in marks)
    print(f"Roll: {roll} | Name: {student['name']}\n"
          f"  Marks: {marks_text}\n"
          f"  Total: {calculate_total(marks):g} | Average: {average:.2f} | "
          f"Grade: {grade_student(average)} | Status: {status}")


def report_all(students):
    data = valid_students(students)
    if not data:
        print("No students added yet.")
        return
    for roll, student in data.items():
        report_student(roll, student)
        print("-" * 60)


def search_student(students, roll):
    check_existing_roll(students, roll)
    report_student(roll, students[roll])


def update_student_marks(students, roll, marks):
    check_existing_roll(students, roll)
    students[roll]["marks"] = marks


def class_analysis(students):
    data = valid_students(students)
    if not data:
        print("No students added yet.")
        return

    averages = {roll: calculate_average(s["marks"]) for roll, s in data.items()}
    class_average = calculate_total(averages.values()) / len(averages)

    top = max(averages, key=averages.get)
    bottom = min(averages, key=averages.get)

    passed = 0
    for s in data.values():
        if has_passed(s["marks"]):
            passed += 1
    failed = len(data) - passed

    above = [f"{data[r]['name']} ({r})" for r in averages if averages[r] > class_average]
    unique_grades = {grade_student(avg) for avg in averages.values()}

    print(f"Total students: {len(data)}")
    print(f"Class average: {class_average:.2f}")
    print(f"Highest scorer: {data[top]['name']} ({top}) - {averages[top]:.2f}")
    print(f"Lowest scorer: {data[bottom]['name']} ({bottom}) - {averages[bottom]:.2f}")
    print(f"Passed: {passed} | Failed: {failed}")
    print(f"Above class average: {', '.join(above) if above else 'None'}")
    print(f"Unique grades awarded: {', '.join(sorted(unique_grades))}")


def performance_report(students):
    data = valid_students(students)
    if not data:
        print("No students added yet.")
        return

    ranking = []
    for roll, s in data.items():
        ranking.append((calculate_average(s["marks"]), roll, s["name"]))
    ranking.sort(reverse=True)

    grade_counts = {}
    rank = 0
    previous_avg = None
    print(f"{'Rank':<6}{'Roll':<10}{'Name':<20}{'Average':>8}  Grade")
    for position, (average, roll, name) in enumerate(ranking, start=1):
        # Students with equal averages share the same rank
        if average != previous_avg:
            rank = position
            previous_avg = average
        grade = grade_student(average)
        grade_counts[grade] = grade_counts.get(grade, 0) + 1
        top_tag = "  <- Top 3" if rank <= 3 else ""
        print(f"{rank:<6}{roll:<10}{name:<20}{average:>8.2f}  {grade:<3}{top_tag}")

    print("\nGrade distribution:")
    for grade in ["A+", "A", "B", "C", "D", "F"]:
        if grade in grade_counts:
            print(f"  {grade}: {grade_counts[grade]}")


while True:
    print("\n======================================== Student Performance Management System ========================================\n"
          "1. Add New Student\n"
          "2. Display All Student Reports\n"
          "3. Search Student by Roll Number\n"
          "4. Update Student Marks\n"
          "5. Class Analytics\n"
          "6. Sorted Performance Report\n"
          "7. Exit"
          )

    choice = get_value("Enter your choice (1-7): ", int)
    match choice:

        case 1:
            name = get_value("Enter student name: ", str).title()
            roll = get_value("Enter roll number: ", str)
            try:
                check_new_roll(students, roll)
                add_student(students, roll, name, get_marks())
            except KeyError as error:
                print(f"[ERROR]: {error.args[0]}")
            else:
                print(f"Student '{name}' added successfully.")

        case 2:
            report_all(students)

        case 3:
            roll = get_value("Enter roll number to search: ", str)
            try:
                search_student(students, roll)
            except KeyError as error:
                print(f"[ERROR]: {error.args[0]}")

        case 4:
            roll = get_value("Enter roll number to update: ", str)
            try:
                check_existing_roll(students, roll)
                print(f"Updating marks for {students[roll]['name']}:")
                update_student_marks(students, roll, get_marks())
            except KeyError as error:
                print(f"[ERROR]: {error.args[0]}")
            else:
                print("Marks updated successfully.")

        case 5:
            class_analysis(students)

        case 6:
            performance_report(students)

        case 7:
            print("Goodbye!")
            break

        case _:
            print("[ERROR]: Invalid choice. Please enter a number from 1 to 7.")
