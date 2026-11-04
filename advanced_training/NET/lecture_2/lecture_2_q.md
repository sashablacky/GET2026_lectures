# Вопросы по C# и .NET

## 1. Разница между `Parse`, `TryParse` и `Convert.To...`

Эти способы преобразуют значение (чаще всего строку) к другому типу, например `int` или `DateTime`. В .NET обычно используется семейство методов `Convert.ToInt32`, `Convert.ToDouble` и т. п.; метода с названием `ConvertTo` обычно нет.

### `Parse`

`Parse` преобразует строку и возвращает результат. Если строка имеет неверный формат или значение выходит за допустимые пределы типа, метод выбрасывает исключение.

```csharp
string text = "42";
int number = int.Parse(text); // 42

// int.Parse("hello") выбросит FormatException
// int.Parse("999999999999999") выбросит OverflowException
```

`Parse` подходит, когда формат данных заранее гарантирован. Для ввода пользователя обычно удобнее `TryParse`, чтобы неверный ввод не приводил к исключению.

### `TryParse`

`TryParse` не сообщает об ошибке через исключение при обычном некорректном вводе. Он возвращает `true`, если преобразование удалось, и записывает результат в параметр `out`; иначе возвращает `false`.

```csharp
string text = "42";

if (int.TryParse(text, out int number))
{
	Console.WriteLine($"Число: {number}");
}
else
{
	Console.WriteLine("Введите целое число.");
}
```

При неудаче `number` получает значение по умолчанию для `int` — `0`. Для чисел с дробной частью можно указывать стиль и культуру, например `double.TryParse` с `CultureInfo`, чтобы явно определить, используется ли запятая или точка.

### `Convert.To...`

Класс `Convert` содержит методы вроде `Convert.ToInt32`, `Convert.ToDouble` и `Convert.ToDateTime`. Они могут преобразовывать не только строки, но и другие совместимые типы.

```csharp
int fromText = Convert.ToInt32("42");
int fromDouble = Convert.ToInt32(42.7); // 43: округление к ближайшему целому
```

Для строки с неверным форматом `Convert.ToInt32` обычно выбрасывает `FormatException`, а для значения вне диапазона — `OverflowException`. Важное отличие: преобразование `null` в числовой тип через `Convert.ToInt32` возвращает `0`, тогда как `int.Parse(null)` выбрасывает `ArgumentNullException`.

| Способ                          | Результат при успехе                    | Поведение при ошибке          | Особенности                                                        |
| ------------------------------- | --------------------------------------- | ----------------------------- | ------------------------------------------------------------------ |
| `int.Parse(text)`               | Возвращает `int`                        | Выбрасывает исключение        | Удобен для гарантированно корректных данных                        |
| `int.TryParse(text, out value)` | Возвращает `true`, значение — в `value` | Возвращает `false`            | Хорош для пользовательского ввода                                  |
| `Convert.ToInt32(value)`        | Возвращает `int`                        | Обычно выбрасывает исключение | Принимает разные типы; `null` преобразует в `0` для числового типа |

> Для преобразований с учётом правил конкретной культуры существуют перегрузки с `IFormatProvider`, например `int.Parse(text, CultureInfo.InvariantCulture)`.

## 2. Основные виды коллекций в .NET

Коллекция — это объект для хранения и обработки нескольких значений. В современном C# чаще всего используют типизированные коллекции из `System.Collections.Generic`: они хранят элементы заданного типа и не требуют постоянного приведения типов.

### Массив (`T[]`)

Хранит элементы одного типа и имеет фиксированный размер после создания. Удобен, когда количество элементов известно и менять размер не нужно.

```csharp
int[] scores = { 90, 85, 100 };
Console.WriteLine(scores[0]); // 90
```

### `List<T>`

Список с динамическим размером: элементы можно добавлять, удалять и получать по индексу. Это один из наиболее распространённых вариантов.

```csharp
var names = new List<string> { "Аня", "Илья" };
names.Add("Оля");
names.Remove("Илья");
```

### `Dictionary<TKey, TValue>`

Хранит пары «ключ — значение». Ключи уникальны; по ключу удобно быстро находить значение.

```csharp
var ages = new Dictionary<string, int>
{
	["Аня"] = 20,
	["Илья"] = 22
};

if (ages.TryGetValue("Аня", out int age))
	Console.WriteLine(age); // 20
```

### `HashSet<T>`

Множество уникальных элементов. Полезно, когда важно исключить дубликаты или быстро проверять наличие элемента. Порядок элементов не следует считать гарантированным.

```csharp
var tags = new HashSet<string> { "C#", "LINQ", "C#" };
Console.WriteLine(tags.Count); // 2
```

### Очередь и стек

- `Queue<T>` работает по принципу FIFO: первым извлекается элемент, добавленный первым.
- `Stack<T>` работает по принципу LIFO: первым извлекается последний добавленный элемент.

```csharp
var queue = new Queue<string>();
queue.Enqueue("первый");
queue.Enqueue("второй");
Console.WriteLine(queue.Dequeue()); // первый

var stack = new Stack<string>();
stack.Push("первый");
stack.Push("второй");
Console.WriteLine(stack.Pop()); // второй
```

### Другие полезные коллекции

- `LinkedList<T>` — двусвязный список; удобен для вставки и удаления узлов, если ссылка на нужный узел уже есть.
- `SortedDictionary<TKey, TValue>` и `SortedSet<T>` — словарь и множество, поддерживающие элементы в отсортированном порядке.
- `ObservableCollection<T>` — коллекция, уведомляющая о добавлении и удалении элементов; часто применяется в интерфейсах.
- `ConcurrentDictionary<TKey, TValue>` и другие типы из `System.Collections.Concurrent` — коллекции для безопасной совместной работы нескольких потоков.

В `System.Collections` также есть старые нетипизированные коллекции (`ArrayList`, `Hashtable`). В новом коде обычно предпочитают их обобщённые аналоги (`List<T>`, `Dictionary<TKey, TValue>`), поскольку они обеспечивают проверку типов на этапе компиляции.

## 3. Основные функции LINQ с примерами

LINQ (Language Integrated Query) — набор средств для запросов к коллекциям и другим источникам данных. Для коллекций в памяти обычно используются методы расширения из `System.Linq`. В примерах ниже предполагаются `using System.Linq;` и типы из `System.Collections.Generic`.

```csharp
var people = new[]
{
	new { Name = "Аня", City = "Москва", Age = 20 },
	new { Name = "Илья", City = "Казань", Age = 17 },
	new { Name = "Оля", City = "Москва", Age = 25 }
};
```

### Фильтрация и преобразование

- `Where` оставляет элементы, удовлетворяющие условию.
- `Select` преобразует каждый элемент, например извлекает одно поле.
- `SelectMany` преобразует каждый элемент в последовательность и объединяет результаты в одну последовательность.

```csharp
var adults = people.Where(p => p.Age >= 18);
var names = adults.Select(p => p.Name);

var words = new[] { new[] { "a", "b" }, new[] { "c" } };
var allWords = words.SelectMany(group => group); // a, b, c
```

### Сортировка

- `OrderBy` сортирует по возрастанию.
- `OrderByDescending` — по убыванию.
- `ThenBy` и `ThenByDescending` добавляют следующий критерий сортировки.

```csharp
var sorted = people
	.OrderBy(p => p.City)
	.ThenBy(p => p.Age);
```

### Группировка и объединение

- `GroupBy` группирует элементы по ключу.
- `Join` объединяет две последовательности по совпадающим ключам (аналог соединения по равенству).
- `GroupJoin` связывает элемент с группой соответствующих элементов другой последовательности.

```csharp
var byCity = people.GroupBy(p => p.City);
foreach (var group in byCity)
	Console.WriteLine($"{group.Key}: {group.Count()}");

var departments = new[]
{
	new { City = "Москва", Office = "Центральный" },
	new { City = "Казань", Office = "Восточный" }
};

var withOffice = people.Join(
	departments,
	person => person.City,
	department => department.City,
	(person, department) => new { person.Name, department.Office });
```

### Проверки и поиск

- `Any` проверяет, есть ли хотя бы один подходящий элемент.
- `All` проверяет, удовлетворяют ли условию все элементы (для пустой последовательности возвращает `true`).
- `Contains` проверяет наличие заданного значения.
- `First` и `FirstOrDefault` возвращают первый элемент; `First` выбрасывает исключение, если элемента нет, а `FirstOrDefault` возвращает значение по умолчанию.
- `Single` и `SingleOrDefault` предназначены для случая, когда должен быть ровно один подходящий элемент; при нескольких таких элементах они выбрасывают исключение.
- `Last` и `LastOrDefault` работают с последним элементом.

```csharp
bool hasAdults = people.Any(p => p.Age >= 18);
bool everyoneHasName = people.All(p => !string.IsNullOrEmpty(p.Name));
var firstAdult = people.FirstOrDefault(p => p.Age >= 18);
```

### Подсчёт и агрегирование

- `Count` считает элементы; перегрузка с условием считает только подходящие.
- `Sum`, `Min`, `Max` вычисляют сумму, минимум и максимум.
- `Average` вычисляет среднее значение.
- `Aggregate` позволяет задать собственное последовательное объединение элементов.

```csharp
int adultCount = people.Count(p => p.Age >= 18);
double averageAge = people.Average(p => p.Age);
int total = new[] { 1, 2, 3 }.Sum(); // 6
```

### Изменение формы и материализация результата

- `Distinct` убирает повторяющиеся значения.
- `Take(n)` берёт первые `n` элементов, `Skip(n)` пропускает первые `n`.
- `Concat` объединяет последовательности, `Union` объединяет их и убирает повторы, `Intersect` находит общие элементы, `Except` — элементы первой последовательности, отсутствующие во второй.
- `ToList`, `ToArray` и `ToDictionary` выполняют запрос и сохраняют результат в коллекцию.

```csharp
var firstTwoNames = people.Select(p => p.Name).Take(2).ToList();
var uniqueCities = people.Select(p => p.City).Distinct();
```

### Синтаксис запросов

Тот же простой запрос можно записать в форме, похожей на SQL. Компилятор преобразует её в вызовы LINQ-операторов.

```csharp
var query = from person in people
			where person.Age >= 18
			orderby person.Name
			select person.Name;
```

### Отложенное выполнение

Многие операторы, например `Where` и `Select`, отложенно выполняются: запрос запускается при переборе результата. Методы вроде `ToList`, `ToArray`, `Count` и `First` обычно выполняют запрос сразу. Поэтому при повторном переборе отложенного запроса источник может быть прочитан повторно.

```csharp
var query = people.Where(p => p.Age >= 18); // запрос пока не перебирается
var result = query.ToList();                // выполнение и сохранение результата
```
