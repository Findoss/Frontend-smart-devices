# All

Обертка

```
{
  event: String,
  data: Any,
}
```

# Client

0. Произвести кормление

```
{
  "event":"startFeeding"
}
```

1. Корм обновлен

```
{
  "event":"feedUpdated"
}
```

2. Количество порций

```
{
  "event":"countPortion",
  "data": Number
}
```

3. Время для таймера (через какое время кормить) в часах от 1 до 11

```
{
  "event":"feedingInterval",
  "data": Number
}
```

4. Режим кормления cat / dog / fish

```
{
  "event":"mode",
  "data": Number
}
```

# Server

0. При подключении клиента

```
{
  "event":"init",
  "data": {
    microcontroller: String,    // название системы (вдруг их несколько)
    countPortion: Number,       // количество порций для кормления
    feedingInterval: Number,    // частота кормления
    feedingCount: Number,       // количество произведенных кормлений
    maxFeedingCount: Number,    // максимальное кол-во порций
    lastFeedingTime: Number     // время последнего кормления
    mode: Number                // модель кормления ('cat'/'dog'/'fish')
    type: String,               // тип устройства (кормушка - 'pf')
  }
}
```

1. Произведено кормление

```
{
  "event": "feeding"
}
```
