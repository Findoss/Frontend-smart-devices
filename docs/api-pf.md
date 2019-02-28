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

3. Время для таймера

```
{
  "event":"timeForTimer"
}
```

# Server

0. При подключении клиента

```
{
  microcontroller: String,    // название системы (вдруг их несколько)
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
