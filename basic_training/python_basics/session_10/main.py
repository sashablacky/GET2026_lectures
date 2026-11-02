import storage
import analyzer

rows = storage.load_transaction("transactions.csv")
valid, rejected = storage.clean_all(rows)

total = analyzer.total_spent(valid)
by_category = analyzer.spend_by_category(valid)
biggest = analyzer.biggest_expensive(valid)

storage.save_csv("clean_csv", valid, ["id", "merchant", "amount"])
storage.save_csv("rejected_csv", rejected, ["id", "merchant", "amount", "reason"])
storage.save_report("report.txt", total, by_category, biggest)

print("Valid:", len(valid))
print("Rejected:", len(rejected))
print("Total spent", analyzer.total_spent(valid))

for category, amount in analyzer.spend_by_category(valid).items():
    print(f" {category}: {amount:.2f}")