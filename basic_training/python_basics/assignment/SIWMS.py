import datetime

inventory = { "SKU-101": {"name": "Wireless Mouse", "category": "Electronics", "price": 25.50, "qty": 40},
              "SKU-102": {"name": "Ergonomic Chair", "category": "Furniture", "price": 150.00, "qty": 12} }

regional_supplier_categories = {"Electronics", "Garden", "Toys", "Office"}

transaction = list()

def add(sku, name, category, price, qty):
    if sku in inventory:
        raise KeyError(f"SKU {sku} already exists.")
    inventory[sku] = {'name': name, 'category': category, 'price': price, 'qty': qty}
    log_event("ADD", sku, qty)



def update_quantity( SKU, qty):
    if SKU not in inventory:
        raise KeyError(f"SKU {SKU} not found.")
    if inventory[SKU]['qty'] + qty < 0:
        raise ValueError("Stock cannot be negative!")
    inventory[SKU]['qty'] += qty
    log_event('UPDATE', SKU, qty)


    
def analyze():
    main_categories = {item['category'] for item in inventory.values()}
    common = main_categories.intersection(regional_supplier_categories)
    print("Common:", ", ".join(sorted(common)) or "None")
    difference = main_categories.difference(regional_supplier_categories)
    print("Difference:", ", ".join(sorted(difference)) or "None")
    return True



def action(action_type, inventory, keyword=None, Category=None):
    if action_type == 'search':
        keyword = keyword.lower()
        for sku, item in inventory.items():
            if keyword in item['name'].lower() or keyword in item['category'].lower():
                print(f"Found: {item}")
    elif action_type == 'filter':
        for sku, item in inventory.items():
            if item['category'].lower() == Category.lower():
                print(f"{sku}: {item}")
    elif action_type == 'sort':
        for sku, item in sorted(inventory.items(), key=lambda pair: pair[1]['price'], reverse=True):
            print(f"{sku}: {item}")
        top_sku, top_item = max(inventory.items(), key=lambda pair: pair[1]['price'])
        print(f"Most expensive: {top_sku} {top_item['name']} ${top_item['price']:.2f}")
        total = sum(item['price'] * item['qty'] for item in inventory.values())
        print(f"Total inventory value: ${total:.2f}")



def display_log():
    if not transaction:
        print("No events yet.")
        return
    for stamp, kind, sku, change, after in transaction:
        print(f"{stamp}  {kind:<7} {sku:<10} {change:+6}  -> {after}")
    print(f"{len(transaction)} events | {len(inventory)} unique items in stock")



def log_event(event_type, sku, change):
    stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    transaction.append((stamp, event_type, sku, change, inventory[sku]['qty']))



def get_value(prompt, convert, allow_negative=True):
    while True:
        try:
            value = convert(input(prompt).strip())
        except ValueError:
            print(f"[ERROR]: Invalid format! Please enter a {convert.__name__}.")
            continue
        if convert is str and value == "":
            print("[ERROR]: This field cannot be empty.")
        elif convert is not str and not allow_negative and value < 0:
            print("[ERROR]: Value cannot be negative.")
        else:
            return value



while True:

    print("======================================== SMART INVENTORY & WAREHOUSE HUB ========================================\n"
    "1. Add New Product\n" \
    "2. Update Stock Quantity\n" \
    "3. Run Warehouse Set Analytics\n" \
    "4. Search & Inventory Summary\n" \
    "5. View Audit Log\n" \
    "6. Exit\n" \
    )

    choise = get_value("Enter your choice (1-6): ", int)
    match choise:

        case 1:
            SKU = get_value("Enter SKU: ", str)
            product_name = get_value("Enter Product Name: ", str)
            category = get_value("Enter Category: ", str)
            price = get_value("Enter Price: ", float, allow_negative=False)
            quantity = get_value("Enter Quantity: ", int, allow_negative=False)
            try:
                add(SKU, product_name, category, price, quantity)
                print(f"Success: Product {SKU} added successfully!")
            except KeyError as e:
                print(f"[ERROR]: {e.args[0]}")

        case 2:
            SKU = get_value("Enter SKU: ", str)
            quantity = get_value("Enter how much to add or subtract: ", int)
            try:
                update_quantity(SKU, quantity)
                print(f"Success: product {SKU} updated")
            except (KeyError, ValueError) as e:
                print(f"[ERROR]: {e.args[0]}")

        case 3:
            analyze()

        case 4:
            action_type = get_value("Enter action type (search/filter/sort): ", str)
            if action_type == 'search':
                keyword = get_value("Enter keyword to search: ", str)
                action(action_type, inventory, keyword=keyword)
            elif action_type == 'filter':
                category = get_value("Enter category to filter: ", str)
                action(action_type, inventory, Category=category)
            elif action_type == 'sort':
                action(action_type, inventory)
            else:
                print("Unknown action type.")

        case 5:
            display_log()

        case 6:
            print("=" * 40)
            print(f"Products: {len(inventory)} | Events logged: {len(transaction)}")
            print("Goodbye!")
            break

        case _:
            print("Invalid choice. Please enter a number between 1 and 6.")

        