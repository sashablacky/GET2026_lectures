bool[,] arr = new bool[5, 6];
for (int i = 0; i < arr.GetLength(0); i++) {
	for (int j = 0; j < arr.GetLength(1); j++) {
		arr[i, j] = true;
	}
}

for (int i = 0; i < arr.GetLength(0); i++) {
    for (int j = 0; j < arr.GetLength(1); j++) {
        Console.Write((arr[i, j] ? "vacant" : "booked") + "\t");
    }
    Console.WriteLine();
}

Console.WriteLine("Enter the row index (0-4) of the element to change: ");
int rowIndex = int.Parse(Console.ReadLine());
Console.WriteLine("Enter the column index (0-5) of the element to change: ");
int columnIndex = int.Parse(Console.ReadLine());

if (arr[rowIndex, columnIndex]) {
    Console.WriteLine($"The element at ({rowIndex}, {columnIndex}) successfully changed from true to false.");
    arr[rowIndex, columnIndex] = false;
} else {
    Console.WriteLine($"The element at ({rowIndex}, {columnIndex}) already is false.");
}

for (int i = 0; i < arr.GetLength(0); i++) {
    for (int j = 0; j < arr.GetLength(1); j++) {
        Console.Write((arr[i, j] ? "vacant" : "booked") + "\t");
    }
    Console.WriteLine();
}

