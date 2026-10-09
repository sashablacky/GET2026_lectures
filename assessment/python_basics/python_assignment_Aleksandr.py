#Q1

def analyze_cart(cart_data):
    total = 0
    categories = set()
    for item in cart_data:
        price = item["price"]
        if item["category"] == "Electronics":
            price = price * 0.9
        total += price
        categories.add(item["category"])
    return (total, categories)

"""print(analyze_cart([
{"name": "Laptop", "category": "Electronics", "price": 1000},
{"name": "Apple", "category": "Groceries", "price": 5},
{"name": "Headphones", "category": "Electronics", "price": 200},
{"name": "Bread", "category": "Groceries", "price": 3}
]))"""

#Q2

def find_common_genres(user1_prefs, user2_prefs):
    liked1 = set()
    liked2 = set()
    for genre, rating in user1_prefs:
        if rating >= 7:
            liked1.add(genre)
    for genre, rating in user2_prefs:
        if rating >= 7:
            liked2.add(genre)
    common = liked1 & liked2
    if common:
        return common
    return "No match found"

alice = [("Action", 8), ("Comedy", 5), ("Sci-Fi", 9), ("Horror", 7)]
bob = [("Sci-Fi", 8), ("Romance", 6), ("Action", 6), ("Horror", 9)]

#print(find_common_genres(alice, bob))

#Q3

def get_letter_grade(average):
    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    else:
        return "F"

def process_grades(grade_book):
    results = []
    for name, scores in grade_book.items():
        average = sum(scores) / len(scores)
        results.append((name, average, get_letter_grade(average)))
    return results

raw_grades = {
    "John": [85, 90, 92],
    "Sara": [95, 100, 93],
    "Mike": [60, 65, 70]
}

#print(process_grades(raw_grades))

#Q4

def audit_inventory(master, physical):
    master_set = set(master)
    physical_set = set(physical)
    return{
        "missing_items": sorted(master_set - physical_set),
        "unexpected_items": sorted(physical_set - master_set),
    }

master_system = ["SKU_1", "SKU_2", "SKU_3", "SKU_4"]
scanned_items = ["SKU_1", "SKU_3", "SKU_5", "SKU_5", "SKU_5"]

#print(audit_inventory(master_system, scanned_items))

#Q5

def route_planner(flight_map, start, end):
    if check_direct(flight_map, start, end):
        print("Direct flight available!")
    else:
        layovers = find_layovers(flight_map, start, end)
        if layovers:
            print(f"1-stop flights available via: {layovers}")
        else:
            print("No routes available.")

def check_direct(flight_map, start, end):
    return end in flight_map.get(start, [])

def find_layovers(flight_map, start, end):
    layovers = set()
    for city in flight_map.get(start, []):
        if end in flight_map.get(city, []):
            layovers.add(city)
    return layovers

flight_map = {
"JFK": ["LAX", "MIA", "LHR"],
"MIA": ["LAX", "DFW"],
"LHR": ["CDG", "DXB"],
"DFW": ["LAX"]
}

route_planner(flight_map, "JFK", "LHR")
route_planner(flight_map, "JFK", "DFW")
route_planner(flight_map, "MIA", "CDG")