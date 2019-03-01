# Client

обертка

```
{
  event: String,
  data: Any,
}
```

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

2. Двойная порция

```
{
  "event":"doublePortion"
}
```

3. Время для таймера (через какое время кормить) в часах от 1 до 11

```
{
  "event":"feedingInterval",
  "data": Number
}
```

# Server

0. При подключении клиента

```
{
  microcontroller: String,    // название системы (вдруг их несколько)
  doublePortion: Boolean,     // использовать двойную порцию для кормления
  feedingInterval: Number,   // частота кормления
  feedingCount: Number,       // количество произведенных кормлений
  maxFeedingCount: Number,    // максимальное кол-во порций
  lastFeedingTime: Number     // время последнего кормления
  type: String,               // тип устройства (кормушка - 'pf')
}
```

1. Произведено кормление

```
{
  "event": "feeding"
}
```
