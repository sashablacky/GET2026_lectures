def total_spent(rows):
    total = 0
    for row in rows:
        total += row["amount"]
    return total

CATEGORIES = {
    "Swiggy":"Food",
    "Zomato":"Food",
    "Amazon":"Shopping",
    "Uber":"Travel",
    "Ola":"Travel",
    "Netflix":"Entertainment"
}

def spend_by_category(rows):
    totals = {}
    for row in rows:
        category = CATEGORIES.get(row["merchant"], "other")
        totals[category] = totals.get(category, 0) + row["amount"]
    return totals


    

def biggest_expensive(rows):
    biggest = None
    for row in rows:
        if biggest is None or row["amount"] > biggest["amount"]:
            biggest = row
    return biggest
