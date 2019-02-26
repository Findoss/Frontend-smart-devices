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

# Server

0. При подключении клиента

```
{
  microcontroller: String,    // название системы (вдруг их несколько)
  feedingCount: Number,       // количество произведенных кормлений
  maxFeedingCount: Number,    // максимальное кол-во порций
  lastFeedingTime: Number     // время последнего кормления
}
```

1. Произведено кормление

```
{
  "event": "feeding"
}
```
