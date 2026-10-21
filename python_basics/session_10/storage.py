import csv
from pathlib import Path

def load_transaction(path):
    rows = []
    with open(path, 'r', newline="", encoding="utf_8") as csv_file:
        for row in csv.DictReader(csv_file):
            rows.append(row)
    return rows

def clean_merchant(text):
    return text.strip().title()

def check_row(row):
    if row["merchant"].strip() == "":
        return "missing merchant"
    try:
        amount = float(row["amount"])
    except ValueError:
        return "amount is not a number"
    if amount <= 0 :
        return "amount must be positive"
    return ""

def clean_all(rows):
    valid = []
    rejected = []
    seen_ids = set()

    for row in rows:
        reason = check_row(row)
        if reason == "" and row["id"] in seen_ids:
            reason = "duplicate id"

        if reason == "":
            seen_ids.add(row["id"])
            valid.append({
                "id": row["id"],
                "merchant": clean_merchant(row["merchant"]),
                "amount": float(row["amount"])
            })
        else:
            row["reason"] = reason
            rejected.append(row)

    return valid, rejected

def save_csv(path, rows, fieldnames):
    with open(path, "w", newline="", encoding="utf_8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

def save_report(path, total, by_category, biggest):
    with open(path, "w", encoding="utf_8") as file:
        file.write("SPENDSENSE REPORT\n")
        file.write(f"Total spent: {total:.2f}\n")
        file.write("Spend by category\n")
        for category, amount in by_category.items():
            file.write(f" {category}: {amount:.2f}")